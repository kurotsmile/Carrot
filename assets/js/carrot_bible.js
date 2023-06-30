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
        html+=carrot.langs.list_btn_lang_select();
        html+='<div class="row mt-2">';

        html+='<div class="col col-6 text-center">';
            html+='<h5><i class="fa-solid fa-book-bible text-info"></i> Old testament</h5>';
            html+='<button onclick="carrot.bible.add_book_old_testament()" class="btn btn-success d-inline btn-sm mt-3"><i class="fa-solid fa-book-medical"></i> Add Book </button>';
            $(list_book).each(function(index,book){
                if(book.type=="old_testament")
                html+='<div><i class="fa-solid fa-book"></i> '+book.name+'</div>';
            });
        html+='</div>';

        html+='<div class="col col-6  text-center">';
            html+='<h5><i class="fa-solid fa-book-bible text-success"></i> New Testament</h5>';
            html+='<button onclick="carrot.bible.add_book_new_testament()" class="btn btn-success d-inline btn-sm mt-3"><i class="fa-solid fa-book-medical"></i> Add Book </button>';
            $(list_book).each(function(index,book){
                if(book.type=="new_testament")
                html+='<div><i class="fa-solid fa-book"></i> '+book.name+'</div>';
            });
        html+='</div>';
        carrot.show(html);
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
        frm.create_field("lang").set_label("Book Lang").set_value(data["lang"]);
        return frm;
    }

    reload(carrot){
        carrot.bible.list();
    }
}