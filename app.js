
(function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var express = require('express');
    var http = require('http');
    var path = require('path');
    var stylus = require('stylus');
    var winston = require('winston');
    var _ = require('underscore')._;

    /**
     * Local dependencies
     */
    var beacons = require('./routes/beacons');
    var index = require('./routes/index');

    var log = new (winston.Logger)({
        transports: [new (winston.transports.Console)()],
    });

    var app = express();
    var server = null;

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
            },
        }));
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'dist')));

        // Routes go here!
        app.get('/', index);

        app.get('/beacons', beacons.all);
        app.post('/beacons', beacons.create);
    });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    server = http.createServer(app);

    server.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

})();
