class Midi{
    show(){
        var html="";
        html+='<div id="all_app" class="row m-0">';
        html+='</div>';
        carrot.show(html);
        carrot.db.collection("app").where("status","==","publish").limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                querySnapshot.forEach((doc) => {
                    var data_app=doc.data();
                    data_app["id"]=doc.id;
                    $("#all_app").append(this.box_app_item(data_app));
                }); 
            }
        });
        carrot.check_event();
        carrot.show("sdsd");
    }
}

var midi=new Midi();
midi.show();