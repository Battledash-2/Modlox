class Client {
	constructor(token: String, xsrf: String): void;
	_makeRequest(location: String, method: String, body: Object, headers: Object): Promise;
	
	// Any functions added via the 'client' folder should be added here
	/**
	 * @description This function is called when the client is ready
	 */
	onready(): void;
	/**
	 * @description A preloaded JSON object from the 'settings.get' function
	 */
	_settings: Object;
	settings: {
		get(callback?: (response: Object)=>{}): Promise<Object>;
	}
	thumbnail: {
		/**
		 * 
		 * @param size A string of 2 numbers seperated by an 'x' (<width>x<height>)
		 * @returns A URL to the image
		 */
		full(size: String, callback?: (response: String)=>{}): Promise<String>;
		/**
		 * 
		 * @param size A string of 2 numbers seperated by an 'x' (<width>x<height>)
		 * @returns A URL to the image
		 */
		bust(size: String, callback?: (response: String)=>{}): Promise<String>;
		/**
		 * 
		 * @param size A string of 2 numbers seperated by an 'x' (<width>x<height>)
		 * @returns A URL to the image
		 */
		headshot(size: String, callback?: (response: String)=>{}): Promise<String>;
	}
}

export function login(token: String): Client;