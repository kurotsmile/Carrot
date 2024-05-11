class Floor{

    objs=null;

    show(){
        carrot.floor.list();
    }

    list(){
        carrot.loading("Get all floor and load data");
        carrot.floor.get_data(carrot.floor.laod_list_by_data);
    }

    get_data(act_done){
        if(carrot.floor.objs==null)
            carrot.floor.get_data_from_server(act_done);
        else
            carrot.floor.laod_list_by_data(carrot.floor.objs);
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("floor");
        q.get_data((datas)=>{
            carrot.floor.objs=datas;
            act_done(datas);
        },()=>{
            carrot.msg("Eror");
        });
    }

    box_item(data){
        var box=new Carrot_List_Item(carrot);
        box.set_title(data.id);
        box.set_tip(data.id);
        box.set_icon(data.icon);
        box.set_db("floor");
        box.set_id(data.id);
        box.set_class("col-2 mb-2");
        return box;
    }

    add(){
        var data_floor_new=new Object();
        data_floor_new["id"]=carrot.create_id();
        data_floor_new["icon"]="";
        this.frm_add_or_edit_floor(data_floor_new).set_title("Add Floor").set_msg_done("Add floor success!").show();
    }

    edit(data,carrot){
        carrot.ai.frm_add_or_edit_floor(data).set_title("Edit Floor").set_msg_done("Update floor success!").show();
    }

    frm_add_or_edit_floor(data){
        var frm=new Carrot_Form("frm_floor",carrot);
        frm.set_icon("fa-solid fa-seedling");
        frm.set_db("floor","id");
        frm.create_field("id").set_label("ID").set_value(data.id).set_main();
        frm.create_field("icon").set_label("Icon").set_value(data.icon).set_type("file").set_type_file("image/*");
        return frm;
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
                html+='<div class="col-12">';
                    html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                        html+='<button onclick="carrot.floor.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add</button>';
                        html+=carrot.tool.btn_export("floor");
                        html+='<button onclick="carrot.floor.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                    html+='</div>';
                html+='</div>';
        html+='</div>';
        return html;
    }

    laod_list_by_data(data){
        carrot.hide_loading();
        var html='';
        html+=carrot.floor.menu();
        html+='<div class="row" id="all_floor"></div>';
        carrot.show(html);
        $(data).each(function(index,floor){
            $("#all_floor").append(carrot.floor.box_item(floor).html());
        });
        carrot.check_event();
    }

    delete_all_data(){
        carrot.floor.objs=null;
        carrot.msg("Delete all data success","success");
    }

}
carrot.floor=new Floor();
if(carrot.call_show_on_load_pagejs) carrot.floor.show();