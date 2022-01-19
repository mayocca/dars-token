const { use, expect } = require("chai");
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

describe("Liquidity", function () {
  let deployer, alice, bob, others;
  let contract;
  let pancakeRouterAddress = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
  let WBNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
  let pancakeRouterContract;
  let INITIAL_SUPPLY = ethers.utils.parseEther("100");
  let deadline;

  before(async function () {
    [deployer, alice, bob, ...others] = await ethers.getSigners();
    let abi = [
      "function addLiquidityETH(address,uint,uint,uint,address,uint) external payable returns (uint,uint,uint)",
      "function getAmountsOut(uint,address[]) public view returns (uint[])",
    ];
    pancakeRouterContract = new ethers.Contract(
      pancakeRouterAddress,
      abi,
      deployer
    );
  });

  beforeEach(async function () {
    const dARSFactory = await ethers.getContractFactory("dARS", deployer);
    contract = await dARSFactory.deploy(INITIAL_SUPPLY);
    deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  });

  it("Should add liquidity to PancakeRouter", async function () {
    await contract.approve(pancakeRouterAddress, ethers.constants.MaxUint256);
    await pancakeRouterContract.addLiquidityETH(
      contract.address,
      INITIAL_SUPPLY,
      INITIAL_SUPPLY,
      ethers.utils.parseEther("100"),
      deployer.address,
      deadline,
      { value: ethers.utils.parseEther("1") }
    );
    let amountsOut = await pancakeRouterContract.getAmountsOut(
      ethers.utils.parseEther("1"),
      [contract.address, WBNB]
    );
    expect(amountsOut[1]).to.not.equal("0");
  });
});
