const { setupAccounts, deployGSNFaucet } = require("./setup");
const expect = require("chai").use(require("chai-string")).expect;

describe("GSNFaucet contract", function() {
  before("setup accounts", async function() {
    await setupAccounts();
    console.log(this.sender, this.deployer);
  });

  beforeEach("setup", async function() {
    await deployGSNFaucet();
  });

  it("does something", function() {
    console.log(this.gsnFaucet.options.address);
  });
});
