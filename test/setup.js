const Web3 = require("web3");
const BN = require("bignumber.js");
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
const DIFFICULTY = 2 ** 254;

async function setupAccounts() {
  this.web3 = new Web3(PROVIDER_URL);
  const accounts = await this.web3.eth.getAccounts();
  if (accounts.length < 10) {
    throw new Error(`Expected at least 10 accounts but found ${accounts}`);
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

  await gsnFaucet.methods
    .initialize("0x" + BN(DIFFICULTY).toString(16))
    .send({ from: this.deployer, gas: 1e6 });
  await fundRecipient(this.web3, { recipient: gsnFaucet.options.address });
  await web3.eth.sendTransaction({
    from: this.deployer,
    to: gsnFaucet.options.address,
    value: 1e18,
    gas: 1e5
  });

  return gsnFaucet;
}

module.exports = {
  setupAccounts,
  deployGSNFaucet,
  deployFooBar
};
