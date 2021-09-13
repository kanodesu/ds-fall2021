### Weekly Assignment 2

#### Assignment:
1. UUsing Node.js, read the assigned AA text file that you wrote for last week's assignment. Store the contents of the file in a variable.
1. Ask yourself, "why are we reading this from a saved text file instead of making another http request?"
3. Study the HTML structure of this file and began to think about how you might parse it to extract the relevant data for each meeting. Using this knowledge about its structure, write a program in Node.js that will write a new text file that contains the street address for **every** row in the table of meetings in your assigned AA file. Make a decision about the [data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures) you want to use to store this data in a file, knowing that you'll be working with this data again later. 

4. Update your GitHub repository with the relevant file(s); this should include a `.js` file(s) with your code and a `.txt` or other format file(s) with the addresses, plus a `md` file with your documentation. In Canvas, submit the URL of the specific location of this work within your `data-structures` GitHub repository. **Note: this should be in a directory that contains only your work for this week.** 

#### Process:
I first studied the HTML structure of this file, and found out all the addresses are under the tag `td`
```html
  <td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
                    	<h4 style="margin:0;padding:0;">Saint Thomas Church</h4><br />
				  	    <b>ADVENTURES IN SOBRIETY - </b><br />
						1 West 53rd Street, 3rd Floor, Andrew Hall, 
						<br />(Betw 5th & 6th Avenues) 10019
						<br />
						<br />
                        
                        <div class="detailsBox"> 
                        	Gay & Lesbian Focus.  All are welcome. 
                        </div>
                         
						<span style="color:darkblue; font-size:10pt;">
                        <img src="../images/wheelchair.jpg" alt="Wheelchair Access" width="20" vspace="5" hspace="10" align="absmiddle"/>Wheelchair access
                        </span>
			  			
						
                    </td>  
```
Then I used the starter code provided by Aaron to get all the elements in `td`
```javascript
var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('/home/ec2-user/environment/week1data/m04.txt');

var $ = cheerio.load(content);

var address = '';

$('td').each(function(i, ele) {
    if($(ele).attr("style")==='border-bottom:1px solid #e3e3e3; width:260px'){
        address+=$(ele).text().trim('')+"\n";
    }
});
```
But in this code, I got everything. I only need the addresses, so I need to get rid of the text under `span`, `h4`, `div`, and `b`. I spent a lot of time here, and finally I tried to `.find` these tags (`span`, `h4`, `div`, and `b`) under the tag `td` and `.romove` them.
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
Finally, I wrote the result into a text file `txt`
```javascript
fs.writeFileSync('/home/ec2-user/environment/week2/address04.txt', address);
```

#### Submission:
1. My `js` file: [week2.js](https://github.com/kanodesu/ds-fall2021/blob/master/week2/week2.js)
1. My `txt` file: [address04.txt](https://github.com/kanodesu/ds-fall2021/blob/master/week2/address04.txt)
1. My repository `URL` : [week2](https://github.com/kanodesu/ds-fall2021/tree/master/week2)
