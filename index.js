const https = require('https');
const { existsSync, unlinkSync, appendFileSync } = require('fs');

const DATA_URL = 'https://jsonplaceholder.typicode.com/users';
const CSV_PATH = 'users.csv';

class CsvLineItem {
	constructor(
		name = null,
		username = null,
		email = null,
		street = null,
		suite = null,
		city = null,
		zipcode = null,
		phone = null,
		company = null
	) {
		this.name = name;
		this.username = username;
		this.email = email;
		this.street = street;
		this.suite = suite;
		this.city = city;
		this.zipcode = zipcode;
		this.phone = phone;
		this.company = company;
	}

	writeToCsv = () => {
		const csv = `${this.name},${this.username},${this.email},${this.street},${this.suite},${this.city},${this.zipcode},${this.phone},${this.company}\n`;

		try {
			appendFileSync(CSV_PATH, csv);
		} catch (err) {
			console.error(err);
		}
	};
}

const writeCsvHeaders = () => {
	const csvHeaders = new CsvLineItem(
		'Name',
		'Username',
		'Email Address',
		'Street Address',
		'Address Line 2',
		'City',
		'Zip Code',
		'Phone Number',
		'Company Name'
	);
	csvHeaders.writeToCsv();
};

const createUserData = async (data) => {
	let users = [];
	data.forEach((user) => {
		const item = new CsvLineItem(
			user.name,
			user.username,
			user.email,
			user.address.street,
			user.address.suite,
			user.address.city,
			user.address.zipcode,
			user.phone,
			user.company.name
		);
		users = [...users, item];
	});
	return users;
};

const writeData = async (userData) => {
	const data = await userData;
	if (existsSync(CSV_PATH)) unlinkSync(CSV_PATH);
	writeCsvHeaders();
	data.forEach((item) => item.writeToCsv());
};

https.get(DATA_URL, (res) => {
	let body = '';
	res.on('data', (chunk) => (body += chunk));
	res.on('end', () => {
		try {
			json = JSON.parse(body);
			const userData = createUserData(json);
			writeData(userData);
		} catch (err) {
			console.error(err);
			process.exit(1);
		}
	});
});
