class Bible{

    objs=null;
    obj_data_cur=null;

    show(){
        carrot.bible.list();
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.bible.add(\'old_testament\');" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Old testament</button>';
                html+='<button onclick="carrot.bible.add(\'new_testament\');" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add New testament</button>';
                html+=carrot.tool.btn_export("bible");
                html+='<button onclick="carrot.bible.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+=carrot.langs.list_btn_lang_select('btn-success');
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    list(){
        carrot.change_title("List all bible","?page=bible","bible");
        carrot.loading("Get all data Bible");
        carrot.bible.get_data(carrot.bible.load_list_by_data);
    }

    get_data(act_done){
        if(carrot.check_ver_cur("bible")==false){
            carrot.update_new_ver_cur("bible",true);
            carrot.bible.get_data_from_server(act_done);
        }else{
            carrot.bible.get_data_from_db(act_done,()=>{
                carrot.bible.get_data_from_server(act_done);
            });
        }
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("bible");
        q.add_select("name");
        q.add_select("type");
        q.add_where("lang",carrot.langs.lang_setting);
        q.set_order("order","ASCENDING");
        q.get_data((data)=>{
            carrot.bible.objs=data;
            $(data).each(function(index,bible){
                carrot.data.add("bible",bible);
            })
            act_done(data);
        });
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("bible").then((datas)=>{
            carrot.bible.objs=datas;
            act_done(datas);
        }).catch(act_fail);
    }

    add(type="old_testament"){
        var data_new=new Object();
        data_new["id"]=carrot.create_id();
        data_new["name"]="";
        data_new["type"]=type;
        data_new["lang"]=carrot.langs.lang_setting;
        data_new["order"]=carrot.bible.objs.length;
        carrot.bible.frm_add_or_edit(data_new).set_title("Add Book").set_msg_done("Add book success!").show();
    }

    edit(data,carrot){
        carrot.bible.frm_add_or_edit(data).set_title("Edit Book").set_type("edit").set_msg_done("Edit book success!").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_bible",carrot);
        frm.set_icon("fa-solid fa-book-bible");
        frm.set_db("bible","id");
        frm.create_field("id").set_label("Book Id").set_value(data["id"]).set_type("id").set_main();
        frm.create_field("name").set_label("Book Name").set_value(data["name"]).add_btn_toLower();
        frm.create_field("type").set_label("Book Type").add_option("old_testament","Old Testament").add_option("new_testament","New Testament").set_type("select").set_value(data["type"]);
        var field_lang=frm.create_field("lang").set_label("Book Lang").set_value(data["lang"]).set_type("select");
        $(carrot.langs.list_lang).each(function(index,lang){
            field_lang.add_option(lang.key,lang.name);
        });
        frm.create_field("order").set_label("Book Order").set_value(data["order"]).set_type("number");
        frm.set_act_done("carrot.bible.reload_list()");
        return frm;
    }

    box_item(book){
        var item_book=new Carrot_List_Item(carrot);
        item_book.set_id(book.id_doc);
        item_book.set_class("col-12 mt-1");
        item_book.set_icon_font("fa-solid fa-book bible_icon");
        item_book.set_class_body("col-11");
        item_book.set_name(book.name);
        item_book.set_db("bible");
        item_book.set_obj_js("bible");
        item_book.set_act_edit("carrot.bible.edit");
        item_book.set_act_click("carrot.bible.show_info(\'"+book.id_doc+"\')");
        var html_body='';
        html_body+='<div class="col-6">'+book.name+'</div>';
        html_body+='<div class="col-6 dev text-end">';
            html_body+='<i role="button" book_name="'+book.id_doc+'" onclick="carrot.bible.list_chapter(\''+book.id_doc+'\')" class="fa-solid fa-rectangle-list m-1"></i>';
            html_body+='<i role="button" book_name="'+book.id_doc+'" onclick="carrot.bible.add_chapter_to_book(\''+book.id_doc+'\')" class="fa-solid fa-folder-plus m-1"></i>';
        html_body+='</div>';
        item_book.set_body(html_body);
        return item_book;
    }

    load_list_by_data(data){
        carrot.hide_loading();
        var html='';
        html+=carrot.bible.menu();
        html+='<div class="row mt-2">';
            html+='<div class="col col-6">';
                html+='<h5><i class="fa-solid fa-book-bible text-info"></i> Old testament</h5>';
                html+='<button onclick="carrot.bible.add(\'old_testament\')" class="btn btn-success btn-sm mt-3 dev"><i class="fa-solid fa-book-medical"></i> Add Book </button>';
                html+='<div class="row" id="old_bible"></div>';
            html+='</div>';

            html+='<div class="col col-6">';
                html+='<h5><i class="fa-solid fa-book-bible text-success"></i> New Testament</h5>';
                html+='<button onclick="carrot.bible.add(\'new_testament\')" class="btn btn-success btn-sm mt-3 dev"><i class="fa-solid fa-book-medical"></i> Add Book </button>';
                html+='<div class="row" id="new_bible"></div>';
            html+='</div>';
        html+='</div>';

        carrot.show(html);
        $(data).each(function(index,bible){
            bible["index"]=index;
            if(bible.type=="old_testament")
                $("#old_bible").append(carrot.bible.box_item(bible).html());
            else
                $("#new_bible").append(carrot.bible.box_item(bible).html());
        });
        carrot.bible.check_event();
    }

    list_chapter(id){
        carrot.loading("Get data bible ("+id+")");
        carrot.bible.get(id,(data)=>{
            carrot.hide_loading();
            var html='';
            $(data.contents).each(function(index,chapter){
                html+='<div role="button" class="d-block m-1 text-justify bg-light">';
                html+='<i class="fa-solid fa-note-sticky"></i> '+chapter.name+' ('+chapter.paragraphs.length+')';
                html+='<button index="'+index+'" name_chapter="'+chapter.name+'" onclick="carrot.bible.delete_chapter(this);return false;" class="btn btn-sm btn-danger float-end"><i class="fa-solid fa-trash-can"></i></button>';
                html+='<button index="'+index+'" onclick="carrot.bible.edit_chapter(this);return false;" class="btn btn-sm btn-secondary float-end"><i class="fa-solid fa-file-pen"></i></button>';
                html+='</div>';
            });

            Swal.fire({
                title: data.name,
                html: html,
                showCloseButton: true,
                focusConfirm: false
            });
        },()=>{
            carrot.msg("Error","error");
        });
    }

    get(id,act_done,act_fail){
        carrot.data.get("bible_info",id,(data)=>{
            act_done(data);
        },()=>{
            carrot.server.get("bible",id,(data)=>{
                carrot.data.add("bible_info",data);
                act_done(data);
            },act_fail);
        });
    }

    show_info(id){
        carrot.loading("Get and show info "+id);
        carrot.bible.get(id,carrot.bible.info,()=>{ carrot.msg("Error","error");});
    }

    info(data){
        carrot.bible.obj_data_cur=data;
        carrot.hide_loading();
        var html='';
        html+=carrot.bible.menu();
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_title(data.name);
        box_info.set_icon_font("fa-solid fa-book-bible");
        box_info.add_body('<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_bible">Related Bible</h4>','<div id="all_paragraphs"></div>');

        box_info.add_attrs('fa-solid fa-book-journal-whills','<l class="lang" key_lang="bible_type">Type</l>',data.type);
        box_info.add_attrs('fa-solid fa-paragraph','<l class="lang" key_lang="bible_count_p">Paragraphs</l>',data.contents.length);
        box_info.add_attrs('fa-solid fa-file','Ebook File',data.name+".epub");
        box_info.add_attrs('fa-solid fa-language','<l class="lang" key_lang="country">Country</l>',data.lang);

        html+=box_info.html();
        carrot.show(html);

        $(data.contents).each(function(index,c){
            $(c.paragraphs).each(function(index_p,p){
                $("#all_paragraphs").append('<small class="fs-8" style="position: relative;bottom: 1ex;font-size: 80%;">'+(index_p+1)+'</small> <span class="text-dark">'+p+'</span> ');
            });
        });
        
        carrot.bible.check_event();
    }

    get_list_by_key_lang(s_key){
        carrot.loading("Get all bible ("+s_key+")");
        carrot.langs.lang_setting=s_key;
        carrot.data.clear("bible");
        setTimeout(()=>{
            carrot.bible.get_data(carrot.bible.load_list_by_data);
        },2);
    }

    check_event(){
        if(carrot.bible.obj_data_cur!=null)
            carrot.tool.list_other_and_footer("bible","type",carrot.bible.obj_data_cur.type);
        else
            carrot.tool.list_other_and_footer("bible");
        carrot.check_event();
        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            carrot.bible.get_list_by_key_lang(key_change);
        });
    }

    delete_all_data(){
        carrot.bible.objs=null;
        carrot.data.clear("bible");
        carrot.data.clear("bible_info");
        carrot.msg("Delete all data bible success!","success");
    }

    reload_list(){
        carrot.bible.objs=null;
        carrot.data.clear("bible");
        setTimeout(carrot.bible.list,500);
    }
}
carrot.bible=new Bible();
if(carrot.call_show_on_load_pagejs) carrot.bible.show();