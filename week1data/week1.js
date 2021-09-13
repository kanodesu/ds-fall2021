// npm install got
// mkdir data

const fs = require('fs');
const got = require('got');

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
	
	try {
		const response = await got('https://parsons.nyc/aa/m02.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m02.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m03.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m03.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m04.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m04.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m05.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m05.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m06.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m06.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m07.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m07.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m08.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m08.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m09.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m09.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
		try {
		const response = await got('https://parsons.nyc/aa/m10.html');
		console.log(response.body);
		fs.writeFileSync('/home/ec2-user/environment/week1data/m10.txt', response.body);
		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
	
	
})();

