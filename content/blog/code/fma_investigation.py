"""
63 vs 64 neurons: Why does one neuron change everything?

A systematic investigation into why a [2, 63, 64, 1] MLP learning F = m*a
gets stuck, while [2, 64, 64, 1] shows a dramatic phase transition.

Run: python fma_investigation.py
Requires: numpy, matplotlib
"""

import numpy as np
import matplotlib.pyplot as plt


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

def initialize_parameters(layer_dims, seed=1):
    np.random.seed(seed)
    parameters = {}
    for l in range(1, len(layer_dims)):
        parameters[f'W{l}'] = np.random.randn(layer_dims[l-1], layer_dims[l]) * np.sqrt(2.0 / layer_dims[l-1])
        parameters[f'b{l}'] = np.zeros((1, layer_dims[l]))
    return parameters

def forward(X, parameters, layer_dims):
    cache = {'A0': X}
    A_prev = X
    L = len(layer_dims)
    for l in range(1, L):
        Z = np.dot(A_prev, parameters[f'W{l}']) + parameters[f'b{l}']
        A = Z if l == L - 1 else leaky_relu(Z)
        cache[f'Z{l}'] = Z
        cache[f'A{l}'] = A
        A_prev = A
    return A, cache

def compute_cost(A, Y):
    return np.mean((A - Y) ** 2)

def backward(X, Y, parameters, cache, layer_dims):
    L = len(layer_dims)
    grads = {}
    m = Y.shape[0]
    AL = cache[f'A{L-1}']
    for l in reversed(range(1, L)):
        Z = cache[f'Z{l}']
        if l == L - 1:
            dZ = (2 / m) * (AL - Y)
        else:
            W_next = parameters[f'W{l+1}']
            dA = np.dot(dZ, W_next.T)
            dZ = dA * leaky_relu_derivative(Z)
        A_prev = cache[f'A{l-1}'] if l > 1 else X
        grads[f'dW{l}'] = np.dot(A_prev.T, dZ)
        grads[f'db{l}'] = np.sum(dZ, axis=0, keepdims=True)
    return grads

def update_parameters(parameters, grads, lr, layer_dims):
    for l in range(1, len(layer_dims)):
        parameters[f'W{l}'] -= lr * grads[f'dW{l}']
        parameters[f'b{l}'] -= lr * grads[f'db{l}']
    return parameters


# -- Investigation 1: Train and track everything --

def train_with_tracking(layer_dims, lr, epochs, seed=1):
    parameters = initialize_parameters(layer_dims, seed=seed)
    history = {
        'cost': [],
        'grad_norms': {l: [] for l in range(1, len(layer_dims))},
        'negative_frac': {l: [] for l in range(1, len(layer_dims) - 1)},
    }
    for i in range(epochs):
        A, cache = forward(X_train, parameters, layer_dims)
        history['cost'].append(compute_cost(A, Y_train))
        grads = backward(X_train, Y_train, parameters, cache, layer_dims)
        for l in range(1, len(layer_dims)):
            history['grad_norms'][l].append(np.linalg.norm(grads[f'dW{l}']))
            if l < len(layer_dims) - 1:
                history['negative_frac'][l].append((cache[f'Z{l}'] < 0).mean())
        parameters = update_parameters(parameters, grads, lr, layer_dims)
    return parameters, history


print("Training 63-neuron network (50K epochs)...")
p63, h63 = train_with_tracking([2, 63, 64, 1], 0.0001, 50000, seed=1)
print(f"Final cost: {h63['cost'][-1]:.4f}")

print("Training 64-neuron network (50K epochs)...")
p64, h64 = train_with_tracking([2, 64, 64, 1], 0.0001, 50000, seed=1)
print(f"Final cost: {h64['cost'][-1]:.4f}")


# -- Investigation 2: Random number sequence analysis --

print("\n" + "=" * 60)
print("RANDOM NUMBER SEQUENCE ANALYSIS")
print("=" * 60)

np.random.seed(1)
seq_63_w1 = np.random.randn(2, 63)   # consumes 126 numbers
seq_63_w2 = np.random.randn(63, 64)  # starts at index 126

np.random.seed(1)
seq_64_w1 = np.random.randn(2, 64)   # consumes 128 numbers
seq_64_w2 = np.random.randn(64, 64)  # starts at index 128

print(f"W1 values identical up to element 126: {np.allclose(seq_63_w1.flatten(), seq_64_w1.flatten()[:126])}")
print(f"W2 values identical: {np.allclose(seq_63_w2.flatten()[:10], seq_64_w2.flatten()[:10])}")
print("W2 is drawn from completely different parts of the random stream!")


# -- Investigation 3: Sensitivity across 20 seeds --

print("\n" + "=" * 60)
print("SENSITIVITY TO INITIALIZATION (20 seeds)")
print("=" * 60)

results_63, results_64 = [], []
for seed in range(1, 21):
    params = initialize_parameters([2, 63, 64, 1], seed=seed)
    for _ in range(10000):
        A, cache = forward(X_train, params, [2, 63, 64, 1])
        grads = backward(X_train, Y_train, params, cache, [2, 63, 64, 1])
        params = update_parameters(params, grads, 0.0001, [2, 63, 64, 1])
    results_63.append(compute_cost(forward(X_train, params, [2, 63, 64, 1])[0], Y_train))

    params = initialize_parameters([2, 64, 64, 1], seed=seed)
    for _ in range(10000):
        A, cache = forward(X_train, params, [2, 64, 64, 1])
        grads = backward(X_train, Y_train, params, cache, [2, 64, 64, 1])
        params = update_parameters(params, grads, 0.0001, [2, 64, 64, 1])
    results_64.append(compute_cost(forward(X_train, params, [2, 64, 64, 1])[0], Y_train))

    print(f"Seed {seed:2d}: 63-net={results_63[-1]:.2f}, 64-net={results_64[-1]:.2f}")

print(f"\n63-net: mean={np.mean(results_63):.2f}, std={np.std(results_63):.2f}")
print(f"64-net: mean={np.mean(results_64):.2f}, std={np.std(results_64):.2f}")


# -- Investigation 4: Width sweep --

print("\n" + "=" * 60)
print("WIDTH SWEEP (5 seeds each)")
print("=" * 60)

widths = [32, 48, 60, 61, 62, 63, 64, 65, 66, 67, 68, 80, 96, 128]
for n in widths:
    costs = []
    for seed in range(1, 6):
        params = initialize_parameters([2, n, 64, 1], seed=seed)
        for _ in range(10000):
            A, cache = forward(X_train, params, [2, n, 64, 1])
            grads = backward(X_train, Y_train, params, cache, [2, n, 64, 1])
            params = update_parameters(params, grads, 0.0001, [2, n, 64, 1])
        costs.append(compute_cost(forward(X_train, params, [2, n, 64, 1])[0], Y_train))
    print(f"n={n:3d}: mean={np.mean(costs):.2f}, std={np.std(costs):.2f}")
