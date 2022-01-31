import fetch from 'node-fetch';
import dotenv from "dotenv";
dotenv.config();

class HTTPResponseError extends Error {
	constructor(response) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`);
		this.response = response;
	}
}
function checkStatus(response)  {
	if (response.ok) {
		// response.status >= 200 && response.status < 300
		return response;
	} else {
		throw new HTTPResponseError(response);
	}
}
const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10&convert=USD',
{method: 'GET',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
	'Accept': 'application/json',
	'Accept-Encoding': 'deflate, gzip'
  }});

try {
    checkStatus(response);
    response.json().then(json => {
		console.log(JSON.stringify(json, null, 2));})
} catch (error) {
	console.log(error);
}
