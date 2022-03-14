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
			fetch(endpoint.www + '/my/settings/json', {
				method: 'GET',
				headers: {
					"x-csrf-token": xsrf,
					cookie: '.ROBLOSECURITY='+token+';',
				}
			}).then(r=>r.json()).then(info=>{
				const uid = info.UserId;
				fetch(endpoint.users + '/v1/users/'+uid, {
					method: 'GET',
					headers: {
						"x-csrf-token": xsrf,
						cookie: '.ROBLOSECURITY='+token+';',
					}
				}).then(d=>d.json()).then(info=>{
					const c = new Client(token, xsrf, info);
					resolve(c);
					callback(c);
				});
			});
		});
	});
}

class Client {
	constructor(token, xsrf, settings) {
		this.onready = ()=>{};
		this.secret = token;
		this.xsrf = xsrf;

		this.endpoints = endpoint;
		this.fetch = fetch;

		let tc = this;
		const instance_ = function () { return tc; }
		this.instance_ = instance_;


		const wrapProxy = function (object) {
			return new Proxy({}, {
				get(target, name) {
					if (typeof object[name] === 'function') return (...a)=>object[name].call(tc, ...a);
					if (typeof target[name] === 'function') return (...a)=>target[name].call(tc, ...a);

					if (typeof object[name] === 'object' && !Array.isArray(object[name])) return wrapProxy(object[name]);
					if (typeof target[name] === 'object' && !Array.isArray(object[name])) return wrapProxy(target[name]);
				}
			});
		}
		const folderPrototype = (proto, folder, pass=[], wrapObjects=false, protot=false) => {
			wrapObjects = wrapObjects || function(o){return o};
			if (typeof pass === 'function') { wrapObjects = pass; pass = []; };

			const functions = fs.readdirSync(path.join(__dirname, folder)).filter(fn=>!fn.includes('.test'));
			const loadFiles = (functions, as='', opath='') => {
				for (let file of functions) {
					if (fs.lstatSync(path.join(__dirname, folder, opath, file)).isDirectory()) {
						let az = as === '' ? file : as + '.' + file;
						loadFiles(fs.readdirSync(path.join(__dirname, folder, opath, file)).filter(fn=>!fn.includes('.test')), az, path.join(opath, file));
						continue;
					}
					let p;
					if (typeof p === 'function' && !protot) p = proto.prototype;
					if (typeof p === 'function' && protot) p = proto.__proto__;
					else p = proto;
					if (as !== '') {
						for (let a of as.split('.')) {
							if (!p.hasOwnProperty(a)) p[a] = wrapObjects({});
							p = p[a];
						}
					}
					p[(file.endsWith('.js')) ? file.slice(0, -3) : file] = require(path.join(__dirname, folder, opath, file))(...pass);
				}
			}
			loadFiles(functions);
		}
		folderPrototype(this, 'client', wrapProxy);

		// this.settings = wrapProxy({
		// 	get: require('./client/settings/get')
		// });
		// this.thumbnail = wrapProxy({
		// 	full: require('./client/thumbnail/full'),
		// 	bust: require('./client/thumbnail/bust'),
		// 	headshot: require('./client/thumbnail/headshot'),
		// });

		// this._settings = {};
		// (async()=>{
		// 	tc._settings = await this.settings.get();
		// 	this.onready();
		// })();
		this._settings = settings;
		this.onready();
	}
	_makeRequest(location, method='GET', body={}, extraHeaders={}) {
		method = method.toUpperCase();
		let options = {
			method,
			headers: {
				cookie: '.ROBLOSECURITY='+this.secret+';',
				...(extraHeaders || {}),
			},
		};
		if (method !== 'GET') {
			options.body = body || {};
		} else if (Object.keys(body).length > 0) {
			let params = new URLSearchParams(body).toString();
			location += '?'+params.toString();
		}
		return fetch(location, options);
	}
	_getuid(id) {
		return new Promise(resolve=>{
			if (typeof id === 'number') return resolve(id);
			this.user.fromname(id).then(i=>resolve(i));
		});
	}
}