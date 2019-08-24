const Web3 = require("web3");
const { fundRecipient } = require("@openzeppelin/gsn-helpers");
const {
  abi: GSNFaucetABI,
  bytecode: GSNFaucetBytecode
} = require("../build/contracts/GSNFaucet.json");

const {
  abi: FooBarAbi,
  bytecode: FooBarBytecode
} = require("./build/contracts/FooBar.json");

const PROVIDER_URL = process.env.PROVIDER_URL || "http://localhost:9545";

async function setupAccounts() {
  this.web3 = new Web3(PROVIDER_URL);
  const accounts = await this.web3.eth.getAccounts();
  if (accounts.length !== 10) {
    throw new Error(`Expected 10 accounts but found ${accounts}`);
  }
  this.deployer = accounts[0];

  return accounts;
}

async function deployFooBar() {
  const FooBar = new this.web3.eth.Contract(FooBarAbi, null, {
    data: FooBarBytecode
  });
  return await FooBar.deploy().send({ from: this.deployer, gas: 2e6 });
}

async function deployGSNFaucet() {
  const GSNFaucet = new this.web3.eth.Contract(GSNFaucetABI, null, {
    data: GSNFaucetBytecode
  });

  const gsnFaucet = await GSNFaucet.deploy().send({
    from: this.deployer,
    gas: 2e6
  });

  await fundRecipient(this.web3, { recipient: gsnFaucet.options.address });
  return gsnFaucet;
}

module.exports = {
  setupAccounts,
  deployGSNFaucet,
  deployFooBar
};
