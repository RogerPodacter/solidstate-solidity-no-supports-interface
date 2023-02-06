'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfSolidStateERC1155 = void 0;
const ERC1155Base_behavior_1 = require('./ERC1155Base.behavior');
const ERC1155Enumerable_behavior_1 = require('./ERC1155Enumerable.behavior');
const ERC1155Metadata_behavior_1 = require('./ERC1155Metadata.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfSolidStateERC1155(
  deploy,
  { transfer, mint, burn, tokenId, tokenURI },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::SolidStateERC1155', function () {
    (0, ERC1155Base_behavior_1.describeBehaviorOfERC1155Base)(
      deploy,
      { mint, burn, tokenId },
      skips,
    );
    (0, ERC1155Enumerable_behavior_1.describeBehaviorOfERC1155Enumerable)(
      deploy,
      {
        transfer,
        mint,
        burn,
      },
    );
    (0, ERC1155Metadata_behavior_1.describeBehaviorOfERC1155Metadata)(deploy, {
      tokenURI,
    });
  });
}
exports.describeBehaviorOfSolidStateERC1155 =
  describeBehaviorOfSolidStateERC1155;
