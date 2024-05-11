class Sync{
    list_colletion=[];

    constructor(){
        this.list_colletion=["song","ico","chat-vi"];
    }

    show(){
        var html='';
        $(carrot.sync.list_colletion).each(function(index,s){
            html+=s;
        });
        carrot.show(html);
        carrot.check_event();
    }

    info(data){
        carrot.show(JSON.stringify(data));
    }
}
carrot.sync=new Sync();
if(carrot.call_show_on_load_pagejs) carrot.sync.show();
