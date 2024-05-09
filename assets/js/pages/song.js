class Song{

    objs=null;
    orderBy_at="publishedAt";
    orderBy_type="DESCENDING";
    data_info_cur=null;

    menu(){
        var html='';
        html+='<div class="row mb-2">';
                html+='<div class="col-8">';
                    html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                        var s_active="active";
                        if(carrot.song.orderBy_at=="publishedAt"&&carrot.song.orderBy_type=="DESCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.song.get_list_orderBy(\'publishedAt\',\'DESCENDING\');return false;"><i class="fa-solid fa-arrow-up-9-1"></i> Date</button>';
                        if(carrot.song.orderBy_at=="publishedAt"&&carrot.song.orderBy_type=="ASCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.song.get_list_orderBy(\'publishedAt\',\'ASCENDING\');return false;"><i class="fa-solid fa-arrow-down-1-9"></i> Date</button>';
                    html+='</div>';

                    html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="Last group">';
                        if(carrot.song.orderBy_at=="name"&&carrot.song.orderBy_type=="DESCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.song.get_list_orderBy(\'name\',\'DESCENDING\');return false;"><i class="fa-solid fa-arrow-up-a-z"></i> Name</button>';
                        if(carrot.song.orderBy_at=="name"&&carrot.song.orderBy_type=="ASCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.song.get_list_orderBy(\'name\',\'ASCENDING\');return false;"><i class="fa-solid fa-arrow-down-z-a"></i> Name</button>';
                    html+='</div>';

                    html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                        html+='<button onclick="carrot.song.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add</button>';
                        html+=carrot.tool.btn_export("song");
                        html+='<button onclick="carrot.song.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                    html+='</div>';
                html+='</div>';

                html+='<div class="col-4">';
                    html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="End group">';
                    html+=carrot.langs.list_btn_lang_select('btn-success');
                    html+='</div>';
                html+='</div>'

        html+='</div>';
     
        return html;
    }
    
    show(){
        var id=carrot.get_param_url("id");
        if(id!=undefined)
            carrot.song.get_info(id);
        else
            carrot.song.list();
    }

    list(){
        carrot.loading("Get all data song and show");
        carrot.change_title("All Song","?page=song","song");
        carrot.song.get_data(carrot.song.load_list_by_data);
    }

    get_list_orderBy(filed,type){
        carrot.loading("Load OrderBy "+filed+" -> "+type);
        carrot.song.orderBy_at=filed;
        carrot.song.orderBy_type=type;
        carrot.song.get_data_from_server(carrot.song.load_list_by_data);
    }

    load_list_by_data(datas){
        var html='';
        html+=carrot.song.menu();
        html+='<div class="row" id="all_song"></div>';
        carrot.show(html);
        carrot.hide_loading();
        $(datas).each(function(index,song){
            song["index"]=index;
            $("#all_song").append(carrot.song.box_item(song).html());
        })
        carrot.song.check_event();
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
        q.add_select("genre");
        q.set_limit(30);
        q.set_order(carrot.song.orderBy_at,carrot.song.orderBy_type);
        q.add_where("lang",carrot.langs.lang_setting);
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
        item_music.set_act_click("carrot.song.get_info('"+data_music.id_doc+"')");
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

    get_info(id){
        carrot.data.get("song",id,(data)=>{
            carrot.song.info(data);
        },()=>{
            carrot.server.get("song",id,(data)=>{
                carrot.data.add("song_info",data);
                carrot.song.info(data);
            });
        });
    }

    info(data){
        carrot.change_title(data.name,"?page=song&id="+data.id_doc,"song");
        carrot.song.data_info_cur=data;
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_name(data.name);
        box_info.set_icon_image(carrot.url()+"/images/150.png");
        carrot.show(box_info.html());
        carrot.song.check_event();
    }

    check_event(){
        if(carrot.song.data_info_cur==null)
            carrot.tool.list_other_and_footer("song");
        else
            carrot.tool.list_other_and_footer("song","genre",carrot.song.data_info_cur.genre);

        carrot.check_event();
        
        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            carrot.langs.lang_setting=key_change;
            carrot.song.get_data_from_server(carrot.song.load_list_by_data);
        });
    }

    delete_all_data(){
        carrot.song.objs=null;
        carrot.data.clear("song");
        carrot.data.clear("song_info");
        carrot.msg("Delete all data success!","success");
    }
}
carrot.song=new Song();
if(carrot.call_show_on_load_pagejs) carrot.song.show();