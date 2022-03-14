module.exports = function (size='48x48', format='Png', cb=()=>{}) {
	return new Promise(resolve=>{
		this._makeRequest(this.endpoints.thumbnails + '/v1/users/avatar-headshot', 'GET', {
			userIds: this._settings.id,
			size,
			format,
			isCircular: false,
		}).then(d=>d.json()).then(json=>{
			if (!json['data'] || json['data']['length'] < 1) { cb(json); return resolve(json); };
			const url = json.data[0].imageUrl;
			cb(url);
			resolve(url);
		});
	});
}