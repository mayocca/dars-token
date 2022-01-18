const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployment", function () {
  let deployer, alice, bob, others;
  let INITIAL_SUPPLY = ethers.utils.parseEther("1000000");

  before(async function () {
    [deployer, alice, bob, ...others] = await ethers.getSigners();
  });

  it("Should mint the correct amount of initial tokens to the creator", async function () {
    const dARSFactory = await ethers.getContractFactory("dARS", deployer);

    const dARS = await dARSFactory.deploy(INITIAL_SUPPLY);

    const balance = await dARS.balanceOf(deployer.address);

    expect(balance).to.equal(INITIAL_SUPPLY);
  });
});
