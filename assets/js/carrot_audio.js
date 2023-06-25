class Carrot_Audio{
    carrot;
    icon="fa-solid fa-guitar";

    constructor(carrot){
        this.carrot=carrot;
        var audio=this;
        carrot.register_page("audio","carrot.audio.list()","carrot.audio.edit");
        var btn_add=this.carrot.menu.create("add_audio").set_label("Add audio").set_icon(this.icon).set_type("add");
        $(btn_add).click(function(){audio.add();});
        var btn_list=this.carrot.menu.create("list_aduio").set_label("List Audio").set_type("main").set_lang("audio").set_icon(this.icon);
        $(btn_list).click(function(){audio.list();});
    }

    add(){
        var data_audio=new Object();
        data_audio["id"]=this.carrot.create_id();
        data_audio["name"]="";
        data_audio["author"]="";
        data_audio["mp3"]="";
        this.frm_add_or_edit(data_audio).set_title("Add Audio").show();
    }

    edit(data,carrot){
        carrot.audio.frm_add_or_edit(data).set_title("Edit Audio").show();
    }

    frm_add_or_edit(data){
        var frm_au=new Carrot_Form("frm_audio",this.carrot);
        frm_au.set_db("audio","id");
        frm_au.set_icon(this.icon);
        frm_au.set_title("Add Or Edit Audio");
        frm_au.create_field("id").set_label("ID").set_type("id").set_val(data["id"]);
        frm_au.create_field("name").set_label("Name").set_val(data["name"]);
        frm_au.create_field("author").set_label("Author").set_val(data["author"]);
        frm_au.create_field("mp3").set_label("Mp3").set_val(data["mp3"]);
        return frm_au;
    }

    list(){
        this.carrot.get_list_doc("audio",this.done_list);
    }

    done_list(audios,carrot){
        carrot.change_title_page("Audio","?p=audio","audio");
        var list_audio=carrot.convert_obj_to_list(audios);
        var htm='';
        htm+='<div class="row">';
        $(list_audio).each(function(intdex,au){
            var item_au=new Carrot_List_Item(carrot);
            item_au.set_id(au.id)
            item_au.set_icon_font("fa-solid fa-guitar mt-3");
            item_au.set_db("audio");
            item_au.set_name(au.name);
            item_au.set_tip(au.author);
            item_au.set_class_icon("pe-0 col-3 ");
            item_au.set_class_body("mt-2 col-9");
            htm+=item_au.html();
        });
        htm+='<div>';
        carrot.show(htm);
        carrot.check_event();
    }
}