// 2017-05-02
const dfRU = require('./remote/utils.js');
const dfU = require('./utils.js');
const mCP = require('child_process');
console.log(`The working path: ${dfU.rWorkingPath()}`);
console.log(`The Magento path: ${dfU.rMagentoPath()}`);
dfRU.maintenanceOn();
var counter = 0;
var numTasks = dfU.isFull() ? 2 : 1;
const done = () => {if (numTasks === ++counter) {
	dfRU.maintenanceOff();
	mCP.execSync(`rm -rf ${dfU.trimS(dfU.rWorkingPath())}`);
}};
if (dfU.isFull()) {
	console.log('The full mode.');
	require('./remote/updateMagentoCode.js')(done);
}
else {
	console.log('The partial mode.');
}
require('./remote/updateMagentoDB.js')(done);