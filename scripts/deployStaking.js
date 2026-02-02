import { network } from "hardhat";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const { ethers } = await network.connect();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy RahmanToken
  const RahmanToken = await ethers.getContractFactory("RahmanToken");
  const token = await RahmanToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("RahmanToken deployed to:", tokenAddress);

  // 2. Deploy Staking Contract
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("Staking deployed to:", stakingAddress);

  // 3. Fund Staking Contract with Reward Pool
  // We'll give it 500,000 tokens so users can earn rewards
  const fundAmount = ethers.parseEther("500000");
  await (await token.transfer(stakingAddress, fundAmount)).wait();
  console.log("Staking contract funded with 500,000 RHM for rewards");

  // Save artifacts for frontend
  const contractsDir = path.join(__dirname, "..", "app", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "StakingData.json"),
    JSON.stringify({
      token: {
        address: tokenAddress,
        abi: JSON.parse(RahmanToken.interface.formatJson())
      },
      staking: {
        address: stakingAddress,
        abi: JSON.parse(Staking.interface.formatJson())
      }
    }, null, 2)
  );

  console.log("Contract data saved to frontend!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
