## Weekly Assignment 6



### Assignment Part One:

For part one of this assignment, write and execute a SQL query for your AA data to filter meetings based on parameters that would make sense for your planned map.


### Process:

I query the data from table aalocations where address equals to `252 West 46th Street, New York, NY`.

```javascript
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


Here's my a screenshot of my final result:
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week6/result-1.png "result.png")

### Assignment Part Two:

For part two of this assignment, write and execute a NoSQL query for your Dear Diary data in DynamoDB to filter diary entries based on parameters that would make sense for your interface.

### Process:

I modified the primary key and sort key from last week. Now I set my primary key as `user` which is my own name, and it won't change in my table, so I set the sort key as`date`. Then I can query data from a chosen time.

```javascript
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


```

Here's my a screenshot of my final result:
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week6/result-new.png "result.png")



### Submission:
1. My `js` files: [week6-1.js](https://github.com/kanodesu/ds-fall2021/blob/master/week6/week6-1.js)  [week6-2-new.js](https://github.com/kanodesu/ds-fall2021/blob/master/week6/week6-2-new.js)  




