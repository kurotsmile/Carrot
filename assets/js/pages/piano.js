class Midi{

    objs=null;

    constructor(){
        this.objs=JSON.parse(localStorage.getItem("objs_midi"));
    }

    show(){
        var id_midi=carrot.get_param_url("id");
        if(id_midi!=undefined)
            this.show_midi_by_id(id_midi);
        else
            this.show_list();
    }

    show_list(){
        carrot.show_loading_page();
        carrot.change_title_page("List Midi","?page=piano","midi");

        if(this.objs!=null)
            this.show_list_by_objs(this.objs);
        else
            this.Get_list_from_server_and_show();
    }

    Get_list_from_server_and_show(){
        carrot.db.collection("Midi Piano Editor").limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                carrot.midi.objs=Array();
                querySnapshot.forEach((doc) => {
                    var data=doc.data();
                    data["id"]=doc.id;
                    carrot.midi.objs.push(data);
                }); 

                localStorage.setItem("objs_midi",JSON.stringify(carrot.midi.objs));
                carrot.midi.show_list_by_objs(carrot.midi.objs);
            }
        });
    }

    show_list_by_objs(midis){
        carrot.show('<div id="all_item" class="row m-0"></div>');
        $(midis).each(function(index,midi){
            midi["index"]=index;
            $("#all_item").append(carrot.midi.box_item(midi));
        });
        carrot.check_event();
    }
    
    show_midi_by_id(id){
        carrot.get_doc("Midi Piano Editor",id,this.info);
    }

    box_item(data){
        var  data_index=data.data_index;
        var s_icon="";
        var s_color_status="";
        var html="";

        if(data.status=="public"){
            s_icon="fa-solid fa-guitar";
            s_color_status="text-success";
        }else{
            s_icon="fa-brands fa-hashnode";
            s_color_status="text-warning";
        }

        html+='<div class="fs-9 '+s_color_status+'"><i class="fa-solid fa-dice-d6"></i> status: '+data.status+'</div>';
        html+='<div class="fs-9 "><i class="fa-solid fa-gauge-high"></i> Speed: '+data.speed+'</div>';
        html+='<div class="fs-9"><i class="fa-solid fa-music"></i> Note: '+data_index.length+'</div>';
        
        var item_obj=new Carrot_List_Item(carrot);
        item_obj.set_db("Midi Piano Editor");
        item_obj.set_icon_font(s_icon+" "+s_color_status);
        item_obj.set_id(data.id);
        item_obj.set_title(data.name);
        item_obj.set_class_body("col-10")
        item_obj.set_body(html);
        item_obj.set_act_edit("carrot.midi.edit");
        item_obj.set_act_click("carrot.midi.info");
        return item_obj.html();
    }

    edit(data,carrot){
        var frm=new Carrot_Form('add_code',carrot);
        frm.set_title("Edit Midi");
        frm.set_db("Midi Piano Editor","id");
        frm.set_type("edit");

        frm.create_field("id").set_label("Id").set_val(data.id).set_main();
        frm.create_field("name").set_label("Name").set_val(data.name);
        var status=frm.create_field("status").set_label("Status").set_type("select");
        status.add_option("pending","Pending");
        status.add_option("public","public");
        status.set_val(data.status);
        
        frm.set_msg_done("Edit Midi success!");
        frm.show();
    }

    info(data,carrot){
        carrot.change_title_page(data.name,"?page=piano&id="+data.id,"Midi");
        var html='<div class="section-container p-2 p-xl-4">';
            html+='<div class="row">';
                html+='<div class="col-md-8 ps-4 ps-lg-3">';
                    html+='<div class="row bg-white shadow-sm">';
                        html+='<div class="col-md-4 p-3 text-center">';
                            html+='<i class="fa-solid fa-guitar fa-5x"></i>';
                        html+='</div>';

                        html+='<div class="col-md-8 p-2">';
                            html+='<h4 class="fw-semi fs-4 mb-3">'+data.name+'</h4>';
                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="file">File</l> <i class="fa-solid fa-file-code"></i></b>';
                                html+='<p id="filename_code">'+data.name+'.midi</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="category">Category</l> <i class="fa-solid fa-boxes-packing"></i></b>';
                                html+='<p>'+data.category+'</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="speed">Interface</l> <i class="fa-solid fa-brush"></i></b>';
                                html+='<p>'+data.speed+'</p>';
                            html+='</div>';
                            if(data.user_id!=null){
                                html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="author">Author</l> <i class="fa-solid fa-user-nurse"></i></b>';
                                html+='<p>'+data.user_id+'</p>';
                                html+='</div>';
                            }
                        html+='</div>';

                    html+='</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }
}

var midi=new Midi();
carrot.midi=midi;
midi.show();