'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfUpgradeableProxy = void 0;
const Proxy_behavior_1 = require('../Proxy.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfUpgradeableProxy(
  deploy,
  { implementationFunction, implementationFunctionArgs },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::UpgradeableProxy', function () {
    (0, Proxy_behavior_1.describeBehaviorOfProxy)(
      deploy,
      {
        implementationFunction,
        implementationFunctionArgs,
      },
      [],
    );
  });
}
exports.describeBehaviorOfUpgradeableProxy = describeBehaviorOfUpgradeableProxy;
