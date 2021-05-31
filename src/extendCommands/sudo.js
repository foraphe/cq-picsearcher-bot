const os = require('os');

function run(context, config) {
    if (!config.enabled) return;
    if (config.admins.indexOf(context.user_id) === -1) return;
    const command = context.message.substr(6);
    switch (command) {
        case 'load':
            const retv = `mem: ${parseInt(os.freemem / 1048576)}MB/${parseInt(os.totalmem / 1048576)}MB\nload: ${Math.round(os.loadavg()[0] * 100) / 100},${Math.round(os.loadavg()[2] * 100) / 100}`;
            global.replyMsg(context, retv);
            break;
        case 'setconfig':
            const conf = command.substr(10);
            if (conf === 'setudest true' || conf === 'setudest false') {
                if (!global.extendConfig || global.extendConfig.error) break;
                const boolv = conf.substr(9);
                global.extendConfig.misc.setu.privateAll = eval(boolv);
                global.replyMsg(`setu私聊发送已设置为${boolv}`);
            }
    }
}

module.exports = run;