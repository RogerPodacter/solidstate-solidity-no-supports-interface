'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfDiamondReadable = void 0;
const introspection_1 = require('../../../introspection');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfDiamondReadable(deploy, { facetCuts }, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::DiamondReadable', function () {
    let instance;
    beforeEach(async function () {
      (0, chai_1.expect)(facetCuts).to.have.lengthOf.at.least(1);
      instance = await deploy();
    });
    // TODO: nonstandard usage
    (0, introspection_1.describeBehaviorOfERC165Base)(
      deploy,
      {
        interfaceIds: ['0x48e2b093'],
      },
      skips,
    );
    describe('#facets()', function () {
      it('returns facet cuts', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['facets()'](),
        ).to.have.deep.members(
          facetCuts.map((fc) => [fc.target, fc.selectors]),
        );
      });
    });
    describe('#facetAddresses()', function () {
      it('returns facets', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['facetAddresses()'](),
        ).to.have.members(facetCuts.map((fc) => fc.target));
      });
    });
    describe('#facetFunctionSelectors(address)', function () {
      it('returns selectors for given facet', async function () {
        for (let facet of facetCuts) {
          (0, chai_1.expect)(
            await instance.callStatic['facetFunctionSelectors(address)'](
              facet.target,
            ),
          ).to.have.members(facet.selectors);
        }
      });
      it('returns empty array for unrecognized facet', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['facetFunctionSelectors(address)'](
            hardhat_1.ethers.constants.AddressZero,
          ),
        ).to.have.lengthOf(0);
      });
    });
    describe('#facetAddress(bytes4)', function () {
      it('returns facet for given selector', async function () {
        for (let facet of facetCuts) {
          for (let selector of facet.selectors) {
            (0, chai_1.expect)(
              await instance.callStatic['facetAddress(bytes4)'](selector),
            ).to.equal(facet.target);
          }
        }
      });
      it('returns zero address for unrecognized selector', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['facetAddress(bytes4)']('0x00000000'),
        ).to.equal(hardhat_1.ethers.constants.AddressZero);
      });
    });
  });
}
exports.describeBehaviorOfDiamondReadable = describeBehaviorOfDiamondReadable;
