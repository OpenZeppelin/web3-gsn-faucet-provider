const { GSNFaucetProvider } = require("../src");
const { generate } = require("ethereumjs-wallet");

const { setupAccounts, deployFooBar } = require("./setup");
const expect = require("chai").use(require("chai-string")).expect;

describe.only("GSNFaucetProvider class", function() {
  beforeEach("setup", async function() {
    const accounts = await setupAccounts();
    this.deployer = accounts[0];
    this.sender = accounts[1];
    this.signer = accounts[2];
    this.failsPre = accounts[7];
    this.failsPost = accounts[8];

    this.fooBar = await deployFooBar();
  });

  it("gets a grant and sends a transaction using it", async function() {
    this.fooBar.setProvider(new GSNFaucetProvider(this.fooBar.currentProvider));
    const txHash = await this.fooBar.methods.foo().send({ from: this.signer });
  });
});
