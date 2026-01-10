import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Escrow", function() {
  let depositor, beneficiary, arbiter;
  let escrow;
  
  beforeEach(async function() {
    // Get 3 test accounts
    [depositor, beneficiary, arbiter] = await ethers.getSigners();
    
    // Deploy escrow with 1 ETH
    escrow = await ethers.deployContract(
      "Escrow",
      [arbiter.address, beneficiary.address],
      { value: ethers.parseEther("1.0") }  // Send 1 ETH
    );
  });
  
  it("should initialize correctly", async function() {
    expect(await escrow.depositor()).to.equal(depositor.address);
    expect(await escrow.beneficiary()).to.equal(beneficiary.address);
    expect(await escrow.arbiter()).to.equal(arbiter.address);
    expect(await escrow.amount()).to.equal(ethers.parseEther("1.0"));
  });
  
  it("should approve and transfer funds", async function() {
    const initialBalance = await ethers.provider.getBalance(beneficiary.address);
    
    // Arbiter approves
    await escrow.connect(arbiter).approve();
    
    // Check if approved
    expect(await escrow.isApproved()).to.equal(true);
    
    // Check beneficiary got money
    const finalBalance = await ethers.provider.getBalance(beneficiary.address);
    expect(finalBalance).to.be.gt(initialBalance);
  });
  
  it("should fail if non-arbiter tries to approve", async function() {
    // Depositor tries to approve (should fail!)
    await expect(
      escrow.connect(depositor).approve()
    ).to.be.revertedWith("Only arbiter can approve!");
  });
});
