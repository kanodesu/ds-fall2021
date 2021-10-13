const async = require('async');


var blogEntries = [];

class BlogEntry {
  constructor(primaryKey, user, date, happy, wake_up_time, sleep_time, total_hours) {
    this.pk = {};
    this.pk.S = primaryKey;
    this.user = {};
    this.user.S = user;
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.happy = {};
    this.happy.BOOL = happy;  
    this.wake_up_time = {};
    this.wake_up_time.S = wake_up_time; 
    this.sleep_time = {};
    this.sleep_time.S = sleep_time; 
    this.total_hours = {};
    this.total_hours.N = total_hours.toString();
  }
}

blogEntries.push(new BlogEntry("Blog 001", "Wenqin", 'Oct 03 2021', false, "10:00am", "03:00am", 7));
blogEntries.push(new BlogEntry("Blog 002", "Wenqin", "Oct 04 2021", true, "10:00am", "02:00am", 8));
blogEntries.push(new BlogEntry("Blog 003", "Wenqin", "Oct 05 2021", true, "08:00am", "01:00am", 7));
blogEntries.push(new BlogEntry("Blog 004", "Wenqin", "Oct 11 2021", true, "11:30am", "03:30am", 8));

console.log(blogEntries);


var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();


async.eachSeries(blogEntries, function(value, callback) {
  var params = {};
  params.Item = value; 
  params.TableName = "ProcessBlog";
  dynamodb.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    });  
    
  setTimeout(callback, 1000); 
});
