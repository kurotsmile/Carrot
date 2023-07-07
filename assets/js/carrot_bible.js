class Carrot_Bible{
    carrot;
    icon="fa-solid fa-book-bible";
    id_page="bible";
    emp_book_cur_edit=null;
    obj_bibles=null;

    model_chapter_to_book="add";
    count_chapter=0;

    constructor(carrot){
        this.carrot=carrot;
        this.carrot.register_page(this.id_page,"carrot.bible.list()","carrot.bible.edit_book","carrot.bible.show","carrot.bible.reload");
        var btn_list=this.carrot.menu.create("bible").set_label("Bible").set_lang("bible").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){carrot.bible.list();});

        if(localStorage.getItem("obj_bibles")!=null) this.obj_bibles=JSON.parse(localStorage.getItem("obj_bibles"));
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

        $(list_book).each(function(index,book){
            var item_book=new Carrot_List_Item(carrot);
            item_book.set_id(book.id);
            item_book.set_index(index);
            item_book.set_class("col-12 mt-1");
            item_book.set_icon_font("fa-solid fa-book");
            item_book.set_class_body("col-11");
            item_book.set_name(book.name);
            item_book.set_db("bible");
            item_book.set_act_edit("carrot.bible.edit_book");
            var html_body='';
            html_body+='<div class="col-6">'+book.name+'</div>';
            html_body+='<div class="col-6 dev text-end">';
                html_body+='<i role="button" book_name="'+book.name+'" onclick="carrot.bible.list_chapter(this)" class="fa-solid fa-rectangle-list m-1"></i>';
                html_body+='<i role="button" book_name="'+book.name+'" onclick="carrot.bible.add_chapter_to_book(this)" class="fa-solid fa-pen-to-square m-1"></i>';
                html_body+='<i role="button" book_name="'+book.name+'" onclick="carrot.bible.add_chapter_to_book(this)" class="fa-solid fa-folder-plus m-1"></i>';
            html_body+='</div>';
            item_book.set_body(html_body);
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
        carrot.check_event();
    }

    data_bible_new(){
        var data_new=new Object();
        data_new["name"]="";
        data_new["type"]="old_testament";
        data_new["lang"]=this.carrot.langs.lang_setting;
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
        carrot.bible.frm_add_or_edit(data).set_title("Edit Book").set_msg_done("Edit book success!").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_bible",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("bible","name");
        frm.create_field("name").set_label("Book Name").set_value(data["name"]).add_btn_toLower();
        frm.create_field("type").set_label("Book Type").add_option("old_testament","Old Testament").add_option("new_testament","New Testament").set_type("select").set_value(data["type"]);
        var field_lang=frm.create_field("lang").set_label("Book Lang").set_value(data["lang"]).set_type("select");
        $(this.carrot.langs.list_lang).each(function(index,lang){
            field_lang.add_option(lang.key,lang.name);
        });
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
}