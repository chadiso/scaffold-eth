const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("YourContract", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("YourContract");

      myContract = await YourContract.deploy();
    });

    describe("setPurpose()", function () {
      it("Should allow only admin to call the function", async function () {
        const [owner, addr1] = await ethers.getSigners();

        const newPurpose = "Test Purpose";

        // works for the winer
        await myContract.connect(owner).setPurpose(newPurpose);
        expect(await myContract.connect(owner).purpose()).to.equal(newPurpose);

        // doesn't work for the other address
        await expect(myContract.connect(addr1).setPurpose('purpose 2'))
        .to.be.revertedWith('Ownable: caller is not the owner');
      });

      it("Should be able to set a new purpose", async function () {
        const newPurpose = "Test Purpose";

        await myContract.setPurpose(newPurpose);
        expect(await myContract.purpose()).to.equal(newPurpose);
      });

      it("Should emit a SetPurpose event ", async function () {
        const [owner] = await ethers.getSigners();

        const newPurpose = "Another Test Purpose";

        expect(await myContract.setPurpose(newPurpose)).to.
          emit(myContract, "SetPurpose").
            withArgs(owner.address, newPurpose);
      });
    });
  });
});
