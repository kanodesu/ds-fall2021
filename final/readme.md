## Final Projects

### Final Assignment 1: AA Map

This project aggregates previous weekly assignments, and all the data was parsed, cleaned and stored in the PostgreSQL. Then I used `Mapbox` to display relevant meetings as a map, and used `leaflet.js` to generate popups, filters, etc.


## Process
#### 01 Request data and save the body as a text file to my "local" environment `AWS Cloud9`. [week1](https://github.com/kanodesu/ds-fall2021/tree/master/week1data)
```javascript
(async () => {
	try {
		const response = await got('https://parsons.nyc/aa/m01.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m01.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
  ```
#### 02 Parsing Data with the addresses. [week2](https://github.com/kanodesu/ds-fall2021/tree/master/week2)
 ```javascript
$('td').each(function(i, ele) {
    if($(ele).attr("style")==='border-bottom:1px solid #e3e3e3; width:260px'){
        $(ele).find('h4').remove();
        $(ele).find('span').remove();
        $(ele).find('div').remove();
        $(ele).find('b').remove();
        address+=$(ele).text().trim('')+"\n";
    }
});
  ```
  
   #### 03 Request geolocation (lat, long) of each address through the Texas A&M Geoservices Geocoding APIs.  [week3](https://github.com/kanodesu/ds-fall2021/tree/master/week3)
 ```javascript
    (async () => {
    	try {
    		const response = await got(apiRequest);
    		let tamuGeo = JSON.parse(response.body);
    		console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
    		var tamuGeo2 = {
            address: value + ", New York" + ", NY",
            latLong: {
                lat: tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude,
                lng: tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude
            }
        };
    		meetingsData.push(tamuGeo2);
    	} catch (error) {
    		console.log(error.response.body);
    	}
    })();
  ```
  
   #### 04 SQL Schema design.  [week4](https://github.com/kanodesu/ds-fall2021/tree/master/week4)
I first used Excel to put all data from the first three rows of Zone 4. I decided to organize these data in four different tables, Group, Location, Meeting, and Type.

I used the Star Schema mode to do the schema design.(reference: [6 Database Schema Designs and How to Use Them](https://www.xplenty.com/blog/database-schema-examples/) ). 
I had the Meeting table in the middle as a "fact", and other three tables as "dimentions" which are descriptions of that fact.
![schema design](https://github.com/kanodesu/ds-fall2021/blob/master/week4/schema%20design.jpg "schema design")

   #### 05 Create a table, populate the table, and check the table.  [week4.2](https://github.com/kanodesu/ds-fall2021/tree/master/week4.2) [week7](https://github.com/kanodesu/ds-fall2021/tree/master/week7)
Create a table:
```javascript
var thisQuery = "CREATE TABLE aameetings (name varchar(200), group_name varchar(200), street_address varchar(200), note varchar(200), wheelchair_access varchar(10), days varchar(20), start_time varchar(20), end_time varchar(20), meeting_type varchar(50), special_interests varchar(200), location varchar(200),Latitude double precision, Longitude double precision);"; 
```
Populate the table:
```javascript
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
```
Check the table:
```javascript
var thisQuery = "SELECT * FROM aameetings;";

```
 #### 06 Final Steps
 This app uses `handlebars` and `npm express` to send data to the webpage. I select parameters from my PostgreSQL database:
```javascript
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
```
Then I used `mapbox` to set up the base-map layer:
```javascript
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'luw954/ckx4k706t33vn14plchghw3s6',
        accessToken: 'pk.eyJ1IjoibHV3OTU0IiwiYSI6ImNreDRqYjE0YTIxY3Uyc282Njc3N2dvMWUifQ.R3x7V8qBlbmLiS2BlOEw3w'
    }).addTo(mymap);
```
Create popups:
```javascript
for (var i=0; i<data.length; i++) {
        L.marker( [data[i].latitude, data[i].longitude] ).bindPopup("<h3>" + data[i].name + "</h3>" +"<b>Group: </b>" +  data[i].group_name + "<br><b>Location: </b>" +  data[i].street_address + "<br><b>Days: </b>" +  data[i].days + "<br /><b>Time: </b>" + data[i].start_time + "-" + data[i].end_time + "<br /> <b>Wheelchair: </b>" + data[i].wheelchair_access + "<br /> <b>Meeting Type: </b>" + data[i].meeting_type + "<br /> <b>Special Interests: </b>" + data[i].special_interests).addTo(mymap);
    }
```
Add a dropdown menu for filtering:
```javascript
<div id="filter" style="width:300px;">
      <label for="days">Select A Day: </label>
      <select name="days" id="days">
        <option value="Sundays">Sunday</option>
        <option value="Mondays">Monday</option>
        <option value="Tuesdays">Tuesday</option>
        <option value="Wednesdays">Wednesday</option>
        <option value="Thursdays">Thursday</option>
        <option value="Fridays">Friday</option>
        <option value="Saturdays">Saturday</option>
      </select>

      <button onclick="applyFilter()">Go</button>
    </div>
```
```javascript
    function filterData(days){
    var dd = [];

    for (let i=0; i<data.length; i++){
        if (data[i].days == days) {
          dd.push(data[i]);
        }
    }

    return dd;
  }
```

 #### 07 Final App
 ![01-1.png](https://github.com/kanodesu/ds-fall2021/blob/master/final/Screen%20Shot%202021-12-13%20at%2018.15.54.png "result.png")


### Final Assignment 2: Process Blog

This project aggregates previous weekly assignments, and is to record my sleep quality with wake up time, sleep time and the total hours that I slept each day.  

## Process
#### 01 NoSQL Schema design.  [week5](https://github.com/kanodesu/ds-fall2021/tree/master/week5)

![schema design](https://github.com/kanodesu/ds-fall2021/blob/master/week5/week5.png "schema design")

#### 02 Set `primary key` and `sort key`.  [week5.2](https://github.com/kanodesu/ds-fall2021/tree/master/week5.2)
I made some modifications for the contents in my blogs. I deleted the "title" part, and change the "mood" as a `string` to a `boolean` value called happy to show my mood for the day.

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
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week5.2/result1.png "result.png")
#### 03 Write into DynamoDB.  [week6](https://github.com/kanodesu/ds-fall2021/tree/master/week6)
I modified the primary key and sort key. Now I set my primary key as `user` which is my own name, and it won't change in my table, so I set the sort key as`date`. Then I can query data from a chosen time.

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

#### 04 Final Steps
This process blog recorded the time I slept, and the total hours. I requested all the days with the boolean "happy" = "ture".

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
```
And I create a table to store all the data.
```javascript
var myTable = '<table><thead><tr><th>user</th><th>date</th><th>happy</th><th>sleep_time</th><th>wake_up_time</th><th>total_hours</th></tr></thead><tbody>';

for (var i=0; i < data.length; i++) {
	myTable += '<tr class class="content">';
	myTable += '<td>' + data[i].user.S + '</td>';
	myTable += '<td>' + data[i].dt.N + '</td>';
	myTable += '<td>' + data[i].happy.BOOL + '</td>';
	myTable += '<td>' + data[i].wake_up_time.S + '</td>';
	myTable += '<td>' + data[i].sleep_time.S + '</td>';
	myTable += '<td>' + data[i].total_hours.N + '</td>';
	myTable += '</tr>';

}

myTable += '</body></table>'

$(window).on('load', function() {
  $("#myEntries").html(myTable)
});
```

 #### 07 Final App
 ![01-1.png](https://github.com/kanodesu/ds-fall2021/blob/master/final/Screen%20Shot%202021-12-13%20at%2018.15.13.png "result.png")
