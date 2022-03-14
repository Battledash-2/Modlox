module.exports = function(cb=()=>{}) {
	return new Promise(resolve=>{
		this._makeRequest(this.endpoints.www + '/my/settings/json', 'GET').then(d=>d.json()).then(json=>{
			const userId = json.UserId;
			this._makeRequest(this.endpoints.users + '/v1/users/'+userId, 'GET').then(d=>d.json()).then(json=>{
				resolve(json);
				cb(json);
			});
		});
	});
}