class User_Avatar{
    objs=null;

    show(){
        carrot.avatar.get_data(carrot.avatar.load_list_by_data);
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
            html+='<div class="col-12">';
                html+='<div class="btn-group btn-sm" role="group" aria-label="First group">';
                    html+='<button onclick="carrot.avatar.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Icon</button>';
                    html+=carrot.tool.btn_export("user-avatar");
                    html+='<button onclick="carrot.avatar.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete Cache</button>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    get_data(act_done){
        carrot.loading("Get list avatar from server");
        var q=new Carrot_Query("user-avatar");
        q.get_data((data)=>{
            carrot.avatar.objs=data;
            act_done(data);
        });
    }

    add(){
        var avatar_data={};
        avatar_data["id"]=carrot.create_id();
        avatar_data["name"]="";
        avatar_data["icon"]="";
        avatar_data["type"]="boy";
        carrot.avatar.frm_add_or_edit(avatar_data).set_title("Add Avatar").show();
    }

    edit(data,carrot){
        carrot.avatar.frm_add_or_edit(data).set_title("Edit Avatar").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_avatar",carrot);
        frm.set_icon(this.icon);
        frm.set_db("user-avatar","id");
        frm.create_field("id").set_label("ID").set_type("id").set_val(data.id);
        frm.create_field("type").set_label("Type").add_option("boy","Boy").add_option("girl","Girl").set_val(data.type).set_type("select");
        frm.create_field("icon").set_label("Icon").set_type("file").set_type_file("image/*").set_val(data.icon);
        return frm;
    }

    box_item(data){
        var id_img=carrot.tool.getIdFileFromURL(data.icon);
        carrot.data.img(id_img,data.icon,id_img);
        var box=new Carrot_List_Item(carrot);
        box.set_id(data.id_doc);
        box.set_index(data.index);
        box.set_db("user-avatar");
        box.set_obj_js("avatar");
        box.set_icon(data.icon);
        box.set_tip(data.type);
        box.set_title(data.id_doc);
        box.set_class("col-md-2 mb-3");
        box.set_class_icon("col-md-12 mb-3 col-12 "+id_img);
        return box;
    }

    load_list_by_data(data){
        carrot.hide_loading();
        carrot.change_title("List Avatar","?page=avatar","avatar");
        var html=carrot.avatar.menu();
        html+='<div class="row">';
        $(data).each(function(index,avatar){
            avatar["index"]=index;
            html+=carrot.avatar.box_item(avatar).html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    msg_list_select(){
        if(carrot.avatar.objs!=null)
            carrot.avatar.load_list_for_msg_by_data(carrot.avatar.objs);
        else
            carrot.avatar.get_data(carrot.avatar.load_list_for_msg_by_data);
    }

    load_list_for_msg_by_data(data){
        var html='';
        $(data).each(function(index,avatar){
            if(index>=20) return false;
            html+="<img role='button' onclick='carrot.avatar.select_avatar_for_user(this)' style='width:50px' class='rounded m-1' src='"+avatar.icon+"'/>";
        });
        
        Swal.fire({
            title: 'Select Avatar',
            html:html,
            showCancelButton: false
        });
    }

    select_avatar_for_user(emp){
        var img_src=$(emp).attr("src");
        $("#"+carrot.field_avatar).attr("src",img_src);
        $("#"+carrot.field_avatar).attr("value",img_src);
        Swal.close();
    }

    delete_all_data(){
        carrot.avatar.objs=null;
        carrot.msg("Delete all data list avatar");
    }
}
carrot.avatar=new User_Avatar();
if(carrot.call_show_on_load_pagejs) carrot.avatar.show();
