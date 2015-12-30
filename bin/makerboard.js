#!/usr/bin/env node

/*
QEMU=`which qemu-mipsel-static`
if [ ! -x "$QEMU" ]; then
	echo "No available QEMU utility can be used."
	echo "Please install it with command:"
	echo "    sudo apt-get install qemu-user-static"
	exit
fi
*/
var path = require('path');
var fs = require('fs');
var MakerBoard = require('../lib/makerboard');
var unzip = require('unzip2');
var yargs = require('yargs')
	.usage('Usage: $0 <command> [options]')
	.command('create', 'Create a new emulation environment')
	.command('run', 'Run specific emulation')
	.demand(1, 'require a valid command')
	.help('help');

var argv = yargs.argv;

var command = argv._[0];

if (command === 'create') {
	var argv = yargs.reset()
		.usage('Usage: $0 create <path>')
		.help('help')
		.example('$0 create <path>', 'Create a new emulation environment')
		.demand(2, 'require a valid path')
		.argv;

	var targetPath = argv._[1].toString();
	var firmwareUrl = 'https://s3-ap-southeast-1.amazonaws.com/mtk.linkit/openwrt-ramips-mt7688-root.squashfs';
	var downloader = new MakerBoard.Downloader();
	downloader.on('finished', function(fwPath) {
		console.log('Extracting ' + fwPath + '...');


		// Extract filesystem
		var extract = new MakerBoard.Extract();
		extract.unsquashFS(fwPath, targetPath, function() {

			// Initializing simulation
			var container = new MakerBoard.Container();
			container.initEnvironment(targetPath, function() {
				console.log('Done');
			});
		});
	});
	downloader.download(firmwareUrl, false, path.join(__dirname, '..', 'data'));
} else if (command === 'run') {
	var argv = yargs.reset()
		.usage('Usage: $0 run <path>')
		.help('help')
		.example('$0 run <path>', 'Run specific emulation')
		.demand(2, 'require a valid path')
		.argv;

	var targetPath = argv._[1].toString();
	var container = new MakerBoard.Container();
	container.run(targetPath, function() {
		console.log('QUIT!');
	});
} else {
	yargs.showHelp();
}
