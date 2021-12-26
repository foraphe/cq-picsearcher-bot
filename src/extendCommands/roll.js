function randInt(length) {
    return parseInt(Math.random() * (length)) + 1; // (0,length]
}

function run(context, config) {
    if (!config) return;
    var r = 100;
    if (range !== NaN && range !== undefined && typeof range === 'number') {
        r = range;
    }
    global.replyMsg(context, '' + randInt(r), config.replyWithAt);
}

module.exports = run;