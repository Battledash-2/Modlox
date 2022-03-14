module.exports = ()=>function(userId, callback=()=>{}) {
	// _getuid(id) {
	return new Promise(resolve=>{
		this._getuid(userId).then(uid=>{
			this._makeRequest(this.endpoints.api + '/users/' + uid, 'GET').then(d=>d.json()).then(j=>{resolve(j); callback(j);});
		});
	});	
}