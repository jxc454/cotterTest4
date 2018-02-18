let _ = require('lodash');
let d3 = require('d3');
let $ = require('jquery');

let x = function(){
    // require('./parkingStackedBar').parkingStackedBar();
    require('./speedCamerasLine').speedCamerasLine(()=>{});
    // require('./rentalZipCodeStackedBar').rentalZipCodeStackedBar(()=>{});
    // require('./homicideStackedBar').homicideStackedBar(()=>{});
}();
