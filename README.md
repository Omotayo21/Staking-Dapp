# Rahman Coin (RHM) Dashboard 💰🚀

Welcome to the official dashboard for **Rahman Coin (RHM)**, a custom ERC-20 cryptocurrency built on the Ethereum Sepolia Test Network.

## 🌐 Live Demo
[Deploy your dashboard on Vercel to get a link here!]

---

## 📖 For Users: How to Use RHM

### 1. Connect Your Wallet
- Open the dashboard and click **"Connect Wallet"**.
- Ensure you have the **MetaMask** extension installed.

### 2. Switch to Sepolia
- If you are on the wrong network, click the **"Switch to Sepolia"** button at the top.
- RHM lives on the Sepolia Testnet, so it won't show up on Mainnet or Hardhat Local.

### 3. Add RHM to MetaMask
- Open MetaMask and click **"Import tokens"**.
- Paste the Token Contract Address: `[PASTE YOUR DEPLOYED ADDRESS HERE]`
- It will auto-fill **RHM** and **18 decimals**.

### 4. Send Tokens to Friends
- Paste your friend's wallet address.
- Enter the amount of RHM to send.
- Click **"Transfer"** and confirm in MetaMask!

---

## 🛠️ For Developers: Build & Deploy

### Prerequisites
- Node.js installed
- Alchemy API Key (Sepolia)
- MetaMask Private Key with Sepolia ETH

### Setup
1. **Clone the repo:**
   ```bash
   git clone https://github.com/Omotayo21/erc20-token.git
   cd erc20-token
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment:**
   Create a `.env` file in the root:
   ```env
   SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   PRIVATE_KEY=YOUR_PRIVATE_KEY
   ```

### Deployment
1. **Compile the contract:**
   ```bash
   npx hardhat compile
   ```
2. **Deploy to Sepolia:**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

---

## 📜 Smart Contract Details
- **Token Name**: Rahman Coin
- **Symbol**: RHM
- **Standard**: ERC-20 (OpenZeppelin)
- **Decimals**: 18
- **Network**: Sepolia Testnet

---

## 🔍 Verification
You can always verify the total supply and transactions on **[Sepolia Etherscan](https://sepolia.etherscan.io)** by searching for the Token Contract Address.

Built with ❤️ by [Omotayo](https://github.com/Omotayo21)
