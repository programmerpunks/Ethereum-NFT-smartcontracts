# Ethereum-NFT-smartcontracts

This repository contains EVM-based smart contracts for different kinds of NFTs. These contracts have been built using the Hardhat framework, which provides an easy-to-use development environment.

## Getting Started

To set up the project on your system

```shell
# clone the repo
git clone https://github.com/programmerpunks/Ethereum-NFT-smartcontracts

# install dependencies
npm install

# Navigate to the root folder and create a new '.env' file inside of this directory
# and add the following values to it
ALCHEMY_API_KEY=EDIT_ME
GORELI_PRIVATE_KEY=EDIT_ME
ETHERSCAN_API_KEY=EDIT_ME
# Note refer to .env.example as an example

```

Try running some of the following tasks:

```shell
# To compile Contracts
npx hardhat compile
# To run all Tests
npx hardhat test

# To run a specific test file
npx hardhat test ./test/<TEST_FILE_NAME>.js

# To deploy
npx hardhat run scripts/<SCRIPT_FILE_NAME>.js
# To deploy on a specific network
npx hardhat run scripts/<SCRIPT_FILE_NAME>.js --network <NETWORK_NAME>

# To verify contract
npx hardhat verify --network <NETWORK_NAME> <address_of_deployed_contract> <Arguments_of_Contract_constructor>

# Note you need to add different networks in your hardhat.config.js file, Only goerli is added by default in this repo

npx hardhat node
npx hardhat run scripts/deploy.js
```

# <b> Contracts </b>

These contract uses openzepplins as base contacts

NOTE: When you make some changes to your contracts

# SimpleNFT

Functionalities:

1. Owner can set Minting Price and anyone can mint
2. A wallet can have only 3 NFTs at a time
3. In one transaction only 3 NFTs can be minted

# SimpleNftGift

1. Owner can set Minting Price and anyone can mint
2. A wallet can have only 3 NFTs at a time
3. In one transaction only 3 NFTs can be minted
4. Owner can mint 10 NFTs as a gift for its team members

# SimpleNFtReveal

Functionalities:

1. Owner can set Minting Price and anyone can mint
2. A wallet can have only 3 NFTs at a time
3. In one transaction only 3 NFTs can be minted
4. Owner can mint 10 NFTs as guest for its team members
5. Onwer can hide TokenURI from a user and reveal it later

# SimpleNFTSplit

Functionalities:

1. Owner can set Minting Price and anyone can mint
2. A wallet can have only 3 NFTs at a time
3. In one transaction only 3 NFTs can be minted
4. Owner can mint 10 NFTs as a gift for its team members
5. Onwer can hide TokenURI from a user and reveal it later
6. Percentages are set by the owner at the start for 5 different wallets and transferred to these wallets by the owner according to their percentages

# SimpleNftWithTokens

Users can mint with custom ERC20Tokens

Functionalities:

1. Owner can set Minting Price and anyone can mint
2. A wallet can have only 3 NFTs at a time
3. In one transaction only 3 NFTs can be minted
4. Owner can mint 10 NFTs as a gift for its team members
5. Onwer can hide TokenURI from a user and reveal it later
6. Percentages are set by the owner at the start for 5 different wallets and transferred to these wallets by the owner according to their percentages

# Mutating NFTs

Clone of Mutant Ape Yacht Club

The MUTANT APE YACHT CLUB(MAYC) is a collection of up to 20,000 Mutant Apes that can only be created by exposing an existing Bored Ape(BAYC) to a vial of MUTANT SERUM(BACC) or by minting a Mutant Ape in the public sale.

# StakingNFT

Functionalities:

1. User can Stake ERC721 tokens and earn ERC20 tokens
2. Owner can set a reward rate
3. Owner can change rewardable tokens in the contract
4. User should be able to earn tokens every 24 hours
5. but Rewards are set to 0 if unstaked before 7 days
6. reward can be claimed even when a user has unstaked but the reward is transferred to the current owner of NFT

# SoulBoundTokens

In this contract, only the owner of a contract is authorized to create a SoulBound token (SBT) and transfer it to a user. To create an SBT, the owner must receive 3 recovery accounts from the user. If a user loses access to the account that holds the SBT, they may request that the owner of the contract recover the SBT and provide their recovery account for verification. Once all necessary approvals have been obtained, the SBT may be transferred to a new account.
