class Carrot_Bible{
    carrot;
    icon="fa-solid fa-book-bible";

    constructor(carrot){
        this.carrot=carrot;
        this.carrot.register_page("bible","carrot.bible.list()","carrot.bible.edit","carrot.bible.show","carrot.bible.reload");
        var btn_list=this.carrot.menu.create("bible").set_label("Bible").set_lang("bible").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){
            carrot.bible.list();
        });
    }

    list(){
        var htm='';
        htm+=this.carrot.langs.list_btn_lang_select();
        this.carrot.show(htm);
    }

    add(){
        var data_new=new Object();
        add_new["name"]="";
        this.frm_add_or_edit(data_new).set_title("Add Book").set_done_msg("Add book success!").show();
    }

    edit(){
        var data;
        
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_bible",this.carrot);
        frm.set_icon(this.icon);
        frm.create_field("name").set_label("Book Name");
        frm.create_field("type").set_label("Book Type").add_option("tu","tu").add_option("cu","cu").set_type("select");
        return frm;
    }
}