var fs = require('fs');
var _ = require('lodash');

module.exports = {
    pullSpeedCameraData: function(){
        let d3Data = [];

        // get files
        _.forEach(require('./datafiles/speedCameras.json').data, citation=>{
            d3Data.push({
                datetime: new Date(citation[18]),
                series: citation[14],
                fine: citation[19]
            });
        });
        return d3Data;
    }
}
