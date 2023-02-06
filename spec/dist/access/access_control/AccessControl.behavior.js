'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfAccessControl = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const ROLE = hardhat_1.ethers.utils.solidityKeccak256(['string'], ['ROLE']);
function describeBehaviorOfAccessControl(
  { deploy, getAdmin, getNonAdmin },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::AccessControl', function () {
    let instance;
    let admin;
    let nonAdmin;
    beforeEach(async function () {
      instance = await deploy();
      admin = await getAdmin();
      nonAdmin = await getNonAdmin();
    });
    describe('#hasRole(bytes32,address)', function () {
      it('returns whether given account has given role', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['hasRole(bytes32,address)'](
            DEFAULT_ADMIN_ROLE,
            admin.address,
          ),
        ).to.equal(true);
        (0, chai_1.expect)(
          await instance.callStatic['hasRole(bytes32,address)'](
            DEFAULT_ADMIN_ROLE,
            hardhat_1.ethers.constants.AddressZero,
          ),
        ).to.equal(false);
      });
    });
    describe('#getRoleAdmin(bytes32)', function () {
      it('returns default admin role', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['getRoleAdmin(bytes32)'](ROLE),
        ).to.equal(DEFAULT_ADMIN_ROLE);
      });
      it('returns default admin role as admin of itself', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['getRoleAdmin(bytes32)'](
            DEFAULT_ADMIN_ROLE,
          ),
        ).to.equal(DEFAULT_ADMIN_ROLE);
      });
    });
    describe('#grantRole(bytes32,address)', function () {
      it('adds role to account', async function () {
        await instance.connect(admin).grantRole(ROLE, nonAdmin.address);
        (0, chai_1.expect)(
          await instance.callStatic['hasRole(bytes32,address)'](
            ROLE,
            nonAdmin.address,
          ),
        ).to.equal(true);
      });
      it('emits RoleGranted event', async function () {
        await (0, chai_1.expect)(
          instance.connect(admin).grantRole(ROLE, nonAdmin.address),
        )
          .to.emit(instance, 'RoleGranted')
          .withArgs(ROLE, nonAdmin.address, admin.address);
      });
      describe('reverts if', function () {
        it('sender is not admin', async function () {
          await instance.connect(admin).grantRole(ROLE, nonAdmin.address);
          await (0, chai_1.expect)(
            instance.connect(nonAdmin).grantRole(ROLE, nonAdmin.address),
          ).to.be.revertedWith(
            `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
          );
        });
      });
    });
    describe('#revokeRole(bytes32,address)', function () {
      it('removes role from account', async function () {
        await instance.connect(admin).grantRole(ROLE, nonAdmin.address);
        await instance.connect(admin).revokeRole(ROLE, nonAdmin.address);
        (0, chai_1.expect)(
          await instance.callStatic['hasRole(bytes32,address)'](
            ROLE,
            nonAdmin.address,
          ),
        ).to.equal(false);
      });
      it('emits RoleRevoked event', async function () {
        await instance.connect(admin).grantRole(ROLE, nonAdmin.address);
        await (0, chai_1.expect)(
          instance.connect(admin).revokeRole(ROLE, nonAdmin.address),
        )
          .to.emit(instance, 'RoleRevoked')
          .withArgs(ROLE, nonAdmin.address, admin.address);
      });
      describe('reverts if', function () {
        it('sender is not admin', async function () {
          await instance.connect(admin).grantRole(ROLE, nonAdmin.address);
          await (0, chai_1.expect)(
            instance.connect(nonAdmin).revokeRole(ROLE, nonAdmin.address),
          ).to.be.revertedWith(
            `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
          );
        });
      });
    });
    describe('#renounceRole(bytes32,address)', function () {
      it('removes role from sender', async function () {
        await instance.connect(admin).grantRole(ROLE, nonAdmin.address);
        await instance.connect(nonAdmin).renounceRole(ROLE),
          (0, chai_1.expect)(
            await instance.callStatic['hasRole(bytes32,address)'](
              ROLE,
              nonAdmin.address,
            ),
          ).to.equal(false);
      });
      it('emits RoleRevoked event', async function () {
        await instance.connect(admin).grantRole(ROLE, nonAdmin.address);
        await (0, chai_1.expect)(instance.connect(nonAdmin).renounceRole(ROLE))
          .to.emit(instance, 'RoleRevoked')
          .withArgs(ROLE, nonAdmin.address, nonAdmin.address);
      });
    });
  });
}
exports.describeBehaviorOfAccessControl = describeBehaviorOfAccessControl;
