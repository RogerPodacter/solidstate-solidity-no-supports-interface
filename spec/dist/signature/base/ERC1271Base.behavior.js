'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC1271Base = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
function describeBehaviorOfERC1271Base(
  deploy,
  { getValidParams, getInvalidParams },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC1271Base', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#isValidSignature(bytes32,bytes)', function () {
      it('returns 0x1626ba7e for valid signature', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['isValidSignature(bytes32,bytes)'](
            ...(await getValidParams()),
          ),
        ).to.equal('0x1626ba7e');
      });
      it('returns 0x00000000 for invalid signature', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['isValidSignature(bytes32,bytes)'](
            ...(await getInvalidParams()),
          ),
        ).to.equal('0x00000000');
      });
    });
  });
}
exports.describeBehaviorOfERC1271Base = describeBehaviorOfERC1271Base;
