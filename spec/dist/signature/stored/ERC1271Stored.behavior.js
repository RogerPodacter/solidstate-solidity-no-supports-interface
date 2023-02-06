'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC1271Stored = void 0;
const ERC1271Base_behavior_1 = require('../base/ERC1271Base.behavior');
const library_1 = require('@solidstate/library');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC1271Stored(deploy, { getValidParams }, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC1271Stored', function () {
    // TODO: nonstandard usage
    (0, ERC1271Base_behavior_1.describeBehaviorOfERC1271Base)(
      deploy,
      {
        getValidParams,
        getInvalidParams: async () => [
          hardhat_1.ethers.utils.randomBytes(32),
          hardhat_1.ethers.utils.randomBytes(0),
        ],
      },
      skips,
    );
  });
}
exports.describeBehaviorOfERC1271Stored = describeBehaviorOfERC1271Stored;
