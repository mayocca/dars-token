const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployment", function () {
  let deployer, alice, bob, others;
  let contract;
  let INITIAL_SUPPLY = ethers.utils.parseEther("1000000");

  before(async function () {
    [deployer, alice, bob, ...others] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const dARSFactory = await ethers.getContractFactory("dARS", deployer);
    contract = await dARSFactory.deploy(INITIAL_SUPPLY);
  });

  it("Should mint the correct amount of initial tokens to the creator", async function () {
    const balance = await contract.balanceOf(deployer.address);
    expect(balance).to.equal(INITIAL_SUPPLY);
  });

  it("Should allow transfers between two accounts", async function () {
    const amount = ethers.utils.parseEther("1");
    await contract.transfer(alice.address, amount);
    const aliceBalance = await contract.balanceOf(alice.address);
    expect(aliceBalance).to.equal(amount);
  });

  it("Should not allow transfers to the zero address", async function () {
    const amount = ethers.utils.parseEther("1");
    await expect(
      contract.transfer(ethers.constants.AddressZero, amount)
    ).to.be.revertedWith("ERC20: transfer to the zero address");
  });

  it("Should not allow to transfer more than the available balance", async function () {
    const amount = INITIAL_SUPPLY.add(ethers.constants.One);
    await expect(
      contract.transfer(alice.address, amount.add(1))
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });
});
