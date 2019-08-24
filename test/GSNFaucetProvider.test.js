const { GSNFaucetProvider } = require("../src");
const { generate } = require("ethereumjs-wallet");

const { setupAccounts, deployFooBar, deployGSNFaucet } = require("./setup");
const expect = require("chai").use(require("chai-string")).expect;

describe.only("GSNFaucetProvider class", function() {
  beforeEach("setup", async function() {
    const accounts = await setupAccounts();
    this.deployer = accounts[0];
    this.sender = accounts[1];
    this.signer = accounts[2];
    this.empty = accounts[10];

    this.fooBar = await deployFooBar();
    this.faucet = await deployGSNFaucet();
  });

  it("gets a grant and sends a transaction using it", async function() {
    this.fooBar.setProvider(
      new GSNFaucetProvider(this.fooBar.currentProvider, {
        faucetAddress: this.faucet.options.address
      })
    );
    await this.fooBar.methods.foo().send({ from: this.empty });
  });
});
