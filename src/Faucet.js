const BN = require("bignumber.js");
const GSNFaucetArtifact = require("../build/contracts/GSNFaucet.json");
const { GSNDevProvider: GSNProvider } = require("@openzeppelin/gsn-provider");
const { soliditySha3 } = require("web3-utils");

const DEFAULT_GAS_PRICE = 10e9;
const GRANT = 1e17;

async function ensureFunds(web3, txParams, faucetAddress) {
  const cost = getCost(txParams);
  const funds = BN(await web3.eth.getBalance(txParams.from));
  if (cost.lte(funds)) return;
  if (funds.plus(GRANT).lt(cost))
    throw new Error(
      `The faucet stipend of ${GRANT} is not enough to cover for the cost of the transaction (${cost})`
    );

  await getFunds(web3, txParams, faucetAddress);
}

async function getFunds(web3, txParams, faucetAddress) {
  const gsnFaucet = new web3.eth.Contract(GSNFaucetArtifact.abi, faucetAddress);
  const gsnProvider = new GSNProvider(web3.currentProvider);
  gsnFaucet.setProvider(gsnProvider);

  const work = await getWork(gsnFaucet, txParams.from);
  await gsnFaucet.methods.gimme(work).send({ from: txParams.from });
}

async function getWork(gsnFaucet, from) {
  const lastNonce = BN(await gsnFaucet.methods.getLastNonce().call());
  const difficulty = BN(await gsnFaucet.methods.getDifficulty().call());
  const nonce = calculateWork(
    from,
    lastNonce,
    difficulty,
    gsnFaucet.options.address
  );
  return nonce;
}

function calculateWork(sender, lastNonce, difficulty, address) {
  let nonce = 0;

  while (true) {
    const rawHash = soliditySha3(
      { type: "address", value: sender },
      { type: "uint256", value: lastNonce.toString() },
      { type: "uint256", value: nonce.toString() },
      { type: "address", value: address }
    );

    const hash = BN(rawHash);

    if (hash.lt(difficulty)) {
      return nonce;
    }
    nonce++;
  }
}

function getCost(txParams) {
  const { gas, gasPrice } = txParams;
  return BN(gas).times(BN(gasPrice || DEFAULT_GAS_PRICE));
}

module.exports = {
  ensureFunds
};
