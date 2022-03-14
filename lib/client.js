/**
 * MIT License
 * Copyright (c) 2022 Battledash-2
 * --------------------------------------
 * File: client.js
 * Comment: Main interface
 */

const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
const exit  = (code) => process.exit(code);

const color = require('terminalcolors.js');
const fs = require('fs');
const path = require('path');
const endpoint = require('./endpoints.js');

const upperMessage = (text)=>{
	console.log('-----------------'.hex('#555').bold());
	console.log(text.red().bold());
	console.log('-----------------'.hex('#555').bold());	
}
const tokenInstructions = ()=>{
	return(`To get your ${'.ROBLOSECURITY'.blue().bold()}: go to the ${'Roblox'.green().bold()} website,\nopen dev tools ${'('.hex('#777')}right click ${'->'.hex('#777')} inspect | F12 | ctrl shift i${')'.hex('#777')} and\ngo to the 'application' tab then go to cookies. Click on ${'.ROBLOSECURITY'.blue().bold()} and copy the value.`);
}
const missingToken = ()=>{
	upperMessage('Missing Token');
	console.log('\n'+tokenInstructions());
	exit(1);
}
const deniedAccess = (to='unspecified')=>{
	upperMessage('Access Denied');
	console.log(`\nAccess was denied during request: '${to.green()}'.\nThis could be because of your ${'.ROBLOSECURITY'.blue().bold()}.\n\n`+tokenInstructions());
	exit(1);
}

module.exports['login'] = function (token, callback=()=>{}) {
	if (!token) return missingToken();
	// status 401 -- unauthorized (token not available)
	return new Promise((resolve, reject)=>{
		fetch(endpoint.auth + '/v2/logout', {
			method: 'POST',
			headers: {
				cookie: '.ROBLOSECURITY='+token+';',
			}
		}).then(res=>{
			if (res.status === 401) return deniedAccess('token verification');
			let xsrf = res.headers.raw()['x-csrf-token']; // x-csrf-token token
			const c = new Client(token, xsrf);
			resolve(c);
			callback(c, res.status);
		});
	});
}

class Client {
	constructor(token, xsrf) {
		this.secret = token;
		this.xsrf = xsrf;
	}
	_makeRequest(location, method, body={}, extraHeaders={}) {
		return fetch(location, {
			method,
			headers: {
				cookie: '.ROBLOSECURITY='+this.secret+';',
				...(extraHeaders || {}),
			},
			body: body || {},
		});
	}
}

const folderPrototype = (proto, folder, pass=[]) => {
	const functions = fs.readdirSync(path.join(__dirname, folder)).filter(fn=>!fn.includes('.test'));
	const loadFiles = (functions, as='', opath='') => {
		for (let file of functions) {
			if (fs.lstatSync(path.join(__dirname, folder, opath, file)).isDirectory()) {
				let az = as === '' ? file : as + '.' + file;
				loadFiles(fs.readdirSync(path.join(__dirname, folder, opath, file)).filter(fn=>!fn.includes('.test')), az, path.join(opath, file));
				continue;
			}
			let p = proto.prototype;
			if (as !== '') {
				for (let a of as.split('.')) {
					if (!p.hasOwnProperty(a)) p[a] = {};
					p = p[a];
				}
			}
			p[(file.endsWith('.js')) ? file.slice(0, -3) : file] = require(path.join(__dirname, folder, opath, file))(...pass);
		}
	}
	loadFiles(functions);
}
folderPrototype(Client, 'client', [ fetch, endpoint ]);