async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);
  // deploying reward Tokens
  const RewardTokens = await ethers.getContractFactory("ERC20Tokens");
  const rewardTokens = await RewardTokens.deploy("TestTokens", "$TT");
  console.log(`rewardTokens address: ${rewardTokens.address}`);

  // deploying nft collection

  const NftCollection = await ethers.getContractFactory("simpleNFT");
  const nftCollection = await NftCollection.deploy(
    "Test",
    "test",
    "ipfs://URI/"
  );
  console.log(`NFT Collection address: ${nftCollection.address}`);

  // deploying Staking Contract

  const StakingNFTs = await ethers.getContractFactory("StakingNFTs");
  const stakingNFTs = await StakingNFTs.deploy(
    nftCollection.address,
    rewardTokens.address
  );

  console.log(`Staking contract address: ${stakingNFTs.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
