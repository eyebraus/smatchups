
module.exports = (function () {
    'use strict';

    var http = require('http')
      , q = require('q')
      , _ = require('underscore')._;

    return {

        get: function (path, options) {
            var deferral = q.defer()
              , opts = _.clone(options);

            opts.path = path;

            http.get(opts, function (res) {
                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function () {
                    deferral.resolve(JSON.parse(data));
                });
            }).on('error', function (err) {
                deferral.reject(err);
            });

            return deferral.promise;
        },

        post: function (path, body, options) {
            var deferral = q.defer()
              , bodyStr = JSON.stringify(body)
              , opts = _.clone(options);

            opts.method = 'POST';
            opts.path = path;
            opts.headers['Content-Length'] = bodyStr.length;

            var req = http.request(opts, function (res) {
                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function () {
                    deferral.resolve(JSON.parse(data));
                });
            }).on('error', function (err) {
                deferral.reject(err);
            });

            req.end(bodyStr);

            return deferral.promise;
        }

    };

})();
