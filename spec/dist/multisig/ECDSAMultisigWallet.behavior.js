'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfECDSAMultisigWallet = void 0;
const mock_contract_1 = require('@ethereum-waffle/mock-contract');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
let currentNonce = hardhat_1.ethers.constants.Zero;
const nextNonce = function () {
  currentNonce = currentNonce.add(hardhat_1.ethers.constants.One);
  return currentNonce;
};
const signAuthorization = async function (
  signer,
  { target, data, value, delegate, nonce, address },
) {
  return (0, library_1.signData)(signer, {
    values: [target, data, value, delegate],
    types: ['address', 'bytes', 'uint256', 'bool'],
    nonce,
    address,
  });
};
function describeBehaviorOfECDSAMultisigWallet(
  deploy,
  { getSigners, getNonSigner, quorum, getVerificationAddress },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ECDSAMultisigWallet', function () {
    let instance;
    let signers;
    let nonSigner;
    let verificationAddress;
    before(async function () {
      signers = await getSigners();
      nonSigner = await getNonSigner();
      (0, chai_1.expect)(quorum).to.be.at.least(1);
      (0, chai_1.expect)(signers.length).to.be.at.least(quorum);
    });
    beforeEach(async function () {
      instance = await deploy();
      verificationAddress = await getVerificationAddress();
    });
    describe('receive()', function () {
      it('accepts ether transfer', async function () {
        let [signer] = signers;
        let value = hardhat_1.ethers.constants.One;
        await (0, chai_1.expect)(() =>
          signer.sendTransaction({ to: instance.address, value }),
        ).to.changeEtherBalance(instance, value);
      });
    });
    describe('#verifyAndExecute((address,bytes,uint256,bool),(bytes,uint256))', function () {
      describe('with "call" opcode', function () {
        let delegate = false;
        it('calls function on target address');
        it('transfers value to target address', async function () {
          let mock = await (0, mock_contract_1.deployMockContract)(signers[0], [
            'function fn () external payable returns (bool)',
          ]);
          await mock.mock.fn.returns(true);
          let target = mock.address;
          const { data } = await mock.populateTransaction.fn();
          let value = hardhat_1.ethers.constants.One;
          let signatures = [];
          for (let signer of signers) {
            let nonce = nextNonce();
            let sig = await signAuthorization(signer, {
              target,
              data,
              value,
              delegate,
              nonce,
              address: verificationAddress,
            });
            signatures.push({ data: sig, nonce });
          }
          // the changeEtherBalances matcher requires a getAddress function to work
          const addressableMock = { getAddress: () => mock.address };
          await (0, chai_1.expect)(() =>
            instance.verifyAndExecute(
              { target, data, value, delegate },
              signatures,
              { value },
            ),
          ).to.changeEtherBalances([addressableMock, instance], [value, 0]);
        });
        it('forwards return data from called function', async function () {
          var _a;
          let mock = await (0, mock_contract_1.deployMockContract)(signers[0], [
            'function fn () external payable returns (bool)',
          ]);
          await mock.mock.fn.returns(true);
          let target = mock.address;
          const { data } = await mock.populateTransaction.fn();
          let value = hardhat_1.ethers.constants.Zero;
          let signatures = [];
          for (let signer of signers) {
            let nonce = nextNonce();
            let sig = await signAuthorization(signer, {
              target,
              data,
              value,
              delegate,
              nonce,
              address: verificationAddress,
            });
            signatures.push({ data: sig, nonce });
          }
          (0, chai_1.expect)(
            hardhat_1.ethers.utils.defaultAbiCoder.decode(
              (_a = mock.interface.functions['fn()'].outputs) !== null &&
                _a !== void 0
                ? _a
                : [],
              await instance.callStatic.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            )[0],
          ).to.be.true;
        });
        describe('reverts if', function () {
          it('target contract reverts', async function () {
            let mock = await (0, mock_contract_1.deployMockContract)(
              signers[0],
              ['function fn () external payable returns (bool)'],
            );
            await mock.mock.fn.returns(true);
            let reason = 'revert: reason';
            await mock.mock.fn.revertsWithReason(reason);
            let target = mock.address;
            const { data } = await mock.populateTransaction.fn();
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.callStatic.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            ).to.be.revertedWith(reason);
          });
          it('quorum is not reached', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers.concat([signers[0]])) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures.slice(0, quorum.toNumber() - 1),
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__QuorumNotReached',
            );
          });
          it('duplicate signer is found', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers.concat([signers[0]])) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__SignerAlreadySigned',
            );
          });
          it('recovered signer is not authorized', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers.concat([nonSigner])) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__RecoveredSignerNotAuthorized',
            );
          });
          it('nonce has been used', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await instance.verifyAndExecute(
              { target, data, value, delegate },
              signatures,
              { value },
            );
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__InvalidNonce',
            );
          });
        });
      });
      describe('with "delegatecall" opcode', function () {
        let delegate = true;
        it('delegatecalls function on target address');
        it('does not transfer value to target address', async function () {
          let receiver = new hardhat_1.ethers.VoidSigner(
            hardhat_1.ethers.constants.AddressZero,
            hardhat_1.ethers.provider,
          );
          let target = receiver.address;
          let data = hardhat_1.ethers.utils.randomBytes(0);
          let value = hardhat_1.ethers.constants.One;
          let signatures = [];
          for (let signer of signers) {
            let nonce = nextNonce();
            let sig = await signAuthorization(signer, {
              target,
              data,
              value,
              delegate,
              nonce,
              address: verificationAddress,
            });
            signatures.push({ data: sig, nonce });
          }
          await (0, chai_1.expect)(async function () {
            return instance.verifyAndExecute(
              { target, data, value, delegate },
              signatures,
              { value },
            );
          }).to.changeEtherBalances([receiver, instance], [0, value]);
        });
        it('forwards return data from called function', async function () {
          // TODO: test non-empty return data
          let target = hardhat_1.ethers.constants.AddressZero;
          let data = hardhat_1.ethers.utils.randomBytes(0);
          let value = hardhat_1.ethers.constants.Zero;
          let signatures = [];
          for (let signer of signers) {
            let nonce = nextNonce();
            let sig = await signAuthorization(signer, {
              target,
              data,
              value,
              delegate,
              nonce,
              address: verificationAddress,
            });
            signatures.push({ data: sig, nonce });
          }
          (0, chai_1.expect)(
            await instance.callStatic.verifyAndExecute(
              { target, data, value, delegate },
              signatures,
              { value },
            ),
          ).to.equal('0x');
        });
        describe('reverts if', function () {
          it('target contract reverts', async function () {
            let mock = await (0, mock_contract_1.deployMockContract)(
              signers[0],
              ['function fn () external payable returns (bool)'],
            );
            let target = mock.address;
            const { data } = await mock.populateTransaction.fn();
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            // revert message depends on waffle mock implementation
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                {
                  target,
                  data,
                  value: hardhat_1.ethers.constants.Zero,
                  delegate: true,
                },
                signatures,
                {
                  value,
                },
              ),
            ).to.be.revertedWith('Mock on the method is not initialized');
          });
          it('quorum is not reached', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers.concat([signers[0]])) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures.slice(0, quorum.toNumber() - 1),
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__QuorumNotReached',
            );
          });
          it('duplicate signer is found', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers.concat([signers[0]])) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__SignerAlreadySigned',
            );
          });
          it('recovered signer is not authorized', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers.concat([nonSigner])) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__RecoveredSignerNotAuthorized',
            );
          });
          it('message value is incorrect', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                {
                  value: value.add(hardhat_1.ethers.constants.One),
                },
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__MessageValueMismatch',
            );
          });
          it('nonce has been used', async function () {
            let target = hardhat_1.ethers.constants.AddressZero;
            let data = hardhat_1.ethers.utils.randomBytes(32);
            let value = hardhat_1.ethers.constants.Zero;
            let signatures = [];
            for (let signer of signers) {
              let nonce = nextNonce();
              let sig = await signAuthorization(signer, {
                target,
                data,
                value,
                delegate,
                nonce,
                address: verificationAddress,
              });
              signatures.push({ data: sig, nonce });
            }
            await instance.verifyAndExecute(
              { target, data, value, delegate },
              signatures,
              { value },
            );
            await (0, chai_1.expect)(
              instance.verifyAndExecute(
                { target, data, value, delegate },
                signatures,
                { value },
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'ECDSAMultisigWallet__InvalidNonce',
            );
          });
        });
      });
    });
  });
}
exports.describeBehaviorOfECDSAMultisigWallet =
  describeBehaviorOfECDSAMultisigWallet;
