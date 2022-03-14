module.exports = ()=>function(assetId, userId, callback=()=>{}) {
	return new Promise(resolve=>{
		if (typeof userId === 'function') { callback = userId; userId = this._settings.id; }
		this._makeRequest(this.endpoints.api + '/ownership/hasasset', 'GET', {
			userId,
			assetId,
		}).then(r=>r.text()).then(t=>{
			let b = t.toLowerCase() === 'true' ? true : false;
			resolve(b);
			callback(b);
		});
	});
}