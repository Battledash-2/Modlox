module.exports = ()=>function(userId, cb=()=>{}) {
	return new Promise(resolve=>{
		this._getuid(userId).then(uid=>{
			this._makeRequest(this.endpoints.api + '/userblock/unblock', 'POST', {
				userId: uid,
			}).then(r=>r.json()).then(j=>{resolve(j);cb(j);});
		});
	});
}