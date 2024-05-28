class User_Avatar{
    objs=null;

    show(){
        carrot.avatar.get_data(carrot.avatar.load_list_by_data);
    }

    get_data(act_done){
        var q=new Carrot_Query("user-avatar");
        q.get_data((data)=>{
            carrot.avatar.objs=data;
            act_done(data);
        });
    }

    box_item(data){
        var box=new Carrot_List_Item(carrot);
        box.set_id(data.id_doc);
        box.set_index(data.index);
        box.set_db("user-avatar");
        box.set_obj_js("avatar");
        box.set_icon(data.icon);
        box.set_tip(data.type);
        box.set_title(data.id_doc);
        box.set_class("col-md-2 mb-3");
        box.set_class_icon("col-md-12 mb-3 col-12");
        return box;
    }

    load_list_by_data(data){
        var html='<div class="row">';
        $(data).each(function(index,avatar){
            avatar["index"]=index;
            html+=carrot.avatar.box_item(avatar).html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }
}
carrot.avatar=new User_Avatar();
if(carrot.call_show_on_load_pagejs) carrot.avatar.show();
