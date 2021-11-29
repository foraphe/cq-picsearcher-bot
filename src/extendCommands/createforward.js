function sendGroupForwardMsg(group_id, msgs) {
    return global.bot('send_group_forward_msg', {
      group_id,
      messages: msgs,
    });
  }

function run(context,config){
    if(context.message_type != 'group')return;
    if(!config || !config.enabled)return;
    if(config.users.indexOf(context.user_id)===-1)return;
    let json=[];
    try{
        let raw=context.message.substr(11); //!createfwd<space>
        json=JSON.parse(raw);
        sendGroupForwardMsg(context.group_id, json);
    }
    catch(e){
        global.replyMsg(`解析JSON失败:${e.message}`);
    }
}

module.exports=run;