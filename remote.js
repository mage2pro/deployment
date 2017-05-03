// 2017-05-02
const dfU = require('./utils.js');
console.log(`The working path: ${dfU.rWorkingPath()}`);
console.log(`The Magento path: ${dfU.rMagentoPath()}`);
require('./remote/updateMagentoCode.js')(() => {});
require('./remote/updateMagentoDB.js')(() => {});