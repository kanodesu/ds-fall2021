const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

var cheerio = require('cheerio');

var content = fs.readFileSync('../week1data/m04.txt');
var $ = cheerio.load(content);

var address = [];


$('td').each(function(i, elem) {
    if ($(elem).attr("style") == "border-bottom:1px solid #e3e3e3; width:260px") {
        var MeetingAddress = {};
        MeetingAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        address.push(MeetingAddress);
    }
});

    fs.writeFileSync('../week7/address04.json', JSON.stringify(address));
    

   
    var meetings = $('td[style="border-bottom:1px solid #e3e3e3;width:350px;"]') 
        .map((i, elem) => $(elem).text()
            .split("\n")
            .map(x => x.trim())
            .filter(x => x.length > 0)
            .join('\n'))
        .get();


    var addresses = $('h4').slice(2)    
        .map((i, elem) => $(elem.parentNode).html()
            .split("\n")
            .map(x => x.trim())
            .filter(x => x.length > 0)
            .join('\n')
            .replace('<br>', ''))
        .get();

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
