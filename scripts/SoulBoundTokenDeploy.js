async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);
  console.log("\n");
  const SoulBoundToken = await ethers.getContractFactory("SoulBoundToken");
  const soulBoundToken = await SoulBoundToken.deploy();
  console.log(`SoulBoundToken address: ${soulBoundToken.address}`);
  console.log("\n");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
