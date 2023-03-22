async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);
  const SimpleNftReveal = await ethers.getContractFactory("simpleNFTReveal");
  const simpleNftReveal = await simpleNftReveal.deploy(
    "Test",
    "test",
    "ipfs://URI/",
    "ipfs://notRevealedUri/"
  );
  console.log(`simpleNFTReveal Contract address: ${simpleNftReveal.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
