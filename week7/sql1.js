const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});   

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wenqin';
db_credentials.host = 'data-structure.capqvcupmcpo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE aameetings (name varchar(200), group_name varchar(200), street_address varchar(200), note varchar(200), wheelchair_access varchar(10), days varchar(20), start_time varchar(20), end_time varchar(20), meeting_type varchar(50), special_interests varchar(200), location varchar(200),Latitude double precision, Longitude double precision);";
// Sample SQL statement to delete a table: 
//var thisQuery = "DROP TABLE meetings;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});