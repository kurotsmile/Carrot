class Share{

    objs=null;

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.share.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add</button>';
                html+=carrot.tool.btn_export("share");
                html+='<button onclick="carrot.share.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
            html+='</div>';

        html+='</div>';
        html+='</div>';
        return html;
    }

    show(){
        carrot.share.list();
    }

    list(){
        carrot.change_title("All Link Share","?p=share","share");
        carrot.loading("Get all data share and show");
        carrot.share.get_data(carrot.share.load_list_by_data);
    }

    load_list_by_data(datas){
        var html='';
        html+=carrot.share.menu();
        html+='<div class="row" id="all_share"></div>';
        carrot.show(html);
        carrot.hide_loading();
        $(datas).each(function(index,share){
            share["index"]=index;
            $("#all_share").append(carrot.share.box_item(share).html());
        });
        carrot.check_event();
    }

    get_data(act_done){
        if(carrot.check_ver_cur("share")==false){
            carrot.update_new_ver_cur("share",true);
            carrot.share.get_data_from_server(act_done);
        }else{
            carrot.share.get_data_from_db(act_done,()=>{
                carrot.share.get_data_from_server(act_done);
            });
        }
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("share");
        q.set_limit(20);
        q.get_data((shares)=>{
            $(shares).each(function(index,share){
                carrot.data.add("share",share);
            });
            act_done(shares);
        });
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("share").then(act_done).catch(act_fail());
    }

    add(){
        var new_data=new Object();
        new_data["name"]="";
        carrot.share.frm_add_or_edit(new_data).set_title("Add Link Share").show();
    }

    edit(data){
        carrot.share.frm_add_or_edit(data).set_title("Update Link Share").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_share",carrot);
        frm.set_icon('fa-solid fa-share-nodes');
        frm.set_db("share","name");
        frm.create_field("name").set_label("Name share").set_value(data.name).set_main();
        frm.create_field("icon").set_label("Icon share(image png )").set_value(data.icon).set_type("file").set_type_file("image/*");
        frm.create_field("font").set_label("Font icon").set_value(data.font);
        frm.create_field("web").set_label("Web Link share").set_value(data.web);
        frm.create_field("android").set_label("Android Link share").set_value(data.android);
        frm.create_field("window").set_label("Window link share").set_value(data.window);
        return frm;
    }

    box_item(data){
        var item_share=new Carrot_List_Item(carrot);
        var html_body='';
        item_share.set_db("share");
        item_share.set_id(data.id_doc);
        item_share.set_obj_js("share");
        item_share.set_name(data.name);
        item_share.set_tip(data.id_doc);
        item_share.set_icon_font(data.font);
        item_share.set_class_body("col-md-10 fs-9");
        item_share.set_class_icon("col-md-2");
        item_share.set_act_edit("carrot.share.edit");

        html_body+='<ul>';
            html_body+='<li><i class="fa-brands fa-android text-info"></i> <b>android</b>:'+data.android+'</li>';
            html_body+='<li><i class="fa-brands fa-edge text-info"></i> <b>web</b>:'+data.web+'</li>';
            html_body+='<li><i class="fa-brands fa-windows text-info"></i> <b>window</b>:'+data.window+'</li>';
        html_body+='</ul>';

        item_share.set_body(html_body);
        return item_share;
    }

    delete_all_data(){
        carrot.data.clear("share");
        carrot.msg("Delete all data success!","success");
    }
}
carrot.share=new Share();
if(carrot.call_show_on_load_pagejs) carrot.share.show();