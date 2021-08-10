function run(context, config) {
    if (!config.enabled || !context.message_type == 'group') return;
    return global.replyMsg(context,`[CQ:poke,qq=${context.user_id}]`)
}

module.exports = run;