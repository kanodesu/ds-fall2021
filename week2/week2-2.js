// npm install cheerio


var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('/home/ec2-user/environment/week1data/m04.txt');

var $ = cheerio.load(content);

var address = [];


$('td').each(function(i, elem) {
    if ($(elem).attr("style") == "border-bottom:1px solid #e3e3e3; width:260px") {
        var MeetingAddress = {};
        MeetingAddress = $(elem).html().split('<br>')[2].trim().split(',')[0];
        address.push(MeetingAddress);
    }
});




fs.writeFileSync('/home/ec2-user/environment/week2/address04.json', JSON.stringify(address));