var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    express = require('express'),
    _ = require('lodash');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

var app = express();

app.use(express.static('static'));
app.use(express.static('dist'));

app.get('/dist/main.js', function(req, res){
    res.sendFile(path.join(__dirname, 'dist/main.js'));
});

app.get('/citationData.json', function(req, res){
    require('./pullCitationData.js').pullCitationData(datafile=>{
        res.send(datafile);
    });
});

app.get('/speedCameras.json', function(req, res){
    let data = require('./pullSpeedCameraData.js').pullSpeedCameraData();
    res.send(data);
});

app.get('/zipCodeRentalData.json', function(req, res){
    let data = require('./pullRentalZipCodeData.js').pullRentalZipCodeData();
    res.send(data);
});

app.get('/homicideData.json', function(req, res){
    let data = require('./pullHomicideData.js').pullHomicideData();
    res.send(data);
});

var server = app.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening at http://%s:%s", host, port);
});