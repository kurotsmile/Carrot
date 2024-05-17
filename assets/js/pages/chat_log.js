class Chat_Log{

    show(){
        carrot.show("Chat Log");
    }
}
carrot.chat_log=new Chat_Log();
if(carrot.call_show_on_load_pagejs) carrot.chat_log.show();