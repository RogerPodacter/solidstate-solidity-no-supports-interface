'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfUpgradeableProxyOwnable = void 0;
const UpgradeableProxy_behavior_1 = require('./UpgradeableProxy.behavior');
const mock_contract_1 = require('@ethereum-waffle/mock-contract');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfUpgradeableProxyOwnable(
  deploy,
  { getOwner, getNonOwner, implementationFunction, implementationFunctionArgs },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::UpgradeableProxyOwnable', () => {
    let instance;
    let owner;
    let nonOwner;
    beforeEach(async () => {
      instance = await deploy();
      owner = await getOwner();
      nonOwner = await getNonOwner();
    });
    (0, UpgradeableProxy_behavior_1.describeBehaviorOfUpgradeableProxy)(
      deploy,
      {
        implementationFunction,
        implementationFunctionArgs,
      },
      [],
    );
    describe('#setImplementation(address)', () => {
      it('updates implementation address', async () => {
        const implementationFunction = 'fn';
        const abi = [
          `function ${implementationFunction} () external view returns (bool)`,
        ];
        const implementation = await (0, mock_contract_1.deployMockContract)(
          owner,
          abi,
        );
        const contract = new hardhat_1.ethers.Contract(
          instance.address,
          abi,
          owner,
        );
        await (0, chai_1.expect)(
          contract.callStatic[implementationFunction](),
        ).not.to.be.revertedWith('Mock on the method is not initialized');
        await instance.connect(owner).setImplementation(implementation.address);
        // call reverts, but with mock-specific message
        await (0, chai_1.expect)(
          contract.callStatic[implementationFunction](),
        ).to.be.revertedWith('Mock on the method is not initialized');
      });
      describe('reverts if', () => {
        it('sender is not owner', async () => {
          await (0, chai_1.expect)(
            instance
              .connect(nonOwner)
              .setImplementation(hardhat_1.ethers.constants.AddressZero),
          ).to.be.revertedWithCustomError(instance, 'Ownable__NotOwner');
        });
      });
    });
  });
}
exports.describeBehaviorOfUpgradeableProxyOwnable =
  describeBehaviorOfUpgradeableProxyOwnable;
