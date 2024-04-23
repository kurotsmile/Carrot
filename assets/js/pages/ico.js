class Carrot_Ico{

    obj_icon_category=[];
    cur_show_icon_category="all";
    
    show(){
        carrot.loading("Get all icon data");
        var q=new Carrot_Query("icon");
        q.set_limit(54);
        q.get_data((icons)=>{
            carrot.hide_loading();
            var  html=carrot.ico.menu();
            html+='<div id="all_icon" class="row m-0"></div>';
            carrot.show(html);
            $(icons).each(function(index,data){
                data["index"]=index;
                $("#all_icon").append(carrot.ico.box_icon_item(data));
            });
            carrot.check_event();
        });
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
        box.set_title("sdsd");
        carrot.show(box.html());
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.icon.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Icon</button>';
                html+='<button onclick="carrot.icon.add_category();" class="btn dev btn-sm btn-success"><i class="fa-solid fa-square-plus"></i> Add Category</button>';
                html+='<button onclick="carrot.icon.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+='<div class="btn-group" role="group">';
                    html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_icon_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> Category ('+carrot.icon.cur_show_icon_category+')</button>';
                    html+='<div class="dropdown-menu" aria-labelledby="btn_list_ebook_category" id="list_icon_category">';
                        var css_active='';
                        carrot.ico.obj_icon_category.push({key:"all",icon:"fa-solid fa-rectangle-list"});
                        $(carrot.ico.obj_icon_category).each(function(index,cat){
                            if(cat.key==carrot.ico.cur_show_icon_category) css_active="btn-success";
                            else css_active="btn-secondary";
                            html+='<button role="button" onclick="carrot.icon.select_show_category(\''+cat.key+'\')" class="dropdown-item btn '+css_active+'"><i class="'+cat.icon+'"></i> '+cat.key+'</button>';
                        });
                    html+='</div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="Last group">';
                var css_active="";
                if(this.type_show=="list_icon") css_active="active"; else css_active="";
                html+='<button onclick="carrot.icon.list();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-regular fa-rectangle-list"></i> List Icon</button>';
                if(this.type_show=="list_category") css_active="active"; else css_active="";
                html+='<button onclick="carrot.icon.list_category();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-solid fa-rectangle-list"></i> List Category</button>';
            html+='</div>';

        html+='</div>';
        html+='</div>';
        return html;
    }
}
carrot.ico=new Carrot_Ico();
if(carrot.call_show_on_load_pagejs) carrot.ico.show();