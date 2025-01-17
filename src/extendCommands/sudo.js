const os = require('os');

function run(context, config) {
    if (!config.enabled) return;
    if (config.admins.indexOf(context.user_id) === -1) return;
    const command = context.message.substr(6);
    if (command === 'load') {
        const retv = `mem: ${parseInt(os.freemem / 1048576)}MB/${parseInt(os.totalmem / 1048576)}MB\nload: ${Math.round(os.loadavg()[0] * 100) / 100},${Math.round(os.loadavg()[2] * 100) / 100}`;
        global.replyMsg(context, retv);
    }
    else if (command.indexOf('setconfig') === 0) {
        const conf = command.substr(10);
        if (conf.indexOf('setudest true') === 0 || conf.indexOf('setudest false') === 0) {
            if (!global.extendConfig || global.extendConfig.error) return;
            const boolv = conf.substr(9);
            global.extendConfig.misc.setu.privateAll = eval(boolv);
            global.replyMsg(`setu私聊发送已设置为${boolv}`);
        }
    }
}

module.exports = run;