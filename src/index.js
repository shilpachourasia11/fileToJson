import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require('babel-polyfill');
import rp from 'request-promise';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
		getData();
	});
});

const getData = async () => {
	const dbData = await fetchFileFromUrl();
	let data = dbData.split('\n');
	let allLabels = data[0].split(',');
	let jsonItem = {};
	let allData= [];
	data.map((item,index)=>{
		if(index > 0){
			let	rowItems = item.split(',');
			rowItems.map((rowData, labelIndex) => {
				jsonItem[allLabels[labelIndex]] = rowData;
			})
			// console.log(jsonItem);
			allData.push(jsonItem);
		}
	})
	console.log(allData);
}

const fetchFileFromUrl = async () => {
	let url = 'https://www.bijandiamonds.com/uploads/Rapnet.txt';
	const data = await rp.get(url);
	return data;
}

export default app;
