// 2017-05-01 Usage: node main --profile=profile/portal.json --full
const remoteController = require('./local/remoteController.js');
var counter = 0;
const done = () => {if (3 === ++counter) {remoteController.execute();}};
require('./local/uploadMagentoCode.js').execute(done);
require('./local/uploadMagentoDB.js').execute(done);
remoteController.upload(done);