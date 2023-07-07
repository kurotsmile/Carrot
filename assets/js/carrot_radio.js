class Carrot_Radio{
    carrot;
    icon="fa-solid fa-radio";
    id_page="radio";
    obj_radios=null;

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("radio","carrot.radio.list()","carrot.radio.edit","carrot.radio.show_info","carrot.radio.reload");
        var btn_add=carrot.menu.create_menu("add_radio").set_label("Add Radio").set_icon(this.icon).set_type("add");
        $(btn_add).click(function(){carrot.radio.add();});

        var btn_list=carrot.menu.create_menu("list_radio").set_label("Radio").set_icon(this.icon).set_type("main");
        $(btn_list).click(function(){carrot.radio.list();});
    }

    list(){
        this.carrot.get_list_doc("radio",function(datas,carrot){
            carrot.radio.obj_radios=datas;
            carrot.change_title_page("Radio","?p="+carrot.radio.id_page,carrot.radio.id_page);
            var list_radio=carrot.obj_to_array(datas);
            var html='';
            html+='<div class="row">';
            $(list_radio).each(function(index,data){
                data["index"]=index;
                html+=carrot.radio.box_radio_item(data);
            });
            html+='</div>';
            carrot.show(html);
            carrot.check_event();
            carrot.radio.check_event();
        });
    }

    edit(data,carrot){
        carrot.radio.frm_add_or_edit(data).set_title("Edit Radio").show();
    }

    add(){
        var new_data_radio=new Object();
        new_data_radio["id"]="r"+this.carrot.create_id();
        new_data_radio["name"]="";
        new_data_radio["url"]="";
        new_data_radio["icon"]="";
        this.frm_add_or_edit(new_data_radio).set_title("Add Radio").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_add",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("radio","id");
        frm.create_field("id").set_label("ID").set_value(data["id"]).set_main();
        frm.create_field("name").set_label("Name").set_value(data["name"]);
        frm.create_field("icon").set_label("Icon").set_value(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("url").set_label("Url Stream").set_value(data["url"]);
        return frm;
    }

    check_event(){
        $(".btn_play_radio").unbind('click');
        $(".btn_play_radio").click(function(){
            var obj_id=$(this).attr("obj_id");
            var radio=JSON.parse(carrot.radio.obj_radios[obj_id]);
            carrot.player_media.create();
            carrot.player_media.play_audio(radio.name,radio.name,radio.url);
        });
    }

    box_radio_item(data){
        var item_radio=new Carrot_List_Item(carrot);
        item_radio.set_icon_font(carrot.radio.icon+" btn_play_radio");
        item_radio.set_id(data.id);
        item_radio.set_index(data.index);
        item_radio.set_db("radio");
        item_radio.set_name(data.name);
        item_radio.set_tip(data.name);
        item_radio.set_class_icon("pe-0 col-2");
        item_radio.set_class_body("mt-2 col-10");
        var html_body='';
        html_body+='<div class="col-10"><i class="fa-solid fa-star-half-stroke"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-solid fa-star-half-stroke"></i></div>';
        html_body+='<div class="col-2 text-end">';
        html_body+='<i role="button" class="audio_icon fa-solid fa-play fa-2x text-success btn_play_radio" obj_id="'+data.id+'"></i>';
        html_body+='</div>';
        item_radio.set_body(html_body);
        return item_radio.html();
    }

    list_for_home(){
        var html='';
        if(this.obj_radios!=null){
            var list_radio=this.carrot.obj_to_array(this.obj_radios);
            list_radio= list_radio.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);

            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_radio">Other Radio</l>';
            html+='<span role="button" onclick="carrot.radio.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div class="row m-0">';
            $(list_radio).each(function(index,data){
                data["index"]=index;
                html+=carrot.radio.box_radio_item(data);
            });
            html+='</div>';
        }
        return html;
    }
}