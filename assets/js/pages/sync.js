class Sync{

    show(){
        carrot.show("sdsd");
        carrot.server.get_doc(this.info);
    }

    info(data){
        console.log("data:"+data.documents[0].fields);
        carrot.msg("Get data success!","success");
    }
}

carrot.sync=new Sync();
carrot.sync.show();
