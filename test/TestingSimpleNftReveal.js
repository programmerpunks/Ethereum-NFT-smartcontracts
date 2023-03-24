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

    const SimpleNFTReveal = await ethers.getContractFactory("simpleNFTReveal");
    const simpleNFTReveal = await SimpleNFTReveal.deploy(
      "Test",
      "test",
      "ipfs://URI/",
      "ipfs://notRevealedUri/"
    );

    const maxMintAmount = 3;
    const maxSupply = 20; //total
    const giftSupply = 10;
    const cost = 0.01;

    await simpleNFTReveal.setMintState(true);
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
      simpleNFT: simpleNFTReveal,
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
    };
  }

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
        const {
          simpleNFT,
          owner,
          account1,
          maxMintAmount,

          cost,
        } = await loadFixture(deployContract);

        const minting = await simpleNFT.connect(account1).mint(maxMintAmount, {
          value: ethers.utils.parseEther("" + cost * maxMintAmount),
        });

        await expect(
          simpleNFT.connect(account1).mint(1, {
            value: ethers.utils.parseEther("" + cost),
          })
        ).to.be.revertedWith("You cannot mint more than max NFTs");
      });
      // TODO: FIX THESE done
      it("Should revert mint more than max NFTs for a wallet", async function () {
        const { simpleNFT, account1, maxMintAmount, cost } = await loadFixture(
          deployContract
        );

        await simpleNFT.gift(maxMintAmount, account1.address, {
          value: ethers.utils.parseEther("" + maxMintAmount * cost),
        });
        await expect(
          simpleNFT.gift(1, account1.address, {
            value: ethers.utils.parseEther("" + cost),
          })
        ).to.be.revertedWith(
          "You cannot mint more than max NFTs for this wallet"
        );
      });

      it("Should revert when amount as gift more than gift supply", async function () {
        const { simpleNFT, accounts, giftSupply, maxMintAmount, cost } =
          await loadFixture(deployContract);
        let gifted = 0;

        for (let index = 0; index < accounts.length; index++) {
          if (giftSupply > gifted) {
            const toMint = giftSupply - gifted;
            if (toMint > maxMintAmount) {
              await simpleNFT.gift(maxMintAmount, accounts[index].address, {
                value: ethers.utils.parseEther("" + cost * maxMintAmount),
              });
              gifted += maxMintAmount;
            } else {
              await expect(
                simpleNFT.gift(toMint + 1, accounts[index + 1].address, {
                  value: ethers.utils.parseEther("" + cost),
                })
              ).to.be.revertedWith("Cannot mint this amount as gift");

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
          account1,
          account2,
          account3,
          maxMintAmount,
          cost,
        } = await loadFixture(deployContract);

        await expect(
          simpleNFT.connect(account3).mint(1, {
            value: ethers.utils.parseEther("" + cost / 2),
          })
        ).to.be.revertedWith("Cost Error");
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
      it("Should revert with the if Balance of contract is not widhdrawn", async function () {
        const { simpleNFT, owner, account1, maxMintAmount, cost } =
          await loadFixture(deployContract);

        await simpleNFT.connect(account1).mint(maxMintAmount, {
          value: ethers.utils.parseEther("" + cost * maxMintAmount),
        });

        expect(
          BigInt(await ethers.provider.getBalance(simpleNFT.address))
        ).to.equal(ethers.utils.parseEther("" + cost * maxMintAmount));

        await expect(() => simpleNFT.withdraw()).to.changeEtherBalances(
          [simpleNFT.address, owner.address],
          [
            ethers.utils.parseEther("" + cost * maxMintAmount * -1),
            ethers.utils.parseEther("" + cost * maxMintAmount),
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
        const { simpleNFT, owner, account1, cost } = await loadFixture(
          deployContract
        );
        await simpleNFT.connect(owner).setBaseURI("ipfs://baseURI/");

        await simpleNFT.gift(1, account1.address, {
          value: ethers.utils.parseEther("" + cost),
        });
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
        const { simpleNFT, owner, maxMintAmount, cost } = await loadFixture(
          deployContract
        );
        await simpleNFT.connect(owner).mint(maxMintAmount, {
          value: ethers.utils.parseEther("" + cost * maxMintAmount),
        });
        expect(await simpleNFT.tokenURI(1)).to.equal("ipfs://notRevealedUri/");
        await simpleNFT.reveal();
        expect(await simpleNFT.tokenURI(1)).to.equal("ipfs://URI/1.json");
      });
    });

    describe("Testing Token Ids with nftsOnwedByWallet function", function () {
      it("Should revert with the if Wrong Token id", async function () {
        const { simpleNFT, owner, account1, account2, account3 } =
          await loadFixture(deployContract);
        await simpleNFT.connect(owner).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });
        const ownerTokens = await simpleNFT
          .connect(owner)
          .nftsOnwedByWallet(owner.address);
        console.log("ownerTokens", ownerTokens);
        // const expectedVal = [
        //   ethers.BigNumber.from("1"),
        //   ethers.BigNumber.from("2"),
        //   ethers.BigNumber.from("3"),
        // ];
        // console.log("My TOkens", expectedVal);
        // expect(ownerTokens).to.equal(expectedVal);
        await simpleNFT.connect(account1).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });
        const account1Tokens = await simpleNFT
          .connect(account1)
          .nftsOnwedByWallet(account1.address);
        console.log("account1Tokens", account1Tokens);
        await simpleNFT.connect(account2).mint(3, {
          value: ethers.utils.parseEther("0.03"),
        });
        const account2Tokens = await simpleNFT
          .connect(account2)
          .nftsOnwedByWallet(account2.address);
        console.log("account2Tokens", account2Tokens);
        await simpleNFT.connect(account3).mint(1, {
          value: ethers.utils.parseEther("0.01"),
        });
        const account3Tokens = await simpleNFT
          .connect(account3)
          .nftsOnwedByWallet(account3.address);
        console.log("account3Tokens", account3Tokens);
        await expect(
          simpleNFT.connect(account3).mint(2, {
            value: ethers.utils.parseEther("0.02"),
          })
        ).to.be.revertedWith("Cannot mint more than max Supply");
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
      const { simpleNFT, accounts, account1, giftSupply, cost, maxMintAmount } =
        await loadFixture(deployContract);

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
      await expect(
        simpleNFT.gift(0, account1.address, {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("Mint amount Cannot be zero");
    });
    it("Gift amount should be greater than maxMintamount", async () => {
      const { simpleNFT, account1, cost, maxMintAmount } = await loadFixture(
        deployContract
      );
      await expect(
        simpleNFT.gift(maxMintAmount + 1, account1.address, {
          value: ethers.utils.parseEther("" + cost * (maxMintAmount + 1)),
        })
      ).to.be.revertedWith("Cannot mint more than max mint amount");
    });
    it("Gift amount cost Error", async () => {
      const { simpleNFT, account1, cost } = await loadFixture(deployContract);
      await expect(
        simpleNFT.gift(1, account1.address, {
          value: ethers.utils.parseEther("" + cost / 2),
        })
      ).to.be.revertedWith("Cost Error");
    });
    it("Gift:Cannot mint more than max Supply", async () => {
      const {
        simpleNFT,
        accounts,
        giftSupply,
        maxMintAmount,
        maxSupply,
        cost,
      } = await loadFixture(deployContract);

      let normalSupply = maxSupply - giftSupply;
      let minted = 0;
      let lastAccountIndex = 0;

      for (let index = 0; index < accounts.length; index++) {
        if (normalSupply > minted) {
          const toMint = normalSupply - minted;
          if (toMint > maxMintAmount) {
            await simpleNFT.connect(accounts[index]).mint(maxMintAmount, {
              value: ethers.utils.parseEther("" + cost * maxMintAmount),
            });
            minted += maxMintAmount;
          } else {
            await simpleNFT.connect(accounts[index]).mint(toMint, {
              value: ethers.utils.parseEther("" + cost * toMint),
            });
            minted += toMint;
          }
        }

        lastAccountIndex = index;
        if (minted == normalSupply) {
          break;
        }
      }
      let gifted = 0;

      for (let index = lastAccountIndex + 1; index < accounts.length; index++) {
        if (giftSupply > gifted) {
          const toMint = giftSupply - gifted;
          if (toMint > maxMintAmount) {
            await simpleNFT.gift(maxMintAmount, accounts[index].address, {
              value: ethers.utils.parseEther("" + cost * maxMintAmount),
            });
            gifted += maxMintAmount;
          } else {
            await expect(
              simpleNFT.gift(
                toMint + 1,
                accounts[lastAccountIndex + 1].address,
                {
                  value: ethers.utils.parseEther("" + cost),
                }
              )
            ).to.be.revertedWith("Gift:Cannot mint more than max Supply");

            await simpleNFT.gift(toMint, accounts[index].address, {
              value: ethers.utils.parseEther("" + cost * toMint),
            });
            gifted += toMint;
          }
        }

        lastAccountIndex = index;

        if (gifted == giftSupply) {
          break;
        }
      }
      await expect(
        simpleNFT.connect(accounts[lastAccountIndex + 1]).mint(1, {
          value: ethers.utils.parseEther("" + cost),
        })
      ).to.be.revertedWith("Cannot mint more than max Supply");

      await expect(
        simpleNFT.gift(1, accounts[lastAccountIndex + 1].address, {
          value: ethers.utils.parseEther("" + cost),
        })
      ).to.be.revertedWith("All Gift are dispatched");
    });
  });
});
