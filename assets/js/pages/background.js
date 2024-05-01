class Background{
    show(){
        carrot.loading("Get and load all background");
        var q=new Carrot_Query("background");
        q.get_data((backgrounds)=>{
            carrot.hide_loading();
            var html='<div class="row m-0">';
            $(backgrounds).each(function(index,bk){
                bk["index"]=index;
                html+=carrot.background.box_item(bk).html();
            });
            html+='</div>';
            carrot.show(html);
            carrot.check_event();
        });
    }

    box_item(data){
        var box=new Carrot_List_Item(carrot);
        box.set_id(data.id_doc);
        box.set_name(data.name);
        box.set_tip(data.id_doc);
        box.set_icon(data.icon);
        box.set_db("background");
        box.set_class("col-md-2 mb-3");
        box.set_obj_js("background");
        box.set_class_icon("col-md-12 mb-3 col-12 text-center icon_info");

        var html_body='';
        if(data.buy=="0")
            html_body+='<span class="text-success"><i class="fa-solid fa-file-arrow-down"></i> Free</span>';
        else
            html_body+='<span class="text-primary"><i class="fa-solid fa-cart-shopping"></i> Buy</span>';

        box.set_body(html_body);
        return box;
    }

    add(){
        var data_bk=new Object();
        data_bk["id"]=carrot.create_id();
        data_bk["name"]="";
        data_bk["icon"]="";
        carrot.background.add_or_edit(data_bk).set_title("Add Background").show();
    }

    edit(data,carrot){
        carrot.background.add_or_edit(data).set_title("Edit Background").show();
    }
    
    add_or_edit(data){
        var frm=new Carrot_Form("frm_background",carrot);
        frm.set_icon("fa-image fa-solid");
        frm.set_db("background","id");
        frm.set_title("Add or Edit Background");
        frm.create_field("id").set_label("ID").set_val(data.id).set_type("id");
        frm.create_field("name").set_label("Name").set_val(data.name);
        frm.create_field("icon").set_label("Icon (url)").set_val(data.icon).set_type("file").set_type_file("image/*");
        var item_sell=frm.create_field("buy").set_label("Status Sell").set_val(data.buy).set_type("select");
        item_sell.add_option("0","Free");
        item_sell.add_option("1","Buy");
        return frm;
    }
}
carrot.background=new Background();
if(carrot.call_show_on_load_pagejs) carrot.background.show();