let _ = require('lodash');
let d3 = require('d3');
let $ = require('jquery');

module.exports = {
    pullHomicideData: function(){
        let datafile = require('./datafiles/homicide20132014.json');
        let dt = null;

        let exportData = _.map(datafile.data, homicide=>{
            dt = new Date(homicide[9]);
            return {
                "series": homicide[14].toUpperCase(),
                // "month": dt.getFullYear() + '-' + _.padStart(1 + dt.getMonth(), 2, '0'),
                "month": dt.getDate(),
                "fine": null
            }
        });
        return exportData;
    }
}