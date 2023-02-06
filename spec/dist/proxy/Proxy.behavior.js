'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfProxy = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfProxy(
  deploy,
  { implementationFunction, implementationFunctionArgs },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::Proxy', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('fallback', function () {
      it('forwards data to implementation', async () => {
        let contract = new hardhat_1.ethers.Contract(
          instance.address,
          [`function ${implementationFunction}`],
          (await hardhat_1.ethers.getSigners())[0],
        );
        await (0, chai_1.expect)(
          contract.callStatic[implementationFunction](
            ...implementationFunctionArgs,
          ),
        ).not.to.be.reverted;
      });
    });
  });
}
exports.describeBehaviorOfProxy = describeBehaviorOfProxy;
