const { setupAccounts, deployGSNFaucet } = require("./setup");
const expect = require("chai").use(require("chai-string")).expect;

describe("GSNFaucet contract", function() {
  beforeEach("setup", async function() {
    const accounts = await setupAccounts();
    this.deployer = accounts[0];
    this.sender = accounts[1];
    this.signer = accounts[2];
    this.failsPre = accounts[7];
    this.failsPost = accounts[8];

    this.gsnFaucet = await deployGSNFaucet();
  });

  it("does something", function() {
    console.log(this.deployer);
    console.log(this.gsnFaucet);
  });
});
