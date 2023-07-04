class Carrot_Bible_Chapter{
    name;
    tip;
    contains=Array();
}

class Carrot_Bible{
    carrot;
    icon="fa-solid fa-book-bible";
    id_page="bible";

    constructor(carrot){
        this.carrot=carrot;
        this.carrot.register_page(this.id_page,"carrot.bible.list()","carrot.bible.edit","carrot.bible.show","carrot.bible.reload");
        var btn_list=this.carrot.menu.create("bible").set_label("Bible").set_lang("bible").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){
            carrot.bible.list();
        });
    }

    get_list_book(){
        this.carrot.get_list_doc(this.id_page,this.act_get_list_book_done);
    }

    act_get_list_book_done(books,carrot){
        carrot.change_title_page("Bible","?p="+carrot.bible.id_page,carrot.bible.id_page);
        var list_book=carrot.obj_to_array(books);
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
            var html_body='';
            html_body+='<div class="col-6">'+book.name+'</div>';
            html_body+='<div class="col-6 dev text-end">';
                html_body+='<i role="button" onclick="carrot.bible.add_chapter_to_book()" class="fa-solid fa-pen-to-square fa-2x m-1"></i>';
                html_body+='<i role="button" onclick="carrot.bible.add_chapter_to_book()" class="fa-solid fa-folder-plus fa-2x m-1"></i>';
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
        carrot.check_event();
    }

    list(){
        this.get_list_book();
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

    add_chapter_to_book(){
        var new_data_chapter=new Object();
        new_data_chapter["name"]="";
        new_data_chapter["tip"]="";
        this.frm_add_or_edit_chapter(new_data_chapter).set_title("Add Chapter To Book").show();
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

    edit(){

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

    frm_add_or_edit_chapter(data){
        var frm=new Carrot_Form("frm_chapter",this.carrot);
        var html_msg='';
        html_msg+='<i class="fa-solid fa-book fa-2x"></i> Thêm vào sách';
        frm.create_field("msg").set_value(html_msg).set_type("msg");
        frm.set_icon("fa-solid fa-book-tanakh");
        frm.create_field("name").set_label("chapter Name").set_value(data["name"]);
        frm.create_field("tip").set_label("chapter Tip").set_value(data["tip"]);
        var btn_add=frm.create_btn();
        btn_add.set_label("Add Chapter");
        btn_add.set_icon("fa-solid fa-square-check");
        btn_add.set_onclick("carrot.bible.act_done_chapter_to_book()");
        frm.off_btn_done();
        return frm;
    } 

    act_done_chapter_to_book(){
        var inp_name=$("#name").val();
        var inp_tip=$("#name").val();
        var washingtonRef = this.carrot.db.collection("bible").doc("sáng thế 1");

        var chap_data=new Object();
        chap_data["name"]=inp_name;
        chap_data["tip"]=inp_tip;

/*
        washingtonRef.update({
            contents : firebase.firestore.FieldValue.arrayUnion(chap_data)
        });
*/

        washingtonRef.update({
            contents: firebase.firestore.FieldValue.arrayRemove(chap_data)
        });


        carrot.msg("Document successfully updated!");

        /*
        return washingtonRef.update({
            contents:{
                chap1:{
                    "name":inp_name,
                    "tip":inp_tip
                },
                chap2:{
                    "name":inp_name,
                    "tip":inp_tip
                }
            }
        })  
        .then(() => {
            carrot.msg("Document successfully updated!");
        })
        .catch((error) => {
            carrot.msg(error,"error");
        });*/
    }

    reload(carrot){
        carrot.bible.list();
    }
}