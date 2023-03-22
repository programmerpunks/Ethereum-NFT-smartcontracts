const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple NFT with gift functionality", function () {
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
    ] = await ethers.getSigners();

    const SimpleNFTGift = await ethers.getContractFactory("simpleNFTGift");
    const simpleNFTGift = await SimpleNFTGift.deploy(
      "Test",
      "test",
      "ipfs://URI/"
    );

    await simpleNFTGift.setMintState(true);

    const maxMintAmount = 3;
    const maxSupply = 20; //total
    const cost = 0.01;

    return {
      simpleNFTGift,
      owner,
      account1,
      account2,
      account3,
      account4,
      account5,
      account6,
      account7,
      maxMintAmount,
      maxSupply,
      cost,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner of Contract", async function () {
      const { simpleNFTGift, owner } = await loadFixture(deployContract);

      expect(await simpleNFTGift.owner()).to.equal(owner.address);
    });

    it("Should have totalSupply equal to zero", async function () {
      const { simpleNFTGift, owner } = await loadFixture(deployContract);

      expect(await simpleNFTGift.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    describe("Validations", function () {
      it("Should revert with the error if minting is paused", async function () {
        const { simpleNFTGift, owner, account1 } = await loadFixture(
          deployContract
        );
        await simpleNFTGift.setMintState(false);
        const mintState = await simpleNFTGift.mintState();
        console.log("MintState value:", mintState);
        await expect(
          simpleNFTGift.connect(account1).mint(1)
        ).to.be.revertedWith("Minting is paused");
      });

      it("Should revert with the error if a account that is NOT owner tries to pause", async function () {
        const { simpleNFTGift, owner, account1 } = await loadFixture(
          deployContract
        );

        await expect(
          simpleNFTGift.connect(account1).setMintState(false)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should revert with the error if a account that is NOT owner tries to gift", async function () {
        const {
          simpleNFTGift,
          owner,
          account1,
          account3,
          maxMintAmount,
          maxSupply,
          cost,
        } = await loadFixture(deployContract);

        await expect(
          simpleNFTGift
            .connect(account1)
            .gift(maxMintAmount, account3.address, {
              value: ethers.utils.parseEther("" + cost * maxMintAmount),
            })
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should revert with the error if mint amount is zero", async function () {
        const { simpleNFTGift, owner, account1, maxMintAmount } =
          await loadFixture(deployContract);

        await expect(
          simpleNFTGift.connect(account1).mint(0)
        ).to.be.revertedWith("Mint amount Cannot be zero");
        await expect(
          simpleNFTGift.connect(account1).mint(maxMintAmount + 1)
        ).to.be.revertedWith("Cannot mint more than max mint amount");
      });

      it("Should revert with the error if already minted max NFTs User", async function () {
        const {
          simpleNFTGift,
          owner,
          account1,
          maxMintAmount,
          maxSupply,
          cost,
        } = await loadFixture(deployContract);

        const minting = await simpleNFTGift
          .connect(account1)
          .mint(maxMintAmount, {
            value: ethers.utils.parseEther("" + cost * maxMintAmount),
          });
        console.log("minting: " + minting);
        await expect(
          simpleNFTGift.connect(account1).mint(1, {
            value: ethers.utils.parseEther("" + cost),
          })
        ).to.be.revertedWith("You cannot mint more than max NFTs");
      });

      // TODO: SET FOLLOWING
      it("Should revert with the error if mint more than max Supply Boundry for user", async function () {
        const {
          simpleNFTGift,
          owner,
          account1,
          account2,
          account3,
          account4,
          account5,
          account6,
          account7,
          maxMintAmount,
          maxSupply,
          cost,
        } = await loadFixture(deployContract);

        await simpleNFTGift.connect(owner).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });

        await simpleNFTGift.connect(account1).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });
        await simpleNFTGift.connect(account2).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });
        // mint 9
        await expect(
          simpleNFTGift.connect(account3).mint(2, {
            value: ethers.utils.parseEther("0.02"),
          })
        ).to.be.revertedWith("Cannot mint more than max Supply");

        await simpleNFTGift.connect(owner).gift(1, account3.address, {
          value: ethers.utils.parseEther("0.01"),
        });

        await simpleNFTGift.connect(owner).gift(2, account3.address, {
          value: ethers.utils.parseEther("0.02"),
        });
        // mint 9 gift 3
        await expect(
          simpleNFTGift.connect(owner).gift(1, account3.address, {
            value: ethers.utils.parseEther("0.01"),
          })
        ).to.be.revertedWith(
          "You cannot mint more than max NFTs for this wallet"
        );

        await simpleNFTGift.connect(owner).gift(3, account4.address, {
          value: ethers.utils.parseEther("0.03"),
        });
        // mint 9 gift 6
        await expect(
          simpleNFTGift.connect(owner).gift(1, account4.address, {
            value: ethers.utils.parseEther("0.01"),
          })
        ).to.be.revertedWith(
          "You cannot mint more than max NFTs for this wallet"
        );
        await simpleNFTGift.connect(owner).gift(3, account5.address, {
          value: ethers.utils.parseEther("0.03"),
        });
        // mint 9 gift 9
        await expect(
          simpleNFTGift.connect(owner).gift(3, account6.address, {
            value: ethers.utils.parseEther("0.03"),
          })
        ).to.be.revertedWith("Cannot mint this amount as gift");

        await simpleNFTGift.connect(owner).gift(1, account6.address, {
          value: ethers.utils.parseEther("0.01"),
        });
        // mint 9 gift 10
        await simpleNFTGift.connect(account6).mint(1, {
          value: ethers.utils.parseEther("0.01"),
        });
        // mint 10 gift 10
        await expect(
          simpleNFTGift.connect(account7).mint(1, {
            value: ethers.utils.parseEther("0.01"),
          })
        ).to.be.revertedWith("Cannot mint more than max Supply");
      });

      it("Should revert with the error if cost is not equal to set cost ", async function () {
        const {
          simpleNFTGift,
          owner,
          account1,
          account2,
          account3,
          maxMintAmount,
          maxSupply,
          cost,
        } = await loadFixture(deployContract);

        await expect(
          simpleNFTGift.connect(account3).mint(1, {
            value: ethers.utils.parseEther("" + cost / 2),
          })
        ).to.be.revertedWith("Cost Error");
      });
    });
  });
  describe("WithDraw ", function () {
    describe("Validations", function () {
      it("Should revert with the error if caller is not owner of contract", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);

        await expect(
          simpleNFTGift.connect(account3).withdraw()
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
      it("Should revert with the if balance of contract is zero", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await expect(
          simpleNFTGift.connect(owner).withdraw()
        ).to.be.revertedWith("Balance of this Contract is Zero");
      });
    });

    describe("Transfer", function () {
      it("Should revert with the if Balance of contract is not widhdrawn", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);

        const balanceOfaccount2before = BigInt(
          await ethers.provider.getBalance(account2.address)
        );
        console.log("balanceOfaccount2before", balanceOfaccount2before);

        await simpleNFTGift.connect(account2).mint(2, {
          value: ethers.utils.parseEther("0.02"),
        });

        expect(
          BigInt(await ethers.provider.getBalance(simpleNFTGift.address))
        ).to.equal(ethers.utils.parseEther("0.02"));

        const balanceOfaccount2After = BigInt(
          await ethers.provider.getBalance(simpleNFTGift.address)
        );
        console.log("balanceOfaccount2After", balanceOfaccount2After);

        const balanceOfOwnerBefore = BigInt(
          await ethers.provider.getBalance(owner.address)
        );
        console.log("balanceOfOwnerBefore:", balanceOfOwnerBefore);
        const widhdrawn = await simpleNFTGift.withdraw();

        const balanceOfOwnerAfter = BigInt(
          await ethers.provider.getBalance(owner.address)
        );
        console.log("balanceOfOwnerAfter:", balanceOfOwnerAfter);

        expect(
          BigInt(await ethers.provider.getBalance(simpleNFTGift.address))
        ).to.equal(BigInt(0));
      });
    });
  });

  describe("function tokenURI ", function () {
    describe("Validations", function () {
      it("Should revert with the error for nonexistent token", async function () {
        const { simpleNFTGift, owner, account1 } = await loadFixture(
          deployContract
        );

        await expect(
          simpleNFTGift.connect(account1).tokenURI(1)
        ).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
      });
      it("Should revert with the URI is not Correct", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await simpleNFTGift.connect(owner).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });
        const tokenurii = await simpleNFTGift.tokenURI(1);
        console.log("tokenurii", tokenurii);

        expect(await simpleNFTGift.tokenURI(1)).to.equal("ipfs://URI/1.json");
      });
    });

    describe("Testing Token Ids with nftsOnwedByWallet function", function () {
      it("Should revert with the if Wrong Token id", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await simpleNFTGift.connect(owner).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });

        const ownerTokens = await simpleNFTGift
          .connect(owner)
          .nftsOnwedByWallet(owner.address);

        console.log("MY tokens: ", [
          ethers.BigNumber.from("1"),
          ethers.BigNumber.from("2"),
          ethers.BigNumber.from("3"),
        ]);

        console.log("ownerTokens", ...ownerTokens);
        // expect(ownerTokens).to.equal([
        //   ethers.BigNumber.from("1"),
        //   ethers.BigNumber.from("2"),
        //   ethers.BigNumber.from("3"),
        // ]);
        await simpleNFTGift.connect(account1).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });

        const account1Tokens = await simpleNFTGift
          .connect(account1)
          .nftsOnwedByWallet(account1.address);

        console.log("account1Tokens: ", account1Tokens);
        await simpleNFTGift.connect(account2).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });

        const account2Tokens = await simpleNFTGift
          .connect(account2)
          .nftsOnwedByWallet(account2.address);

        console.log("account1Tokens: ", account2Tokens);

        await simpleNFTGift.connect(account3).mint(1, {
          value: ethers.utils.parseEther("0.01"),
        });

        const account3Tokens = await simpleNFTGift
          .connect(account3)
          .nftsOnwedByWallet(account3.address);

        console.log("account1Tokens: ", account3Tokens);
        // TODO: fix this lateron
        // await expect(
        //   simpleNFTGift.connect(account3).mint(2, {
        //     value: ethers.utils.parseEther("0.02"),
        //   })
        // ).to.be.revertedWith("Cannot mint more than max Supply");
      });
    });

    describe("Testing of cost function", function () {
      it("validation of OnlyOwner", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await expect(
          simpleNFTGift.connect(account2).setCost(ethers.utils.parseEther("1"))
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
      it("Should revert with the if cost is not set", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);

        await simpleNFTGift
          .connect(owner)
          .setCost(ethers.utils.parseEther("1"));
        expect(await simpleNFTGift.cost()).to.equal(
          ethers.utils.parseEther("1")
        );
      });
    });

    describe("Testing of setmaxMintAmount function", function () {
      it("validation of OnlyOwner", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await expect(
          simpleNFTGift.connect(account2).setmaxMintAmount(5)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
      it("Should revert with the if maxmint amount is not updated", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);

        await simpleNFTGift.connect(owner).setmaxMintAmount(1);

        await expect(
          simpleNFTGift.connect(account2).mint(2)
        ).to.be.revertedWith("Cannot mint more than max mint amount");

        expect(await simpleNFTGift.maxMintAmount()).to.equal(1);
      });
    });
    describe("Testing of setmaxMintAmount function", function () {
      it("validation of OnlyOwner", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await expect(
          simpleNFTGift.connect(account2).setBaseURI("ipfs://none")
        ).to.be.revertedWith("Ownable: caller is not the owner");

        await expect(
          simpleNFTGift.connect(account2).setBaseExtension("ipfs://none")
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Error if setBaseExtension is not set", async function () {
        const { simpleNFTGift, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        const setbaseExtension = await simpleNFTGift
          .connect(owner)
          .setBaseExtension(".png");
        const val = await simpleNFTGift.baseExtension();
        expect(val).to.equal(".png");
      });
    });
  });
  describe("Testing of gift function ", function () {
    it("Validation", async function () {
      const { simpleNFTGift, owner, account1, account2, account3, account4 } =
        await loadFixture(deployContract);

      await expect(
        simpleNFTGift.connect(account1).gift(3, account3.address, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await simpleNFTGift.setMintState(false);
      await expect(
        simpleNFTGift.gift(3, account3.address, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("Minting is paused");
    });
    it("Should revert error when all gift are dispatched", async () => {
      //All Gift are dispatched
      const { simpleNFTGift, owner, account1, account2, account3, account4 } =
        await loadFixture(deployContract);

      await simpleNFTGift.gift(3, account1.address, {
        value: ethers.utils.parseEther("0.03"),
      });
      await simpleNFTGift.gift(3, account2.address, {
        value: ethers.utils.parseEther("0.03"),
      });
      await simpleNFTGift.gift(3, account3.address, {
        value: ethers.utils.parseEther("0.03"),
      });

      await simpleNFTGift.gift(1, account4.address, {
        value: ethers.utils.parseEther("0.01"),
      });
      await expect(
        simpleNFTGift.gift(3, account4.address, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("All Gift are dispatched");
    });
    it("Gift amount should be greater than zero", async () => {
      const { simpleNFTGift, owner, account1, account2, account3, account4 } =
        await loadFixture(deployContract);
      await expect(
        simpleNFTGift.gift(0, account4.address, {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("Mint amount Cannot be zero");
    });
    it("Gift amount should be greater than maxMintamount", async () => {
      const { simpleNFTGift, owner, account1, account2, account3, account4 } =
        await loadFixture(deployContract);
      await expect(
        simpleNFTGift.gift(4, account4.address, {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("Cannot mint more than max mint amount");
    });
    it("Gift amount cost Error", async () => {
      const { simpleNFTGift, owner, account1, account2, account3, account4 } =
        await loadFixture(deployContract);
      await expect(
        simpleNFTGift.gift(1, account4.address, {
          value: ethers.utils.parseEther("0.009"),
        })
      ).to.be.revertedWith("Cost Error");
    });
    it("Gift:Cannot mint more than max Supply", async () => {
      const {
        simpleNFTGift,
        owner,
        account1,
        account2,
        account3,
        account4,
        account5,
        account6,
        account7,
        maxMintAmount,
        maxSupply,
        cost,
      } = await loadFixture(deployContract);

      await simpleNFTGift.gift(3, account4.address, {
        value: ethers.utils.parseEther("0.03"),
      });
      await simpleNFTGift.gift(3, account5.address, {
        value: ethers.utils.parseEther("0.03"),
      });
      await simpleNFTGift.gift(2, account6.address, {
        value: ethers.utils.parseEther("0.02"),
      });
      //mint 0 gift 8
      await simpleNFTGift.mint(3, {
        value: ethers.utils.parseEther("0.03"),
      });
      await simpleNFTGift.connect(account1).mint(3, {
        value: ethers.utils.parseEther("0.03"),
      });
      await simpleNFTGift.connect(account2).mint(3, {
        value: ethers.utils.parseEther("0.03"),
      });
      await simpleNFTGift.connect(account3).mint(1, {
        value: ethers.utils.parseEther("0.01"),
      });

      // mint 10, gift 8
      await expect(
        simpleNFTGift.gift(3, account7.address, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("Cannot mint this amount as gift");

      await simpleNFTGift.gift(2, account7.address, {
        value: ethers.utils.parseEther("0.02"),
      });

      expect(await simpleNFTGift.totalSupply()).to.equal(20);
    });
  });
});
