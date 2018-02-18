let _ = require('lodash');
let d3 = require('d3');
let $ = require('jquery');
import spring from 'react-motion';
import ride from 'react-move';

let datafile = require('./datafiles/sampleNFLData.json');

_.keys(datafile['2012020500'].home.stats).forEach(v => console.log(v));
