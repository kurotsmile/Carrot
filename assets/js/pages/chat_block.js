class Chat_Block{
    show(){
        carrot.show("sdsd");
        carrot.check_event();
    }
}

carrot.chat_block=new Chat_Block();
if(carrot.call_show_on_load_pagejs) carrot.chat_block.show();