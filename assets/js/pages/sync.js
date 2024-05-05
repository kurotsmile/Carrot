class Sync{
    show(){
        carrot.loading();
        carrot.html("sdsd");
    }

    info(data){
        carrot.show(JSON.stringify(data));
    }
}
carrot.sync=new Sync();
if(carrot.call_show_on_load_pagejs) carrot.sync.show();
