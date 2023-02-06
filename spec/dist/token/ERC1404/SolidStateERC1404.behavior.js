'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfSolidStateERC1404 = void 0;
const ERC20_1 = require('../ERC20');
const ERC1404Base_behavior_1 = require('./ERC1404Base.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfSolidStateERC1404(
  deploy,
  { mint, burn, allowance, restrictions, name, symbol, decimals, supply },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::SolidStateERC1404', function () {
    (0, ERC20_1.describeBehaviorOfSolidStateERC20)(
      deploy,
      {
        mint,
        burn,
        allowance,
        name,
        symbol,
        decimals,
        supply,
      },
      skips,
    );
    (0, ERC1404Base_behavior_1.describeBehaviorOfERC1404Base)(
      deploy,
      {
        restrictions,
        mint,
        burn,
        supply,
      },
      ['::ERC20Base', ...(skips !== null && skips !== void 0 ? skips : [])],
    );
  });
}
exports.describeBehaviorOfSolidStateERC1404 =
  describeBehaviorOfSolidStateERC1404;
