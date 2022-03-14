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
					if (typeof object[name] === 'function') return (...a)=>object[name].call(instance_(), ...a);
					if (typeof target[name] === 'function') return (...a)=>target[name].call(instance_(), ...a);
				}
			});
		}

		this.settings = wrapProxy({
			get: require('./client/settings/get')
		});
		this.thumbnail = wrapProxy({
			full: require('./client/thumbnail/full'),
			bust: require('./client/thumbnail/bust'),
			headshot: require('./client/thumbnail/headshot'),
		});

		this._settings = {};
		(async()=>{
			tc._settings = await this.settings.get();
			this.onready();
		})();
	}
	_makeRequest(location, method='GET', body={}, extraHeaders={}) {
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
}