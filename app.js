
(function () {

    /**
     * npm dependencies
     */

    var express = require('express')
      , http = require('http')
      , path = require('path')
      , stylus = require('stylus')
      , winston = require('winston')
      , _ = require('underscore')._;

    /**
     * Local dependencies
     */

    var beacons = require('./routes/beacons')
      , index = require('./routes/index');

    var app = express()
      , log = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)()]
        });

    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(stylus.middleware({
            src: path.join(__dirname, 'public'),
            compile: function (str, path) {
                return stylus(str).set('filename', path);
            }
        }));
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'dist')));

        // Routes go here!
        app.get('/', index);

        app.get('/beacons', beacons.all);
    });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    server = http.createServer(app);

    server.listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });

})();
