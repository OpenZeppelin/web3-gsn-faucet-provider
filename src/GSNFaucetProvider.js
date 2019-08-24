const Web3 = require("web3");
const { generate } = require("ethereumjs-wallet");
const { GSNProvider } = require("@openzeppelin/gsn-provider");

class FaucetProvider {
  constructor(base, options = {}) {
    const web3 = new Web3(base);
    base = web3.currentProvider;
    this.baseProvider = base;
    this.baseSend = (base.sendAsync || base.send).bind(base);

    this.sendAsync = this.send.bind(this);

    this.gsnProvider = new GSNProvider(base, {
      signKey: generate().privKey
    });
  }

  send(payload, callback) {
    // switch (payload.method) {
    //   case "eth_sendTransaction":
    //     if (this._handleSendTransaction(payload, callback)) return;
    //     break;

    //   case "eth_estimateGas":
    //     if (this._handleEstimateGas(payload, callback)) return;
    //     break;

    //   case "eth_getTransactionReceipt":
    //     if (this._handleGetTransactionReceipt(payload, callback)) return;
    //     break;
    // }

    // Default by sending to base provider
    return this.baseSend(payload, callback);
  }
}

module.exports = FaucetProvider;
