# Crypto Transaction Visualizer and Analyzer

A highly interactive web application that visualizes and analyzes cryptocurrency transactions using a dynamic force-directed graph.

## Features

- **Input Forms for Analytics**: Input a wallet address or transaction hash and select the depth level of transaction exploration.
- **Force-Directed Graph Visualization**: Visual representation of transactions as nodes and edges, dynamically styled based on attributes.
- **Interactive Animations**: Smooth transitions, real-time animations, and node hover effects with tooltips.
- **Insights Dashboard**: Dynamic insights like top wallet connections and total currency flow.
- **Simulated Transaction Alerts**: Subscribe to real-time transaction alerts with highlight animations.
- **Customizable Graph Appearance**: Change visual themes, node size, and edge thickness.

## Technology Stack

- **HTML**
- **CSS**
- **JavaScript**
  - **D3.js** for force-directed graph
  - **GSAP** for animations

## How to Run

1. Open `index.html` in a modern web browser.
2. When prompted, enter your Etherscan API Key.
3. Input a wallet address or transaction hash and select the desired depth level.
4. Click **Visualize** to see the transaction graph.

## Note

- This project uses simulated data due to API limitations. Replace the `simulateData` function with actual API calls to fetch real blockchain data.
- Ensure you have an internet connection to load external libraries from CDNs.
