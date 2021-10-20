// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

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
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});