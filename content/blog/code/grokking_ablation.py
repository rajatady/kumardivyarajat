"""
Ablation study: which components does grokking need?

Train a 4-layer transformer on modular division (a/b mod 97).
At two checkpoints (7K and 11K steps), freeze each component
and continue training to see if generalization still happens.

Runs in ~20 minutes on any GPU or Apple MPS.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import json

DEVICE = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"
P = 97  # prime for modular arithmetic


def mod_inverse(b, p):
    return pow(b, p - 2, p)


class ModularDivisionDataset:
    def __init__(self, p, train=True, seed=42):
        self.p = p
        np.random.seed(seed)
        all_pairs = [(a, b) for a in range(p) for b in range(1, p)]
        np.random.shuffle(all_pairs)
        split = int(len(all_pairs) * 0.5)
        self.pairs = all_pairs[:split] if train else all_pairs[split:]
        self.pairs = [(a, b, (a * mod_inverse(b, p)) % p) for a, b in self.pairs]

    def get_batch(self, batch_size):
        indices = np.random.choice(len(self.pairs), min(batch_size, len(self.pairs)), replace=False)
        batch = [self.pairs[i] for i in indices]
        x = torch.tensor([[a, b, P] for a, b, c in batch], dtype=torch.long)
        y = torch.tensor([c for a, b, c in batch], dtype=torch.long)
        return x.to(DEVICE), y.to(DEVICE)


class TransformerLayer(nn.Module):
    def __init__(self, hidden_size, num_heads):
        super().__init__()
        self.ln1 = nn.LayerNorm(hidden_size)
        self.attn = nn.MultiheadAttention(hidden_size, num_heads, batch_first=True)
        self.ln2 = nn.LayerNorm(hidden_size)
        self.mlp_fc1 = nn.Linear(hidden_size, 4 * hidden_size)
        self.mlp_fc2 = nn.Linear(4 * hidden_size, hidden_size)

    def forward(self, x):
        h = self.ln1(x)
        attn_out, _ = self.attn(h, h, h, need_weights=False)
        x = x + attn_out
        h = self.ln2(x)
        x = x + self.mlp_fc2(F.gelu(self.mlp_fc1(h)))
        return x


class SimpleTransformer(nn.Module):
    def __init__(self, vocab_size=99, hidden_size=128, num_layers=4, num_heads=4):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, hidden_size)
        self.pos_embed = nn.Embedding(16, hidden_size)
        self.layers = nn.ModuleList([
            TransformerLayer(hidden_size, num_heads) for _ in range(num_layers)
        ])
        self.ln_f = nn.LayerNorm(hidden_size)
        self.head = nn.Linear(hidden_size, vocab_size, bias=False)

    def forward(self, x):
        B, T = x.shape
        h = self.embed(x) + self.pos_embed(torch.arange(T, device=x.device))
        for layer in self.layers:
            h = layer(h)
        h = self.ln_f(h)
        return self.head(h[:, -1])


def apply_intervention(model, intervention_name):
    """Freeze specific components. Returns (trainable_params, total_params)."""

    if intervention_name == "baseline":
        pass
    elif intervention_name == "freeze_head":
        for p in model.head.parameters():
            p.requires_grad = False
    elif intervention_name == "freeze_embed":
        for p in model.embed.parameters():
            p.requires_grad = False
        for p in model.pos_embed.parameters():
            p.requires_grad = False
    elif intervention_name == "freeze_attn_all":
        for layer in model.layers:
            for p in layer.attn.parameters():
                p.requires_grad = False
            for p in layer.ln1.parameters():
                p.requires_grad = False
    elif intervention_name == "freeze_mlp_all":
        for layer in model.layers:
            for p in layer.mlp_fc1.parameters():
                p.requires_grad = False
            for p in layer.mlp_fc2.parameters():
                p.requires_grad = False
            for p in layer.ln2.parameters():
                p.requires_grad = False
    elif intervention_name == "freeze_exit_layer":
        for p in model.layers[-1].parameters():
            p.requires_grad = False
    elif intervention_name == "freeze_entry_layer":
        for p in model.layers[0].parameters():
            p.requires_grad = False
    elif intervention_name == "freeze_middle_layers":
        for p in model.layers[1].parameters():
            p.requires_grad = False
        for p in model.layers[2].parameters():
            p.requires_grad = False
    elif intervention_name == "freeze_exit_attn":
        for p in model.layers[-1].attn.parameters():
            p.requires_grad = False
    elif intervention_name == "freeze_exit_mlp":
        for p in model.layers[-1].mlp_fc1.parameters():
            p.requires_grad = False
        for p in model.layers[-1].mlp_fc2.parameters():
            p.requires_grad = False

    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    return trainable, total


def run_ablation(checkpoint_step, intervention_name, num_steps=10000, wd=0.3):
    """Load from checkpoint, apply intervention, train, return trajectory."""

    ckpt_path = f"checkpoints/checkpoint_step_{checkpoint_step}.pt"
    ckpt = torch.load(ckpt_path, map_location=DEVICE)

    model = SimpleTransformer(num_layers=4).to(DEVICE)
    model.load_state_dict(ckpt["model_state"])

    trainable, total = apply_intervention(model, intervention_name)
    actual_wd = 0.0 if intervention_name == "no_weight_decay" else wd

    optimizer = torch.optim.AdamW(
        [p for p in model.parameters() if p.requires_grad],
        lr=3e-4, weight_decay=actual_wd,
    )

    train_data = ModularDivisionDataset(P, train=True)
    test_data = ModularDivisionDataset(P, train=False)
    x_test, y_test = test_data.get_batch(256)

    trajectory = []
    for step in range(num_steps):
        model.train()
        x, y = train_data.get_batch(64)
        loss = F.cross_entropy(model(x), y)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if step % 500 == 0:
            model.eval()
            with torch.no_grad():
                test_acc = (model(x_test).argmax(-1) == y_test).float().mean().item()
                train_acc = (model(x).argmax(-1) == y).float().mean().item()
            trajectory.append({
                "step": checkpoint_step + step,
                "train_acc": train_acc,
                "test_acc": test_acc,
                "loss": loss.item(),
            })
            if step % 2000 == 0:
                print(f"  {intervention_name} @ {checkpoint_step}+{step}: "
                      f"train={train_acc:.3f} test={test_acc:.3f}")

    return {
        "intervention": intervention_name,
        "checkpoint": checkpoint_step,
        "trainable_params": trainable,
        "total_params": total,
        "final_test_acc": trajectory[-1]["test_acc"],
        "max_test_acc": max(t["test_acc"] for t in trajectory),
        "trajectory": trajectory,
    }


if __name__ == "__main__":
    checkpoints = [7000, 11000]
    interventions = [
        "baseline", "no_weight_decay",
        "freeze_head", "freeze_embed",
        "freeze_exit_layer", "freeze_exit_attn", "freeze_exit_mlp",
        "freeze_entry_layer", "freeze_middle_layers",
        "freeze_attn_all", "freeze_mlp_all",
    ]

    results = []
    for ckpt in checkpoints:
        for intervention in interventions:
            print(f"\n[ckpt {ckpt}] {intervention}")
            result = run_ablation(ckpt, intervention)
            results.append(result)

    with open("grokking_ablation_results.json", "w") as f:
        json.dump(results, f, indent=2)

    # Summary table
    print(f"\n{'Intervention':<25} {'From 7K':>12} {'From 11K':>12}")
    print("-" * 50)
    for intervention in interventions:
        r7 = next((r for r in results if r["intervention"] == intervention and r["checkpoint"] == 7000), None)
        r11 = next((r for r in results if r["intervention"] == intervention and r["checkpoint"] == 11000), None)
        print(f"{intervention:<25} {r7['final_test_acc']:>11.1%} {r11['final_test_acc']:>11.1%}")
