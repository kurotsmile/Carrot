class Carrot_Audio{
    carrot;
    icon="fa-solid fa-guitar";
    obj_audios=null;
    index_audio_cur=-1;

    constructor(carrot){
        this.carrot=carrot;
        var audio=this;
        carrot.register_page("audio","carrot.audio.list()","carrot.audio.edit");
        var btn_add=this.carrot.menu.create("add_audio").set_label("Add audio").set_icon(this.icon).set_type("add");
        $(btn_add).click(function(){audio.add();});
        var btn_list=this.carrot.menu.create("list_aduio").set_label("List Audio").set_type("main").set_lang("audio").set_icon(this.icon);
        $(btn_list).click(function(){audio.list();});
        if(localStorage.getItem("obj_audios")!=null) this.obj_audios=JSON.parse(localStorage.getItem("obj_audios"));
    }

    add(){
        var data_audio=new Object();
        data_audio["id"]=this.carrot.create_id();
        data_audio["name"]="";
        data_audio["author"]="";
        data_audio["mp3"]="";
        this.frm_add_or_edit(data_audio).set_title("Add Audio").set_msg("Add Audio Success!").show();
    }

    edit(data,carrot){
        carrot.audio.frm_add_or_edit(data).set_title("Edit Audio").set_msg("Update Audio Success!").show();
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
        carrot.audio.obj_audios=audios;
        carrot.player_media.create();
        carrot.player_media.set_act_next(carrot.audio.next_audio);
        carrot.player_media.set_act_prev(carrot.audio.prev_audio);
        carrot.change_title_page("Audio","?p=audio","audio");
        var list_audio=carrot.convert_obj_to_list(audios);
        var htm='';
        htm+='<div class="row">';
        $(list_audio).each(function(intdex,au){
            var item_au=new Carrot_List_Item(carrot);
            item_au.set_index(intdex);
            item_au.set_id(au.id)
            item_au.set_icon_font("audio_icon fa-solid fa-guitar mt-3");
            item_au.set_db("audio");
            item_au.set_name(au.name);
            item_au.set_tip(au.author);
            item_au.set_class_icon("pe-0 col-3 ");
            item_au.set_class_body("mt-2 col-9");
            htm+=item_au.html();
        });
        htm+='<div>';
        carrot.show(htm);
        carrot.audio.check_event();
    }

    check_event(){
        var audio=this;
        $(".audio_icon").click(function(){
            var audio_id=$(this).attr("obj_id");
            var audio_index=$(this).attr("obj_index");
            var au=JSON.parse(audio.obj_audios[audio_id]);
            $(this).effect( "bounce","fast");
            audio.index_audio_cur=parseInt(audio_index);
            audio.carrot.player_media.open(this,audio.carrot.player_media.play_audio(au.name,au.author,au.mp3))
        });
        this.carrot.check_event();
    }

    next_audio(carrot){
        carrot.audio.index_audio_cur+=1;
        carrot.audio.play_audio_by_index(carrot.audio.index_audio_cur);
    }

    prev_audio(carrot){
        carrot.audio.index_audio_cur-=1;
        carrot.audio.play_audio_by_index(carrot.audio.index_audio_cur);
    }

    play_audio_by_index(index){
        var list_audio=this.carrot.obj_to_array(this.obj_audios);
        var au=list_audio[index];
        this.carrot.player_media.play_audio(au.name,au.author,au.mp3);
    }
}