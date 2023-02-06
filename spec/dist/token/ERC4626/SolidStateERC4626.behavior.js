'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfSolidStateERC4626 = void 0;
const ERC20_1 = require('../ERC20');
const ERC4626Base_behavior_1 = require('./ERC4626Base.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfSolidStateERC4626(deploy, args, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::SolidStateERC4626', function () {
    (0, ERC20_1.describeBehaviorOfSolidStateERC20)(deploy, args, skips);
    (0, ERC4626Base_behavior_1.describeBehaviorOfERC4626Base)(deploy, args, [
      '::ERC20Base',
      '::ERC20Metadata',
      ...(skips !== null && skips !== void 0 ? skips : []),
    ]);
  });
}
exports.describeBehaviorOfSolidStateERC4626 =
  describeBehaviorOfSolidStateERC4626;
