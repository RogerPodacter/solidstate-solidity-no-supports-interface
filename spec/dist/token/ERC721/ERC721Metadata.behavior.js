'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC721Metadata = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
function describeBehaviorOfERC721Metadata(
  deploy,
  { name, symbol, tokenURI },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC721Metadata', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#name()', function () {
      it('returns token name', async function () {
        (0, chai_1.expect)(await instance.callStatic['name()']()).to.equal(
          name,
        );
      });
    });
    describe('#symbol()', function () {
      it('returns token symbol', async function () {
        (0, chai_1.expect)(await instance.callStatic['symbol()']()).to.equal(
          symbol,
        );
      });
    });
    describe('#tokenURI(uint256)', function () {
      it('returns empty string if neither base URI nor token URI is set');
      it('returns stored token URI if base URI is not set');
      it('returns concatenation of base URI and token URI if both are set');
      it(
        'returns concatenation of base URI and token ID if only base URI is set',
      );
    });
  });
}
exports.describeBehaviorOfERC721Metadata = describeBehaviorOfERC721Metadata;
