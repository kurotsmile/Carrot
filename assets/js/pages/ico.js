class Carrot_Ico{

    obj_icon_category=[];
    cur_show_icon_category="all";
    type_show="list_icon";

    show(){
        carrot.loading("Get all icon data");
        var q=new Carrot_Query("icon");
        if(carrot.ico.cur_show_icon_category!="all") q.add_where("category",carrot.ico.cur_show_icon_category);
        q.set_limit(54);
        q.get_data((icons)=>{
            carrot.hide_loading();
            carrot.change_title_page("Icon -"+carrot.ico.cur_show_icon_category, "?page=ico","icon");
            var  html=carrot.ico.menu();
            html+='<div id="all_icon" class="row m-0"></div>';
            carrot.show(html);
            $(icons).each(function(index,data){
                data["index"]=index;
                $("#all_icon").append(carrot.ico.box_icon_item(data));
            });
            carrot.ico.check_event();
        });
    }

    check_event(){
        if(carrot.ico.obj_icon_category.length<=1) carrot.ico.get_all_data_category();
        else carrot.ico.show_data_to_dropdown_category_icon();
        carrot.check_event();
    }

    box_icon_item(data_icon,s_class="col-md-2 mb-2 col-sm-3"){
        if(data_icon["name"]==null) data_icon["name"]=data_icon.id_doc;
        var s_url_icon="";
        if(data_icon.icon!=null) s_url_icon=data_icon.icon;
        if(s_url_icon=="") s_url_icon="images/64.png";
        var item_icon=new Carrot_List_Item(carrot);
        item_icon.set_db("icon");
        item_icon.set_id(data_icon.id_doc);
        item_icon.set_class(s_class);
        item_icon.set_class_icon("col-md-12 mb-3 col-12 text-center icon_info");
        item_icon.set_icon(s_url_icon);
        item_icon.set_name(data_icon.name);
        item_icon.set_body("<span class='fs-8' style='color:"+data_icon.color+"'>"+data_icon.color+"</span>");
        item_icon.set_act_click("carrot.ico.get_info('"+data_icon.id_doc+"');");
        return item_icon.html();
    }

    get_info(id){
        carrot.loading("Get data info "+id);
        carrot.server.get_doc("icon",id,(data)=>{
            carrot.hide_loading();
            carrot.ico.info(data);
        });
    }

    info(data){
        var box=new Carrot_Info();
        box.set_title(data.name);
        carrot.show(box.html());
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.ico.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Icon</button>';
                html+='<button onclick="carrot.ico.add_category();" class="btn dev btn-sm btn-success"><i class="fa-solid fa-square-plus"></i> Add Category</button>';
                html+='<button onclick="carrot.ico.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+='<div class="btn-group" role="group">';
                    html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_icon_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> Category ('+carrot.icon.cur_show_icon_category+')</button>';
                    html+='<div class="dropdown-menu" aria-labelledby="btn_list_ebook_category" id="list_icon_category"></div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="Last group">';
                var css_active="";
                if(this.type_show=="list_icon") css_active="active"; else css_active="";
                html+='<button onclick="carrot.ico.show();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-regular fa-rectangle-list"></i> List Icon</button>';
                if(this.type_show=="list_category") css_active="active"; else css_active="";
                html+='<button onclick="carrot.ico.show_list_category();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-solid fa-rectangle-list"></i> List Category</button>';
            html+='</div>';

        html+='</div>';
        html+='</div>';
        return html;
    }

    add(){
        var data_icon=new Object();
        data_icon["id"]="icon"+this.carrot.create_id();
        data_icon["name"]="";
        data_icon["icon"]="";
        data_icon["color"]="";
        data_icon["category"]="";
        data_icon["date_create"]=new Date().toISOString();
        this.add_or_edit(data_icon).set_title("Add icon").set_msg_done("Add icon success!").show();
    }

    edit(data_icon,carrot){
        carrot.icon.add_or_edit(data_icon).set_title("Update icon").set_msg_done("Update icon success!").show();
    }

    add_or_edit(data){
        var frm=new Carrot_Form("frm_icon",carrot);
        frm.set_db("icon","id");
        frm.set_icon_font(this.icon);
        frm.create_field("id").set_label("ID").set_val(data["id"]).set_type("id").set_main();
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon").set_val(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("color").set_label("Color").set_val(data["color"]).set_type("color");
        var category_field=frm.create_field("category").set_label("Category").set_val(data["category"]).set_type("select");
        category_field.add_option("","Unknown");
        var list_category=this.carrot.obj_to_array(this.obj_icon_category);
        $(list_category).each(function(index,category){
            category_field.add_option(category.key,category.key);
        });
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        return frm;
    }

    add_category(){
        var data_new=new Object();
        data_new["key"]="";
        data_new["icon"]="";
        data_new["buy"]="free";
        this.add_or_edit_category(data_new).set_title("Add Category").set_msg_done("Add Icon Category Success!!!").show();
    }

    edit_category(data,carrot){
        carrot.ico.add_or_edit_category(data).set_title("Edit Category").set_msg_done("Update Icon Category Success!!!").show();
    }

    add_or_edit_category(data){
        var frm=new Carrot_Form("frm_icon_category",carrot);
        frm.set_db("icon_category","key");
        frm.set_icon_font("fa-solid fa-rectangle-list");
        frm.create_field("key").set_label("Name Key").set_val(data["key"]).set_main();
        frm.create_field("icon").set_label("Icon (Font)").set_val(data["icon"]);
        var field_buy=frm.create_field("buy").set_label("Status Buy").set_val(data["buy"]).set_type("select");
        field_buy.add_option("free","Free");
        field_buy.add_option("buy","buy");
        return frm;
    }

    get_all_data_category(){
        var q=new Carrot_Query("icon_category");
        q.get_data((datas)=>{
            carrot.ico.get_all_data_category_done(datas);
        });
    }

    get_all_data_category_done(icons){
        carrot.ico.obj_icon_category=icons;
        carrot.ico.show_data_to_dropdown_category_icon();
    }

    show_data_to_dropdown_category_icon(){
        var html='';
        var css_active='';
        if(carrot.ico.obj_icon_category.length==0) carrot.ico.obj_icon_category.push({key:"all",icon:"fa-solid fa-rectangle-list"});
        $(carrot.ico.obj_icon_category).each(function(index,cat){
            cat.index=index;
            if(cat.key==carrot.ico.cur_show_icon_category) css_active="btn-success";
            else css_active="btn-secondary";
            html+='<button role="button" onclick="carrot.ico.select_show_category(\''+cat.key+'\')" class="dropdown-item btn '+css_active+'"><i class="'+cat.icon+'"></i> '+cat.key+'</button>';
        });
        $("#list_icon_category").html(html);
    }

    show_list_category(){
        var html='';
        carrot.change_title_page("Icon Catgeory","?page=icon_category","icon_category");
        carrot.ico.type_show="list_category";

        html+=carrot.ico.menu();
        html+='<div class="row">';
        $(carrot.ico.obj_icon_category).each(function(index,category){
            var item_cat_icon=new Carrot_List_Item(carrot);
            item_cat_icon.set_title(category.key);
            item_cat_icon.set_index(index);
            item_cat_icon.set_db("icon_category");
            if(category.icon!=null) item_cat_icon.set_icon_font(category.icon+" icon_catgeory");
            item_cat_icon.set_obj_js("icon");
            item_cat_icon.set_id(category.key);
            item_cat_icon.set_act_edit("carrot.ico.edit_category");
            item_cat_icon.set_class("col-md-4 mb-3");
            item_cat_icon.set_class_icon("col-2");
            item_cat_icon.set_class_body("col-10");
            if(category.buy=="buy") item_cat_icon.set_body('<i class="fa-solid fa-cart-shopping text-success text-end"></i>');
            item_cat_icon.set_act_click("carrot.ico.select_show_category('"+category.id_doc+"')");
            html+=item_cat_icon.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.ico.check_event();
    }

    select_show_category(key_category){
        carrot.ico.cur_show_icon_category=key_category;
        carrot.ico.show();
    }

    delete_all_data(){
        carrot.msg("Delete all data success!");
    }
}
carrot.ico=new Carrot_Ico();
if(carrot.call_show_on_load_pagejs) carrot.ico.show();