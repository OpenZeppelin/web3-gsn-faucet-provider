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
    console.log("DEPLOYING");
    this.fooBar = await deployFooBar();
    console.log("DEPLOYED FOOBAR");
    this.faucet = await deployGSNFaucet();
    console.log("DEPLOYED");
  });

  it("gets a grant and sends a transaction using it", async function() {
    this.fooBar.setProvider(
      new GSNFaucetProvider(this.fooBar.currentProvider, {
        faucetAddress: this.faucet.options.address
      })
    );
    const tx = await this.fooBar.methods.foo().send({ from: this.empty });
    // console.log(tx)
    // console.log(tx.logs)
    // console.log(tx.events)

    // const r = await web3.eth.getTransactionReceipt(tx.transactionHash);
    // console.log(r);
    // console.log(r.logs);
    // console.log(r.events);
  });
});
