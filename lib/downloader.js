var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');
var https = require('https');
var ProgressBar = require('progress');
var util = require('util');
var events = require('events');

var Downloader = module.exports = function() {
};

util.inherits(Downloader, events.EventEmitter);

Downloader.prototype._download = function(opts, secure, force, targetPath) {
	var self = this;

	var client = secure ? https : http;
	var req = client.request(opts, function(res) {
		var len = parseInt(res.headers['content-length'], 10);

		// Redirect
		if (res.statusCode == 301 && res.headers['location']) {
			opts.path = res.headers['location'];
			self._download(opts, secure, force, targetPath);
			return;
		}

		// Specify path to save file
		var _targetPath = targetPath;
		var stats = fs.statSync(targetPath);
		if (stats.isDirectory()) {
			_targetPath = path.join(targetPath, path.basename(opts.path));
		}

		if (!force) {
			if (fs.existsSync(_targetPath)) {
				var stats = fs.statSync(_targetPath);
				if (stats.size == len) {
					self.emit('finished', _targetPath);
					return;
				}
			}
		}

		res.pipe(fs.createWriteStream(_targetPath));

		// Progress bar
		var bar = null;

		res.on('data', function(chunk) {
			bar = bar || new ProgressBar('Downloading [:bar] :current/:totalBytes :percent | ETA :etas', {
				complete: '=',
				incomplete: ' ',
				width: 40,
				total: len
			});
			bar.tick(chunk.length);
		});

		res.on('end', function() {
			self.emit('finished', _targetPath);
		});
	});

	req.end();
};

Downloader.prototype.download = function(_url, force, targetPath) {
	var info = url.parse(_url);

	var secure = false;
	if (info.protocol == 'https:') {
		secure = true;
	}

	var opts = {
		host: info.host,
		port: secure ? 443 : info.port || 80,
		path: info.path
	};

	this._download(opts, secure, force, targetPath);
};
