class Song{

    objs=null;

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.song.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Radio</button>';
                html+=carrot.tool.btn_export("song");
                html+='<button onclick="carrot.song.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    show(){
        carrot.song.list();
    }

    list(){
        carrot.loading("Get all data song and show");
        carrot.change_title("All Song","?page=song","song");
        var html='';
        html+=carrot.song.menu();
        html+='<div class="row" id="all_song"></div>';
        carrot.show(html);
        carrot.song.get_data((datas)=>{
            carrot.hide_loading();
            $(datas).each(function(index,song){
                song["index"]=index;
                $("#all_song").append(carrot.song.box_item(song).html());
            })
            carrot.check_event();
        });
    }
    get_data(act_done){
        if(carrot.check_ver_cur("song")==false){
            carrot.update_new_ver_cur("song",true);
            carrot.song.get_data_from_server(act_done);
        }else{
            carrot.song.get_data_from_db(act_done,()=>{
                carrot.song.get_data_from_server(act_done);
            });
        }
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("song").then((songs)=>{
            carrot.song.objs=songs;
            act_done(songs);
        }).catch(act_fail);
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("song");
        q.add_select("name");
        q.add_select("artist");
        q.add_select("avatar");
        q.set_limit(30);
        q.get_data((songs)=>{
            carrot.song.objs=songs;
            $(songs).each(function(index,song){
                carrot.data.add("song",song);
            });
            act_done(songs);
        });
    }

    box_item(data_music){
        if(data_music==null) return "";
        var s_url_avatar="";
        if(data_music.avatar!=null) s_url_avatar=data_music.avatar;
        if(s_url_avatar=="") s_url_avatar="images/150.png";
        var item_music=new Carrot_List_Item(carrot);
        item_music.set_db("song");
        item_music.set_obj_js("music");
        item_music.set_id(data_music.id_doc);
        item_music.set_class('col-md-4 mb-3');
        item_music.set_name(data_music.name);
        item_music.set_index(data_music.index);
        item_music.set_icon(s_url_avatar);
        item_music.set_act_edit("carrot.music.edit");
        item_music.set_class_icon("pe-0 col-3 btn_info_music");
        item_music.set_class_body("mt-2 col-9");
        var html_body='';
        html_body+='<li class="col-8 ratfac">';
            if(data_music.artist!='') html_body+='<span class="d-block fs-8 mb-2">'+data_music.artist+'</span>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi fa-solid fa-music fa-2xs"></i>';
        html_body+='</li>';

        html_body+='<div class="col-4 text-end">'; 
        if(data_music.mp3!="") html_body+='<span role="button" class="status_music float-end text-success btn-play-music m-1"  aud-id="'+data_music.id_doc+'" aud-index="'+data_music.index+'"><i class="fa-sharp fa-solid fa-circle-play fa-2x"></i></span> ';
        if(data_music.link_ytb!="") html_body+='<span role="button" class="status_video float-end text-success btn-play-video m-1"  aud-id="'+data_music.id_doc+'" aud-index="'+data_music.index+'"><i class="fa-sharp fa-solid fa-film fa-2x"></i></span> ';
        html_body+='</div>';

        item_music.set_body(html_body);
        return item_music;
    }

    delete_all_data(){
        carrot.song.objs=null;
        carrot.data.clear("song");
        carrot.msg("Delete all data success!","success");
    }
}
carrot.song=new Song();
if(carrot.call_show_on_load_pagejs) carrot.song.show();