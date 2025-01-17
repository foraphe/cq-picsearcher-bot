const commands = [
    {   //
        // "A是不是B" | "A还是B"
        "listen": (context) => context.message.indexOf('\u8fd8\u662f') !== -1 | context.message.indexOf('\u662f\u4e0d\u662f') !== -1,
        "module": "choices",
        "exec": (module, context, config) => module(context, config),
        "config": "choice"
    },
    {
        // "A不AB"
        "listen": (context) => {
            if (context.message.indexOf('\u4e0d') !== -1) {
                const spl = context.message.indexOf('\u4e0d');
                const prefix = context.message.substr(1, spl - 1);
                if (context.message.substr(spl + 1, prefix.length) === prefix) {
                    return true;
                }
            }
        },
        "exec": (module, context, config) => module(context, config),
        "module": "choices",
        "config": "choice"
    },
    {
        "listen": (context) => context.message.substr(0, 5) === '!sudo',
        "module": "sudo",
        "exec": (module, context, config) => module(context, config),
        "config": "sudo"
    },
    {
        "listen": (context) => context.message.substr(0, 5) === '!roll',
        "module": "roll",
        "exec": (module, context, config) => module(context, config),
        "config": "roll"
    },
    {
        "listen": (context) => context.message.substr(0,5) === '!poke',
        "module": "poke",
        "exec": (module, context, config) => module(context, config),
        "config": "poke"
    },
    {
    "listen": (context) => context.message.substr(0,10) === '!createfwd',
        "module": "createfwd",
        "exec": (module, context, config) => module(context, config),
        "config": "createfwd"
    }
];

module.exports = commands;