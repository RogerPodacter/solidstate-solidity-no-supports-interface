'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfManagedProxy = void 0;
const Proxy_behavior_1 = require('../Proxy.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfManagedProxy(
  deploy,
  { implementationFunction, implementationFunctionArgs },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ManagedProxy', function () {
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
exports.describeBehaviorOfManagedProxy = describeBehaviorOfManagedProxy;
