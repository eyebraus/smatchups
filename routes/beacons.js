
module.exports = (function () {

    return {
        all: function (req, res) {
            // Just some mock data :)
            res.send([
                {
                    id: '1',
                    userName: 'beerz4yearz',
                    timestamp: new Date(2015, 8, 9, 18, 8, 0),
                    profilePictureUrl: '/app/img/prof-pic-placekitten.png',
                    gameIcon: '/app/img/icon/ssbm-small.png',
                    message: 'lol play melee or whatever'
                }]);
        }
    };

})();
