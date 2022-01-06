import fetch from 'node-fetch';
import dotenv from "dotenv";
dotenv.config();

//Elegant recursive print function for outputting full JSON array with nested arrays 
function print(data) {
	for (var key in data) {
		if (data[key] == null) {
			console.log("\t".repeat(data.depth) + key + ": " + data[key]);
		}
		else if (typeof(data[key]) == 'object') {
			data[key].depth = data.depth +1;
			console.log("\t".repeat(data.depth) + key + " {");
			print(data[key]);
			console.log("\t".repeat(data.depth) + "}");
		}
		else if (key != "depth") {
				console.log("\t".repeat(data.depth) + key + ": " + data[key]);
		}
	}
}

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
		json.depth = 0;
		print(json);})
} catch (error) {
	console.log(error);
}
