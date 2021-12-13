var express = require('express'), 
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone');
const handlebars = require('handlebars');
var fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});  

//const indexSource = fs.readFileSync("templates/sensor.txt").toString();
//var template = handlebars.compile(indexSource, { strict: true });

const aaSource = fs.readFileSync("templates/aa.txt").toString();
var aatemplate = handlebars.compile(aaSource, { strict: true });

const pbSource = fs.readFileSync("templates/pb.txt").toString();
var pbtemplate = handlebars.compile(pbSource, { strict: true });

// AWS RDS credentials
//var db_credentials = new Object();
//db_credentials.user = process.env.AWSRDS_UN;
//db_credentials.host = process.env.AWSRDS_HT; 
//db_credentials.database = process.env.AWSRDS_DB;
//db_credentials.password = process.env.AWSRDS_PW;
//db_credentials.port = 5432;

var db_credentials = new Object();
db_credentials.user = 'wenqin';
db_credentials.host = 'data-structure.capqvcupmcpo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <link rel="stylesheet" href="css/styles.css?v=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
       integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
       crossorigin=""/>
</head>
<body>
<div id="mapid"></div>
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>
  <script>
  var data = 
  `;
  
var jx = `;
    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoibHV3OTU0IiwiYSI6ImNreDRqYjE0YTIxY3Uyc282Njc3N2dvMWUifQ.R3x7V8qBlbmLiS2BlOEw3w'
    }).addTo(mymap);

    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].lon] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
    </script>
    </body>
    </html>`;


app.get('/', function(req, res) {
    res.send('<h3>Code demo site</h3><ul><li><a href="/aa">aa meetings</a></li><li><a href="/processblog">process blog</a></li></ul>');
}); 

// respond to requests for /aa
app.get('/aa', function(req, res) {


    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = `SELECT latitude, longitude, name, group_name, street_address, note, wheelchair_access, days, start_time, end_time, meeting_type, special_interests, location
                 FROM aameetings 
                 GROUP BY latitude, longitude, name, group_name, street_address, note, wheelchair_access, days, start_time, end_time, meeting_type, special_interests, location
                 ;`;


    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            res.send(aatemplate({ aadata: JSON.stringify(qres.rows)}));
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});



app.get('/processblog', function(req, res) {
    // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";
    console.log(req.query.type);
    
    var happy = "true";
    if (["true", "false"].includes(req.query.type)) {
        happy = req.query.type;
    }

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    // DynamoDB (NoSQL) query
var params = {
    TableName : "ProcessBlog3",
    KeyConditionExpression: "#usr = :user and dt between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
    "#usr" : "user"
    },
    ExpressionAttributeValues: { // the query values
        ":user": {S: "Wenqin"},
        ":minDate": {N: new Date("Oct 04 2021").valueOf().toString()},
        ":maxDate": {N: new Date("Oct 11 2021").valueOf().toString()}
    }
};

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            throw (err);
        }
        else {
            console.log(data.Items);
            res.end(pbtemplate({ pbdata: JSON.stringify(data.Items)}));
            console.log('3) responded to request for process blog data');
        }
    });
});

// serve static files in /public
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// listen on port 8080
var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Server listening...');
});