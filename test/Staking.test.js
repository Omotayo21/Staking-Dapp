import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Staking Reward Math", function () {
  let token, staking, owner, user;
  const APY = 10n;
  const SECONDS_IN_YEAR = 31536000n;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const RahmanToken = await ethers.getContractFactory("RahmanToken");
    token = await RahmanToken.deploy();
    
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(await token.getAddress());

    // Fund Reward Pool
    await token.transfer(await staking.getAddress(), ethers.parseEther("10000"));
    
    // Give user some tokens (Give 5,000 so they can stake multiple times)
    await token.transfer(user.address, ethers.parseEther("5000"));
    await token.connect(user).approve(await staking.getAddress(), ethers.MaxUint256);
  });

  it("Should calculate 10% APY correctly after 1 year", async function () {
    const stakeAmount = ethers.parseEther("1000"); // 1000 RHM
    await staking.connect(user).stake(stakeAmount);

    // Fast forward 1 year
    await owner.provider.send("evm_increaseTime", [Number(SECONDS_IN_YEAR)]);
    await owner.provider.send("evm_mine");

    const earned = await staking.earned(user.address);
    const expectedResponse = ethers.parseEther("100"); // 10% of 1000 = 100
    
    // Check if it's within a tiny margin (due to 1-2 seconds of block mining)
    expect(earned).to.be.closeTo(expectedResponse, ethers.parseEther("0.0001"));
  });

  it("Should update rewards when user stakes more", async function () {
    await staking.connect(user).stake(ethers.parseEther("1000"));

    // Fast forward 6 months
    await owner.provider.send("evm_increaseTime", [Number(SECONDS_IN_YEAR / 2n)]);
    await owner.provider.send("evm_mine");

    // Earned ~50 RHM
    let earned = await staking.earned(user.address);
    expect(earned).to.be.closeTo(ethers.parseEther("50"), ethers.parseEther("0.001"));

    // Stake 1000 more
    await staking.connect(user).stake(ethers.parseEther("1000"));
    
    // Total staked = 2000. 
    // Reward counter should be set to 50, and lastUpdateTime to now.
    
    // Fast forward another 6 months
    await owner.provider.send("evm_increaseTime", [Number(SECONDS_IN_YEAR / 2n)]);
    await owner.provider.send("evm_mine");
    
    // Earned = 50 (from first 6 mo) + 100 (from 10% of 2000 for 6 mo) = 150
    earned = await staking.earned(user.address);
    expect(earned).to.be.closeTo(ethers.parseEther("150"), ethers.parseEther("0.001"));
  });
});
