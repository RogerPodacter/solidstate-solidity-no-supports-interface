'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC1271Ownable = void 0;
const ERC1271Base_behavior_1 = require('../base/ERC1271Base.behavior');
const library_1 = require('@solidstate/library');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC1271Ownable(
  deploy,
  { getOwner, getNonOwner },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC1271Ownable', function () {
    let owner;
    let nonOwner;
    beforeEach(async function () {
      owner = await getOwner();
      nonOwner = await getNonOwner();
    });
    // TODO: nonstandard usage
    (0, ERC1271Base_behavior_1.describeBehaviorOfERC1271Base)(
      deploy,
      {
        getValidParams: async function () {
          let hash = hardhat_1.ethers.utils.randomBytes(32);
          let signature = await owner.signMessage(
            hardhat_1.ethers.utils.arrayify(hash),
          );
          return [hash, hardhat_1.ethers.utils.arrayify(signature)];
        },
        getInvalidParams: async function () {
          let hash = hardhat_1.ethers.utils.randomBytes(32);
          let signature = await nonOwner.signMessage(
            hardhat_1.ethers.utils.arrayify(hash),
          );
          return [hash, hardhat_1.ethers.utils.arrayify(signature)];
        },
      },
      skips,
    );
  });
}
exports.describeBehaviorOfERC1271Ownable = describeBehaviorOfERC1271Ownable;
