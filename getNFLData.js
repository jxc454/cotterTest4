// This is a javascript file yo.

module.exports = function getNFLData(){
    let url = "http://www.nfl.com/liveupdate/game-center/2012020500/2012020500_gtd.json";

    http.get(url, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            var fbResponse = JSON.parse(body);
            let fileKeys = {};
            getKeys(fbResponse);

            console.log(_.toPairs(fileKeys));

            function getKeys(json){
                _.forEach(json, (value, key) => _.isObject(value) ? getKeys(value) : _.has(fileKeys, key) ? _.set(fileKeys, key, ++fileKeys[key]) : _.set(fileKeys, key, 0));
            }

        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}
