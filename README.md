# 💰 Token Staking dApp

A professional DeFi Staking platform built for the Web3 portfolio. Users can stake "Rahman Token" (RHM) and earn a fixed 10% APY based on real-time block timestamps.

## 🚀 Key Features
- **ERC-20 + Faucet**: Custom token with a built-in faucet for easy user onboarding.
- **10% Fixed APY**: Accurate time-based reward calculation on-chain.
- **Live Dashboard**: Real-time ticker that shows rewards increasing every second.
- **Flexible Staking**: No lock-up periods—stake, claim, or unstake at any time.
- **Premium UI**: Glassmorphism design with responsive layouts.

## 🛠️ Tech Stack
- **Smart Contracts**: Solidity, OpenZeppelin, Hardhat.
- **Frontend**: React, Ethers.js, Wagmi, RainbowKit, Tailwind CSS.
- **Deployment**: Sepolia Testnet.

## 📈 Reward Logic
Rewards are calculated using the formula:
`Rewards = (StakedAmount * 10 * TimePassed) / (100 * 31,536,000)`

Detailed math explanation can be found in `STAKING_TUTORIAL.md`.

## 📦 Setup & Installation
1. Install dependencies: `npm install`
2. Configure `.env` with your Sepolia RPC and Private Key.
3. Deploy contracts: `npx hardhat run scripts/deployStaking.js --network sepolia`
4. Start frontend: `cd app && npm run dev`

## 🛡️ Security
- **ReentrancyGuard**: Prevents reentrancy attacks on withdraw/claim.
- **Modifier Pattern**: State updates are settled before any balance changes.
