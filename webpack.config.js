var path = require('path');

module.exports = {
    entry: "./app.js", // bundle's entry point
    output: {
        path: path.join(__dirname, 'dist'), // output directory
        filename: "[name].js" // name of output file
    }
}; 