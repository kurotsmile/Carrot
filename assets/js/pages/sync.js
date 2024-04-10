class Sync{
    
    show(){
        carrot.show_loading_page();
        var q=new Carrot_Query("app");
        q.add_select("name_en");
        q.get_data(this.info);
        q.set_limit(10);
    }


    info(data){
        carrot.show(JSON.stringify(data));
    }
}

carrot.sync=new Sync();
carrot.sync.show();
