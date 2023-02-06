'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfDiamondWritable = void 0;
const introspection_1 = require('../../../introspection');
const mock_contract_1 = require('@ethereum-waffle/mock-contract');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfDiamondWritable(
  deploy,
  { getOwner, getNonOwner },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::DiamondWritable', function () {
    let owner;
    let nonOwner;
    const functions = [];
    const selectors = [];
    let abi;
    let facet;
    let instance;
    before(async function () {
      owner = await getOwner();
      nonOwner = await getNonOwner();
      for (let i = 0; i < 24; i++) {
        const fn = `fn${i}()`;
        functions.push(fn);
        selectors.push(
          hardhat_1.ethers.utils.hexDataSlice(
            hardhat_1.ethers.utils.solidityKeccak256(['string'], [fn]),
            0,
            4,
          ),
        );
      }
      abi = functions.map((fn) => `function ${fn}`);
      facet = await (0, mock_contract_1.deployMockContract)(owner, abi);
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    // TODO: nonstandard usage
    (0, introspection_1.describeBehaviorOfERC165Base)(
      deploy,
      {
        interfaceIds: ['0x1f931c1c'],
      },
      skips,
    );
    describe('#diamondCut((address,enum,bytes4[])[],address,bytes)', function () {
      it('emits DiamondCut event', async function () {
        const facets = [
          {
            target: facet.address,
            action: 0,
            selectors: [
              hardhat_1.ethers.utils.hexlify(
                hardhat_1.ethers.utils.randomBytes(4),
              ),
            ],
          },
        ];
        const target = hardhat_1.ethers.constants.AddressZero;
        const data = '0x';
        let tx = instance.connect(owner).diamondCut(facets, target, data);
        const events = (await (await tx).wait()).events;
        const argsResult = events[0].args;
        (0, chai_1.expect)(argsResult.facetCuts[0].target).to.eq(
          facets[0].target,
        );
        (0, chai_1.expect)(argsResult.facetCuts[0].action).to.eq(
          facets[0].action,
        );
        (0, chai_1.expect)(argsResult.facetCuts[0].selectors).to.deep.eq(
          facets[0].selectors,
        );
        (0, chai_1.expect)(argsResult.target).to.eq(target);
        (0, chai_1.expect)(argsResult.data).to.eq(data);
      });
      describe('using FacetCutAction ADD', function () {
        it('adds facet', async function () {
          const contract = new hardhat_1.ethers.Contract(
            instance.address,
            abi,
            hardhat_1.ethers.provider,
          );
          for (let fn of functions) {
            await (0, chai_1.expect)(
              contract.callStatic[fn](),
            ).to.be.revertedWithCustomError(
              instance,
              'Proxy__ImplementationIsNotContract',
            );
          }
          await instance
            .connect(owner)
            .diamondCut(
              [{ target: facet.address, action: 0, selectors }],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
          for (let fn of functions) {
            // call reverts, but with mock-specific message
            await (0, chai_1.expect)(
              contract.callStatic[fn](),
            ).to.be.revertedWith('Mock on the method is not initialized');
          }
        });
        describe('reverts if', function () {
          it('target facet is not a contract', async function () {
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: hardhat_1.ethers.constants.AddressZero,
                    action: 0,
                    selectors: [hardhat_1.ethers.utils.randomBytes(4)],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__TargetHasNoCode',
            );
          });
          it('selector has already been added', async function () {
            const facetCuts = [
              {
                target: facet.address,
                action: 0,
                selectors: [hardhat_1.ethers.utils.randomBytes(4)],
              },
            ];
            await instance
              .connect(owner)
              .diamondCut(
                facetCuts,
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              );
            await (0, chai_1.expect)(
              instance
                .connect(owner)
                .diamondCut(
                  facetCuts,
                  hardhat_1.ethers.constants.AddressZero,
                  '0x',
                ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__SelectorAlreadyAdded',
            );
          });
        });
      });
      describe('using FacetCutAction REPLACE', function () {
        it('replaces facet', async function () {
          const contract = new hardhat_1.ethers.Contract(
            instance.address,
            abi,
            hardhat_1.ethers.provider,
          );
          await instance
            .connect(owner)
            .diamondCut(
              [{ target: facet.address, action: 0, selectors }],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
          for (let fn of functions) {
            // call reverts, but with mock-specific message
            await (0, chai_1.expect)(
              contract.callStatic[fn](),
            ).to.be.revertedWith('Mock on the method is not initialized');
          }
          const facetReplacement = await (0,
          mock_contract_1.deployMockContract)(owner, abi);
          for (let fn of functions) {
            (0, chai_1.expect)(facetReplacement[fn]).not.to.be.undefined;
          }
          await instance
            .connect(owner)
            .diamondCut(
              [{ target: facetReplacement.address, action: 1, selectors }],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
          for (let fn of functions) {
            // call reverts, but with mock-specific message
            await (0, chai_1.expect)(
              contract.callStatic[fn](),
            ).to.be.revertedWith('Mock on the method is not initialized');
          }
        });
        describe('reverts if', function () {
          it('target facet is not a contract', async function () {
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: hardhat_1.ethers.constants.AddressZero,
                    action: 1,
                    selectors: [hardhat_1.ethers.utils.randomBytes(4)],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__TargetHasNoCode',
            );
          });
          it('selector has not been added', async function () {
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: facet.address,
                    action: 1,
                    selectors: [hardhat_1.ethers.utils.randomBytes(4)],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__SelectorNotFound',
            );
          });
          it('selector is immutable', async function () {
            const selector = hardhat_1.ethers.utils.randomBytes(4);
            await instance.connect(owner).diamondCut(
              [
                {
                  target: instance.address,
                  action: 0,
                  selectors: [selector],
                },
              ],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: facet.address,
                    action: 1,
                    selectors: [selector],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__SelectorIsImmutable',
            );
          });
          it('replacement facet is same as existing facet', async function () {
            const selector = hardhat_1.ethers.utils.randomBytes(4);
            await instance.connect(owner).diamondCut(
              [
                {
                  target: facet.address,
                  action: 0,
                  selectors: [selector],
                },
              ],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: facet.address,
                    action: 1,
                    selectors: [selector],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__ReplaceTargetIsIdentical',
            );
          });
        });
      });
      describe('using FacetCutAction REMOVE', function () {
        it('removes facet', async function () {
          const contract = new hardhat_1.ethers.Contract(
            instance.address,
            abi,
            hardhat_1.ethers.provider,
          );
          await instance
            .connect(owner)
            .diamondCut(
              [{ target: facet.address, action: 0, selectors }],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
          for (let fn of functions) {
            // call reverts, but with mock-specific message
            await (0, chai_1.expect)(
              contract.callStatic[fn](),
            ).to.be.revertedWith('Mock on the method is not initialized');
          }
          await instance
            .connect(owner)
            .diamondCut(
              [
                {
                  target: hardhat_1.ethers.constants.AddressZero,
                  action: 2,
                  selectors,
                },
              ],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
          for (let fn of functions) {
            await (0, chai_1.expect)(
              contract.callStatic[fn](),
            ).to.be.revertedWithCustomError(
              instance,
              'Proxy__ImplementationIsNotContract',
            );
          }
        });
        describe('reverts if', function () {
          it('target address is not zero address', async function () {
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: instance.address,
                    action: 2,
                    selectors: [hardhat_1.ethers.utils.randomBytes(4)],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__RemoveTargetNotZeroAddress',
            );
          });
          it('selector has not been added', async function () {
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: hardhat_1.ethers.constants.AddressZero,
                    action: 2,
                    selectors: [hardhat_1.ethers.utils.randomBytes(4)],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__SelectorNotFound',
            );
          });
          it('selector is immutable', async function () {
            const selector = hardhat_1.ethers.utils.randomBytes(4);
            await instance.connect(owner).diamondCut(
              [
                {
                  target: instance.address,
                  action: 0,
                  selectors: [selector],
                },
              ],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            );
            await (0, chai_1.expect)(
              instance.connect(owner).diamondCut(
                [
                  {
                    target: hardhat_1.ethers.constants.AddressZero,
                    action: 2,
                    selectors: [selector],
                  },
                ],
                hardhat_1.ethers.constants.AddressZero,
                '0x',
              ),
            ).to.be.revertedWithCustomError(
              instance,
              'DiamondWritable__SelectorIsImmutable',
            );
          });
        });
      });
      describe('reverts if', function () {
        it('sender is not owner', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(nonOwner)
              .diamondCut([], hardhat_1.ethers.constants.AddressZero, '0x'),
          ).to.be.revertedWithCustomError(instance, 'Ownable__NotOwner');
        });
        it('passed FacetCutAction is invalid', async function () {
          await (0, chai_1.expect)(
            instance.connect(owner).diamondCut(
              [
                {
                  target: hardhat_1.ethers.constants.AddressZero,
                  action: 3,
                  selectors: [],
                },
              ],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            ),
          ).to.be.revertedWithoutReason();
        });
        it('passed selector array is empty', async function () {
          await (0, chai_1.expect)(
            instance.connect(owner).diamondCut(
              [
                {
                  target: hardhat_1.ethers.constants.AddressZero,
                  action: 0,
                  selectors: [],
                },
              ],
              hardhat_1.ethers.constants.AddressZero,
              '0x',
            ),
          ).to.be.revertedWithCustomError(
            instance,
            'DiamondWritable__SelectorNotSpecified',
          );
        });
        it('initialization target is provided but data is not', async function () {
          await (0, chai_1.expect)(
            instance.connect(owner).diamondCut([], facet.address, '0x'),
          ).to.be.revertedWithCustomError(
            instance,
            'DiamondWritable__InvalidInitializationParameters',
          );
        });
        it('initialization data is provided but target is not', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(owner)
              .diamondCut([], hardhat_1.ethers.constants.AddressZero, '0x01'),
          ).to.be.revertedWithCustomError(
            instance,
            'DiamondWritable__InvalidInitializationParameters',
          );
        });
        it('initialization target has no code', async function () {
          await (0, chai_1.expect)(
            instance.connect(owner).diamondCut([], owner.address, '0x01'),
          ).to.be.revertedWithCustomError(
            instance,
            'DiamondWritable__TargetHasNoCode',
          );
        });
        it('initialization function reverts', async function () {
          await (0, chai_1.expect)(
            instance.connect(owner).diamondCut([], facet.address, '0x01'),
          ).to.be.revertedWith('Mock on the method is not initialized');
        });
      });
    });
  });
}
exports.describeBehaviorOfDiamondWritable = describeBehaviorOfDiamondWritable;
