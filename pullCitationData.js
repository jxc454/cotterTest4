var fs = require('fs');
var _ = require('lodash');

module.exports = {
    pullCitationData: function(callback){
        let d3Data = [];

        // get files
        fs.readdir('./citations', (err, filenames)=>{
            _.forEach(filenames, file=>{
                _.forEach(require('./citations/' + file).data, citation=>{
                    d3Data.push({
                        month: getDateFromEpoch(citation[3]).getFullYear() + '-' + _.padStart(_.add(1, getDateFromEpoch(citation[3]).getMonth()).toString(), 2, '0'),
                        offense: citation[8],
                        fine: citation[9]
                    });
                });
            });
            callback(d3Data);
        });
    }
}

// helper(s)
function getDateFromEpoch(epoch){
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    return d;
}