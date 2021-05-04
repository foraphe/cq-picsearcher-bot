function randInt(length) {
    return parseInt(Math.random() * (length));
}

function get(context) {
    // "还是"
    if (context.message.match('\u8fd8\u662f')) {
        const choices = context.message.substr(1, context.message.length - 1).split('\u8fd8\u662f');
        if (choices.length <= 1) return;
        return choices[randInt(choices.length)];
    }
    // "A是不是B"
    else if (context.message.match('\u662f\u4e0d\u662f')) {
        const prefix = context.message.substr(1, context.message.match('\u662f\u4e0d\u662f').index);
        const suffix = context.message.substr(context.message.match('\u662f\u4e0d\u662f').index + 3, context.message.length);
        const choices = ['是', '不是'];
        return prefix + choices[randInt(2)] + suffix;
    }
    // "A不AB"
    else {
        const spl = context.message.indexOf('\u4e0d');
        const prefix = context.message.substr(1, spl - 1);
        const suffix = context.message.substr(spl + prefix.length + 1, context.message.length);
        const choices = [prefix, '不' + prefix];
        return choices[randInt(2)] + suffix;
    }
}

function run(context, config) {
    if (!config.enabled) return;
    global.replyMsg(context, get(context), config.replyWithAt);
}

module.exports = run;