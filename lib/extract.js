var child_process = require('child_process');

var Extract = module.exports = function() {
};

Extract.prototype.unsquashFS = function(filePath, targetPath, callback) {

	var unsquashfs = child_process.spawn('unsquashfs', [
			'-d',
			targetPath,
			filePath
		], {
			stdio: 'inherit'
		});

	unsquashfs.on('close', function() {
		callback();
	});
};
