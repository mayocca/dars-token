async function main() {
  let INITIAL_SUPPLY = ethers.utils.parseEther("1000000");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", await deployer.getAddress());
  console.table({ Name: network.name, "Chain ID": network.config.chainId });

  const dARSFactory = await ethers.getContractFactory("dARS");
  const dARSContract = await dARSFactory.deploy(INITIAL_SUPPLY);
  await dARSContract.deployed();
  console.log("dARS address:", dARSContract.address);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract_address.json",
    JSON.stringify({ Token: contract.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    contractsDir + "/Token.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
