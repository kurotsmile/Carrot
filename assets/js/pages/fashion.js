class Fashion{

    objs=null;

    show(){
        carrot.fashion.list();
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
                html+='<div class="col-12">';
                    html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                        html+='<button onclick="carrot.fashion.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add</button>';
                        html+=carrot.tool.btn_export("character_fashion");
                        html+='<button onclick="carrot.fashion.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                    html+='</div>';
                html+='</div>';
        html+='</div>';
        return html;
    }

    list(){
        carrot.loading("Get all data fashion");
        carrot.change_title("All Fashion","?p=fashion","fashion");
        carrot.fashion.get_data(carrot.fashion.load_list_by_data);
    }

    get_data(act_done){
        carrot.fashion.get_data_from_server((datas)=>{
            act_done(datas);
        },()=>{
            carrot.msg("No list Fashion","error");
        });
    }

    get_data_from_server(act_done,act_fail){
        var q=new Carrot_Query("character_fashion");
        q.get_data((datas)=>{
            console.log(datas);
            carrot.fashion.objs=datas;
            act_done(datas);
        },act_fail);
    }

    edit(data,carrot){
        carrot.fashion.frm_add_or_edit_fashion(data).set_title("Edit Fashion").set_msg_done("Update fashion success").show();
    }

    add(){
        var skin_data=new Object();
        skin_data["id"]="";
        skin_data["img"]="";
        skin_data["icon"]="";
        skin_data["type"]="";
        carrot.fashion.frm_add_or_edit_fashion(skin_data).set_title("Add Fashion").set_msg_done("Add fashion success").show();
    }

    frm_add_or_edit_fashion(data){
        var frm=new Carrot_Form("frm_skin",carrot);
        frm.set_icon("fa-solid fa-shirt");
        frm.set_db("character_fashion","id");
        frm.create_field("id").set_label("ID").set_value(data["id"]).set_main();
        frm.create_field("icon").set_label("Icon").set_type("file").set_type_file("image/*").set_value(data["icon"]);
        frm.create_field("img").set_label("Iamge").set_type("file").set_type_file("image/*").set_value(data["img"]);
        frm.create_field("type").set_label("Type").set_value(data["type"]);
        frm.create_field("buy").set_label("Buy Status").add_option("0","Free").add_option("1","Buy").set_type("select").set_value(data["buy"]);
        return frm;
    }

    box_item(data){
        var item_fashion=new Carrot_List_Item(carrot);
        item_fashion.set_index(data.index);
        item_fashion.set_id(data.id);
        item_fashion.set_icon(data.icon);
        item_fashion.set_db("character_fashion");
        item_fashion.set_name(data.type);
        item_fashion.set_class_icon("pe-0 col-3");
        item_fashion.set_class_body("mt-2 col-9");
        item_fashion.set_act_edit("carrot.fashion.edit");
        item_fashion.set_obj_js("fashion");
        var html_body='';
        html_body+='<div class="col-12 fs-8">';
        if(data.buy=='0') html_body+='<i class="fa-solid fa-boxes-stacked text-success"></i> Free';
        else html_body+='<i class="fa-solid fa-cart-shopping text-info"></i> Buy';
        html_body+='<div class="d-block text-break"><b><i class="fa-solid fa-tape"></i> Img:</b> <a href="'+data.img+'" target="_blank">'+data.img+'</a></div>';
        html_body+='</div>';
        item_fashion.set_body(html_body);
        return item_fashion;
    }

    load_list_by_data(datas){
        carrot.hide_loading();
        var html='';
        html+=carrot.fashion.menu();
        html+='<div class="row" id="all_fashion"></div>';
        carrot.show(html);
        $(datas).each(function(index,fashion){
            fashion["index"]=index;
            $("#all_fashion").append(carrot.fashion.box_item(fashion).html());
        });
        carrot.check_event();
    }
}
carrot.fashion=new Fashion();
if(carrot.call_show_on_load_pagejs) carrot.fashion.show();