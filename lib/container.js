var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var co = require('co');

var Container = module.exports = function() {
};

Container.prototype.checkDependency = function() {

	var check = child_process.spawn('which', [ 'qemu-mipsel-static123' ]);

	check.on('close', function(code) {
		console.log(code);
		if (code == 0) {
			callback();
			return;
		}

		callback(new Error('Cannot found QEMU'));
	});

};

Container.prototype.copyFile = function(srcPath, targetPath, callback) {
	fs.exists(srcPath, function(exists) {
		if (!exists) {
			callback(new Error('file doesn\'t exists.'));
			return;
		}

		var stats = fs.lstatSync(srcPath);
		if (stats.isSymbolicLink())
			srcPath = fs.readlinkSync(srcPath);

		var copy = child_process.spawn('cp', [
				'-a',
				srcPath,
				targetPath
			]);

		copy.on('close', function(code) {
			callback();
		});
	});
};

Container.prototype.initEnvironment = function(targetPath, callback) {
	var self = this;
	var qemuPath = '/usr/bin/qemu-mipsel-static';

	var usrBin = path.join(targetPath, 'usr', 'bin');

	this.copyFile(qemuPath, path.join(usrBin, 'qemu-core-static'), function(err) {

		if (err) {
			callback(err);
			return;
		}

		var arch = 'x86-32';
		if (process.arch == 'x64') {
			arch = 'x86-64';
		}

		var coreFile = path.join(__dirname, '..', 'built', process.platform + '-' + arch);
		self.copyFile(coreFile, path.join(usrBin, 'qemu-mipsel-static'), function(err) {

			self.copyFile(path.join(__dirname, '../', 'scripts', 'init.sh'), targetPath, function(err) {

				if (err) {
					callback(err);
					return;
				}

				callback();
			});
		});
	});
};

Container.prototype.bindPath = function(srcPath, targetPath, callback) {

	var mount = child_process.spawn('sudo', [
			'mount',
			'--bind',
			srcPath,
			targetPath
		]);

	mount.on('close', function(code) {
		callback();
	});
};

Container.prototype.mount = function(fstype, srcPath, targetPath, callback) {

	var mount = child_process.spawn('sudo', [
			'mount',
			'-t',
			fstype,
			srcPath,
			targetPath
		]);

	mount.on('close', function(code) {
		callback();
	});
};

Container.prototype.unmount = function(targetPath, callback) {

	var unmount = child_process.spawn('sudo', [
			'umount',
			'-l',
			targetPath
		]);

	unmount.on('close', function(code) {
		callback();
	});
};

Container.prototype.initNetwork = function(targetPath, callback) {

	this.copyFile('/etc/resolv.conf', path.join(targetPath, 'etc'), function(err) {

		if (err) {
			callback(err);
			return;
		}

		callback();
	});
};

Container.prototype.enter = function(targetPath, callback) {

	// switch to environment
	var chroot = child_process.spawn('sudo', [
			'chroot',
			targetPath,
			'/init.sh'
		], {
			stdio: 'inherit'
		});

	chroot.on('close', function(code) {
		callback();
	});
};

Container.prototype.run = function(targetPath, callback) {
	var self = this;

	fs.exists(targetPath, function(exists) {
		if (!exists) {
			callback(new Error('target path doesn\'t exists.'));
			return;
		}

		co(function *() {

			// Mounting
			var sysPath = path.join(targetPath, 'sys');
			var procPath = path.join(targetPath, 'proc');
			var devPath = path.join(targetPath, 'dev');

			// Unmount
			yield function(done) {
				self.unmount(devPath, done);
			};

			yield function(done) {
				self.unmount(procPath, done);
			};

			yield function(done) {
				self.unmount(sysPath, done);
			};

			// Initializing network
			yield function(done) {
				self.initNetwork(targetPath, done);
			};

			yield function(done) {
				self.mount('sys', 'sys', sysPath, done);
			};

			yield function(done) {
				self.mount('proc', 'proc', procPath, done);
			};

			yield function(done) {
				self.bindPath('/dev', devPath, done);
			};

			// Enter to emulation
			yield function(done) {
				self.enter(targetPath, done);
			};

			// Unmount
			yield function(done) {
				self.unmount(devPath, done);
			};

			yield function(done) {
				self.unmount(procPath, done);
			};

			yield function(done) {
				self.unmount(sysPath, done);
			};

			callback();
		});
	});
};
