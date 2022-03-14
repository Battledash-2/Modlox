module.exports = ()=>function(cb=()=>{}) {
	return new Promise(resolve=>{
		this._makeRequest(this.endpoints.users + '/v1/users/'+this._settings.id, 'GET').then(d=>d.json()).then(json=>{
			if (!json.hasOwnProperty('errors')) this._settings = json;
			resolve(json);
			cb(json);
		});
	});
}