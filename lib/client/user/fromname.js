module.exports = ()=>function (userName, callback=()=>{}) {
	return new Promise(resolve=>{
		this._makeRequest(this.endpoints.api + '/users/get-by-username', 'GET', {
			username: userName,
		}).then(r=>r.json()).then(j=>{
			resolve(j.Id);
			callback(j.Id);
		});
	});
}