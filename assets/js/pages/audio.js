class Carrot_Audio{
    objs=null;
    index_play=-1;
    icon="fa-solid fa-guitar";

    show(){
        carrot.loading("Get all audio and load");
        carrot.data.list("audio").then((audios)=>{
            carrot.audio.load_and_show_list_by_data(audios);
        }).catch(()=>{
            var q=new Carrot_Query("audio");
            q.set_limit(50);
            q.get_data((audios)=>{
                $(audios).each(function(index,audio){
                    audio.index=index;
                    carrot.data.add("audio",audio);
                });
                carrot.audio.load_and_show_list_by_data(audios);
            });
        });
    }

    load_and_show_list_by_data(audios){
        carrot.audio.objs=audios;
        carrot.player_media.create();
        carrot.player_media.set_act_next(carrot.audio.next);
        carrot.player_media.set_act_prev(carrot.audio.prev);
        carrot.change_title_page("Audio","?page=audio","audio");
        carrot.hide_loading();
        var html='';
        html+=carrot.audio.menu();
        html+='<div class="row">';
        $(audios).each(function(index,audio){
            audio.index=index;
            html+=carrot.audio.box_item(audio).html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.audio.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Audio</button>';
                html+='<button onclick="carrot.audio.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    box_item(data){
        var item_au=new Carrot_List_Item(carrot);
        item_au.set_id(data.id_doc)
        item_au.set_icon_font(carrot.audio.icon+" audio_icon mt-3 fa-2x");
        item_au.set_db("audio");
        item_au.set_name(data.name);
        item_au.set_class_icon("pe-0 col-2");
        item_au.set_class_body("mt-2 col-10");
        item_au.set_act_click("carrot.audio.play('"+data.id_doc+"');return false;");
        var html_body='';
        html_body+='<div class="col-10">'+data.author+'</div>';
        html_body+='<div class="col-2 text-end">';
        if(data.buy=="0")
            html_body+='<i role="button" onclick="carrot.audio.play(\''+data.id_doc+'\');return false;" class="audio_icon fa-solid fa-play fa-2x text-success" obj_id="'+data.id_doc+'"></i>';
        else
            html_body+='<i role="button" onclick="carrot.audio.play(\''+data.id_doc+'\');return false;" class="audio_icon fa-solid fa-cart-shopping fa-2x text-info" obj_id="'+data.id_doc+'"></i>';
        html_body+='</div>';
        item_au.set_body(html_body);
        return item_au;
    }

    play(id_audio){
        carrot.data.get("audio",id_audio,(au)=>{
            carrot.audio.play_by_data(au);
        },()=>{
            carrot.msg("Not found data","alert");
        });
    }

    play_by_data(au){
        carrot.player_media.play_audio(au.name,au.author,au.mp3);
    }

    next(){
        carrot.audio.index_play++;
        carrot.audio.play_by_data(carrot.audio.objs[carrot.audio.index_play]);
    }

    prev(){
        carrot.audio.index_play++;
        carrot.audio.play_by_data(carrot.audio.objs[carrot.audio.index_play]);
    }

    list_for_home(){
        var html='';
        if(carrot.audio.objs!=null){
            carrot.player_media.create();
            var list_audio=carrot.random(carrot.audio.objs);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+carrot.audio.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_audio">Other Audio</l>';
            html+='<span role="button" onclick="carrot.audio.show()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div class="row">';
            for(var i=0;i<12;i++){
                var audio=list_audio[i];
                html+=carrot.audio.box_item(audio).html();
            }
            html+='</div>';
        }
        return html;
    }

    check_event(){

    }

    add(){
        var data_audio=new Object();
        data_audio["id"]=carrot.create_id();
        data_audio["name"]="";
        data_audio["author"]="";
        data_audio["mp3"]="";
        this.frm_add_or_edit(data_audio).set_title("Add Audio").set_msg("Add Audio Success!").show();
    }

    edit(data,carrot){
        carrot.audio.frm_add_or_edit(data).set_title("Edit Audio").set_msg("Update Audio Success!").show();
    }

    frm_add_or_edit(data){
        var frm_au=new Carrot_Form("frm_audio",carrot);
        frm_au.set_db("audio","id");
        frm_au.set_icon(carrot.audio.icon);
        frm_au.set_title("Add Or Edit Audio");
        frm_au.create_field("id").set_label("ID").set_type("id").set_val(data["id"]);
        frm_au.create_field("name").set_label("Name").set_val(data["name"]);
        frm_au.create_field("author").set_label("Author").set_val(data["author"]);
        frm_au.create_field("mp3").set_label("Mp3").set_val(data["mp3"]).set_type("file").set_type_file("audio/*");
        frm_au.create_field("buy").set_label("Buy").add_option("0","Free").add_option("1","Buy").set_val(data["buy"]).set_type("select");
        return frm_au;
    }

    delete_all_data(){
        carrot.data.clear("audio");
        setTimeout(3000,()=>{carrot.audio.show();});
        carrot.msg("Delete all data audio success!","success");
    }
}
carrot.audio=new Carrot_Audio();
if(carrot.call_show_on_load_pagejs) carrot.audio.show();