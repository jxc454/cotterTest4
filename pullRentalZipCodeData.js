let _ = require('lodash');
let d3 = require('d3');
let $ = require('jquery');

module.exports = {
    pullRentalZipCodeData: function(){
        let datafile = require('./datafiles/bcRentalLicenses.json');
        let dt = null;

        let exportData = _.map(datafile.records, object=>{
            dt = new Date(object["Issue Date"]);
            return {
                // "series": 10*object["Zip Code"].substring(0, 4),
                "series": object["City"].toUpperCase().substring(0, 3),
                "month": dt.getFullYear() + '-' + _.padStart(1 + dt.getMonth(), 2, '0'),
                "fine": null
            }
        });
        return exportData;
    }
}