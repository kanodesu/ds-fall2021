## Weekly Assignment 6



### Assignment:
#### Part One: Write and execute a query for your AA data PostgreSQL

For part one of this assignment, write and execute a SQL query for your AA data to filter meetings based on parameters that would make sense for your planned map.



### Process:

I started with `starter code` provided by Aaron, and find out all the meetings that are held at the location '252 West 46th Street, New York, NY`.
```javascript
const { Client } = require('pg');
const cTable = require('console.table');
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

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
var thisQuery = "SELECT address, lat, long FROM aalocations WHERE address = '252 West 46th Street, New York, NY';";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
```


### Result:
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week6/result-1.png "result.png")


#### Part Two: Write and execute a query for your Dear Diary data DynamoDB

For part two of this assignment, write and execute a NoSQL query for your Dear Diary data in DynamoDB to filter diary entries based on parameters that would make sense for your interface.

### Process:

I modified the code in week5.2, and set my `user name` as the primary key, and `date` as the sort key. Since there is only one user in my table, I query the blogs by changing the date.

```javascript
var params = {
    TableName : "ProcessBlog3",
    KeyConditionExpression: "#usr = :user and dt between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
    "#usr" : "user"
    },
    ExpressionAttributeValues: { // the query values
        ":user": {S: "wenqin"},
        ":minDate": {N: new Date("Oct 04 2021").valueOf().toString()},
        ":maxDate": {N: new Date("Oct 11 2021").valueOf().toString()}
    }
};
```
### Result:
I only got a result like this. I think there might be some problems in my code, but I can't figure it out...
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week6/result-2.png "result.png")


### Submission:
1. My `js` files: [week6-1.js](https://github.com/kanodesu/ds-fall2021/blob/master/week6/week6-1.js)  [week6-2.js](https://github.com/kanodesu/ds-fall2021/blob/master/week6/week6-2.js)  
 





