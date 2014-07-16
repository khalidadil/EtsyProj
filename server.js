/**
 * Module dependencies.
 */

//this is how node searches for installed packages
var express = require('express'),
    http = require('http'), //default node packages
    path = require('path'), //default node packages
    app = express(),
    myth = require('myth'),
    fs = require('fs'),
    methodOverride = require('method-override'); 

// all environments
app.set('port', process.env.PORT || 3000);
app.use(methodOverride());

app.get("*.css", function(req, res) { // all .css
    // console.log(req.url)
    var path = __dirname + req.url;
    fs.readFile(path, "utf8", function(err, data) {
        if (err) {
            throw new Error("File does not exist: "+err);
        }
        res.header("Content-type", "text/css");
        try {
            res.send(myth(data));
        } catch (e) {
            console.log(e);
            res.send(data);
        }
    });
});

app.use(express.static(path.join(__dirname, '')));

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
