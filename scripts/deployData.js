const { Transaction } = require("ethereumjs-tx");
const ethUtils = require("ethereumjs-util");

const fs = require("fs");

function toHexString(buffer) {
  return "0x" + buffer.toString("hex");
}

const { bytecode } = require("../build/contracts/GSNFaucet.json");

const tx = new Transaction({
  nonce: 0,
  data: bytecode,
  value: 0,
  gasPrice: 100000000000, /// 100 gigawei
  gasLimit: 1500000,
  v: 27,
  r: "0x1234567890123456789012345678901234567890123456789012345678901235",
  s: "0x1234567890123456789012345678901234567890123456789012345678901234"
});

const deployer = tx.getSenderAddress();

console.log(
  JSON.stringify({
    deployer: toHexString(deployer),
    contract: {
      address: toHexString(
        ethUtils.generateAddress(deployer, ethUtils.toBuffer(0))
      ),
      deployTx: toHexString(tx.serialize())
    }
  })
);
