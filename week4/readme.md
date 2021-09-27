## Weekly Assignment 4



#### Assignment:
Using the Hills text as a starting point (but feel free to strike out on your own), draw a data model for the AA meetings data to be stored in a database. Include all the content/data/variables from the source file that you believe to be relevant, even if you haven't parsed it yet. Upload an image (`png` format) of your drawing to your GitHub repository.

Using Excel, populate a dummy table(s) with ***ALL*** the data from the first three rows of the AA zone you have been working with. If you decide to organize this into multiple tables, create multiple tabs in the spreadsheet and make it clear how the tables would relate to each other. 


#### Process:
I first used Excel to put all data from the first three rows Of Zone 4. I decided to organize these data in four different tables, Group, Location, Meeting, and Type.

I used the Star Schema mode to do the schema design.(reference: [6 Database Schema Designs and How to Use Them](https://www.xplenty.com/blog/database-schema-examples/) ). 
I had the Meeting table in the middle as a "fact", and other three tables as "dimentions" which are descriptions of that fact.
![schema design](https://github.com/kanodesu/ds-fall2021/blob/master/week4/schema%20design.jpg "schema design")

#### Submission:
1. My `xlsx` file: [DummyData.xlsx](https://github.com/kanodesu/ds-fall2021/blob/master/week4/DummyData.xlsx)
1. My schema design: [schema design.jpg](https://github.com/kanodesu/ds-fall2021/blob/master/week4/schema%20design.jpg)

