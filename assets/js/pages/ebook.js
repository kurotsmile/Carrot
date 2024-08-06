class EBook{

    objs=null;
    ebook_category=null;
    obj_ebook_cur=null;

    orderBy_at="date";
    orderBy_type="DESCENDING";
    type_category_show="all";
    type_view="list_ebook";
    type_content_show="view";
    data_img_cover=null;

    index_chapter_edit=-1;

    constructor(){
        if(!carrot.tool.isClassLoaded("Carrot_Ebook_File")) $('head').append('<script type="text/javascript" src="assets/js/carrot_ebook_file.js?ver='+carrot.get_ver_cur("js")+'"></script>');
    }

    show(){
        var id=carrot.get_param_url("id");
        if(id!=undefined)
            carrot.ebook.show_info_by_id(id);
        else
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
            html+='<div class="col-10">';
                html+='<div class="btn-group m-1" role="group">';
                html+='<button onclick="carrot.ebook.add();return false;" class="btn btn-success btn-sm"><i class="fa-solid fa-marker"></i> Write a book</button>';
                html+='<button onclick="carrot.ebook.add_category();return false;" class="btn btn-success dev btn-sm"><i class="fa-solid fa-square-plus"></i> Add Category</button>';
                html+='</div>';

                html+='<div class="btn-group m-1" role="group">';
                    if(carrot.ebook.type_view=='info') html+='<button onclick="carrot.ebook.list();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-caret-left"></i> <l class="lang" key_lang="back">Back</l></button>';
                    if(carrot.ebook.type_view=="list_ebook") s_class="active"; else s_class="";
                    html+='<button onclick="carrot.ebook.list();return false;" class="btn '+s_class+' btn-success btn-sm"><i class="fa-solid fa-swatchbook"></i> list Ebook</button>';
                    if(carrot.ebook.type_view=="list_category") s_class="active"; else s_class="";
                    html+='<button onclick="carrot.ebook.list_category();return false;" class="btn '+s_class+' btn-success btn-sm"><i class="fa-solid fa-hurricane"></i> list Category</button>';
                html+='</div>';

                html+='<div class="btn-group m-1" role="group">';
                html+='<button onclick="carrot.ebook.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+=carrot.tool.btn_export("ebook","Ebook")+carrot.tool.btn_export("ebook_category","Category");
                html+='</div>';

                html+='<div class="btn-group" role="group">';
                html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_ebook_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> <l class="lang" key_lang="genre">Category</l> ('+carrot.ebook.type_category_show+')</button>';
                html+='<div class="dropdown-menu" aria-labelledby="btn_list_ebook_category" id="list_ebook_category"></div>';
                html+='</div>';

            html+='</div>';

            html+='<div class="col-2">';
                html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="End group">';
                html+=carrot.langs.list_btn_lang_select('btn-success','carrot.ebook.get_list_by_key_lang');
                html+='</div>';
            html+='</div>';
            
        html+='</div>';
        return html;
    }

    list(){
        carrot.change_title("All Ebook",carrot.url()+"?page=ebook","ebook");
        carrot.ebook.type_view="list_ebook";
        carrot.loading("Get all data Ebook and show");
        carrot.ebook.get_data(carrot.ebook.load_list_by_data);
    }

    get_list_by_key_lang(s_key){
        carrot.loading("Get all Ebook ("+s_key+")");
        carrot.langs.lang_setting=s_key;
        carrot.data.clear("ebook");
        setTimeout(()=>{
            carrot.ebook.get_data(carrot.ebook.load_list_by_data);
        },500);
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
            carrot.ebook.check_event();
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
        item_cat.set_id(cat.id_doc);
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
        }),()=>{ carrot.msg("Error","error");});
    }

    info(data){
        carrot.ebook.obj_ebook_cur=data;
        carrot.ebook.type_view="info";
        carrot.change_title(data.title,carrot.url()+"?page=ebook&id="+data.id_doc,"ebook");
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
        info.add_attrs("fa-solid fa-thermometer",'<l class="lang" key_lang="status">Status</l>',data.status);
        info.add_attrs("fa-solid fa-calendar-days",'<l class="lang" key_lang="date">Date Public</l>',data.date);
        info.set_protocol_url("ebook://show/"+data.id_doc);

        info.add_btn("btn_download_trial","fa-solid fa-download","Download (trial)","carrot.ebook.download(true)");
        info.add_btn("btn_download","fa-solid fa-file-arrow-down","Download (full)","carrot.ebook.download()");
        info.add_btn("btn_pay","fa-brands fa-paypal","Download (full)","carrot.ebook.pay()");

        info.add_body('<h4 class="fw-semi fs-5 lang" key_lang="describe">Describe</h4>',data.describe);
        var html_head='<div class="text-center">';
        html_head+='<button id="btn_ebook_menu" onclick="carrot.ebook.table_of_contents()" class="btn d-inline btn-success m-1"><i class="fa-brands fa-elementor"></i> <l class="lang" key_lang="table_of_contents">Table of contents</l> </button>';
        if(data.user.id==carrot.user.get_user_login_id()) html_head+='<button role="button" onclick="carrot.ebook.edit_info_book_cur()" type="button" class="btn d-inline btn-warning m-1"><i class="fa-solid fa-pen-to-square"></i> <l class="lang" key_lang="edit_info">Edit Info</l> </button>';
        html_head+='</div>';
        info.set_header_right(html_head);

        info.add_body('<h4 id="ebook_contents_title" class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="content">Content</h4>','<div id="ebook_contents"></div>');

        info.set_db("ebook");
        info.set_obj_js("ebook");
        carrot.show(carrot.ebook.menu()+info.html());

        $("#btn_download_trial").removeClass("d-inline");
        $("#btn_download").removeClass("d-inline");
        $("#btn_pay").removeClass("d-inline");

        if(carrot.ebook.check_pay(data.id_doc)){
            $("#btn_download").show();
            $("#btn_pay").hide();
            $("#btn_download_trial").hide();
        }else{
            $("#btn_download").hide();
            $("#btn_pay").show();
            $("#btn_download_trial").show();
        }

        $("#ebook_contents").append(carrot.ebook.box_content(data));
        carrot.ebook.check_event();
        carrot.ebook.reader_cover_image_data();
    }

    box_content(data){
        var html_list='';
        html_list+='<div class="row">';
        html_list+='<div class="col-2" style="font-size:10px">';
        html_list+='<div class="list-group" id="list-tab" role="tablist">';
        $(data.contents).each(function(index,c){
            var s_class='';
            if(index==0) s_class='active';
            html_list+='<a class="list-group-item list-group-item-action '+s_class+'" id="c_'+index+'" data-bs-toggle="list" href="#c_'+index+'_body" role="tab" aria-controls="c_'+index+'_body"><l class="lang" key_lang="chapter">Chapter</l> '+(index+1);
            html_list+=' <span class="btn btn-info btn-sm dev fs-9" role="button" onclick="carrot.ebook.edit_chapter(\''+index+'\');return false;"><i class="fa-solid fa-pen-to-square"></i></span>';
            html_list+=' <span class="btn btn-danger btn-sm dev fs-9" role="button" onclick="carrot.ebook.delete_chapter(\''+index+'\');return false;"><i class="fa-solid fa-trash-can"></i></span>';
            html_list+='</a>';
        });

        html_list+='<a onclick="carrot.ebook.add_chapter()" class="list-group-item bg-success text-white dev" role="button" ><i class="fa-solid fa-square-plus"></i> Add Chapter</a>';

        html_list+='</div>';
        html_list+='</div>';
        html_list+='<div class="col-10">';
        html_list+='<div class="tab-content" id="nav-tabContent">';
        $(data.contents).each(function(index,c){
            var s_class='';
            if(index==0) s_class='show active';
            html_list+='<div class="tab-pane fade '+s_class+'" id="c_'+index+'_body" role="tabpanel" aria-labelledby="c_'+index+'">'
            if(c.title!=undefined) html_list+='<h5>'+c.title+'</h5>';
            html_list+=c.content;
            html_list+='</div>';
        });
        html_list+='</div>';
        html_list+='</div>';
        html_list+='</div>';
        return html_list;
    }

    reader_cover_image_data(){
        if(carrot.ebook.obj_ebook_cur!=null){
            if(carrot.ebook.obj_ebook_cur.icon!=null){
                carrot.file.get_base64data_file(carrot.ebook.obj_ebook_cur.icon).then((data)=>{
                    carrot.tool.resizeImage(data, 740, 1186).then((result) => {
                        carrot.ebook.data_img_cover=carrot.tool.makeblob(result);
                    });
                });
            }
        }
    }

    show_chapter_by_index(index){
        $('#c_'+index).tab('show');
        Swal.close();
        carrot.ebook.scroll_to_contain();
    }

    table_of_contents(){
        var html='';
        html+='<div class="d-block">';
        $(carrot.ebook.obj_ebook_cur.contents).each(function(index,chapter){
            html+='<a role="button" onclick="carrot.ebook.show_chapter_by_index(\''+index+'\');return false;" class="text-justify btn d-block btn-success btn-sm m-1">'+chapter.title+'</a>';
        });
        html+='</div>';
        Swal.fire({
            title:carrot.l("table_of_contents","Table of contents"),
            html:html
        });
    }

    check_event(){
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
        });

        if(carrot.ebook.obj_ebook_cur!=null){
            $(".list-group-item.list-group-item-action").click(()=>{
                carrot.ebook.scroll_to_contain();
            });
            carrot.tool.list_other_and_footer("ebook","category",carrot.ebook.obj_ebook_cur.category);
        }else{
            carrot.tool.list_other_and_footer("ebook");
        }

        carrot.tool.box_app_tip("ERead Now");
        carrot.check_event();
    }

    check_pay(id){
        if(localStorage.getItem("buy_ebook_"+id)!=null)
            return true;
        else
            return false;
    }

    pay(){
        carrot.show_pay("Ebook","Download Ebook ("+carrot.ebook.obj_ebook_cur.title+")","Download the Ebook file (epub) to use","2.00",carrot.ebook.pay_success);
    }

    pay_success(carrot){
        $("#btn_download").show();
        $("#btn_download_trial").hide();
        $("#btn_pay").hide();
        localStorage.setItem("buy_ebook_"+carrot.ebook.obj_ebook_cur.id_doc,"1");
        carrot.ebook.download();
    }

    download(trial=false){
        var ebook_file=new Carrot_Ebook_File();
        ebook_file.set_title(carrot.ebook.obj_ebook_cur.title);
        ebook_file.set_lang(carrot.ebook.obj_ebook_cur.lang);
        if(carrot.ebook.obj_ebook_cur.author!=null) ebook_file.set_author(carrot.ebook.obj_ebook_cur.author);
        if(carrot.ebook.obj_ebook_cur.category!=null) ebook_file.set_type(carrot.ebook.obj_ebook_cur.category);
        if(carrot.ebook.data_img_cover!=null) ebook_file.set_data_image_cover(carrot.ebook.data_img_cover);
        $(carrot.ebook.obj_ebook_cur.contents).each(function(index,content){
            if(trial){
                if(index>=(carrot.ebook.obj_ebook_cur.contents.length/2)) return false;
                ebook_file.add_chapter(content.title,content.content);
            }
            else{
                ebook_file.add_chapter(content.title,content.content);
            }
        });
        ebook_file.download();
    }

    scroll_to_contain(){
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#ebook_contents_title").offset().top
        }, 500);
    }

    add_chapter(){
        carrot.ebook.index_chapter_edit=-1;
        var data_new={};
        data_new["title"]="";
        data_new["content"]="";
        carrot.ebook.frm_add_or_edit_chapter(data_new).set_title("Add Chapter").set_act_done("carrot.ebook.act_done_add_chapter").show();
    }

    edit_chapter(index){
        carrot.ebook.index_chapter_edit=index;
        carrot.ebook.frm_add_or_edit_chapter(carrot.ebook.obj_ebook_cur.contents[index]).set_title("Edit Chapter").show();
    }

    frm_add_or_edit_chapter(data){
        var frm=new Carrot_Form("frm_ebook",carrot);
        frm.set_icon("fa-solid fa-quote-left");
        frm.create_field("title_chapter").set_label("Title").set_val(data["title"]);
        frm.create_field("content_chapter").set_label("Content").set_val(data["content"]).set_type("editor");
        frm.off_btn_done();

        var btn_done=new Carrot_Btn();
        btn_done.set_icon("fa-solid fa-circle-check");
        btn_done.set_act("carrot.ebook.act_done_add_chapter()");
        frm.add_btn(btn_done);
        return frm;
    }

    act_done_add_chapter(){
        var title_chapter=$("#title_chapter").val();
        var content_chapter=$("#content_chapter").val();
        if(carrot.ebook.index_chapter_edit==-1){
            carrot.ebook.obj_ebook_cur.contents.push({title:title_chapter,content:content_chapter});
        }else{
            carrot.ebook.obj_ebook_cur.contents[carrot.ebook.index_chapter_edit].title=title_chapter;
            carrot.ebook.obj_ebook_cur.contents[carrot.ebook.index_chapter_edit].content=content_chapter;
        }
        $("#ebook_contents").html(carrot.ebook.box_content(carrot.ebook.obj_ebook_cur));
        if(carrot.ebook.index_chapter_edit==-1){
            var washingtonRef = carrot.db.collection("ebook").doc(carrot.ebook.obj_ebook_cur.id_doc);
            washingtonRef.update({
                contents: firebase.firestore.FieldValue.arrayUnion({title:title_chapter,content:content_chapter})
            });
            carrot.msg("Add Chapter ("+title_chapter+") success!");
            carrot.check_event();
            $('#box').modal('hide');
        }
        else{
            carrot.set_doc("ebook",carrot.ebook.obj_ebook_cur.id_doc,carrot.ebook.obj_ebook_cur);
            carrot.msg("Update Chapter ("+title_chapter+") success!");
            carrot.check_event();
            carrot.ebook.show_chapter_by_index(carrot.ebook.index_chapter_edit);
            $('#box').modal('hide');
        }
    }

    delete_chapter(index){
        Swal.fire({
            title: 'Are you sure?',
            text: "Delete Chapter ("+carrot.ebook.obj_ebook_cur.title+")-> "+carrot.ebook.obj_ebook_cur.contents[index].title+" ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed){
                carrot.ebook.obj_ebook_cur.contents.splice(index,1);
                carrot.set_doc("ebook",carrot.ebook.obj_ebook_cur.id_doc,carrot.ebook.obj_ebook_cur);
                Swal.close();
                setTimeout(()=>{
                    $("#ebook_contents").html(carrot.ebook.box_content(carrot.ebook.obj_ebook_cur));
                    carrot.check_event();
                    carrot.ebook.show_chapter_by_index(0);
                },500);
            }
        })
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