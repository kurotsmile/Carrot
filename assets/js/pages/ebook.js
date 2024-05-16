class EBook{

    objs=null;
    ebook_category=null;
    obj_ebook_cur=null;
    
    orderBy_at="date";
    orderBy_type="DESCENDING";
    type_category_show="all";
    type_view="list_ebook";

    show(){
        carrot.ebook.list();
    }

    add(){
        var new_data=new Object();
        new_data["id"]="ebook"+carrot.create_id();
        new_data["icon"]="";
        new_data["title"]="";
        new_data["describe"]="";
        new_data["category"]="";
        new_data["date"]=$.datepicker.formatDate('yy-mm-dd', new Date());
        new_data["lang"]=carrot.lang;
        new_data["status"]="draft";
        new_data["author"]="";
        new_data["user"]=carrot.user.get_user_login();
        carrot.ebook.frm_add_or_edit(new_data).set_title("Add Ebook").set_msg_done("Add ebook success!!!").set_type("add").show();
    }

    edit(data,carrot){
        carrot.ebook.frm_add_or_edit(data).set_title("Update Ebook").set_msg_done("Update ebook success!!!").set_type("update").show();
    }

    edit_info_book_cur(){
        carrot.get_doc("ebook",carrot.ebook.obj_ebook_cur.id,carrot.ebook.edit);
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_ebook",carrot);
        frm.set_icon("fa-solid fa-book");
        frm.set_db("ebook","id");
        frm.create_field("id").set_label("ID Ebook").set_val(data["id"]).set_type("id").set_tip('<i class="fa-solid fa-book-open-reader"></i> First you need to fill in the necessary information of the book you are about to write, The content in the chapter you can add later');
        frm.create_field("icon").set_label("Icon (File image 740 x 1186)").set_val(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("title").set_label("Title Ebook").set_val(data["title"]);
        var field_cat=frm.create_field("category").set_label(carrot.l("genre","category")).set_val(data["category"]).set_type("select");
        $(carrot.ebook.ebook_category).each(function(index,cat){
            field_cat.add_option(cat.name,cat.name);
        });
        frm.create_field("describe").set_label("Describe Ebook").set_val(data["describe"]).set_type("editor");
        frm.create_field("date").set_label("Public Date").set_val(data["date"]).set_type("date");
        frm.create_field("lang").set_label("Lang eBook").set_val(data["lang"]).set_type("lang");
        var field_status=frm.create_field("status").set_label("Status").set_value(data.status).set_type("select");
        field_status.add_option("draft","Draft");
        field_status.add_option("publish","Publish");
        frm.create_field("author").set_label("Author").set_val(data["author"]);
        frm.create_field("user").set_label("Public User").set_val(data["user"]).set_type("user");
        return frm;
    }

    add_category(){
        var new_data=new Object();
        new_data["name"]="";
        new_data["icon"]="";
        new_data["image"]="";
        $(carrot.langs.list_lang).each(function(index,lang){
            new_data["name_"+lang.key]="";
        });
        carrot.ebook.frm_add_or_edit_category(new_data).set_title("Add Category").set_msg_done("Add Category Success!").set_type("add").show();
    }

    edit_category(data,carrot){
        carrot.ebook.frm_add_or_edit_category(data).set_title("Update Category").set_msg_done("Update Category Success").set_type("update").show();
    }

    frm_add_or_edit_category(data){
        var frm=new Carrot_Form("frm_ebook_category",carrot);
        frm.set_icon("fa-solid fa-hurricane");
        frm.set_db("ebook_category","name");
        frm.create_field("name").set_label("Name Category").set_val(data["name"]).set_main();
        frm.create_field("icon").set_label("Icon Category (Font)").set_val(data["icon"]);
        frm.create_field("image").set_label("Cover Ebook Category Image (300x300)").set_val(data["image"]).set_type("file").set_type_file("image/*");
        $(carrot.langs.list_lang).each(function(index,lang){
            frm.create_field("name_"+lang.key).set_label("Name "+lang.name+" ("+lang.key+") <img style='width:20px;' src='"+lang.icon+"'>").set_val(data["name_"+lang.key]);
        });
        return frm;
    }

    menu(){
        var html='';
        var s_class=""
        html+='<div class="row">';
            html+='<div class="col-8">';
                html+='<button onclick="carrot.ebook.add();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-marker"></i> Write a book</button>';
                html+='<button onclick="carrot.ebook.add_category();return false;" class="btn btn-success dev btn-sm m-1"><i class="fa-solid fa-square-plus"></i> Add Category</button>';

                html+='<div class="btn-group m-1" role="group">';
                    if(carrot.ebook.type_view=="list_ebook") s_class="active"; else s_class="";
                    html+='<button onclick="carrot.ebook.list();return false;" class="btn '+s_class+' btn-success btn-sm"><i class="fa-solid fa-swatchbook"></i> list Ebook</button>';
                    if(carrot.ebook.type_view=="list_category") s_class="active"; else s_class="";
                    html+='<button onclick="carrot.ebook.list_category();return false;" class="btn '+s_class+' btn-success btn-sm"><i class="fa-solid fa-hurricane"></i> list Category</button>';
                html+='</div>';

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
        carrot.change_title("All Ebook","?page=ebook","ebook");
        carrot.ebook.type_view="list_ebook";
        carrot.loading("Get all data Ebook and show");
        carrot.ebook.get_data(carrot.ebook.load_list_by_data);
    }

    list_category(){
        carrot.loading("Get all data Ebook category and show");
        carrot.ebook.get_category((data)=>{
            carrot.change_title("All Ebook Category","?page=ebook_category","ebook");
            carrot.ebook.type_view="list_category";
            carrot.hide_loading();
            var html='';
            html+=carrot.ebook.menu();
            html+='<div id="all_cat_ebook" class="row">';
            $(data).each(function(index,cat){
                cat["index"]=index;
                html+=carrot.ebook.box_item_category(cat).html();
            });
            html+='</div>';
            carrot.show(html);
            carrot.check_event();
        });
    }

    show_list_by_category(id_cat){
        carrot.ebook.type_view="list_category";
        carrot.loading("Get all data by category ("+id_cat+")");
        carrot.data.clear("ebook");
        carrot.ebook.objs=null;
        carrot.ebook.type_category_show=id_cat;
        carrot.ebook.get_data(carrot.ebook.load_list_by_data,()=>{
            carrot.msg("There are no books in this category","alert");
        });
    }

    get_data(act_done,act_fail=null){
        if(carrot.check_ver_cur("ebook")==false){
            carrot.update_new_ver_cur("ebook",true);
            carrot.ebook.get_data_from_server(act_done,act_fail);
        }else{
            carrot.ebook.get_data_from_db(act_done,()=>{
                carrot.ebook.get_data_from_server(act_done,act_fail);
            });
        }
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("ebook").then((ebooks)=>{
            carrot.ebook.objs=ebooks;
            act_done(ebooks);
        }).catch(act_fail);
    }
    
    get_data_from_server(act_done,act_fail){
        var q=new Carrot_Query("ebook");
        q.add_select("title");
        q.add_select("type");
        q.add_select("category");
        q.add_select("status");
        q.add_select("icon");
        q.add_select("author");
        q.add_where("lang",carrot.langs.lang_setting);
        if(carrot.ebook.type_category_show!="all") q.add_where("category",carrot.ebook.type_category_show);
        q.set_limit(44);
        q.get_data((data)=>{
            carrot.ebook.objs=data;
            $(data).each(function(index,e){
                carrot.data.add("ebook",e);
            })
            act_done(data);
        },act_fail);
    }

    box_item(data){
        var item_ebook=new Carrot_List_Item(carrot);
        var url_cover_ebook_img='';
        if(data.icon!=null)if(data.icon!=''){
            url_cover_ebook_img=carrot.url()+"/images/150.png";
            carrot.data.img(data.id_doc,data.icon,"icon_ebook_"+data.id_doc);
        }
        item_ebook.set_index(data.index);
        item_ebook.set_db("ebook");
        item_ebook.set_id(data.id_doc);
        item_ebook.set_title(data.title);
        item_ebook.set_tip(data.category);
        if(url_cover_ebook_img!='')
            item_ebook.set_icon(url_cover_ebook_img);
        else
            item_ebook.set_icon_font(carrot.data.icon+" ebook_icon");
        item_ebook.set_id_icon("icon_ebook_"+data.id_doc);

        var html_body='';
        if(data.author!=null) html_body+='<div class="d-block"><i class="fa-solid fa-user"></i> '+data.author+'</div>';
        if(data.date!=null) html_body+='<div class="d-block"><i class="fa-solid fa-calendar-days"></i> '+data.date+'</div>';
        item_ebook.set_body(html_body);
        item_ebook.set_class_icon("col-md-2");
        item_ebook.set_class_body("col-md-10");
        item_ebook.set_act_click("carrot.ebook.show_info_by_id('"+data.id_doc+"')");
        return item_ebook;
    }

    box_item_category(cat){
        var item_cat=new Carrot_List_Item(carrot);
            item_cat.set_title(cat.name);
            item_cat.set_db("ebook_category",cat.id_doc);
            item_cat.set_tip(cat.id);
            item_cat.set_act_edit("carrot.ebook.edit_category");
            item_cat.set_obj_js("ebook");
            item_cat.set_id(cat.name);
            item_cat.set_icon_font(cat.icon);
            item_cat.set_class_icon("col-2");
            item_cat.set_class_body("col-10");
            item_cat.set_index(cat.index);
            item_cat.set_act_click("carrot.ebook.show_list_by_category('"+cat.id_doc+"')");
        return item_cat;
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
        carrot.ebook.check_event();
        //carrot.check_event();
    }

    get_category(act_done){
        if(carrot.check_ver_cur("ebook_category")==false){
            carrot.update_new_ver_cur("ebook_category",true);
            carrot.ebook.get_category_form_server(act_done);
        }else{
            carrot.ebook.get_category_form_db(act_done,()=>{
                carrot.ebook.get_category_form_server(act_done);
            });
        }
    }

    get_category_form_server(act_done){
        var q=new Carrot_Query("ebook_category");
        q.get_data((data)=>{
            $(data).each(function(index,c){
                carrot.data.add("ebook_category",c);
            });
            carrot.ebook.ebook_category=data;
            act_done(data);
        });
    }

    get_category_form_db(act_done,act_fail){
        carrot.data.list("ebook_category").then((data)=>{
            carrot.ebook.ebook_category=data;
            act_done(data);
        }).catch(act_fail);
    }

    show_info_by_id(id){
        carrot.loading("Get data ("+id+")");
        carrot.data.get("ebook_info",id,(data)=>{
            carrot.ebook.info(data);
        },
        carrot.server.get("ebook",id,(data)=>{
            carrot.data.add("ebook_info",data);
            carrot.ebook.info(data);
        }));
    }

    info(data){
        carrot.obj_ebook_cur=data;
        carrot.type_view="info";
        carrot.change_title(data.title,"?page=ebook&id="+data.id_doc,"ebook");
        carrot.hide_loading();
        
        var info=new Carrot_Info(data.id_doc);
        info.set_title(data.title);
        if(data.icon==null||data.icon==undefined||data.icon=='undefined'||data.icon==""){
            info.set_icon_font("fa-solid fa-book fa-4x");
        }else{
            carrot.data.img(data.id_doc,data.icon,"pic_ebook_"+data.id_doc);
            info.set_icon_image(carrot.url()+"/images/150.png");
        }
        
        info.set_icon_id("pic_ebook_"+data.id_doc);
        info.add_attrs("fa-solid fa-hurricane",'<l class="lang" key_lang="genre">Category</l>',data.category);
        info.add_attrs("fa-solid fa-file-powerpoint",'<l class="lang" key_lang="total_chapters">Total Chapters</l>',data.contents.length);
        info.add_attrs("fa-solid fa-file-arrow-down",'<l class="lang" key_lang="file">File</l>',data.title+'.epub');
        if(data.user!=null) info.add_attrs("fa-solid fa-user-nurse",'<l class="lang" key_lang="posted_by">Posted By</l>',data.user.name);
        if(data.author!=null) info.add_attrs("fa-solid fa-user",'<l class="lang" key_lang="author">Author</l>',data.author);
        info.add_attrs("fa-solid fa-language",'<l class="lang" key_lang="country">Country</l>',data.lang);
        info.set_protocol_url("ebook://show/"+data.id_doc);

        carrot.show(carrot.ebook.menu()+info.html());
        carrot.ebook.check_event();
    }

    check_event(){
        carrot
        carrot.ebook.get_category((data)=>{
            $("#list_ebook_category").html('');
            data.push({id_doc:"all",icon:"fa-solid fa-table-list",name:"all"});
            $(data).each(function(index,category){
                var html='';
                var class_menu='';
                if(category.id_doc==carrot.ebook.type_category_show) class_menu='active';
                html+='<button type="button" onclick="carrot.ebook.show_list_by_category(\''+category.id_doc+'\');" class="dropdown-item '+class_menu+'""> <i class="'+category.icon+'"></i> '+category.name+'</button>';
                $("#list_ebook_category").append(html);
            });

            carrot.tool.list_other_and_footer("ebook");
            carrot.tool.show_app_tip("ERead Now");
            carrot.check_event();
        });
    }

    delete_all_data(){
        carrot.data.clear("ebook");
        carrot.data.clear("ebook_info");
        carrot.data.clear("ebook_category");
        carrot.msg("Delete all data success!","success");
        setTimeout(()=>{carrot.ebook.list();},500);
    }

    list_for_home(){
        var html="";
        if(carrot.ebook.objs!=null){
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="fa-solid fa-book fs-6 me-2"></i> <l class="lang" key_lang="ebook">Ebook</l>';
            html+='<span role="button" onclick="carrot.ebook.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div id="other_ebook" class="row m-0">';
            $(carrot.random(carrot.ebook.objs)).each(function(index,e){
                if(index>=12) return false;
                e["index"]=index;
                html+=carrot.ebook.box_item(e).html();
            });
            html+='</div>';
        }
        return html;
    }

}
carrot.ebook=new EBook();
if(carrot.call_show_on_load_pagejs) carrot.ebook.show();