const os = require('os');

function run(context, config) {
    if (!config.enabled) return;
    if (config.admins.indexOf(context.user_id) === -1) return;
    const command = context.message.substr(6);
    switch (command) {
        case 'load':
            const retv = `uptime: ${os.uptime}\nmem: ${os.freemem}/${os.totalmem}\nload: ${os.loadavg}`;
            global.replyMsg(context, retv);
    }
}