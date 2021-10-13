## Weekly Assignment 5.2



### Assignment:
Using Amazon Web Services to create a table in Amazon DynamoDB, a NoSQL database service.

Create some data for the table in your database.

Use the AWS SDK for JavaScript to work with your DynamoDB table in Node.js. Install with:
`npm install aws-sdk`


### 5.1:
I decided to make a blog to record my sleep quality with wake up time, sleep time and the total hours that I slept each day.
![(non)schema](https://github.com/kanodesu/ds-fall2021/blob/master/week5/week5.png "(non)schema")

My `word` file: [01.docx](https://github.com/kanodesu/ds-fall2021/blob/master/week5/01.docx)  [02.docx](https://github.com/kanodesu/ds-fall2021/blob/master/week5/02.docx) [03.docx](https://github.com/kanodesu/ds-fall2021/blob/master/week5/03.docx)

### 5.2:
I made some modifications for the contents in my blogs. I deleted the "title" part, and change the "mood" as a `string` to a `boolean` value called happy to show my mood for the day.

I started with `starter code` provided by Aaron, and created some data in my table.
```javascript
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
```

I used `async.eachSeries` method to create a loop to get all the objects at once.
```javascript
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
```

### Result:
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week5.2/result.png "result.png")

### Submission:
1. My `js` file: [week5.js](https://github.com/kanodesu/ds-fall2021/blob/master/week5.2/week5.js) [03.docx](https://github.com/kanodesu/ds-fall2021/blob/master/week5/03.docx)
2. The `screenshot` of my table: [result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week5.2/result.png)



