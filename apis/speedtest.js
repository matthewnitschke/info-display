var speedTest = require('speedtest-net')

module.exports = {
    download: 'Running',
    upload: 'Running'
}

var testSpeed = () => {
    var test = speedTest({ maxTime: 5000 });

    test.on('data', data => {
        module.exports.download = data.speeds.download + " Mbps"
        module.exports.upload = data.speeds.upload + " Mbps"
    });

    test.on('error', err => {
        console.error(err);
    });
}

testSpeed();
setInterval(testSpeed, 600000) // every 10min run speedtest