class Carrot_Radio{
    objs=null;

    show(){
        carrot.radio.list();
    }

    list(){
        carrot.change_title("Radio","?p=radio","radio");
        carrot.loading("Get all data radio and show");
        carrot.radio.get_data(carrot.radio.load_list_by_data);
    }

    edit(data,carrot){
        carrot.radio.frm_add_or_edit(data).set_title("Edit Radio").show();
    }

    add(){
        var new_data_radio=new Object();
        new_data_radio["id"]="r"+carrot.create_id();
        new_data_radio["name"] = "";
        new_data_radio["url"] = "";
        new_data_radio["dataFormat"] = "";
        new_data_radio["audioFormat"] = "";
        new_data_radio["station"] = "";
        new_data_radio["genres"] = "";
        new_data_radio["bitrate"] = "";
        new_data_radio["rating"] = "";
        new_data_radio["description"] = "";
        new_data_radio["excludeCodec"] = "";
        new_data_radio["chunkSize"] = "";
        new_data_radio["bufferSize"] = "";
        new_data_radio["icon"] = "";
        new_data_radio["city"] = "";
        new_data_radio["country"] = "";
        new_data_radio["date_create"]=new Date().toISOString();
        new_data_radio["lang"]=carrot.langs.lang_setting;
        carrot.radio.frm_add_or_edit(new_data_radio).set_title("Add Radio").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_add",carrot);
        frm.set_icon("fa-solid fa-radio");
        frm.set_db("radio","id");
        frm.create_field("id").set_label("ID").set_value(data["id"]).set_main();
        frm.create_field("name").set_label("Name").set_value(data["name"]);
        frm.create_field("url").set_label("Url Stream").set_value(data["url"]);
        frm.create_field("dataFormat").set_label("Data Format").set_value(data["dataFormat"]);
        frm.create_field("audioFormat").set_label("Audio Format").set_value(data["audioFormat"]);
        frm.create_field("station").set_label("Station").set_value(data["station"]);
        frm.create_field("genres").set_label("Genres").set_value(data["genres"]);
        frm.create_field("bitrate").set_label("Bitrate").set_value(data["bitrate"]);
        frm.create_field("rating").set_label("Rating").set_value(data["rating"]);
        frm.create_field("description").set_label("Description").set_value(data["description"]);
        frm.create_field("excludeCodec").set_label("Exclude Codec").set_value(data["excludeCodec"]);
        frm.create_field("chunkSize").set_label("Chunk Size").set_value(data["chunkSize"]);
        frm.create_field("bufferSize").set_label("Buffer Size").set_value(data["bufferSize"]);
        frm.create_field("icon").set_label("Icon").set_value(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("city").set_label("City").set_value(data["city"]);
        frm.create_field("country").set_label("Country").set_value(data["country"]);
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        frm.create_field("lang").set_label("Lang").set_type("lang").set_val(data["lang"]);
        frm.set_act_done("carrot.radio.reload()");
        return frm;
    }

    getStar(rate){
        rate=parseInt(rate);
        var html='';
        for(var i=0;i<=5;i++){
            if(i<rate)
                html+='<i style="color:green" class="fas fa-star"></i>';
            else
                html+='<i style="color:#d9d9d9" class="far fa-star"></i>';
        }
        return html;
    }

    get_data(act_done){
        if(carrot.check_ver_cur("radio")==false){
            carrot.update_new_ver_cur("radio",true);
            carrot.radio.get_data_from_server(act_done);
        }else{
            carrot.radio.get_data_from_db(act_done,()=>{
                carrot.radio.get_data_from_server(act_done);
            });
        }
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("radio");
        q.get_data((datas)=>{
            carrot.radio.objs=datas;
            $(datas).each(function(index,radio){
                carrot.data.add("radio",radio);
            });
            act_done(datas);
        });
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("radio").then(act_done,act_fail);
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.radio.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Radio</button>';
                html+=carrot.tool.btn_export("radio");
                html+='<button onclick="carrot.radio.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    load_list_by_data(data){
        carrot.hide_loading();
        carrot.player_media.create();
        var html='';
        html+=carrot.radio.menu();
        html+='<div class="row" id="all_radio"></div>';
        carrot.show(html);
        $(data).each(function(index,radio){
            radio["index"]=index;
            $("#all_radio").append(carrot.radio.box_item(radio).html());
        });
        carrot.check_event();
    }

    box_item(data){
        var item_radio=new Carrot_List_Item(carrot);
        item_radio.set_icon_font("fa-solid fa-radio");
        item_radio.set_id(data.id_doc);
        item_radio.set_index(data.index);
        item_radio.set_db("radio");
        item_radio.set_name(data.name);
        item_radio.set_tip(data.name);
        item_radio.set_class_icon("pe-0 col-2");
        item_radio.set_class_body("mt-2 col-10");
        var html_body='';
        html_body+='<div class="col-10">'+carrot.radio.getStar(data.rating)+'</div>';
        html_body+='<div class="col-2 text-end">';
        html_body+='<i role="button" onclick="carrot.player_media.play_audio(\''+data.name+'\',\''+data.name+'\',\''+data.url+'\');" class="audio_icon fa-solid fa-play fa-2x text-success btn_play_radio" obj_id="'+data.id+'"></i>';
        html_body+='</div>';
        item_radio.set_body(html_body);
        item_radio.set_act_click("carrot.player_media.play_audio('"+data.name+"','"+data.name+"','"+data.url+"');")
        return item_radio;
    }

    list_for_home(){
        var html='';
        if(carrot.radio.objs!=null){
            var list_radio=carrot.random(carrot.radio.objs);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="fa-solid fa-radio fs-6 me-2"></i> <l class="lang" key_lang="other_radio">Other Radio</l>';
            html+='<span role="button" onclick="carrot.radio.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div class="row m-0">';
            $(list_radio).each(function(index,data){
                data["index"]=index;
                html+=carrot.radio.box_item(data).html();
            });
            html+='</div>';
        }
        return html;
    }

    reload(){
        carrot.data.clear("radio");
        setTimeout(carrot.radio.show,2000);
    }

    delete_all_data(){
        carrot.data.clear("radio");
        carrot.msg("Delete all data radio success!","success");
        setTimeout(carrot.radio.show(),2000);
    }
}
var radio=new Carrot_Radio();
carrot.radio=radio;