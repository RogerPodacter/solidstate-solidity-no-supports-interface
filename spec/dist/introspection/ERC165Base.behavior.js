'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC165Base = void 0;
function describeBehaviorOfERC165Base(deploy, { interfaceIds }, skips) {
  // const describe = describeFilter(skips);
  // describe('::ERC165Base', function () {
  //   let instance: ERC165Base;
  //   beforeEach(async function () {
  //     instance = await deploy();
  //   });
  //   describe('#supportsInterface(bytes4)', function () {
  //     it('returns true for ERC165 interface', async function () {
  //       expect(
  //         await instance.callStatic['supportsInterface(bytes4)']('0x01ffc9a7'),
  //       ).to.be.true;
  //     });
  //     it('returns false for unknown interface', async function () {
  //       expect(
  //         await instance.callStatic['supportsInterface(bytes4)']('0x00000000'),
  //       ).to.be.false;
  //     });
  //     it('returns false for invalid interface', async function () {
  //       expect(
  //         await instance.callStatic['supportsInterface(bytes4)']('0xffffffff'),
  //       ).to.be.false;
  //     });
  //     for (let interfaceId of interfaceIds) {
  //       it(`returns true for interface ${interfaceId}`, async function () {
  //         expect(
  //           await instance.callStatic['supportsInterface(bytes4)'](interfaceId),
  //         ).to.be.true;
  //       });
  //     }
  //   });
  // });
}
exports.describeBehaviorOfERC165Base = describeBehaviorOfERC165Base;
