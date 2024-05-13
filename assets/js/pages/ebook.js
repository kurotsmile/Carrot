class EBook{

    objs=null;
    orderBy_at="date";
    orderBy_type="DESCENDING";

    show(){
        carrot.ebook.list();
    }

    menu(){
        var html='';
        html+='<div class="row">';
            html+='<div class="col-8">';
                html+='<button onclick="carrot.ebook.add();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-marker"></i> Write a book</button>';
                html+='<button onclick="carrot.ebook.add_category();return false;" class="btn btn-success dev btn-sm m-1"><i class="fa-solid fa-square-plus"></i> Add Category</button>';

                html+='<button onclick="carrot.ebook.list();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-swatchbook"></i> list Ebook</button>';
                html+='<button onclick="carrot.ebook.list_category();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-hurricane"></i> list Category</button>';
                html+='<button onclick="carrot.ebook.delete_all_data();return false;" class="btn btn-danger dev btn-sm m-1"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';

                html+='<div class="btn-group" role="group">';
                html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_ebook_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> <l class="lang" key_lang="genre">Category</l> ('+carrot.ebook.type_category_show+')</button>';
                html+='<div class="dropdown-menu" aria-labelledby="btn_list_ebook_category" id="list_ebook_category"></div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="col-4">';
                html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="End group">';
                html+=carrot.langs.list_btn_lang_select('btn-success');
                html+='</div>';
            html+='</div>';
            
        html+='</div>';
        return html;
    }

    list(){
        carrot.loading("Get all data Ebook and show");
        carrot.ebook.get_data(carrot.ebook.load_list_by_data);
    }

    get_data(act_done){
        if(carrot.check_ver_cur("ebook")==false){
            carrot.update_new_ver_cur("ebook",true);
            carrot.ebook.get_data_from_server(act_done);
        }else{
            carrot.ebook.get_data_from_db(act_done,()=>{
                carrot.ebook.get_data_from_server(act_done);
            });
        }
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("ebook").then((ebooks)=>{
            carrot.ebook.objs=ebooks;
            act_done(ebooks);
        }).catch(act_fail);
    }
    
    get_data_from_server(act_done){
        var q=new Carrot_Query("ebook");
        q.add_select("title");
        q.add_select("type");
        q.add_select("category");
        q.add_select("status");
        q.add_select("icon");
        q.add_select("author");
        q.add_where("lang",carrot.langs.lang_setting);
        q.set_order("date","ASCENDING");
        q.set_limit(44);
        q.get_data((data)=>{
            carrot.ebook.objs=data;
            $(data).each(function(index,e){
                carrot.data.add("ebook",e);
            })
            act_done(data);
        });
    }

    box_item(data){
        var item_ebook=new Carrot_List_Item(carrot);
        var url_cover_ebook_img='';
        if(data.icon!=null)if(data.icon!='') url_cover_ebook_img=data.icon;
        item_ebook.set_index(data.index);
        item_ebook.set_db("ebook");
        item_ebook.set_id(data.id_doc);
        item_ebook.set_title(data.title);
        item_ebook.set_tip(data.category);
        if(url_cover_ebook_img!='')
            item_ebook.set_icon(url_cover_ebook_img);
        else
            item_ebook.set_icon_font(carrot.data.icon+" ebook_icon");

        var html_body='';
        if(data.author!=null) html_body+='<div class="d-block"><i class="fa-solid fa-user"></i> '+data.author+'</div>';
        if(data.date!=null) html_body+='<div class="d-block"><i class="fa-solid fa-calendar-days"></i> '+data.date+'</div>';
        item_ebook.set_body(html_body);
        item_ebook.set_class_icon("col-md-2");
        item_ebook.set_class_body("col-md-10");
        return item_ebook;
    }

    load_list_by_data(data){
        carrot.hide_loading();
        var html='';
        html+=carrot.ebook.menu();
        html+='<div class="row" id="all_ebook"></div>';
        carrot.show(html);
        $(data).each(function(index,ebook){
            $("#all_ebook").append(carrot.ebook.box_item(ebook).html());
        });
        carrot.check_event();
    }
}
carrot.ebook=new EBook();
if(carrot.call_show_on_load_pagejs) carrot.ebook.show();