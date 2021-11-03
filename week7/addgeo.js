"use strict";

/* global i*/
// dependencies
//npm install async dotenv querystring
const fs = require('fs'),
      querystring = require('querystring'),
      got = require('got'),
      async = require('async'),
      dotenv = require('dotenv'),
      request = require('request');
      
// TAMU api key
dotenv.config({path: '../.env'});
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx';



// geocode addresses
let meetingsData = [];
let addresses = JSON.parse(fs.readFileSync('../week7/meeting04.json'));

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, (d,callback) => {
    let query = {
        streetAddress: d.address,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

  // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);
    
    
    request(apiRequest, function(err, resp, body) {
        if (err){ throw err; }

        let tamuGeo = JSON.parse(body);
        
        d.location = tamuGeo.InputAddress.StreetAddress;

        d.lat = tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude;
        d.lng = tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude;
        delete d.address;
        console.log(d);
        meetingsData.push(d);
    });
  
    setTimeout(callback, 500);
}, function() {
    fs.writeFileSync('../week7/addgeo04.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});    

