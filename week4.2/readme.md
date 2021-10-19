## Weekly Assignment 4.2



### Assignment:
#### Part 4.2a: Create a table(s) in your database

Modify the following starter code to replace the database credentials with your own. It includes two SQL sample statements that you can modify to accomplish any of the following tasks in your new database, with the help of the `pg` module in Node:  

1. Create a new table.  
2. Remove (delete!) a table.  


#### Part 4.2b: Populate your database

Use the [`pg` module](https://node-postgres.com/) in Node to insert your AA data in the database you created. Hint: check to make sure you have the correct number of rows! **Note: it is not expected that this data be complete and clean yet. For now, just insert the documents/data you have.**  

#### Part 4.2c: Check your work

To see what's in your new database table, let's query all of its contents: 


### 4.1:
My schema design:
![schema](https://github.com/kanodesu/ds-fall2021/blob/master/week4/schema%20design.jpg "schema")

My `xlsx` file: [DummyData.xlsx](https://github.com/kanodesu/ds-fall2021/blob/master/week4/DummyData.xlsx)

### 4.2:

I started with `starter code` provided by Aaron, and created a table, populated some data, and finally checked it.
```javascript
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
var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
```


### Result:
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week4.2/result.png "result.png")

### Submission:
1. My `js` files: [week4a.js](https://github.com/kanodesu/ds-fall2021/blob/master/week4.2/week4a.js)  [week4b.js](https://github.com/kanodesu/ds-fall2021/blob/master/week4.2/week4b.js)  [week4c.js](https://github.com/kanodesu/ds-fall2021/blob/master/week4.2/week4c.js)
 




