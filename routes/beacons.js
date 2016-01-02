
module.exports = (function () {
    'use strict';

    /**
     * Packaged dependencies
     */
    var redis = require('then-redis');

    /**
     * Local dependencies
     */
    var Resource = require('../model/resource');

    var redisClient = typeof process.env.REDIS_URL !== 'undefined'
        ? redis.createClient(process.env.REDIS_URL)
        : redis.createClient();
    var beaconsResource = new Resource(redisClient, 'beacons');

    return {

        all: function (req, res) {
            beaconsResource.all()
                .then(function (beacons) {
                    res.type('application/json');
                    res.send(beacons);
                })
                .fail(function (error) {
                    res.send(500, error);
                });
        },

        create: function (req, res) {
            var document = req.body.document;

            beaconsResource.create(document)
                .then(function (beacon) {
                    res.type('application/json');
                    res.send(beacon);
                })
                .fail(function (error) {
                    res.send(500, error);
                });
        },

    };

})();
