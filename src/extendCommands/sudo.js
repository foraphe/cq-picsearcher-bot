const os = require('os');

function run(context, config) {
    if (!config.enabled) return;
    if (config.admins.indexOf(context.user_id) === -1) return;
    const command = context.message.substr(6);
    switch (command) {
        case 'load':
            const retv = `mem: ${parseInt(os.freemem / 1048576)}MB/${parseInt(os.totalmem / 1048576)}MB\nload: ${os.loadavg()}`;
            global.replyMsg(context, retv);
    }
}

module.exports = run;