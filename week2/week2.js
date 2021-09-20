// npm install cheerio


var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('/home/ec2-user/environment/week1data/m04.txt');

var $ = cheerio.load(content);

var address = '';

$('td').each(function(i, ele) {
    if($(ele).attr("style")==='border-bottom:1px solid #e3e3e3; width:260px'){
        $(ele).find('h4').remove();
        $(ele).find('span').remove();
        $(ele).find('div').remove();
        $(ele).find('b').remove();
        address+=$(ele).html().split('<br>')[2].trim().split(',')[0];
        
    }
});

$.html();



fs.writeFileSync('/home/ec2-user/environment/week2/address04.txt', address);