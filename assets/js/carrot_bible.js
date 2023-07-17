class Carrot_Bible{
    carrot;
    icon="fa-solid fa-book-bible";
    id_page="bible";
    emp_book_cur_edit=null;
    obj_bibles=null;
    obj_bible_cur=null;

    model_chapter_to_book="add";
    count_chapter=0;

    constructor(carrot){
        this.carrot=carrot;
        this.carrot.register_page(this.id_page,"carrot.bible.list()","carrot.bible.edit_book","carrot.bible.show_list_book_in_bible","carrot.bible.reload");
        this.carrot.register_page("bible_chapter","carrot.bible.list()","carrot.bible.edit_book","carrot.bible.show_all_paragraph_in_chapter","carrot.bible.reload");
        var btn_list=this.carrot.menu.create("bible").set_label("Bible").set_lang("bible").set_icon(this.icon).set_type("main");
        $(btn_list).click(function(){carrot.bible.list();});

        if(localStorage.getItem("obj_bibles")!=null) this.obj_bibles=JSON.parse(localStorage.getItem("obj_bibles"));
    }

    save_obj(){
        localStorage.setItem("obj_bibles",JSON.stringify(this.obj_bibles));
    }

    list(){
        this.get_list_by_key_lang(this.carrot.lang);
    }

    get_list_by_key_lang(s_key){
        console.log("load bible:"+s_key);
        this.carrot.langs.lang_setting=s_key;
        this.carrot.db.collection(this.id_page).where("lang", "==", s_key).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.obj_bibles=new Object();
                querySnapshot.forEach((doc) => {
                    var data_book=doc.data();
                    data_book["id"]=doc.id;
                    this.obj_bibles[doc.id]=JSON.stringify(data_book);
                });
                this.save_obj();
                this.act_get_list_book_done(this.obj_bibles,this.carrot);
            }else{
                this.act_get_list_book_done(null,this.carrot);
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
        });
    }

    act_get_list_book_done(books,carrot){
        carrot.change_title_page("Bible","?p="+carrot.bible.id_page,carrot.bible.id_page);
        var list_book=Array();
        if(books!=null) list_book=carrot.obj_to_array(books);
        var html='';
        var html_old_testament='';
        var html_new_testament='';

        list_book.sort((a,b) => a.order - b.order); 

        $(list_book).each(function(index,book){
            var item_book=carrot.bible.box_book_item(book);
            item_book.set_index(book.order);
            if(book.type=="old_testament")
                html_old_testament+=item_book.html();   
            else
                html_new_testament+=item_book.html();
        });

        html+=carrot.langs.list_btn_lang_select();
        html+='<div class="row mt-2">';
            html+='<div class="col col-6">';
                html+='<h5><i class="fa-solid fa-book-bible text-info"></i> Old testament</h5>';
                html+='<button onclick="carrot.bible.add_book_old_testament()" class="btn btn-success btn-sm mt-3 dev"><i class="fa-solid fa-book-medical"></i> Add Book </button>';
                html+='<div class="row">'+html_old_testament+'</div>';
            html+='</div>';

            html+='<div class="col col-6">';
                html+='<h5><i class="fa-solid fa-book-bible text-success"></i> New Testament</h5>';
                html+='<button onclick="carrot.bible.add_book_new_testament()" class="btn btn-success btn-sm mt-3 dev"><i class="fa-solid fa-book-medical"></i> Add Book </button>';
                html+='<div class="row">'+html_new_testament+'</div>';
            html+='</div>';
        html+='</div>';
        carrot.show(html);

        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            carrot.bible.get_list_by_key_lang(key_change);
        });

        carrot.bible.check_event();
    }

    box_book_item(book){
        var item_book=new Carrot_List_Item(this.carrot);
        item_book.set_id(book.id);
        item_book.set_class("col-12 mt-1");
        item_book.set_icon_font("fa-solid fa-book bible_icon");
        item_book.set_class_body("col-11");
        item_book.set_name(book.name);
        item_book.set_db("bible");
        item_book.set_act_edit("carrot.bible.edit_book");
        var html_body='';
        html_body+='<div class="col-6">'+book.name+'</div>';
        html_body+='<div class="col-6 dev text-end">';
            html_body+='<i role="button" book_name="'+book.id+'" onclick="carrot.bible.list_chapter(this)" class="fa-solid fa-rectangle-list m-1"></i>';
            html_body+='<i role="button" book_name="'+book.id+'" onclick="carrot.bible.add_chapter_to_book(this)" class="fa-solid fa-folder-plus m-1"></i>';
        html_body+='</div>';
        item_book.set_body(html_body);
        return item_book;
    }

    show_list_book_in_bible(id_bible,carrot){
        carrot.bible.list_pub_bible_chapter(id_bible);
    }

    list_pub_bible_chapter(id_book){
        var html='';
        var data_book=JSON.parse(this.obj_bibles[id_book]);
        var contents=data_book.contents;
        this.carrot.change_title_page(data_book.name,"?p=bible&id="+data_book.id,"bible");
        this.obj_bible_cur=data_book;
        html+='<div class="row">';
        html+='<div class="col-12"><button onclick="carrot.bible.list();return false;" class="btn btn-sm btn-secondary"><i class="fa-solid fa-square-caret-left"></i> Back</button></div>';
        html+='</div>';

        html+='<div class="row">';
        $(contents).each(function(index,bible){
            bible["id"]=index;
            html+=carrot.bible.box_chapter_item(bible);
        });
        html+='</div>'
        this.carrot.show(html);
        this.carrot.bible.check_event();
    }

    back_list_bible_chapter(){
        this.list_pub_bible_chapter(this.obj_bible_cur.id);
    }

    show_all_paragraph_in_chapter(index_chapter,carrot){
        carrot.bible.list_pub_bible_paragraph_in_chapter(index_chapter,carrot);
    }

    list_pub_bible_paragraph_in_chapter(index_id,carrot){
        var html='';
        var contents=carrot.bible.obj_bible_cur.contents;
        var data_contents=contents[index_id];
        carrot.change_title_page(this.obj_bible_cur.name+" ("+(parseInt(index_id)+1)+")","?p=bible_chapter&id="+this.obj_bible_cur.id+"&chapter="+index_id,"bible_chapter");
        html+='<div class="row m-0">';
        html+='<div class="col-12">';
            html+='<button onclick="carrot.bible.list();return false;" class="btn btn-sm btn-secondary mr-1"><i class="fa-solid fa-synagogue"></i> All Book</button> ';
            html+='<button onclick="carrot.bible.back_list_bible_chapter();return false;" class="btn btn-sm btn-secondary"><i class="fa-solid fa-square-caret-left"></i> Back</button>';
        html+='</div>';
        html+='</div>';

        html+='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';

            html+='<div class="col-8">';
                html+='<div class="about row p-2 py-3 bg-white shadow-sm">';
                    html+='<div class="col-md-2 p-3 text-center">';
                        html+='<i class="fa-solid fa-book-bible fa-5x"></i>';
                    html+='</div>';

                    html+='<div class="col-md-10 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+this.obj_bible_cur.name+'</h4>';
                        html+='<div class="row pt-4">';
                        
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="bible_type">Type</l> <i class="fa-solid fa-book-journal-whills"></i></b>';
                                html+='<p>'+this.obj_bible_cur.type+'</p>';
                            html+='</div>';

                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="bible_count_p">Paragraphs</l> <i class="fa-solid fa-book-quran"></i></b>';
                                html+='<p>'+data_contents.paragraphs.length+'</p>';
                            html+='</div>';

                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>Ebook File <i class="fa-solid fa-file"></i></b>';
                                html+='<p>'+this.obj_bible_cur.name+'.epub</p>';
                            html+='</div>';

                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="country">Country</l> <i class="fa-solid fa-language"></i></b>';
                                html+='<p>'+this.obj_bible_cur.lang+'</p>';
                            html+='</div>';

                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-12">';
                                html+='<button id="btn_share" type="button" class="btn d-inline btn-success m-1"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                                if(carrot.bible.check_pay(carrot.bible.obj_bible_cur.id))
                                    html+='<button id="btn_download" class="btn d-inline btn-success m-1"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l> </button>';
                                else
                                    html+='<button id="btn_download" class="btn d-inline btn-info m-1"><i class="fa-brands fa-paypal"></i> <l class="lang" key_lang="download">Download</l> </button>';
                                
                            html+='</div>';
                        html+='</div>';
                    html+='</div>';
                html+='</div>';

                html+='<div class="about row p-2 py-3 bg-white mt-2 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5" > Chapter '+parseInt(parseInt(index_id)+1)+'</h4>';
                    html+='<div>';
                        $(data_contents.paragraphs).each(function(index,p){
                            html+='<small class="fs-8" style="position: relative;bottom: 1ex;font-size: 80%;">'+(index+1)+'</small> <span class="text-dark">'+p+'</span> ';
                        });
                    html+='</div>';
                html+='</div>';

                html+=carrot.rate.box_comment(this.obj_bible_cur);

            html+='</div>';

            html+='<div class="col-4">';
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_bible">Related Bible</h4>';
            $(this.obj_bible_cur.contents).each(function(index,bible){
                if(index_id!=index){
                    bible["id"]=index;
                    html+=carrot.bible.box_chapter_item(bible,"col-12 mt-1");
                }
            });
            html+='</div>';

        html+='</div>';
        html+='</div>';

        html+=this.list_for_home();
        this.carrot.show(html);
        this.carrot.bible.check_event();

        $("#btn_download").click(function(){
            if(carrot.bible.check_pay(carrot.bible.obj_bible_cur.id))
                carrot.bible.act_download(carrot);
            else
                carrot.show_pay("Bible","Download Bible ("+carrot.bible.obj_bible_cur.name+")","Download bible book","2.99",carrot.bible.pay_success);
        });
    }

    box_chapter_item(data,s_class="col-4 mt-1"){
        var item_chapter=new Carrot_List_Item(this.carrot);
        item_chapter.set_id(data.id);
        item_chapter.set_class(s_class);
        item_chapter.set_icon_font("fa-solid fa-book-tanakh bible_chapter_icon");
        item_chapter.set_class_body("col-11");
        item_chapter.set_label(data.name);
        item_chapter.set_tip(data.tip);
        return item_chapter.html();
    }

    check_event(){
        var carrot=this.carrot;
        if(this.obj_bibles!=null){
            this.carrot.check_event();
            
            $(".bible_icon").click(function(){
                var obj_id=$(this).attr("obj_id");
                carrot.bible.list_pub_bible_chapter(obj_id);
            });

            $(".bible_chapter_icon").click(function(){
                var obj_id=$(this).attr("obj_id");
                carrot.bible.list_pub_bible_paragraph_in_chapter(obj_id,carrot);
            });
        }
    }

    data_bible_new(){
        var list_bible=this.carrot.obj_to_array(this.obj_bibles);
        var data_new=new Object();
        data_new["id"]=this.carrot.create_id();
        data_new["name"]="";
        data_new["type"]="old_testament";
        data_new["lang"]=this.carrot.langs.lang_setting;
        data_new["order"]=list_bible.length;
        return data_new;
    }

    add(){
        var data_new=this.data_bible_new();  
        this.add_book(data_new);
    }

    add_book(data){
        this.frm_add_or_edit(data).set_title("Add Book").set_msg_done("Add book success!").show();
    }

    add_chapter_to_book(emp){
        this.emp_book_cur_edit=emp;
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

    add_book_old_testament(){
        var data_new=this.data_bible_new();
        data_new["type"]="old_testament";
        this.add_book(data_new);
    }

    add_book_new_testament(){
        var data_new=this.data_bible_new();
        data_new["type"]="new_testament";
        this.add_book(data_new);
    }

    edit_book(data,carrot){
        carrot.bible.frm_add_or_edit(data).set_title("Edit Book").set_type("edit").set_msg_done("Edit book success!").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_bible",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("bible","id");
        frm.create_field("id").set_label("Book Id").set_value(data["id"]).set_type("id").set_main();
        frm.create_field("name").set_label("Book Name").set_value(data["name"]).add_btn_toLower();
        frm.create_field("type").set_label("Book Type").add_option("old_testament","Old Testament").add_option("new_testament","New Testament").set_type("select").set_value(data["type"]);
        var field_lang=frm.create_field("lang").set_label("Book Lang").set_value(data["lang"]).set_type("select");
        $(this.carrot.langs.list_lang).each(function(index,lang){
            field_lang.add_option(lang.key,lang.name);
        });
        frm.create_field("order").set_label("Book Order").set_value(data["order"]).set_type("number");
        return frm;
    }

    list_chapter(emp){
        this.emp_book_cur_edit=emp;
        var name_book=$(emp).attr("book_name");
        this.carrot.get_doc("bible",name_book,this.done_list_chapter);
    }

    done_list_chapter(data,carrot){
        var html='';
        $(data.contents).each(function(index,chapter){
            html+='<div role="button" class="d-block m-1 text-justify bg-light">';
            html+='<i class="fa-solid fa-note-sticky"></i> '+chapter.name+' ('+chapter.paragraphs.length+')';
            html+='<button index="'+index+'" onclick="carrot.bible.edit_chapter(this);return false;" class="btn btn-sm btn-danger float-end"><i class="fa-solid fa-trash-can"></i></button>';
            html+='<button index="'+index+'" onclick="carrot.bible.edit_chapter(this);return false;" class="btn btn-sm btn-secondary float-end"><i class="fa-solid fa-file-pen"></i></button>';
            html+='</div>';
        });
        Swal.fire({
            title: data.name,
            html: html,
            showCloseButton: true,
            focusConfirm: false
        });
    }

    frm_add_or_edit_chapter(data){
        var frm=new Carrot_Form("frm_chapter",this.carrot);
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
        frm.off_btn_done();
        return frm;
    } 

    act_done_chapter_to_book(){
        var inp_name=$("#name").val();
        var inp_tip=$("#tip").val();
        var book_name=$(this.emp_book_cur_edit).attr("book_name");
        var chap_data=new Object();
        chap_data["name"]=inp_name;
        chap_data["tip"]=inp_tip;
        var data_book=JSON.parse(this.obj_bibles[book_name]);
        var contents=data_book["contents"];

        var paragraphs=Array();
        $(".paragraph").each(function(indext,emp){
            paragraphs.push($(emp).val());
        });
        chap_data["paragraphs"]=paragraphs;

        if(this.model_chapter_to_book=="add"){
            if(data_book.contents==null) data_book.contents=Array();
            var washingtonRef = this.carrot.db.collection("bible").doc(book_name);
            washingtonRef.update({
                contents: firebase.firestore.FieldValue.arrayUnion(chap_data)
            });
            data_book.contents.push(chap_data);
            this.obj_bibles[book_name]=data_book;
            carrot.msg("Add chapter to book bible successfully!");
        }
        else{
            var index_chapter=this.emp_book_cur_edit["index_chapter"];
            contents[index_chapter]=chap_data;
            data_book["contents"]=contents;
            this.obj_bibles[book_name]=data_book;
            this.carrot.set_doc("bible",book_name,data_book);
            carrot.msg("Update chapter to book bible successfully!");
        }
    }

    add_paragraph(){
        var html='';
        this.count_chapter+=1;
        html+='<div class="input-group">';
            html+='<div class="input-group-prepend">';
                html+='<div class="input-group-text">'+this.count_chapter+'</div>';
            html+='</div>';

            html+='<input id="p_'+this.count_chapter+'" type="text" class="form-control paragraph" value=""   placeholder="Enter Paragraph"/>';

            html+='<div class="input-group-prepend">';
                html+='<div  role="button" onclick="paste_tag(\'p_'+this.count_chapter+'\');return false;" class="input-group-text"><i class="fa-solid fa-clipboard"></i> &nbsp</div>';
            html+='</div>';

            html+='<div class="input-group-prepend">';
                html+='<div  role="button" onclick="carrot.bible.delete_paragraph(this);return false;" class="input-group-text btn-danger"><i class="fa-solid fa-delete-left"></i> &nbsp</div>';
            html+='</div>';

        html+='</div>';
        $("#paragraphs").append(html);
    }

    delete_paragraph(emp){
        $(emp).parent().parent().remove();
    }

    reload(carrot){
        carrot.bible.list();
    }

    act_download(carrot){
        carrot.bible.create_ebook();
    }

    list_for_home(){
        var html='';
        if(this.obj_bibles!=null){
            var list_bible=this.carrot.obj_to_array(this.obj_bibles);
            list_bible= list_bible.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);

            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="bible">Bible</l>';
            html+='<span role="button" onclick="carrot.bible.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div id="other_code" class="row m-0">';
            $(list_bible).each(function (index,b){
                var item_book=carrot.bible.box_book_item(b);
                item_book.set_index(index);
                item_book.set_class("col-4 mt-2");
                html+=item_book.html();
            });
            html+='</div>';
        }
        return html;
    }

    check_pay(id_bible){
        if(localStorage.getItem("buy_"+carrot.bible.id_page+"_"+id_bible)!=null)
            return true;
        else
            return false;
    }

    pay_success(carrot){
        $("#btn_download").removeClass("btn-info").addClass("btn-success").html('<i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l>');
        localStorage.setItem("buy_"+carrot.bible.id_page+"_"+carrot.bible.obj_bible_cur.id,"1");
        carrot.bible.act_download(carrot);
    }

    download_bible(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.carrot.msg("Download Success!");
    }

    create_ebook(){
        var file_mimetype='application/epub+zip';
        var container_xml='';
        var content_opf='';
        var toc_ncx='';
        var zip=new JSZip();
        var book_data=this.obj_bible_cur;
        //console.log(this.obj_bible_cur);
        var contents=book_data.contents;
        container_xml+='<?xml version="1.0" encoding="UTF-8"?>';
        container_xml+='<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">';
            container_xml+='<rootfiles>';
                container_xml+='<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>';
            container_xml+='</rootfiles>';
        container_xml+='</container>';

        toc_ncx+='<?xml version="1.0" encoding="UTF-8"?>';
        toc_ncx+='<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">';
        toc_ncx+='<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">';

            toc_ncx+='<head>';
                toc_ncx+='<meta name="dtb:uid" content="urn:uuid:7a8a677c-ed6b-4ea1-a2dd-d46f4c886a73"/>';
                toc_ncx+='<meta name="dtb:depth" content="1"/>';
                toc_ncx+='<meta name="dtb:totalPageCount" content="0"/>';
                toc_ncx+='<meta name="dtb:maxPageNumber" content="0"/>';
            toc_ncx+='</head>';

            toc_ncx+='<docTitle>';
                toc_ncx+='<text>'+this.obj_bible_cur.name+'</text>';
            toc_ncx+='</docTitle>';

            toc_ncx+='<navMap>';

                $(contents).each(function(index,chapter){
                    toc_ncx+='<navPoint id="navPoint-'+index+'" playOrder="1">';
                    toc_ncx+='<navLabel><text>'+chapter.name+'</text></navLabel>';
                    toc_ncx+='<content src="Text/chapter_'+index+'.xhtml"/>';
                    toc_ncx+='</navPoint>';
                });

            toc_ncx+='</navMap>';

        toc_ncx+='</ncx>';


        content_opf+='<?xml version="1.0" encoding="utf-8"?>';
        content_opf+='<package version="2.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">';

            content_opf+='<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">';
                content_opf+='<dc:identifier opf:scheme="UUID" id="BookId">urn:uuid:7a8a677c-ed6b-4ea1-a2dd-d46f4c886a73</dc:identifier>';
                content_opf+='<dc:language>'+this.carrot.lang+'</dc:language>';
                content_opf+='<dc:title>'+this.obj_bible_cur.name+'</dc:title>';
                content_opf+='<meta name="Sigil version" content="1.9.30"/>';
                content_opf+='<dc:date opf:event="modification" xmlns:opf="http://www.idpf.org/2007/opf">2023-07-16</dc:date>';
            content_opf+='</metadata>';

            content_opf+='<manifest>';
                content_opf+='<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>';
                $(contents).each(function(index,chapter){
                    content_opf+='<item id="chapter_'+index+'" href="Text/chapter_'+index+'.xhtml" media-type="application/xhtml+xml"/>';
                });
            content_opf+='</manifest>';

            content_opf+='<spine toc="ncx">';
                $(contents).each(function(index,chapter){
                    content_opf+='<itemref idref="chapter_'+index+'"/>';
                });
            content_opf+='</spine>';

        content_opf+='</package>';

        zip.file("mimetype",file_mimetype);
        zip.file("META-INF/container.xml",container_xml);
        zip.file("OEBPS/toc.ncx",toc_ncx);
        zip.file("OEBPS/content.opf",content_opf);

        $(contents).each(function(index,chapter){
            var xhtml='';
            var paragraphs=chapter.paragraphs;
            xhtml+='<?xml version="1.0" encoding="utf-8"?>';
            xhtml+='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
            xhtml+='<html xmlns="http://www.w3.org/1999/xhtml">';
            xhtml+='<head><title>Chapter '+(parseInt(index)+1)+'</title></head>';
            xhtml+='<body>';
                xhtml+='<h2>'+book_data.name+' '+(parseInt(index)+1)+'</h2>';
                for(var i=0;i<paragraphs.length;i++){
                    xhtml+='<p><sup>'+(i+1)+'</sup> '+paragraphs[i]+'</p>';
                };
            xhtml+='</body>';
            xhtml+='</html>';
            zip.file("OEBPS/Text/chapter_"+index+".xhtml",xhtml);
        });

        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, book_data.name+".epub");
        });
    }
}