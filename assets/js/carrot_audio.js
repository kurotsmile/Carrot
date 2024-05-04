class Carrot_Audio{
    carrot;
    icon="fa-solid fa-guitar";
    id_page="audio";
    obj_audios=null;
    index_audio_cur=-1;

    constructor(carrot){
        this.carrot=carrot;
        var audio=this;
        carrot.register_page("audio","carrot.audio.list()","carrot.audio.edit","carrot.audio.reload");
        var btn_add=this.carrot.menu.create("add_audio").set_label("Add audio").set_icon(this.icon).set_type("add");
        $(btn_add).click(function(){audio.add();});
        var btn_list=this.carrot.menu.create("list_aduio").set_label("List Audio").set_type("main").set_lang("audio").set_icon(this.icon);
        $(btn_list).click(function(){audio.list();});
        if(localStorage.getItem("obj_audios")!=null) this.obj_audios=JSON.parse(localStorage.getItem("obj_audios"));
    }

    save_obj_audios(){
        localStorage.setItem("obj_audios",JSON.stringify(this.obj_audios));
    }

    delete_obj_audios(){
        localStorage.removeItem("obj_audios");
        this.obj_audios=null;
        this.carrot.delete_ver_cur(this.id_page);
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
        frm_au.create_field("mp3").set_label("Mp3").set_val(data["mp3"]).set_type("file").set_type_file("audio/*");
        frm_au.create_field("buy").set_label("Buy").add_option("0","Free").add_option("1","Buy").set_val(data["buy"]).set_type("select");
        return frm_au;
    }

    list(){
        if(this.carrot.check_ver_cur("audio")){
            if(this.obj_audios!=null){
                this.carrot.log("Show list from cache data","success");
                this.show_list_from_data(this.obj_audios,this.carrot);
            } 
            else{
                this.carrot.get_list_doc("audio",this.get_data_audio_from_server);
            }
        }else{
            this.carrot.get_list_doc("audio",this.get_data_audio_from_server);
        }
    }

    get_data_audio_from_server(audios,carrot){
        carrot.audio.obj_audios=audios;
        carrot.audio.save_obj_audios();
        carrot.audio.show_list_from_data(audios,carrot);
        carrot.update_new_ver_cur("audio",true);
    }

    show_list_from_data(audios,carrot){
        carrot.audio.obj_audios=audios;
        carrot.player_media.create();
        carrot.player_media.set_act_next(carrot.audio.next_audio);
        carrot.player_media.set_act_prev(carrot.audio.prev_audio);
        carrot.change_title_page("Audio","?p=audio","audio");
        var list_audio=carrot.convert_obj_to_list(audios);
        var html='';
        html+='<div class="row">';
        $(list_audio).each(function(index,au){
            html+=carrot.audio.box_audio_item(index,au,carrot);
        });
        html+='<div>';
        carrot.show(html);
        carrot.audio.check_event();
    }

    box_audio_item(index,au,carrot){
        var item_au=new Carrot_List_Item(carrot);
        item_au.set_index(index);
        item_au.set_id(au.id)
        item_au.set_icon_font("audio_icon fa-solid fa-guitar mt-3 fa-2x");
        item_au.set_db("audio");
        item_au.set_name(au.name);
        item_au.set_class_icon("pe-0 col-2");
        item_au.set_class_body("mt-2 col-10");
        var html_body='';
        html_body+='<div class="col-10">'+au.author+'</div>';
        html_body+='<div class="col-2 text-end">';
        if(au.buy=="0")
            html_body+='<i role="button" class="audio_icon fa-solid fa-play fa-2x text-success" obj_id="'+au.id+'"></i>';
        else
            html_body+='<i role="button" class="audio_icon fa-solid fa-cart-shopping fa-2x text-info" obj_id="'+au.id+'"></i>';
        html_body+='</div>';
        item_au.set_body(html_body);
        return item_au.html();
    }

    check_event(){
        var audio=this;
        $(".audio_icon").click(function(){
            var audio_id=$(this).attr("obj_id");
            var audio_index=$(this).attr("obj_index");
            var au=JSON.parse(audio.obj_audios[audio_id]);
            $(this).effect( "bounce","fast");
            audio.index_audio_cur=parseInt(audio_index);
            audio.carrot.player_media.open(this,audio.carrot.player_media.play_audio(au.name,au.author,au.mp3));
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

    list_for_home(){
        var html='';
        if(this.obj_audios!=null){
            var list_audio=this.carrot.obj_to_array(this.obj_audios);
            list_audio= list_audio.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_audio">Other Audio</l>';
            html+='<span role="button" onclick="carrot.audio.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div class="row">';
            for(var i=0;i<12;i++){
                var audio=list_audio[i];
                html+=this.box_audio_item(i,audio,this.carrot);
            }
            html+='</div>';
        }
        return html;
    }

    reload(carrot){
        carrot.audio.delete_obj_audios();
        carrot.audio.list();
    }
}