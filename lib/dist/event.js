'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getLogs = void 0;
function getLogs(contractInterface, receipt, only = []) {
  const events = [];
  for (const log of receipt.logs) {
    try {
      const parsedLog = contractInterface.parseLog(log);
      if (only.length > 0 && !only.includes(parsedLog.name)) {
        continue;
      }
      events.push(parsedLog);
    } catch (e) {
      console.log(e);
      throw Error('could not parse logs');
    }
  }
  return events;
}
exports.getLogs = getLogs;
