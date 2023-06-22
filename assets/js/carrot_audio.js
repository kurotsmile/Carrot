class Carrot_Audio{
    carrot;
    constructor(carrot){
        this.carrot=carrot;
        var audio=this;
        var btn_add=this.carrot.menu.create("add_audio").set_label("Add audio").set_type("add");
        $(btn_add).click(function(){audio.add();});
        var btn_list=this.carrot.menu.create("list_aduio").set_label("List Audio").set_type("main").set_lang("audio").set_icon("fa-solid fa-guitar");
        $(btn_list).click(function(){audio.list();});
    }

    add(){
        var data_audio=new Object();
        data_audio["id"]=this.carrot.create_id();
        data_audio["name"]="";
        data_audio["author"]="";
        data_audio["mp3"]="";
        this.add_or_edit(data_audio);
    }

    edit(data,carrot){
        carrot.audio.add_or_edit(data);
    }

    add_or_edit(data){
        var frm_add=new Carrot_Form("frm_audio",this.carrot);
        frm_add.set_db("audio",data.id);
        frm_add.set_title("Add Or Edit Audio");
        frm_add.create_field("id").set_label("ID").set_type("id").set_val(data["id"]);
        frm_add.create_field("name").set_label("Name").set_val(data["name"]);
        frm_add.create_field("author").set_label("Author").set_val(data["author"]);
        frm_add.create_field("mp3").set_label("Mp3").set_val(data["mp3"]);
        frm_add.show();
    }

    list(){
        this.carrot.get_list_doc("audio",this.done_list);
    }

    done_list(audios,carrot){
        carrot.change_title_page("Audio","?p=audio","audio");
        var list_audio=carrot.convert_obj_to_list(audios);
        var htm='';
        $(list_audio).each(function(intdex,au){
            var item_au=new Carrot_List_Item(carrot);
            item_au.set_id(au.id)
            item_au.set_icon_font("fa-solid fa-guitar");
            item_au.set_db("audio");
            item_au.set_name(au.name);
            item_au.set_tip(au.mp3);
            htm+=item_au.html();
        });
        carrot.show(htm);
        carrot.check_event();
    }
}