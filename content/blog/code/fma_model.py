"""
F = m*a training with full trace collection across 8 widths.

Trains [2, N, 64, 1] networks for N in {63, 64, 65, 80, 96, 105, 110, 128},
storing all internal variables (activations, gradients, weight stats) at every
epoch. Saves traces to traces.pkl for analysis.

Run: python fma_model.py
Requires: numpy, pickle
"""

import numpy as np
import pickle


# -- Data --
np.random.seed(42)
n_samples = 1000
m = np.random.uniform(1, 10, n_samples)
a = np.random.uniform(1, 10, n_samples)
F = m * a
X = np.column_stack([m, a])
Y = F.reshape(-1, 1)
split = int(0.7 * n_samples)
X_train, X_val = X[:split], X[split:]
Y_train, Y_val = Y[:split], Y[split:]


# -- Network functions --

def leaky_relu(Z, alpha=0.01):
    return np.where(Z > 0, Z, alpha * Z)

def leaky_relu_derivative(Z, alpha=0.01):
    return np.where(Z > 0, 1, alpha)


def train_and_trace(width, epochs=150, lr=1e-5, seed=1):
    """Train a [2, width, 64, 1] network and collect full traces."""
    layer_dims = [2, width, 64, 1]
    np.random.seed(seed)

    # Initialize (uniform, not He - matches original experiment)
    params = {}
    for l in range(1, len(layer_dims)):
        params[f'W{l}'] = np.random.rand(layer_dims[l-1], layer_dims[l]) * np.sqrt(1/layer_dims[l-1])
        params[f'b{l}'] = np.zeros((1, layer_dims[l]))

    traces = []

    for epoch in range(epochs):
        # Forward
        A0 = X_train
        Z1 = A0 @ params['W1'] + params['b1']
        A1 = leaky_relu(Z1)
        Z2 = A1 @ params['W2'] + params['b2']
        A2 = leaky_relu(Z2)
        Z3 = A2 @ params['W3'] + params['b3']
        A3 = Z3  # linear output

        cost = np.mean((A3 - Y_train) ** 2)

        # Backward
        m_samples = Y_train.shape[0]
        dZ3 = (2 / m_samples) * (A3 - Y_train)
        dW3 = A2.T @ dZ3
        db3 = np.sum(dZ3, axis=0, keepdims=True)

        dA2 = dZ3 @ params['W3'].T
        dZ2 = dA2 * leaky_relu_derivative(Z2)
        dW2 = A1.T @ dZ2
        db2 = np.sum(dZ2, axis=0, keepdims=True)

        dA1 = dZ2 @ params['W2'].T
        dZ1 = dA1 * leaky_relu_derivative(Z1)
        dW1 = A0.T @ dZ1
        db1 = np.sum(dZ1, axis=0, keepdims=True)

        # Collect trace
        trace = {
            'epoch': epoch, 'cost': cost, 'width': width,
            'Z1_max': Z1.max(), 'Z1_min': Z1.min(), 'Z1_mean': Z1.mean(), 'Z1_std': Z1.std(),
            'A1_max': A1.max(), 'A1_min': A1.min(), 'A1_mean': A1.mean(), 'A1_std': A1.std(),
            'Z2_max': Z2.max(), 'Z2_min': Z2.min(), 'Z2_mean': Z2.mean(), 'Z2_std': Z2.std(),
            'A2_max': A2.max(), 'A2_min': A2.min(), 'A2_mean': A2.mean(), 'A2_std': A2.std(),
            'Z3_max': Z3.max(), 'Z3_min': Z3.min(), 'Z3_mean': Z3.mean(), 'Z3_std': Z3.std(),
            'error_max': np.abs(A3 - Y_train).max(),
            'error_mean': np.abs(A3 - Y_train).mean(),
            'W1_max': params['W1'].max(), 'W1_min': params['W1'].min(),
            'W1_mean': params['W1'].mean(), 'W1_std': params['W1'].std(),
            'b1_max': params['b1'].max(), 'b1_min': params['b1'].min(), 'b1_mean': params['b1'].mean(),
            'W2_max': params['W2'].max(), 'W2_min': params['W2'].min(),
            'W2_mean': params['W2'].mean(), 'W2_std': params['W2'].std(),
            'b2_max': params['b2'].max(), 'b2_min': params['b2'].min(), 'b2_mean': params['b2'].mean(),
            'W3_max': params['W3'].max(), 'W3_min': params['W3'].min(),
            'W3_mean': params['W3'].mean(), 'W3_std': params['W3'].std(),
            'b3_max': params['b3'].max(), 'b3_min': params['b3'].min(), 'b3_mean': params['b3'].mean(),
            'dW1_norm': np.linalg.norm(dW1), 'dW2_norm': np.linalg.norm(dW2), 'dW3_norm': np.linalg.norm(dW3),
        }
        traces.append(trace)

        # Update
        params['W1'] -= lr * dW1
        params['b1'] -= lr * db1
        params['W2'] -= lr * dW2
        params['b2'] -= lr * db2
        params['W3'] -= lr * dW3
        params['b3'] -= lr * db3

    return traces


# -- Run all widths --

widths = [63, 64, 65, 80, 96, 105, 110, 128]
all_traces = {}

for w in widths:
    print(f"Running width {w}...")
    all_traces[w] = train_and_trace(w, epochs=150, lr=1e-5, seed=1)

# Save
with open('traces.pkl', 'wb') as f:
    pickle.dump(all_traces, f)

print(f"\nSaved traces for {len(widths)} widths, 150 epochs each")

# Print summary
print("\nFinal costs:")
print(f"{'Width':<8} {'Cost':<12} {'Z2_max':<10} {'A2_mean':<10} {'dW2_norm':<10}")
print("-" * 50)
for w in widths:
    t = all_traces[w][-1]
    print(f"{w:<8} {t['cost']:<12.2f} {t['Z2_max']:<10.2f} {t['A2_mean']:<10.2f} {t['dW2_norm']:<10.2f}")
