class Sync{

    show(){
        carrot.show_loading_page();
        var q=new Carrot_Query("app");
        
        q.get_data(this.info);
    }

    info(data){
        carrot.show(JSON.stringify(data));
    }
}

carrot.sync=new Sync();
carrot.sync.show();
