function randInt(length) {
    return parseInt(Math.random() * (length));
}

function run(context, config) {
    if (!config) return;
    const range = parseInt(context.message.substr(6));
    var r = 100;
    if (range !== NaN && typeof range === 'number') {
        r = range;
    }
    global.replyMsg(context, '' + randInt(r), config.replyWithAt);
}

module.exports = run;