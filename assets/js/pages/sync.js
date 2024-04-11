class Sync{

    show(){
        carrot.loading();
        var imageUrl = "https://firebasestorage.googleapis.com/v0/b/carrotstore.appspot.com/o/app%2Fimage%2Fjpeg%2F1688281471671_icon.jpg?alt=media&token=35ca9ef2-f42c-46f8-9210-871c9368bb90";
        this.saveImageToIndexedDB(imageUrl,"thanh");
    }

    info(data){
        carrot.show(JSON.stringify(data));
    }
}
carrot.sync=new Sync();
if(carrot.call_show_on_load_pagejs) carrot.sync.show();
