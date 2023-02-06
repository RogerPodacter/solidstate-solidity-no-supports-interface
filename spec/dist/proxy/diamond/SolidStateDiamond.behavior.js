'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfSolidStateDiamond = void 0;
const access_1 = require('../../access');
const introspection_1 = require('../../introspection');
const DiamondBase_behavior_1 = require('./base/DiamondBase.behavior');
const DiamondFallback_behavior_1 = require('./fallback/DiamondFallback.behavior');
const DiamondReadable_behavior_1 = require('./readable/DiamondReadable.behavior');
const DiamondWritable_behavior_1 = require('./writable/DiamondWritable.behavior');
const mock_contract_1 = require('@ethereum-waffle/mock-contract');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfSolidStateDiamond(deploy, args, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::SolidStateDiamond', function () {
    let owner;
    let nonOwner;
    let instance;
    before(async function () {
      owner = await args.getOwner();
      nonOwner = await args.getNonOwner();
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    (0, DiamondBase_behavior_1.describeBehaviorOfDiamondBase)(
      deploy,
      args,
      skips,
    );
    (0, DiamondFallback_behavior_1.describeBehaviorOfDiamondFallback)(
      deploy,
      args,
      ['::DiamondBase', ...(skips !== null && skips !== void 0 ? skips : [])],
    );
    (0, DiamondReadable_behavior_1.describeBehaviorOfDiamondReadable)(
      deploy,
      args,
      skips,
    );
    (0, DiamondWritable_behavior_1.describeBehaviorOfDiamondWritable)(
      deploy,
      args,
      skips,
    );
    // TODO: nonstandard usage
    (0, introspection_1.describeBehaviorOfERC165Base)(
      deploy,
      {
        interfaceIds: ['0x7f5828d0'],
      },
      skips,
    );
    (0, access_1.describeBehaviorOfSafeOwnable)(deploy, args, skips);
    describe('receive()', function () {
      it('accepts ether transfer', async function () {
        let [signer] = await hardhat_1.ethers.getSigners();
        let value = hardhat_1.ethers.constants.One;
        await (0, chai_1.expect)(() =>
          signer.sendTransaction({ to: instance.address, value }),
        ).to.changeEtherBalance(instance, value);
      });
    });
    describe('#diamondCut((address,enum,bytes4[])[],address,bytes)', function () {
      const selectors = [];
      const abi = [];
      let facet;
      before(async function () {
        for (let i = 0; i < 24; i++) {
          const fn = `fn${i}()`;
          abi.push(`function ${fn}`);
          selectors.push(
            hardhat_1.ethers.utils.hexDataSlice(
              hardhat_1.ethers.utils.solidityKeccak256(['string'], [fn]),
              0,
              4,
            ),
          );
        }
        facet = await (0, mock_contract_1.deployMockContract)(owner, abi);
      });
      it('adds selectors one-by-one', async function () {
        const expectedSelectors = [];
        for (let selector of selectors) {
          await instance
            .connect(owner)
            .diamondCut(
              [{ target: facet.address, action: 0, selectors: [selector] }],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
          expectedSelectors.push(selector);
          // call reverts, but with mock-specific message
          await (0, chai_1.expect)(
            owner.sendTransaction({ to: instance.address, data: selector }),
          ).to.be.revertedWith('Mock on the method is not initialized');
          (0, chai_1.expect)(
            await instance.callStatic['facets()'](),
          ).to.have.deep.members([
            ...args.facetCuts.map((fc) => [fc.target, fc.selectors]),
            [facet.address, expectedSelectors],
          ]);
          (0, chai_1.expect)(
            await instance.callStatic['facetFunctionSelectors(address)'](
              facet.address,
            ),
          ).to.have.deep.members(expectedSelectors);
          (0, chai_1.expect)(
            await instance.callStatic['facetAddress(bytes4)'](selector),
          ).to.equal(facet.address);
        }
      });
      it('removes selectors one-by-one in ascending order of addition', async function () {
        await instance
          .connect(owner)
          .diamondCut(
            [{ target: facet.address, action: 0, selectors }],
            hardhat_1.ethers.constants.AddressZero,
            '0x',
          );
        const expectedSelectors = [...selectors];
        for (let selector of selectors) {
          await instance.connect(owner).diamondCut(
            [
              {
                target: hardhat_1.ethers.constants.AddressZero,
                action: 2,
                selectors: [selector],
              },
            ],
            hardhat_1.ethers.constants.AddressZero,
            '0x',
          );
          const last = expectedSelectors.pop();
          if (last && last !== selector) {
            expectedSelectors.splice(
              expectedSelectors.indexOf(selector),
              1,
              last,
            );
            // call reverts, but with mock-specific message
            await (0, chai_1.expect)(
              owner.sendTransaction({ to: instance.address, data: last }),
            ).to.be.revertedWith('Mock on the method is not initialized');
          }
          await (0, chai_1.expect)(
            owner.sendTransaction({ to: instance.address, data: selector }),
          ).to.be.revertedWithCustomError(
            instance,
            'Proxy__ImplementationIsNotContract',
          );
          (0, chai_1.expect)(
            await instance.callStatic['facets()'](),
          ).to.have.deep.members(
            [
              ...args.facetCuts.map((fc) => [fc.target, fc.selectors]),
              [facet.address, expectedSelectors],
            ].filter((f) => f[1].length),
          );
          (0, chai_1.expect)(
            await instance.callStatic['facetFunctionSelectors(address)'](
              facet.address,
            ),
          ).to.have.deep.members(expectedSelectors);
          (0, chai_1.expect)(
            await instance.callStatic['facetAddress(bytes4)'](selector),
          ).to.equal(hardhat_1.ethers.constants.AddressZero);
        }
      });
      it('removes selectors one-by-one in descending order of addition', async function () {
        await instance
          .connect(owner)
          .diamondCut(
            [{ target: facet.address, action: 0, selectors }],
            hardhat_1.ethers.constants.AddressZero,
            '0x',
          );
        const expectedSelectors = [...selectors];
        for (let selector of [...selectors].reverse()) {
          await instance.connect(owner).diamondCut(
            [
              {
                target: hardhat_1.ethers.constants.AddressZero,
                action: 2,
                selectors: [selector],
              },
            ],
            hardhat_1.ethers.constants.AddressZero,
            '0x',
          );
          const last = expectedSelectors.pop();
          if (last && last !== selector) {
            expectedSelectors.splice(
              expectedSelectors.indexOf(selector),
              1,
              last,
            );
            // call reverts, but with mock-specific message
            await (0, chai_1.expect)(
              owner.sendTransaction({ to: instance.address, data: last }),
            ).to.be.revertedWith('Mock on the method is not initialized');
          }
          await (0, chai_1.expect)(
            owner.sendTransaction({ to: instance.address, data: selector }),
          ).to.be.revertedWithCustomError(
            instance,
            'Proxy__ImplementationIsNotContract',
          );
          (0, chai_1.expect)(
            await instance.callStatic['facets()'](),
          ).to.have.deep.members(
            [
              ...args.facetCuts.map((fc) => [fc.target, fc.selectors]),
              [facet.address, expectedSelectors],
            ].filter((f) => f[1].length),
          );
          (0, chai_1.expect)(
            await instance.callStatic['facetFunctionSelectors(address)'](
              facet.address,
            ),
          ).to.have.deep.members(expectedSelectors);
          (0, chai_1.expect)(
            await instance.callStatic['facetAddress(bytes4)'](selector),
          ).to.equal(hardhat_1.ethers.constants.AddressZero);
        }
      });
      it('removes selectors one-by-one in random order', async function () {
        await instance
          .connect(owner)
          .diamondCut(
            [{ target: facet.address, action: 0, selectors }],
            hardhat_1.ethers.constants.AddressZero,
            '0x',
          );
        const expectedSelectors = [...selectors];
        for (let selector of [...selectors].sort(() => 0.5 - Math.random())) {
          await instance.connect(owner).diamondCut(
            [
              {
                target: hardhat_1.ethers.constants.AddressZero,
                action: 2,
                selectors: [selector],
              },
            ],
            hardhat_1.ethers.constants.AddressZero,
            '0x',
          );
          const last = expectedSelectors.pop();
          if (last && last !== selector) {
            expectedSelectors.splice(
              expectedSelectors.indexOf(selector),
              1,
              last,
            );
            // call reverts, but with mock-specific message
            await (0, chai_1.expect)(
              owner.sendTransaction({ to: instance.address, data: last }),
            ).to.be.revertedWith('Mock on the method is not initialized');
          }
          await (0, chai_1.expect)(
            owner.sendTransaction({ to: instance.address, data: selector }),
          ).to.be.revertedWithCustomError(
            instance,
            'Proxy__ImplementationIsNotContract',
          );
          (0, chai_1.expect)(
            await instance.callStatic['facets()'](),
          ).to.have.deep.members(
            [
              ...args.facetCuts.map((fc) => [fc.target, fc.selectors]),
              [facet.address, expectedSelectors],
            ].filter((f) => f[1].length),
          );
          (0, chai_1.expect)(
            await instance.callStatic['facetFunctionSelectors(address)'](
              facet.address,
            ),
          ).to.have.deep.members(expectedSelectors);
          (0, chai_1.expect)(
            await instance.callStatic['facetAddress(bytes4)'](selector),
          ).to.equal(hardhat_1.ethers.constants.AddressZero);
        }
      });
    });
  });
}
exports.describeBehaviorOfSolidStateDiamond =
  describeBehaviorOfSolidStateDiamond;
