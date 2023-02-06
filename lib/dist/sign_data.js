'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.signData = exports.hashData = void 0;
const hardhat_1 = require('hardhat');
function hashData({ types, values, nonce, address }) {
  const hash = hardhat_1.ethers.utils.solidityKeccak256(
    [...types, 'uint256', 'address'],
    [...values, nonce, address],
  );
  return hardhat_1.ethers.utils.arrayify(hash);
}
exports.hashData = hashData;
async function signData(signer, data) {
  const signature = await signer.signMessage(hashData(data));
  return hardhat_1.ethers.utils.arrayify(signature);
}
exports.signData = signData;
