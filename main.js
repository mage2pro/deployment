// 2017-05-01 Usage: node main --profile=profile/portal.json --full
const remoteController = require('./local/remoteController.js');
var counter = 0;
const done = () => {if (1 < ++counter) {
	remoteController.execute();
}};
//require('./local/uploadMagentoCode.js')(done);
require('./local/uploadMagentoDB.js')(done);
remoteController.upload(require('yargs').argv['full'], done);