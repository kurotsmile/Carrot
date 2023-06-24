class Carrot_Langs{
    carrot;
    icon="fa-sharp fa-solid fa-language";

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("lang","carrot.langs.list()","carrot.langs.edit_lang");
        carrot.menu.create("lang_setting").set_label("Lang").set_type("setting");
        var btn_add=carrot.menu.create("add_lang").set_label("Add Lang").set_icon(this.icon).set_type("add");
        var btn_list=carrot.menu.create("list_lang").set_label("List Lang").set_icon(this.icon).set_type("dev");
        $(btn_add).click(function(){carrot.langs.add_lang();});
        $(btn_list).click(function(){carrot.langs.list();});
        
    }

    list(){
        var carrot=this.carrot;
        var html='';
        carrot.change_title_page("All Lang","?p=lang","lang");
        html+='<div class="row">';
        $(this.carrot.list_lang).each(function(index,lang){
            lang["id"]=lang["key"];
            var item_lang=new Carrot_List_Item(carrot);
            item_lang.set_id(lang.id);
            item_lang.set_db("lang");
            item_lang.set_icon(lang.icon);
            item_lang.set_name(lang.name);
            item_lang.set_tip(lang.key);
            item_lang.set_class("col-md-2 mb-2");
            item_lang.set_class_icon("pe-0 col-3 ");
            item_lang.set_class_body("mt-2 col-9");
            html+=item_lang.html();
        });
        html+='</div>';
        this.carrot.show(html);
        this.carrot.check_event();
    }

    add_lang(){
        var data_lang=new Object();
        data_lang["key"]="";
        data_lang["name"]="";
        data_lang["icon"]="";
        this.frm_add_or_edit_lang(data_lang).set_title("Add Lang").show();
    }

    edit_lang(data,carrot){
        carrot.langs.frm_add_or_edit_lang(data).set_title("Update Lang").show();
    }

    frm_add_or_edit_lang(data_lang){
        var frm=new Carrot_Form("frm_lang",this.carrot);
        frm.set_db("lang","key");
        frm.create_field("key").set_label("Key").set_value(data_lang.key);
        frm.create_field("name").set_label("Name").set_value(data_lang.name);
        frm.create_field("icon").set_label("icon").set_value(data_lang.icon);
        return frm;
    }
}