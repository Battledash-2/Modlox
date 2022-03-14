module.exports = ()=>function (callback=()=>{}) {
	return new Promise(resolve=>{
		this._makeRequest(this.endpoints.api + '/currency/balance', 'GET').then(data=>data.json()).then(result=>{
			resolve(result.robux);
			callback(result.robux);
		});
	});
}