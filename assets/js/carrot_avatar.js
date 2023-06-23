class Carrot_Avatar{
    carrot;
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("avatar","carrot.avatar.list()","carrot.avatar.edit");
        $(this.carrot.menu.create("add_avatar").set_label("Add Avatar").set_icon("fa-regular fa-image-portrait").set_type("add")).click(function(){carrot.avatar.add()});
        $(this.carrot.menu.create("list_avatar").set_label("List Avatar").set_icon("fa-regular fa-image-portrait").set_type("dev")).click(function(){carrot.avatar.list();});
    }

    add(){
        var avatar_data=new Object();
        avatar_data["id"]=this.carrot.create_id();
        avatar_data["name"]="";
        avatar_data["icon"]="";
        avatar_data["type"]="boy";
        this.add_or_edit(avatar_data);
    }

    edit(data,carrot){
        carrot.avatar.add_or_edit(data);
    }

    add_or_edit(data){
        var frm=new Carrot_Form("frm_avatar",this.carrot);
        frm.set_title("Add or Edit Avatar");
        frm.set_db("user-avatar",data.id);
        frm.create_field("id").set_label("ID").set_type("id").set_val(data.id);
        frm.create_field("type").set_label("Type").add_option("boy","Boy").add_option("girl","Girl").set_val(data.type).set_type("select");
        frm.create_field("icon").set_label("Icon").set_val(data.icon);
        frm.show();
    }

    list(){
        this.carrot.change_title_page("Avatar","?p=avatar","avatar");
        this.carrot.get_list_doc("user-avatar",this.show_list_avatar);
    }

    show_list_avatar(list_avatar,carrot){
        list_avatar=carrot.obj_to_array(list_avatar);
        var html="<div class='row m-0'>";
        $(list_avatar).each(function(index,avt){
            var item_avatar=new Carrot_List_Item(carrot);
            item_avatar.set_id(avt.id);
            item_avatar.set_db("user-avatar");
            item_avatar.set_icon(avt.icon);
            item_avatar.set_tip(avt.type);
            item_avatar.set_title(avt.id);
            item_avatar.set_class("col-md-2 mb-3");
            item_avatar.set_class_icon("col-md-12 mb-3 col-12");
            html+=item_avatar.html();
        });
        html+="</div>";
        carrot.show(html);
        carrot.check_event();
    }

    show_edit_avatar_done(data_avatar,carrot){
        if(data_avatar!=null)
            carrot.ai_lover.show_box_add_or_edit_avatar(data_avatar,carrot.act_done_add_or_edit);
         else
            carrot.msg("<b>Avatar</b> không còn tồn tại!","error");
    }
}