'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC1155Metadata = void 0;
const library_1 = require('@solidstate/library');
function describeBehaviorOfERC1155Metadata(deploy, { tokenURI }, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC1155Metadata', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#uri(uint256)', function () {
      it('returns empty string if neither base URI nor token URI is set');
      it('returns stored token URI if base URI is not set');
      it('returns concatenation of base URI and token URI if both are set');
      it(
        'returns concatenation of base URI and token ID if only base URI is set',
      );
    });
  });
}
exports.describeBehaviorOfERC1155Metadata = describeBehaviorOfERC1155Metadata;
