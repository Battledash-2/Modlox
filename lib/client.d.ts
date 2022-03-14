declare class Client {
	constructor(token: String, xsrf: String);
	_makeRequest(location: String, method: String, body: Object, headers: Object): Promise<any>;
	
	// Any functions added via the 'client' folder should be added here
	/**
	 * @description This function is called when the client is ready
	 */
	onready(): void;
	/**
	 * @description A preloaded JSON object from the 'settings.get' function
	 */
	_settings: Object;

	user: {
		/**
		 * @param {Number} page Page
		 * @returns {Array} A list of the user's friends
		 */
		friends(page: Number, callback?: (response: Array<Object>)=>{}): Promise<Array<Object>>;
		/**
		 * @returns {Object} Object with the user information
		 */
		settings(callback?: (response: Object)=>{}): Promise<Object>;
		/**
		 * @returns {Boolean}
		 */
		hasasset(assetId: Number, userId?: Number, callback?: (response: Boolean)=>{}): Promise<Boolean>;
		/**
		 * @param {String} userName The user name
		 * @returns {Number} Returns a user id from a given user name
		 */
		fromname(userName: String, callback?: (response: Number)=>{}): Promise<Number>;
		/**
		 * @param {Number|String} userId The user id or name
		 * @returns {Object} Returns an object of user data from the given id or username
		 */
		get(userId: String|Number, callback?: (response: Number)=>{}): Promise<Object>;
		/**
		 * @param {Number|String} userId The user id or name
		 * @returns {Object} Returns an object
		 */
		block(userId: String|Number, callback?: (response: Number)=>{}): Promise<Object>;
		/**
		 * @param {Number|String} userId The user id or name
		 * @returns {Object} Returns an object
		 */
		unblock(userId: String|Number, callback?: (response: Number)=>{}): Promise<Object>;
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

		currency: {
			/**
			 * @returns An integer of how many Robuk(x) the user has
			 */
			balance(callback?: (response: Number)=>{}): Promise<Number>;
		}
	}
}

export function login(token: String): Client;