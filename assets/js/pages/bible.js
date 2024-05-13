class Bible{

    objs=null;
    obj_data_cur=null;
    type_view='';

    show(){
        carrot.bible.list();
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                if(carrot.bible.type_view=='info') html+='<button onclick="carrot.bible.list();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-caret-left"></i> <l class="lang" key_lang="back">Back</l></button>';
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
    
    get_edit_chapter_by_id_bible(id){
        carrot.loading("Get data bible ("+id+")");
        carrot.bible.get(id,(data)=>{
            carrot.hide_loading();
            carrot.bible.obj_data_cur=data;
        })
    }

    add_chapter_to_book(emp){
        var new_data_chapter=new Object();
        new_data_chapter["name"]="";
        new_data_chapter["tip"]="";
        this.model_chapter_to_book="add";
        this.frm_add_or_edit_chapter(new_data_chapter).set_title("Add Chapter To Book").show();
    }

    edit_chapter(emp){
        var index_chapter=$(emp).attr("index");
        var name_book=$(this.emp_book_cur_edit).attr("book_name");
        var data_book=JSON.parse(this.obj_bibles[name_book]);
        var contents=data_book["contents"];
        this.emp_book_cur_edit["index_chapter"]=index_chapter;
        this.model_chapter_to_book="update";
        this.frm_add_or_edit_chapter(contents[index_chapter]).set_title("Edit Chapter Book").show();
        Swal.close();
    }

    frm_add_or_edit_chapter(data){
        var frm=new Carrot_Form("frm_chapter",carrot);
        var html_msg='';
        html_msg+='<i class="fa-solid fa-book fa-2x"></i> '+$(this.emp_book_cur_edit).attr("book_name");
        frm.create_field("msg").set_value(html_msg).set_type("msg");
        frm.set_icon("fa-solid fa-book-tanakh");
        frm.create_field("name").set_label("chapter Name").set_value(data["name"]);
        frm.create_field("tip").set_label("chapter Tip").set_value(data["tip"]);
        var html_contain='';
        html_contain+="<div id='paragraphs'>";
        if(data.paragraphs!=null)
            this.count_chapter=data.paragraphs.length;
        else
            this.index_chapter=0;
        $(data.paragraphs).each(function(index,data){
            html_contain+='<div class="input-group">';
            html_contain+='<div class="input-group-prepend">';
                html_contain+='<div class="input-group-text">'+(index+1)+'</div>';
            html_contain+='</div>';
            html_contain+='<input type="text" class="form-control paragraph" value="'+data+'"   placeholder="Enter Paragraph"/>';
            html_contain+='<div class="input-group-prepend">';
                html_contain+='<div role="button" onclick="carrot.bible.delete_paragraph(this);return false;" class="input-group-text btn-danger"><i class="fa-solid fa-delete-left"></i> &nbsp</div>';
            html_contain+='</div>';
            html_contain+='</div>';
        });
        html_contain+="</div>";
        html_contain+='<button onclick="carrot.bible.add_paragraph();return false;" class="btn btn-sm btn-light"><i class="fa-solid fa-plus"></i> Add paragraph</button>';
        frm.create_field("contain").set_type("msg").set_value(html_contain);
        var btn_add=frm.create_btn();
        btn_add.set_label("Add Chapter");
        btn_add.set_icon("fa-solid fa-square-check");
        btn_add.set_onclick("carrot.bible.act_done_chapter_to_book()");

        var btn_add_by_text=frm.create_btn();
        btn_add_by_text.set_label("Add by Text");
        btn_add_by_text.set_icon("fa-solid fa-square-check");
        btn_add_by_text.set_onclick("carrot.bible.add_paragraph_by_text()");
        frm.off_btn_done();
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
            html_body+='<i role="button" book_name="'+book.id_doc+'" onclick="carrot.bible.get_edit_chapter_by_id_bible(\''+book.id_doc+'\')" class="fa-solid fa-folder-plus m-1"></i>';
        html_body+='</div>';
        item_book.set_body(html_body);
        return item_book;
    }

    load_list_by_data(data){
        carrot.bible.type_view="list";
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
        carrot.change_title(data.name,"?page=bible&id="+data.id_doc,"bible");
        carrot.bible.type_view='info';
        carrot.bible.obj_data_cur=data;
        carrot.hide_loading();
        var html='';
        html+=carrot.bible.menu();
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_title(data.name);
        box_info.set_icon_font("fa-solid fa-book-bible");
        box_info.add_body('<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_bible">Related Bible</h4>','<div id="bible_contents"></div>');

        box_info.add_attrs('fa-solid fa-book-journal-whills','<l class="lang" key_lang="bible_type">Type</l>',data.type);
        box_info.add_attrs('fa-solid fa-paragraph','<l class="lang" key_lang="bible_count_p">Paragraphs</l>',data.contents.length);
        box_info.add_attrs('fa-solid fa-file','Ebook File',data.name+".epub");
        box_info.add_attrs('fa-solid fa-language','<l class="lang" key_lang="country">Country</l>',data.lang);

        box_info.add_btn("btn_download","fa-solid fa-file-arrow-down","Download","carrot.bible.act_download()");
        box_info.add_btn("btn_pay","fa-brands fa-paypal","Download","carrot.bible.pay()");

        html+=box_info.html();
        carrot.show(html);
        var html_list='';
        html_list+='<div class="row">';
        html_list+='<div class="col-2" style="font-size:10px">';
        html_list+='<div class="list-group" id="list-tab" role="tablist">';
        $(data.contents).each(function(index,c){
            var s_class='';
            if(index==0) s_class='active';
            html_list+='<a class="list-group-item list-group-item-action '+s_class+'" id="c_'+index+'" data-bs-toggle="list" href="#c_'+index+'_body" role="tab" aria-controls="c_'+index+'_body"><l class="lang" key_lang="chapter">Chapter</l> '+(index+1)+'  <i style="font-size:3px;color:gray" class="fa-solid fa-circle"></i>  <span class="float-right badge bg-success text-white">'+c.paragraphs.length+'</span></a>';
        });
        html_list+='</div>';
        html_list+='</div>';
        html_list+='<div class="col-10">';
        html_list+='<div class="tab-content" id="nav-tabContent">';
        $(data.contents).each(function(index,c){
            var s_class='';
            if(index==0) s_class='show active';
            html_list+='<div class="tab-pane fade '+s_class+'" id="c_'+index+'_body" role="tabpanel" aria-labelledby="c_'+index+'">'
            $(c.paragraphs).each(function(index_p,p){
                html_list+='<small class="fs-8" style="position: relative;bottom: 1ex;font-size: 80%;">'+(index_p+1)+'</small> <span class="text-dark">'+p+'</span> ';
            });
            html_list+='</div>';
        });
        html_list+='</div>';
        html_list+='</div>';
        html_list+='</div>';
        $("#bible_contents").append(html_list);
        
        $("#btn_download").removeClass("d-inline");
        $("#btn_pay").removeClass("d-inline");

        if(carrot.bible.check_pay(data.id_doc)){
            $("#btn_download").show();
            $("#btn_pay").hide();
        }else{
            $("#btn_download").hide();
            $("#btn_pay").show();
        }

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

    pay(){
        carrot.show_pay("bible","Download Bible ("+carrot.bible.obj_data_cur.name+")","Download the source code file to use","2.00",carrot.bible.pay_success);
    }
    
    pay_success(carrot){
        $("#btn_download").show();
        $("#btn_pay").hide();
        localStorage.setItem("buy_bible_"+carrot.bible.obj_data_cur.id_doc,"1");
        carrot.bible.download_bible();
    }

    download_bible() {
        var ebook_file=new Carrot_Ebook_File();
        var contents=carrot.bible.obj_data_cur.contents;
        ebook_file.set_lang(carrot.bible.obj_data_cur.lang);
        ebook_file.set_title(carrot.bible.obj_data_cur.name);
        $(contents).each(function(index,chapter){
            var xhtml='';
            var paragraphs=chapter.paragraphs;
            for(var i=0;i<paragraphs.length;i++){
                xhtml+='<p><sup>'+(i+1)+'</sup> '+paragraphs[i]+'</p>';
            };
            ebook_file.add_chapter("Chapter "+(index+1),xhtml);
        });
        ebook_file.download();
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

    check_pay(id){
        if(localStorage.getItem("buy_bible_"+id)!=null)
            return true;
        else
            return false;
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