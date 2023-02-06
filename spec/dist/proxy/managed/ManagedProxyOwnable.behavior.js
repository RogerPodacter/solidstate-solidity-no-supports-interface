'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfManagedProxyOwnable = void 0;
const ManagedProxy_behavior_1 = require('./ManagedProxy.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfManagedProxyOwnable(
  deploy,
  { implementationFunction, implementationFunctionArgs },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ManagedProxyOwnable', function () {
    (0, ManagedProxy_behavior_1.describeBehaviorOfManagedProxy)(
      deploy,
      {
        implementationFunction,
        implementationFunctionArgs,
      },
      [],
    );
  });
}
exports.describeBehaviorOfManagedProxyOwnable =
  describeBehaviorOfManagedProxyOwnable;
