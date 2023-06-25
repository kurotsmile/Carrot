class Carrot_Link_Store{
    carrot;
    icon="fa-solid fa-store";
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("link_store","carrot.link_store.list()","carrot.link_store.edit");
        var btn_add=carrot.menu.create("add_link_store").set_label("Add Link Store").set_icon(this.icon).set_type("add");
        var btn_list=carrot.menu.create("list_link_store").set_label("List Store").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){carrot.link_store.list();});
        $(btn_add).click(function(){carrot.link_store.add();});
    }

    list(){
        this.carrot.get_list_doc("link_store",this.list_show);
    }

    list_show(data,carrot){
        carrot.change_title_page("All Store","?p=link_store","link_store");
        var list_link_store=carrot.obj_to_array(data);
        var html='';
        html='<div class="row">';
        $(list_link_store).each(function(index,store){
            var item_store=new Carrot_List_Item(carrot);
            item_store.set_db("link_store");
            item_store.set_id(store.key);
            item_store.set_icon(store.img);
            item_store.set_name("<i class='"+store.icon+"'></i> "+store.name);
            item_store.set_class("col-md-2 mb-2 col-sm-3");
            item_store.set_class_icon("col-md-12 mb-3 col-12 text-center");
            item_store.set_tip(store.key);
            item_store.set_body("<div class='col-12 mb-2 mt-2'><a target='_blank' href='"+store.link+"' class='btn btn-sm btn-success'><i class='fa-brands fa-instalod'></i> Go to</a></div>");
            html+=item_store.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    add(){
        var data_new=new Object();
        data_new["icon"]="";
        data_new["img"]="";
        data_new["key"]="";
        data_new["name"]="";
        data_new["link"]="";
        this.frm_add_or_edit(data_new).set_title("Add Store").show();
    }

    edit(data,carrot){
        carrot.link_store.frm_add_or_edit(data).set_title("Update Store").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_link_store",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("link_store","key");
        frm.create_field("key").set_label("Key").set_val(data["key"]);
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon (Font)").set_val(data["icon"]);
        frm.create_field("img").set_label("Image (Url)").set_val(data["img"]);
        frm.create_field("link").set_label("Link All App").set_val(data["link"]);
        return frm;
    }
}