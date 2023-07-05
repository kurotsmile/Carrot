class Carrot_Radio{
    carrot;
    icon="fa-solid fa-radio";

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("radio","carrot.radio.list()","carrot.radio.edit","carrot.radio.show_info","carrot.radio.reload");
        var btn_add=carrot.menu.create_menu("add_radio").set_label("Add Radio").set_icon(this.icon).set_type("add");
        $(btn_add).click(function(){carrot.radio.add();});

        var btn_list=carrot.menu.create_menu("list_radio").set_label("Radio").set_icon(this.icon).set_type("main");
        $(btn_list).click(function(){carrot.radio.list();});
    }

    list(){

    }

    edit(){

    }

    add(){
        var new_data_radio=new Object();
        new_data_radio["name"]="";
        new_data_radio["url"]="";
        new_data_radio["icon"]="";
        this.frm_add_or_edit(new_data_radio).set_title("Add Radio").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_add",this.carrot);
        frm.set_icon(this.icon);
        frm.create_field("name").set_label("Name").set_value(data["name"]);
        frm.create_field("icon").set_label("Icon").set_value(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("url").set_label("Url Stream").set_value(data["url"]);
        return frm;
    }
}