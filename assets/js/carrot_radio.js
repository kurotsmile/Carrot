class Carrot_Radio{
    carrot;
    icon="fa-solid fa-radio";
    id_page="radio";

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
            carrot.change_title_page("Radio","?p="+carrot.radio.id_page,carrot.radio.id_page);
            var list_radio=carrot.obj_to_array(datas);
            var html='';
            html+='<div class="row">';
            $(list_radio).each(function(index,data){
                var item_radio=new Carrot_List_Item(carrot);
                item_radio.set_icon_font(carrot.radio.icon);
                item_radio.set_id(data.id);
                item_radio.set_index(index);
                item_radio.set_db("radio");
                item_radio.set_name(data.name);
                item_radio.set_class_icon("pe-0 col-2");
                item_radio.set_class_body("mt-2 col-10");
                var html_body='';
                html_body+='<div class="col-10"><i class="fa-solid fa-star-half-stroke"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-solid fa-star-half-stroke"></i></div>';
                html_body+='<div class="col-2 text-end">';
                html_body+='<i role="button" class="audio_icon fa-solid fa-play fa-2x text-success" obj_id="'+data.id+'"></i>';
                html_body+='</div>';
                item_radio.set_body(html_body);
                html+=item_radio.html();
            });
            html+='</div>';
            carrot.show(html);
            carrot.check_event();
        });
    }

    edit(data,carrot){
        carrot.radio.frm_add_or_edit(data).set_title("Edit Radio").show();
    }

    add(){
        var new_data_radio=new Object();
        new_data_radio["id"]=this.carrot.create_id();
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
}