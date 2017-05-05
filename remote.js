// 2017-05-02
const dfU = require('./utils.js');
console.log(`The working path: ${dfU.rWorkingPath()}`);
console.log(`The Magento path: ${dfU.rMagentoPath()}`);
if (dfU.isFull()) {
	console.log('The full mode.');
	require('./remote/updateMagentoCode.js')(() => {});
}
else {
	console.log('The partial mode.');
}
require('./remote/updateMagentoDB.js')(() => {});