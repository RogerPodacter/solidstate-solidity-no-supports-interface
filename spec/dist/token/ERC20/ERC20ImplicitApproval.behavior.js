'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC20ImplicitApproval = void 0;
const ERC20Base_behavior_1 = require('./ERC20Base.behavior');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC20ImplicitApproval(
  deploy,
  { supply, getHolder, getImplicitlyApprovedSpender, burn, mint },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC20ImplicitApproval', function () {
    let holder;
    let implicitlyApprovedSpender;
    let instance;
    before(async function () {
      holder = await getHolder();
      implicitlyApprovedSpender = await getImplicitlyApprovedSpender();
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    (0, ERC20Base_behavior_1.describeBehaviorOfERC20Base)(
      deploy,
      {
        mint,
        burn,
        supply,
      },
      skips,
    );
    describe('#allowance(address,address)', function () {
      it('returns maximum uint256 for implicitly approved spender', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['allowance(address,address)'](
            hardhat_1.ethers.constants.AddressZero,
            implicitlyApprovedSpender.address,
          ),
        ).to.equal(hardhat_1.ethers.constants.MaxUint256);
      });
    });
    describe('#transferFrom(address,address,uint256)', function () {
      it('does not require approval for implicitly approved sender', async function () {
        const amount = hardhat_1.ethers.constants.One;
        await mint(holder.address, amount);
        await instance
          .connect(holder)
          .approve(
            implicitlyApprovedSpender.address,
            hardhat_1.ethers.constants.AddressZero,
          );
        await (0, chai_1.expect)(
          instance
            .connect(implicitlyApprovedSpender)
            .transferFrom(
              holder.address,
              implicitlyApprovedSpender.address,
              amount,
            ),
        ).not.to.be.reverted;
      });
    });
  });
}
exports.describeBehaviorOfERC20ImplicitApproval =
  describeBehaviorOfERC20ImplicitApproval;
