'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.bytes32ToNumber = exports.bnToBytes32 = exports.bnToAddress = void 0;
const ethers_1 = require('ethers');
const hardhat_1 = require('hardhat');
function bnToAddress(bn) {
  return hardhat_1.ethers.utils.getAddress(
    hardhat_1.ethers.utils.hexZeroPad(hardhat_1.ethers.utils.hexlify(bn), 20),
  );
}
exports.bnToAddress = bnToAddress;
function bnToBytes32(bn) {
  return hardhat_1.ethers.utils.hexZeroPad(
    hardhat_1.ethers.utils.hexlify(bn),
    32,
  );
}
exports.bnToBytes32 = bnToBytes32;
function bytes32ToNumber(bytes32) {
  return ethers_1.BigNumber.from(bytes32).toNumber();
}
exports.bytes32ToNumber = bytes32ToNumber;
