const { time } = require("@nomicfoundation/hardhat-network-helpers");
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`\nDeploying contracts with the account: ${deployer.address}`);
  const balance = await deployer.getBalance();
  console.log(`\nAccount balance: ${balance.toString()}`);

  const BaycContract = await ethers.getContractFactory("BoredApeYachtClub");
  const baycContract = await BaycContract.deploy(
    "BoredApeYachtClub",
    "BAYC",
    10000,
    time.latest()
  );

  console.log(`BAYC Contract address: ${baycContract.address}`);

  const BaccContract = await ethers.getContractFactory("BoredApeChemistryClub");
  const baccContract = await BaccContract.deploy(
    "ipfs://BoredApeChemistryClub/"
  );
  console.log(`BACC Contract address: ${baccContract.address}`);

  const MaycContract = await ethers.getContractFactory("MutantApeYachtClub");
  const maycContract = await MaycContract.deploy(
    "MutantApeYachtClub",
    "MAYC",
    baycContract.address,
    baccContract.address
  );

  console.log(`MAYC Contract address: ${maycContract.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
