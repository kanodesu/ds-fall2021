"use strict";

/* global i*/
// dependencies
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

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('/home/ec2-user/environment/week3/m04-data.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});    
