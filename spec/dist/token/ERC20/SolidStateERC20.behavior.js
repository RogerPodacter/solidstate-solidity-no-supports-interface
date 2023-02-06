'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfSolidStateERC20 = void 0;
const ERC20Base_behavior_1 = require('./ERC20Base.behavior');
const ERC20Extended_behavior_1 = require('./ERC20Extended.behavior');
const ERC20Metadata_behavior_1 = require('./ERC20Metadata.behavior');
const ERC20Permit_behavior_1 = require('./ERC20Permit.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfSolidStateERC20(deploy, args, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::SolidStateERC20', function () {
    (0, ERC20Base_behavior_1.describeBehaviorOfERC20Base)(deploy, args, skips);
    (0, ERC20Extended_behavior_1.describeBehaviorOfERC20Extended)(
      deploy,
      args,
      skips,
    );
    (0, ERC20Metadata_behavior_1.describeBehaviorOfERC20Metadata)(
      deploy,
      args,
      skips,
    );
    (0, ERC20Permit_behavior_1.describeBehaviorOfERC20Permit)(
      deploy,
      args,
      skips,
    );
  });
}
exports.describeBehaviorOfSolidStateERC20 = describeBehaviorOfSolidStateERC20;
