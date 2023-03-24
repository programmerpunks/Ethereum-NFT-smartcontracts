const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple NFT with Reveal functionality", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [
      owner,
      account1,
      account2,
      account3,
      account4,
      account5,
      account6,
      account7,
      account8,
      account9,
    ] = await ethers.getSigners();

    const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
    const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");

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

    const maxMintAmount = 3;
    const maxSupply = 20; //total
    const giftSupply = 10;
    const cost = 0.01;

    await simpleNftWithTokens.setMintState(true);
    const accounts = [
      owner,
      account1,
      account2,
      account3,
      account4,
      account5,
      account6,
      account7,
      account8,
      account9,
    ];
    return {
      simpleNFT: simpleNftWithTokens,
      owner,
      account1,
      account2,
      account3,
      account4,
      account5,
      account6,
      account7,
      accounts,
      maxMintAmount,
      maxSupply,
      cost,
      giftSupply,
      erc20Tokens,
    };
  }

  describe("Constructor", () => {
    async function deployContract1() {
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2, account3, account4, account5] =
        await ethers.getSigners();

      const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
      const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");
      const SimpleNFT = await ethers.getContractFactory("simpleNftWithTokens");
      const simpleNFT = await SimpleNFT.deploy(
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
        [20, 20, 20, 20, 19],
        erc20Tokens.address
      );
    }
    async function deployContract2() {
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2, account3, account4, account5] =
        await ethers.getSigners();
      const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
      const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");
      const SimpleNFT = await ethers.getContractFactory("simpleNftWithTokens");
      const simpleNFT = await SimpleNFT.deploy(
        "Test",
        "test",
        "ipfs://URI/",
        "ipfs://notRevealedUri/",
        [
          account1.address.toString(),
          account2.address.toString(),
          ethers.constants.AddressZero,
          account4.address.toString(),
          account5.address.toString(),
        ],
        [20, 20, 20, 20, 20],
        erc20Tokens.address
      );
    }

    async function deployContract3() {
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2, account3, account4, account5] =
        await ethers.getSigners();

      const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
      const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");
      const SimpleNFT = await ethers.getContractFactory("simpleNftWithTokens");
      const simpleNFT = await SimpleNFT.deploy(
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
        [20, 20, 20, 0, 20],
        erc20Tokens.address
      );
    }

    async function deployContract4() {
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2, account3, account4, account5] =
        await ethers.getSigners();

      const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
      const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");
      const SimpleNFT = await ethers.getContractFactory("simpleNftWithTokens");
      const simpleNFT = await SimpleNFT.deploy(
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
        [20, 20, 20, 0],
        erc20Tokens.address
      );
    }
    async function deployContract5() {
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2, account3, account4, account5] =
        await ethers.getSigners();

      const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
      const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");
      const SimpleNFT = await ethers.getContractFactory("simpleNftWithTokens");
      const simpleNFT = await SimpleNFT.deploy(
        "Test",
        "test",
        "ipfs://URI/",
        "ipfs://notRevealedUri/",
        [
          account1.address.toString(),
          account2.address.toString(),
          account3.address.toString(),
          account4.address.toString(),
        ],
        [20, 20, 20, 0],
        erc20Tokens.address
      );
    }
    async function deployContract6() {
      // Contracts are deployed using the first signer/account by default
      const [owner, account1, account2, account3, account4, account5] =
        await ethers.getSigners();

      const Erc20Tokens = await ethers.getContractFactory("ERC20Tokens");
      const erc20Tokens = await Erc20Tokens.deploy("TestTokens", "$TT");
      const SimpleNFT = await ethers.getContractFactory("simpleNftWithTokens");
      const simpleNFT = await SimpleNFT.deploy(
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
        ethers.constants.AddressZero
      );
    }
    it("Should Revert when Total percentage don't add upto 100%", async function () {
      await expect(loadFixture(deployContract1)).to.be.revertedWith(
        "Total percentage should add upto 100%"
      );
    });
    it("Should Revert when Address cannot  be zero", async function () {
      await expect(loadFixture(deployContract2)).to.be.revertedWith(
        "Address cannot be zero"
      );
    });
    it("Should Revert when percentage cannot be zero for each partner", async function () {
      await expect(loadFixture(deployContract3)).to.be.revertedWith(
        "percentage cannot be zero for each partner"
      );
    });
    it("Should Revert when Accounts and percentages lengths are mismatch", async function () {
      await expect(loadFixture(deployContract4)).to.be.revertedWith(
        "Accounts and percentages length mismatch"
      );
    });
    it("Should Revert when ppartner not equal to minPartners", async function () {
      await expect(loadFixture(deployContract5)).to.be.revertedWith(
        // "partner must be at least 5"
        "partner must be at least equal to minPartners"
      );
    });
    it("Should Revert when zero address for erc20 account.", async function () {
      await expect(loadFixture(deployContract6)).to.be.revertedWith(
        // "partner must be at least 5"
        "_ERC20TokenAddress cannot be used zero"
      );
    });
  });
  describe("Deployment", function () {
    it("Should set the right owner of Contract", async function () {
      const { simpleNFT, owner } = await loadFixture(deployContract);

      expect(await simpleNFT.owner()).to.equal(owner.address);
    });

    it("Should have totalSupply equal to zero", async function () {
      const { simpleNFT, owner } = await loadFixture(deployContract);

      expect(await simpleNFT.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    describe("Validations", function () {
      it("Should revert with the error if minting is paused", async function () {
        const { simpleNFT, owner, account1 } = await loadFixture(
          deployContract
        );
        await simpleNFT.setMintState(false);
        const mintState = await simpleNFT.mintState();

        await expect(simpleNFT.connect(account1).mint(1)).to.be.revertedWith(
          "Minting is paused"
        );
      });

      it("Should revert with the error if a account that is NOT owner tries to gift", async function () {
        const {
          simpleNFT,
          owner,
          account1,
          account3,
          maxMintAmount,
          maxSupply,
          cost,
        } = await loadFixture(deployContract);

        await expect(
          simpleNFT.connect(account1).gift(maxMintAmount, account3.address, {
            value: ethers.utils.parseEther("" + cost * maxMintAmount),
          })
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should revert with the error if a account that is NOT owner setMintState", async function () {
        const { simpleNFT, owner, account1, account3 } = await loadFixture(
          deployContract
        );

        await expect(
          simpleNFT.connect(account1).setMintState(false)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should revert with the error if mint amount is zero", async function () {
        const { simpleNFT, owner, account1, maxMintAmount } = await loadFixture(
          deployContract
        );

        await expect(simpleNFT.connect(account1).mint(0)).to.be.revertedWith(
          "Mint amount Cannot be zero"
        );
        await expect(
          simpleNFT.connect(account1).mint(maxMintAmount + 1)
        ).to.be.revertedWith("Cannot mint more than max mint amount");
      });

      it("Should revert with the error if already minted max NFTs User", async function () {
        const { simpleNFT, owner, account1, maxMintAmount, cost, erc20Tokens } =
          await loadFixture(deployContract);

        await erc20Tokens.transfer(
          account1.address,
          ethers.utils.parseEther("" + (maxMintAmount + 1) * cost)
        );
        await erc20Tokens
          .connect(account1)
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + (maxMintAmount + 1) * cost)
          );

        const minting = await simpleNFT.connect(account1).mint(maxMintAmount);

        await expect(simpleNFT.connect(account1).mint(1)).to.be.revertedWith(
          "You cannot mint more than max NFTs"
        );
      });

      it("Should revert mint more than max NFTs for a wallet", async function () {
        const { simpleNFT, account1, maxMintAmount, cost, erc20Tokens } =
          await loadFixture(deployContract);

        await erc20Tokens.approve(
          simpleNFT.address,
          ethers.utils.parseEther("" + (maxMintAmount + 1) * cost)
        );

        await simpleNFT.gift(maxMintAmount, account1.address);

        await expect(simpleNFT.gift(1, account1.address)).to.be.revertedWith(
          "You cannot mint more than max NFTs for this wallet"
        );
      });

      it("Should revert when amount as gift more than gift supply", async function () {
        const {
          simpleNFT,
          accounts,
          giftSupply,
          maxMintAmount,
          cost,
          erc20Tokens,
        } = await loadFixture(deployContract);
        let gifted = 0;

        for (let index = 0; index < accounts.length; index++) {
          if (giftSupply > gifted) {
            await erc20Tokens.approve(
              simpleNFT.address,
              ethers.utils.parseEther("" + maxMintAmount * maxMintAmount * cost)
            );
            const toMint = giftSupply - gifted;
            if (toMint > maxMintAmount) {
              await erc20Tokens.approve(
                simpleNFT.address,
                ethers.utils.parseEther("" + maxMintAmount * cost)
              );

              await simpleNFT.gift(maxMintAmount, accounts[index].address);
              gifted += maxMintAmount;
            } else {
              await erc20Tokens.approve(
                simpleNFT.address,
                ethers.utils.parseEther("" + (toMint + 1) * cost)
              );

              await expect(
                simpleNFT.gift(toMint + 1, accounts[index + 1].address)
              ).to.be.revertedWith("Gift:Cannot mint this amount as gift");

              await simpleNFT.gift(toMint, accounts[index].address, {
                value: ethers.utils.parseEther("" + cost * toMint),
              });
              gifted += toMint;
            }
          }

          if (gifted == giftSupply) {
            break;
          }
        }
      });

      it("Should revert with the error if cost is not equal to set cost ", async function () {
        const {
          simpleNFT,
          owner,
          erc20Tokens,
          account1,
          account2,
          maxMintAmount,
          cost,
        } = await loadFixture(deployContract);

        await erc20Tokens
          .connect(account1)
          .approve(simpleNFT.address, ethers.utils.parseEther("" + cost / 2));

        await expect(simpleNFT.connect(account1).mint(1)).to.be.revertedWith(
          "Not enough Allowed Token to NFTs Contract"
        );

        // more approval but less balance
        await erc20Tokens
          .connect(account1)
          .approve(simpleNFT.address, ethers.utils.parseEther("" + cost * 2));
        await expect(simpleNFT.connect(account1).mint(2)).to.be.revertedWith(
          "Not enough Tokens"
        );

        await erc20Tokens
          .connect(account2)
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + (maxMintAmount - 1) * cost)
          );

        await expect(
          simpleNFT.gift(maxMintAmount, account1.address)
        ).to.be.revertedWith("Not enough Allowed Token to NFTs Contract");

        // await erc20Tokens
        //   .connect(account2)
        //   .approve(
        //     simpleNFT.address,
        //     ethers.utils.parseEther("" + maxMintAmount * cost)
        //   );

        const balance = await erc20Tokens.balanceOf(owner.address);
        await erc20Tokens.transfer(account2.address, balance);

        // await erc20Tokens.transfer(
        //   account2.address,
        //   ethers.utils.parseEther("" + cost * maxMintAmount)
        // );
        await erc20Tokens.approve(
          simpleNFT.address,
          ethers.utils.parseEther("" + maxMintAmount * cost)
        );

        await expect(
          simpleNFT.gift(maxMintAmount, account2.address)
        ).to.be.revertedWith("Not enough Tokens");

        // await erc20Tokens.connect(account2).transfer(owner.address, balance);
        await erc20Tokens
          .connect(account2)
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + maxMintAmount * cost)
          );

        await simpleNFT.connect(account2).mint(maxMintAmount);

        const mintedTokens = await simpleNFT.nftsOnwedByWallet(
          account2.address
        );

        expect(mintedTokens.toString()).to.equal("1,2,3");
      });
    });
  });
  describe("WithDraw ", function () {
    describe("Validations", function () {
      it("Should revert with the error if caller is not owner of contract", async function () {
        const { simpleNFT, account1 } = await loadFixture(deployContract);
        await expect(simpleNFT.connect(account1).withdraw()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("Should revert with the if balance of contract is zero", async function () {
        const { simpleNFT, owner } = await loadFixture(deployContract);
        await expect(simpleNFT.connect(owner).withdraw()).to.be.revertedWith(
          "Balance of this Contract is Zero"
        );
      });
    });

    describe("Transfer", function () {
      it("Should revert with the if Balance of contract is not withdrawn", async function () {
        const {
          simpleNFT,
          account1,
          account2,
          account3,
          account4,
          account5,
          maxMintAmount,
          cost,
          erc20Tokens,
        } = await loadFixture(deployContract);

        await erc20Tokens
          .connect(account1)
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + maxMintAmount * cost)
          );

        await erc20Tokens.transfer(
          account1.address,
          ethers.utils.parseEther("" + cost * maxMintAmount)
        );

        await simpleNFT.connect(account1).mint(maxMintAmount);

        expect(BigInt(await erc20Tokens.balanceOf(simpleNFT.address))).to.equal(
          ethers.utils.parseEther("" + cost * maxMintAmount)
        );

        await expect(() => simpleNFT.withdraw()).to.changeTokenBalances(
          erc20Tokens,
          [
            simpleNFT.address,
            account1.address,
            account2.address,
            account3.address,
            account4.address,
            account5.address,
          ],
          [
            ethers.utils.parseEther("" + cost * maxMintAmount * -1),
            ethers.utils.parseEther("" + (cost * maxMintAmount * 20) / 100), //20%,
            ethers.utils.parseEther("" + (cost * maxMintAmount * 20) / 100), //20%,
            ethers.utils.parseEther("" + (cost * maxMintAmount * 20) / 100), //20%,
            ethers.utils.parseEther("" + (cost * maxMintAmount * 20) / 100), //20%,
            ethers.utils.parseEther("" + (cost * maxMintAmount * 20) / 100), //20%,
          ]
        );

        expect(
          BigInt(await ethers.provider.getBalance(simpleNFT.address))
        ).to.equal(BigInt(0));
      });
    });
  });

  describe("function tokenURI ", function () {
    describe("Validations", function () {
      it("Should revert with the error for nonexistent token", async function () {
        const { simpleNFT, owner, account1 } = await loadFixture(
          deployContract
        );

        await expect(
          simpleNFT.connect(account1).tokenURI(1)
        ).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
      });

      it("Should revert when non onwer tries to reveal", async function () {
        const { simpleNFT, account1 } = await loadFixture(deployContract);
        await expect(simpleNFT.connect(account1).reveal()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("Should revert when non owner tries setBaseURI ", async function () {
        const { simpleNFT, account1 } = await loadFixture(deployContract);
        await expect(
          simpleNFT.connect(account1).setBaseURI("ipfs://baseUR/")
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should revert if setBaseURI is not set:", async function () {
        const { simpleNFT, owner, account1, cost, erc20Tokens, maxMintAmount } =
          await loadFixture(deployContract);
        await simpleNFT.connect(owner).setBaseURI("ipfs://baseURI/");

        await erc20Tokens.approve(
          simpleNFT.address,
          ethers.utils.parseEther("" + maxMintAmount * cost)
        );

        await simpleNFT.gift(maxMintAmount, account1.address);
        await simpleNFT.reveal();

        expect(await simpleNFT.tokenURI(1)).to.equal("ipfs://baseURI/1.json");
      });

      it("Should revert if setNotRevealedURI is called by non owner:", async function () {
        const { simpleNFT, account1 } = await loadFixture(deployContract);
        await expect(
          simpleNFT.connect(account1).setNotRevealedURI("ipfs://baseURI/")
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should revert if setNotRevealedURI is doesn't set NotRevealedURI:", async function () {
        const { simpleNFT, owner } = await loadFixture(deployContract);
        await simpleNFT
          .connect(owner)
          .setNotRevealedURI("ipfs://setNotRevealedURItest/");
        expect(await simpleNFT.notRevealedUri()).to.equal(
          "ipfs://setNotRevealedURItest/"
        );
      });

      it("Should revert with the URI is not Correct", async function () {
        const { simpleNFT, owner, maxMintAmount, cost, erc20Tokens } =
          await loadFixture(deployContract);

        await erc20Tokens.approve(
          simpleNFT.address,
          ethers.utils.parseEther("" + maxMintAmount * cost)
        );

        await simpleNFT.connect(owner).mint(maxMintAmount);
        expect(await simpleNFT.tokenURI(1)).to.equal("ipfs://notRevealedUri/");
        await simpleNFT.reveal();
        expect(await simpleNFT.tokenURI(1)).to.equal("ipfs://URI/1.json");
      });
    });

    describe("Testing Token Ids with nftsOnwedByWallet function", function () {
      it("Should revert with the if Wrong Token id", async function () {
        const {
          simpleNFT,
          owner,
          account1,
          account2,
          account3,
          maxMintAmount,
          cost,
          erc20Tokens,
        } = await loadFixture(deployContract);

        await erc20Tokens.approve(
          simpleNFT.address,
          ethers.utils.parseEther("" + maxMintAmount * cost)
        );
        await simpleNFT.connect(owner).mint(maxMintAmount);

        const ownerTokens = await simpleNFT
          .connect(owner)
          .nftsOnwedByWallet(owner.address);
        console.log("ownerTokens", ownerTokens);

        expect(ownerTokens.toString()).to.equal("1,2,3");

        await erc20Tokens
          .connect(account1)
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + maxMintAmount * cost)
          );

        await erc20Tokens.transfer(
          account1.address,
          ethers.utils.parseEther("" + cost * maxMintAmount)
        );

        await simpleNFT.connect(account1).mint(maxMintAmount);

        const account1Tokens = await simpleNFT
          .connect(account1)
          .nftsOnwedByWallet(account1.address);

        console.log("account1Tokens", account1Tokens);
        expect(account1Tokens.toString()).to.equal("4,5,6");

        await erc20Tokens
          .connect(account2)
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + maxMintAmount * cost)
          );

        await erc20Tokens.transfer(
          account2.address,
          ethers.utils.parseEther("" + cost * maxMintAmount)
        );
        await simpleNFT.connect(account2).mint(maxMintAmount);

        const account2Tokens = await simpleNFT
          .connect(account2)
          .nftsOnwedByWallet(account2.address);
        console.log("account2Tokens", account2Tokens);
        expect(account2Tokens.toString()).to.equal("7,8,9");

        await erc20Tokens
          .connect(account3)
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + maxMintAmount * cost)
          );

        await erc20Tokens.transfer(
          account3.address,
          ethers.utils.parseEther("" + cost * maxMintAmount)
        );

        await simpleNFT.connect(account3).mint(1);
        const account3Tokens = await simpleNFT
          .connect(account3)
          .nftsOnwedByWallet(account3.address);

        console.log("account3Tokens", account3Tokens);
        expect(account3Tokens.toString()).to.equal("10");

        await expect(simpleNFT.connect(account3).mint(2)).to.be.revertedWith(
          "Cannot mint more than max Supply"
        );
      });
    });

    describe("Testing of cost function", function () {
      it("validation of OnlyOwner", async function () {
        const { simpleNFT, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await expect(
          simpleNFT.connect(account2).setCost(ethers.utils.parseEther("1"))
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
      it("Should revert with the if cost is not set", async function () {
        const { simpleNFT, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        const newCost = ethers.utils.parseEther("1");
        await simpleNFT.connect(owner).setCost(newCost);
        expect(await simpleNFT.cost()).to.equal(newCost);
      });
    });

    describe("Testing of Reveal Functionality", function () {
      it("validation of OnlyOwner", async function () {
        const {
          simpleNFT,
          owner,
          account1,
          account2,
          account3,
          maxMintAmount,
        } = await loadFixture(deployContract);
        await expect(
          simpleNFT
            .connect(account2)
            .setCost(ethers.utils.parseEther("" + maxMintAmount))
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should revert with the if cost is not set", async function () {
        const { simpleNFT, owner } = await loadFixture(deployContract);

        const newCost = ethers.utils.parseEther("1");
        await simpleNFT.connect(owner).setCost(newCost);
        expect(await simpleNFT.cost()).to.equal(newCost);
      });
    });
    describe("Testing of setmaxMintAmount function", function () {
      it("validation of OnlyOwner", async function () {
        const { simpleNFT, owner, account1, maxMintAmount } = await loadFixture(
          deployContract
        );
        await expect(
          simpleNFT.connect(account1).setmaxMintAmount(maxMintAmount + 1)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
      it("Should revert with the if maxmint amount is not updated", async function () {
        const { simpleNFT, owner, account1, maxMintAmount } = await loadFixture(
          deployContract
        );

        await simpleNFT.connect(owner).setmaxMintAmount(maxMintAmount + 1);

        await expect(
          simpleNFT.connect(account1).mint(maxMintAmount + 2)
        ).to.be.revertedWith("Cannot mint more than max mint amount");

        expect(await simpleNFT.maxMintAmount()).to.equal(maxMintAmount + 1);
      });
    });
    describe("Testing of setBaseURI and setBaseExtension function", function () {
      it("validation of OnlyOwner", async function () {
        const { simpleNFT, account1 } = await loadFixture(deployContract);
        await expect(
          simpleNFT.connect(account1).setBaseURI("ipfs://none")
        ).to.be.revertedWith("Ownable: caller is not the owner");

        await expect(
          simpleNFT.connect(account1).setBaseExtension("ipfs://none")
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Error if setBaseExtension is not set", async function () {
        const { simpleNFT, owner } = await loadFixture(deployContract);
        await simpleNFT.connect(owner).setBaseExtension(".png");

        const newExtension = await simpleNFT.baseExtension();
        expect(newExtension).to.equal(".png");
      });
    });
  });

  describe("Testing of gift function ", function () {
    it("Validation", async function () {
      const { simpleNFT, account1, maxMintAmount, cost } = await loadFixture(
        deployContract
      );

      await expect(
        simpleNFT.connect(account1).gift(maxMintAmount, account1.address, {
          value: ethers.utils.parseEther("" + cost * maxMintAmount),
        })
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await simpleNFT.setMintState(false);
      await expect(
        simpleNFT.gift(maxMintAmount, account1.address, {
          value: ethers.utils.parseEther("" + cost * maxMintAmount),
        })
      ).to.be.revertedWith("Minting is paused");
    });

    it("Should revert error when all gift are dispatched", async () => {
      //All Gift are dispatched
      // NOTE: hardhat has Only 10 accounts by defaults so if  giftSupply > 10* maxMintAmount then these test function are bound to fail
      const {
        simpleNFT,
        accounts,
        account1,
        giftSupply,
        cost,
        maxMintAmount,
        erc20Tokens,
      } = await loadFixture(deployContract);

      await erc20Tokens.approve(
        simpleNFT.address,
        ethers.utils.parseEther("" + maxMintAmount * accounts.length)
      );

      let minted = 0;
      for (let index = 0; index < accounts.length; index++) {
        if (giftSupply > minted) {
          const toMint = giftSupply - minted;
          if (toMint > maxMintAmount) {
            await simpleNFT.gift(maxMintAmount, accounts[index].address, {
              value: ethers.utils.parseEther("" + cost * maxMintAmount),
            });
            minted += maxMintAmount;
          } else {
            await simpleNFT.gift(toMint, accounts[index].address, {
              value: ethers.utils.parseEther("" + cost * toMint),
            });
            minted += toMint;
          }
        }
      }
      await expect(
        simpleNFT.gift(1, account1.address, {
          value: ethers.utils.parseEther("" + cost),
        })
      ).to.be.revertedWith("All Gift are dispatched");
    });
    it("Gift amount should be greater than zero", async () => {
      const { simpleNFT, account1 } = await loadFixture(deployContract);
      await expect(simpleNFT.gift(0, account1.address)).to.be.revertedWith(
        "Mint amount Cannot be zero"
      );
    });
    it("Gift amount should be greater than maxMintamount", async () => {
      const { simpleNFT, account1, cost, maxMintAmount } = await loadFixture(
        deployContract
      );
      await expect(
        simpleNFT.gift(maxMintAmount + 1, account1.address)
      ).to.be.revertedWith("Cannot mint more than max mint amount");
    });
    // it("Gift amount cost Error", async () => {
    //   const { simpleNFT, account1, cost, maxMintAmount, erc20Tokens } =
    //     await loadFixture(deployContract);

    //   await erc20Tokens.approve(
    //     simpleNFT.address,
    //     ethers.utils.parseEther("" + maxMintAmount * cost)
    //   );
    //   await expect(
    //     simpleNFT.gift(
    //       1,
    //       account1.address
    //       //   , {
    //       //   value: ethers.utils.parseEther("" + cost / 2),
    //       // }
    //     )
    //   ).to.be.revertedWith("Cost Error");
    // });
    it("Gift:Cannot mint more than max Supply", async () => {
      const {
        simpleNFT,
        accounts,
        giftSupply,
        maxMintAmount,
        maxSupply,
        cost,
        erc20Tokens,
      } = await loadFixture(deployContract);

      let normalSupply = maxSupply - giftSupply;
      let minted = 0;
      let lastAccountIndex = 0;

      for (let i = 0; i < accounts.length; i++) {
        await erc20Tokens.transfer(
          accounts[i].address,
          ethers.utils.parseEther("" + cost * maxMintAmount)
        );
        await erc20Tokens
          .connect(accounts[i])
          .approve(
            simpleNFT.address,
            ethers.utils.parseEther("" + maxMintAmount * cost)
          );
      }

      for (let index = 0; index < accounts.length; index++) {
        if (normalSupply > minted) {
          const toMint = normalSupply - minted;
          if (toMint > maxMintAmount) {
            await simpleNFT.connect(accounts[index]).mint(maxMintAmount);
            minted += maxMintAmount;
          } else {
            await simpleNFT.connect(accounts[index]).mint(toMint);
            minted += toMint;
          }
        }

        lastAccountIndex = index;
        if (minted == normalSupply) {
          break;
        }
      }

      await erc20Tokens.approve(
        simpleNFT.address,
        ethers.utils.parseEther("" + 1000 * maxMintAmount)
      );
      let gifted = 0;

      for (let index = lastAccountIndex + 1; index < accounts.length; index++) {
        if (giftSupply > gifted) {
          const toMint = giftSupply - gifted;
          if (toMint > maxMintAmount) {
            await simpleNFT.gift(maxMintAmount, accounts[index].address);
            gifted += maxMintAmount;
          } else {
            await expect(
              simpleNFT.gift(toMint + 1, accounts[lastAccountIndex + 1].address)
            ).to.be.revertedWith("Cannot mint more than max Supply");

            await simpleNFT.gift(toMint, accounts[index].address);
            gifted += toMint;
          }
        }

        lastAccountIndex = index;

        if (gifted == giftSupply) {
          break;
        }
      }

      await expect(
        simpleNFT.connect(accounts[lastAccountIndex + 1]).mint(1)
      ).to.be.revertedWith("Cannot mint more than max Supply");

      await expect(
        simpleNFT.gift(1, accounts[lastAccountIndex + 1].address)
      ).to.be.revertedWith("All Gift are dispatched");
    });
  });
});
