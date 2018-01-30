let _ = require('lodash');
let d3 = require('d3');
let $ = require('jquery');

let datafile = require('./datafiles/sampleNFLData.json');

console.log(_.uniq(_.map(datafile.records , object=>{return 10*object["Zip Code"].substring(0, 4);})).sort().length);

let test5 = () => Object.keys(datafile).map(k => k);