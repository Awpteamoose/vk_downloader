"use strict";

var fs = require('fs-extended');
var request = require('request');
var sanitize = require('sanitize-filename');
var wallpost_url = process.argv[2];
var wallpost_id = wallpost_url.slice(wallpost_url.indexOf("wall-") + "wall".length);

request(`https://api.vk.com/method/wall.getById?posts=${wallpost_id}`, (error, response, body) => {
	if (!error && response.statusCode == 200) {
		body = JSON.parse(body);
		body.response[0].attachments.forEach((attach) => {
			if (attach.type !== "audio") return;
			var audio = attach.audio;
			var filename = sanitize(`${audio.artist} - ${audio.title}`, { "replacement": "~" });
			filename = "out\\" + filename + ".mp3";
			fs.ensureFileSync(filename);
			request(`${audio.url}`).pipe(fs.createWriteStream(filename));
		});
	} else {
		console.log(error);
	};
})
