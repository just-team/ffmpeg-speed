const exec = require('child_process').exec,
	  fs = require('fs'),
	  Promise = require("bluebird");


function ChangeSpeed(options, cb) {
	var input = options.input,
		speed = options.speed,
		output = options.output,
		unlink = options.unlink,
		config = {};


	if(speed !== 'x0.5' && speed !== 'x2') {
		return cb('Wrong speed value: ' + speed);
	}

	if(input.indexOf('"') != -1 || output.indexOf('"') != -1) {
		return cb('Video name must not contain ""');
	}

	var promise_input = new Promise(function(resolve, reject) {
		fs.exists(input, function(bool_input) {
			if(!bool_input) {
				reject('Input source does not exist: ' + input);
			} else {
				resolve();
			}
		});
	});


	var promise_output = function() {
		var promise = new Promise(function(resolve, reject) {
			fs.exists(output, function(bool_output) {
				if(bool_output) {
					reject('Output source exists: ' + output);
				} else {
					resolve();
				}
			});
		});

		return promise;
	}

	var promise_speed = function() {
		var promise = new Promise(function(resolve, reject) {
			if(speed === 'x0.5') {
				config.video = 2;
				config.audio = 0.5;
			} else {
				config.video = 0.5;
				config.audio = 2;
			}

			resolve();
		});

		return promise;
	}

	var promise_create = function() {
		var promise = new Promise(function(resolve, reject) {
			exec('ffmpeg -i "' + input + '" -vf "setpts=' + config.video + '*PTS" -filter:a "atempo=' + config.audio + '" "' + output + '" -y', (err, stdout, stderr) => {
			  if (err) { return cb(err); }

			  resolve(stdout);
			});		
		});

		return promise;
	}

	var promise_unlink = function() {
		var promise = new Promise(function(resolve, reject) {
			if (unlink) {
				fs.unlink(input, function() {
					resolve();
				});
			} else {
				resolve();
			}
		});

		return promise;
	}

	var promise_done = function(stdout) {
		var promise = new Promise(function(resolve, reject) {
			cb(null);
		});

		return promise;
	}

	var promise_error = function(err) {
		cb(err);
	}


	promise_input
	.then(promise_output)
	.then(promise_speed)
	.then(promise_create)
	.then(promise_unlink)
	.then(promise_done)
	.catch(promise_error);
}

module.exports = ChangeSpeed;