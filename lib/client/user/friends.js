module.exports = ()=>function(page=1, cb=()=>{}) {
	if (typeof page === 'function') { cb = page; page = 1; } 
	return new Promise(resolve=>{
		this._makeRequest(this.endpoints.api + '/users/'+this._settings.id+'/friends', 'GET', {
			page,
		}).then(d=>d.json()).then(json=>{
			resolve(json);
			cb(json);
		});
	});
}