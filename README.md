# ffmpeg-speed

## Speed up/slow down effect for ffmpeg.


```
npm install ffmpeg-speed --save
```

### Options
* input - full input directory to video file.
* speed - 'x0.5' or 'x2'
* output - full output directory to new video file.
* unlink - boolean : delete input file after finishing.


Working example.
```
const ffmpegSpeed = require('ffmpeg-speed'),
	  path = require('path');

var config = {
	input: path.join(__dirname, 'input.mp4'),
	speed: 'x0.5',
	output: path.join(__dirname, 'output.mp4'),
	unlink: true
};


ffmpegSpeed(config, function(err) {
	if(err) {
		throw err;
	}

	// ...
});
```