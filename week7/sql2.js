const fs = require('fs');
const { Client } = require('pg');
var async = require('async');  
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wenqin';
db_credentials.host = 'data-structure.capqvcupmcpo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

let addressesForDb = JSON.parse(fs.readFileSync('../week7/addgeo04.json'));

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aameetings VALUES (E'" + value.name + "', E'" + value.group_name + "', E'" + value.street_address + "', E'" + value.note + "', E'" + value.wheelchair_access + "', E'" + value.days + "', E'" + value.start_time + "', E'" + value.end_time + "', E'" + value.meeting_type + "', E'" + value.special_interests + "', E'" + value.location + "', " + value.lat + ", " + value.lng + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 500); 
}); 