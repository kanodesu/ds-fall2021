### Weekly Assignment 3



#### Assignment:
1. Continue work on the file you parsed in Weekly Assignment 2. If you haven't already, organize your data into a mixture of Objects and Arrays that can be [‘parsed’ and ‘stringified’](https://nodejs.org/en/knowledge/javascript-conventions/what-is-json/) as [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) so that it will be easier to access the data for your work on this assignment. Since you’ll be assembling a list of many results, your best bet is to first create an (empty) array and then add items to it one at a time. You can use the Array object’s [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method for this.
1. Write a script that makes a request to the [Texas A&M Geoservices Geocoding APIs](http://geoservices.tamu.edu/Services/Geocode/WebService/) for each address, using the address data you parsed in Weekly Assignment 2. You'll need to do some work on the address data (using code!) to prepare them for the API queries. For example, the parsed value `50 Perry Street, Ground Floor,` should be modified to `50 Perry Street, New York, NY`. The addresses are messy and may yield weird results from the API response. Don't worry too much about this right now. But, start to think about it; in a later assignment we'll have to clean these up.  
3. Your final output should be a `.json` **file** that contains an **array** that contains an **object** for each meeting (which may or may not nest other arrays and objects). The array should have a length equal to the number of meetings. Each object should hold the relevant data for each meeting. For now, we're focusing on the addresses and geographic coordinates. 


#### Process:
I first changed my code from last week, and organized all my data into Arrays. I saved them in a new text file [address04.json](https://github.com/kanodesu/ds-fall2021/blob/master/week2/address04.json).

Then I used the starter code provided by Aaron to install npm `async` `dotenv` and `querystring`, and got all the geocode addresses by using `JSON.parse` the text file [address04.json](https://github.com/kanodesu/ds-fall2021/blob/master/week2/address04.json).
```js
//npm install async dotenv querystring
const fs = require('fs'),
      querystring = require('querystring'),
      got = require('got'),
      async = require('async'),
      dotenv = require('dotenv');
      
// TAMU api key
dotenv.config({path: '../.env'});
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx';

// geocode addresses
let meetingsData = [];
let addresses = JSON.parse(fs.readFileSync('/home/ec2-user/environment/week2/address04.json'));
```
For the next step, I tried to use the starter code first to make a request to the [Texas A&M Geoservices Geocoding APIs](http://geoservices.tamu.edu/Services/Geocode/WebService/) for each address, but I got a lot of other information.
```js
// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

  // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    (async () => {
    	try {
    		const response = await got(apiRequest);
    		let tamuGeo = JSON.parse(response.body);
    		console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
    		meetingsData.push(tamuGeo);
    	} catch (error) {
    		console.log(error.response.body);
    	}
    })();
```
And my result showed:
```js
{
	"version" : "4.10",
	"TransactionId" : "44500a14-47ed-4d92-b39e-2445642528e2",
	"Version" : "4.1",
	"QueryStatusCodeValue" : "200",
	"FeatureMatchingResultType" : "Success",
	"FeatureMatchingResultCount" : "1",
	"TimeTaken" : "0.0156291",
	"ExceptionOccured" : "False",
	"Exception" : "",
	"InputAddress" :
		{
		"StreetAddress" : "252 West 46th Street ",
		"City" : "New York",
		"State" : "NY",
		"Zip" : ""
		},
	"OutputGeocodes" :
	[
		{
		"OutputGeocode" :
			{
			"Latitude" : "40.6639307188879",
			"Longitude" : "-73.9382749875207",
			"NAACCRGISCoordinateQualityCode" : "11",
			"NAACCRGISCoordinateQualityType" : "CityCentroid",
			"MatchScore" : "50",
			"MatchType" : "Relaxed;Soundex",
			"FeatureMatchingResultType" : "Success",
			"FeatureMatchingResultCount" : "1",
			"FeatureMatchingGeographyType" : "City",
			"RegionSize" : "1213369809.72834",
			"RegionSizeUnits" : "Meters",
			"MatchedLocationType" : "LOCATION_TYPE_CITY",
			"ExceptionOccured" : "False",
			"Exception" : "",
			"ErrorMessage" : ""
			}
		}
	]
}
```
I only needed the `"StreetAddress"`, `"Latitude"`, and `"Longitude"` part, so I set a new Array, and write only address and latLong into it. Because the `"InputAddress" :
		{
		"StreetAddress" : "252 West 46th Street ",
		"City" : "New York",
		"State" : "NY",
		"Zip" : ""
		},` should be modified to `"252 West 46th Street, New York, NY "`, and `"New York, NY"` is the solid answer for each address, I wrote the 'address' into `value + ", New York" + ", NY",`.
```js
    (async () => {
    	try {
    		const response = await got(apiRequest);
    		let tamuGeo = JSON.parse(response.body);
    		console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
    		var tamuGeo2 = {
            address: value + ", New York" + ", NY",
            latLong: {
                lat: tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude,
                lng: tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude
            }
        };
    		meetingsData.push(tamuGeo2);
    	} catch (error) {
    		console.log(error.response.body);
    	}
    })();
```
Then my result was correct:
```js
{
	"address": "252 West 46th Street, New York, NY",
	"latLong": {
		"lat": "40.7591895426735",
		"lng": "-73.9867385774772"
	}
}, {
	"address": "303 West 42nd Street, New York, NY",
	"latLong": {
		"lat": "40.7573472021927",
		"lng": "-73.9898278386809"
	}
},
```
Finally, I wrote the result into a text file `json`
```javascript
fs.writeFileSync('/home/ec2-user/environment/week3/m04-data.json', JSON.stringify(meetingsData));
```

#### Submission:
1. My `js` file: [week3.js](https://github.com/kanodesu/ds-fall2021/blob/master/week3/week3.js)
1. My `txt` file: [m04-data.json](https://github.com/kanodesu/ds-fall2021/blob/master/week3/m04-data.json)
1. My repository `URL` : [week3](https://github.com/kanodesu/ds-fall2021/tree/master/week3)
