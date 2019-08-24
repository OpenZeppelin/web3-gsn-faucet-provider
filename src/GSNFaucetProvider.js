const Web3 = require("web3");
const { generate } = require("ethereumjs-wallet");
const { GSNProvider } = require("@openzeppelin/gsn-provider");
const { ensureFunds } = require("./Faucet");

class GSNFaucetProvider {
  constructor(base, options = {}) {
    this.web3 = new Web3(base);
    base = this.web3.currentProvider;
    this.baseProvider = base;
    this.baseSend = (base.sendAsync || base.send).bind(base);

    this.sendAsync = this.send.bind(this);
    this.faucetAddress = options.faucetAddress;
    // this.gsnProvider = new GSNProvider(base, {
    //   signKey: generate().privKey
    // });
  }

  async _claimFunds(payload) {
    // return Promise.resolve();
    const txParams = payload.params[0];
    await ensureFunds(this.web3, txParams, this.faucetAddress);
  }

  send(payload, callback) {
    switch (payload.method) {
      case "eth_sendTransaction":
        this._claimFunds(payload).then(() => {
          this.baseSend(payload, callback);
        });
        break;
      default:
        this.baseSend(payload, callback);
    }
  }
}

module.exports = GSNFaucetProvider;
