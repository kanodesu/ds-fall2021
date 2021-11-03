## Weekly Assignment 7



### Assignment:

Finish parsing and cleaning the rest of the data in your assigned "zone" (the zone that corresponds with the last digit of your student ID number) and all other zones, and update/replace your PostgreSQL table(s) with the new data. This should include all the data you need for the final map in Final Assignment 1.



### Process:

I first go back to `week2`, and clean up all the HTML files in the AA dataset with needed information, and write it into a new `json`file.
```javascript
var newmeeting = [];
    meetings.forEach((meetingset, i) => {
        var meetings2 = meetingset.split('\n').map((mtext) => {
            var meeting3 = {};
            meeting3.address = address[i] + ", New York, NY";
            meeting3.name = addresses[i].split('</h4>')[0].split('>')[1].replace('<br>', '').trim();
            meeting3.group_name = (addresses[i].split('\n')[1].startsWith('<b>') ? addresses[i].split('\n')[1].split('</b>')[0].split('<b>')[1].split('-')[0].trim() : '');
            meeting3.street_address = addresses[i].split('\n').slice(2, 4).join('').replace(',', ', ').replace('  ', ' ').replace('<br>', '').trim();
            meeting3.note = (addresses[i].includes('detailsBox') ? addresses[i].split('"detailsBox">')[1].split('</div')[0].replace('\n', '').replace('<br>', '').trim() : '');
            meeting3.wheelchair_access = (addresses[i].includes('wheelchair') ? true : false);
            meeting3.days = mtext.split(' ')[0].trim();
            meeting3.start_time = mtext.split('From')[1].split('to')[0].trim();
            meeting3.end_time = mtext.split('to')[1].trim().split(' ').slice(0, 2).join(' ').trim();
            meeting3.meeting_type = (mtext.includes('Type') ? mtext.split('Type')[1].trim().split('Special')[0].trim() : '');
            meeting3.special_interests = (mtext.includes('Special Interest') ? mtext.split('Special Interest')[1].trim() : '');
            return meeting3; 
        });

        meetings2.forEach((meeting3) => {
            newmeeting.push(meeting3);
        });
    });

    fs.writeFileSync('../week7/meeting04.json', JSON.stringify(newmeeting));

```
Then I need to add the geo locations for these addressed. The process is similar to `week3`.
```javascript
    request(apiRequest, function(err, resp, body) {
        if (err){ throw err; }

        let tamuGeo = JSON.parse(body);
        
        d.location = tamuGeo.InputAddress.StreetAddress;

        d.lat = tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude;
        d.lng = tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude;
        delete d.address;
        console.log(d);
        meetingsData.push(d);
    });
  
    setTimeout(callback, 500);
}, function() {
    fs.writeFileSync('../week7/addgeo04.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});  
```
Finally, I repear the processes in `week4a` to create a new table `aameetings` in RDS, and then add the data into the table, and also check the table.
```javascript
var thisQuery = "CREATE TABLE aameetings (name varchar(200), group_name varchar(200), street_address varchar(200), note varchar(200), wheelchair_access varchar(10), days varchar(20), start_time varchar(20), end_time varchar(20), meeting_type varchar(50), special_interests varchar(200), location varchar(200),Latitude double precision, Longitude double precision);"; 
```

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

```javascript
var thisQuery = "SELECT * FROM aameetings;";

```

Here's my a screenshot of my final result:
![result.png](https://github.com/kanodesu/ds-fall2021/blob/master/week7/Screen%20Shot.png "result.png")



### Submission:
1. My `js` files: [clean.js](https://github.com/kanodesu/ds-fall2021/blob/master/week7/clean.js)  [addgeo.js](https://github.com/kanodesu/ds-fall2021/blob/master/week7/addgeo.js)  [sql1.js](https://github.com/kanodesu/ds-fall2021/blob/master/week7/sql1.js)  [sql2.js](https://github.com/kanodesu/ds-fall2021/blob/master/week7/sql2.js)  [sql3.js](https://github.com/kanodesu/ds-fall2021/blob/master/week7/sql3.js) 
 
 1. My `json` files: [address04.json](https://github.com/kanodesu/ds-fall2021/blob/master/week7/address04.json)  [meeting04.json](https://github.com/kanodesu/ds-fall2021/blob/master/week7/meeting04.json)  [addgeo04.json](https://github.com/kanodesu/ds-fall2021/blob/master/week7/addgeo04.json) 

 1. My `json` files for other zones: [other zones](https://github.com/kanodesu/ds-fall2021/tree/master/week7/other%20zones)  




