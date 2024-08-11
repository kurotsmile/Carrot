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
var sync=new Sync();
carrot.sync=sync;
