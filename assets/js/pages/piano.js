class Midi{
    show(){
        var html="";
        html+='<div id="all_item" class="row m-0">';
        html+='</div>';
        carrot.show(html);
        carrot.db.collection("Midi Piano Editor").limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                querySnapshot.forEach((doc) => {
                    var data_app=doc.data();
                    data_app["id"]=doc.id;
                    $("#all_item").append(this.box_item(data_app));
                }); 
            }
        });
        carrot.check_event();
        carrot.show(html);
    }

    box_item(data){
        var  data_index=data.data_index;
        var html='<div class="col-md-4 mb-3">';
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                    html+='<div class="col-2 text-center d-fex"><i class="fa-3x fa-solid fa-guitar"></i></div>';
                    html+='<div class="col-10"">';
                        html+="<h5 class='mb-0 fs-6'>"+data.name+"</h5>";
                        html+='<div class="fs-9 text-warning"><i class="fa-solid fa-gauge-high"></i> Speed: '+data.speed+'</div>';
                        html+='<div class="fs-9"><i class="fa-solid fa-dice-d6"></i> status: '+data.status+'</div>';
                        html+='<div class="fs-9"><i class="fa-solid fa-music"></i> Note: '+data_index.length+'</div>';
                    html+='</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }
}

var midi=new Midi();
midi.show();

alert("sdsd");