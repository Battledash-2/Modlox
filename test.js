const loaddotenv = (fn)=>{
	const fs = require('node:fs');
	const path = require('node:path');
	const fc = String(fs.readFileSync(path.join(__dirname, fn)));
	const ss = fc.split('\n').map(l=>l.split('='));
	ss.forEach(s=>{process.env[s[0]]=s[1]});
}
loaddotenv('.env');
// fs.readdirSync('.').forEach(f=>{if(!f.endsWith('.env'))return; loaddotenv(f)});

const Client = require('./');
(async()=>{


const client = await Client.login(process.env['token']);
client.onready = async()=>{
	const url = await client.thumbnail.headshot('420x420');
	console.log(url);
}


})();