async function main() {
  const [deployer, account1, account2, account3, account4, account5] =
    await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
  const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");

  console.log(`\n\nerc20Tokens address: ${erc20Tokens.address}`);

  const SimpleNftWithTokens = await ethers.getContractFactory(
    "simpleNftWithTokens"
  );
  const simpleNftWithTokens = await SimpleNftWithTokens.deploy(
    "Test",
    "test",
    "ipfs://URI/",
    "ipfs://notRevealedUri/",
    [
      account1.address.toString(),
      account2.address.toString(),
      account3.address.toString(),
      account4.address.toString(),
      account5.address.toString(),
    ],
    [20, 20, 20, 20, 20],
    erc20Tokens.address
  );

  console.log(`simpleNftWithTokens address: ${simpleNftWithTokens.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
