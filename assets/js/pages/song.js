class Song{

    objs=null;
    orderBy_at="publishedAt";
    orderBy_type="DESCENDING";
    data_info_cur=null;
    index_song_cur=-1;
    type_player_media="music";

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

    add(){
        var data_music=new Object();
        data_music["id"]="song"+carrot.create_id();
        data_music["name"]="";
        data_music["avatar"]="";
        data_music["artist"]="";
        data_music["mp3"]="";
        data_music["lyrics"]="";
        data_music["genre"]="";
        data_music["link_ytb"]="";
        data_music["album"]="";
        data_music["year"]="";
        data_music["date"]=$.datepicker.formatDate('yy-mm-dd', new Date());
        data_music["publishedAt"]="";
        data_music["lang"]=carrot.lang;
        this.frm_add_or_edit(data_music).set_title("Add Music").set_msg_done("Add song success!").show();
    }

    edit(data,carrot){
        carrot.song.frm_add_or_edit(data).set_title("Edit Music").set_msg_done("Update song success!").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_music",carrot);
        frm.set_icon('fa-solid fa-music');
        frm.set_db("song","id");
        frm.create_field("song_check").set_type("msg").set_value("");
        var btn_ytb_avatar=new Carrot_Btn();
        btn_ytb_avatar.set_onclick("carrot.song.check_music()");
        btn_ytb_avatar.set_icon("fa-solid fa-wand-magic-sparkles");
        frm.create_field("id").set_label("ID Song").set_value(data["id"]).set_type("id");
        var html_msg_id='<a class="fs-9" id="link_song" href="https://carrotstore.web.app/?p=song&id='+data["id"]+'" target="_blank">https://carrotstore.web.app/?p=song&id='+data["id"]+'</a>';
        frm.create_field("msg_id").set_type("msg").set_val(html_msg_id);
        frm.create_field("link_ytb").set_label("link ytb").add_btn_download_ytb().set_val(data["link_ytb"]).add_btn(btn_ytb_avatar).set_tip("Dán liên kết Youtube vào đây để nhập tự động thông tin bài hát");
        frm.create_field("name").set_label("Name").set_val(data["name"]).set_tip("Create id url by name").add_btn_search_google().add_btn_search_ytb().add_btn_toLower();
        frm.create_field("avatar").set_label("Avatar (url)").set_val(data["avatar"]).set_type("file").set_type_file("image/*");
        frm.create_field("artist").set_label("Artist").set_val(data["artist"]).add_btn_toLower();
        frm.create_field("mp3").set_label("Mp3 (Url)").set_val(data["mp3"]).set_type("file").set_type_file("audio/*");
        frm.create_field("lyrics").set_label("lyrics").set_val(data["lyrics"]).set_type("editor");

        var genre_field=frm.create_field("genre").set_label("Genre").set_val(data["genre"]).set_type("select");
        genre_field.add_option("pop","Pop music");
        genre_field.add_option("pop","Pop");
        genre_field.add_option("rock","Rock");
        genre_field.add_option("jazz","jazz");
        genre_field.add_option("r&b","R&B");
        genre_field.add_option("blues","Blues");
        genre_field.add_option("ballad","Ballad");
        genre_field.add_option("hip hop","Hip Hop");
        genre_field.add_option("country","Country");
        genre_field.add_option("dance","Dance");
        genre_field.add_option("folk","Folk");
        genre_field.add_option("EDM","EDM");
        genre_field.add_option("k-pop","K-POP");

        frm.create_field("album").set_label("Album").set_val(data["album"]);
        var year_field=frm.create_field("year").set_label("Year").set_val(data["year"]).set_type("select");

        for(var i=new Date().getFullYear()+10;i>1960;i--) year_field.add_option(i,"Year "+i);

        frm.create_field("date").set_label("Date Create").set_type("date").set_val(data["date"]);
        frm.create_field("publishedAt").set_label("publishedAt").set_val(data["publishedAt"]);
        var lang_field=frm.create_field("lang").set_label("Lang").set_val(data["lang"]).set_type("select");
        $(carrot.langs.list_lang).each(function(index,lang_data){
            lang_field.add_option(lang_data.key,lang_data.name);
        });
        return frm;
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
        q.add_select("mp3");
        q.add_select("link_ytb");
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
        var item_music=new Carrot_List_Item(carrot);
        carrot.data.img(carrot.tool.id(data_music.id_doc),data_music.avatar,"pic_music_"+carrot.tool.id(data_music.id_doc));
        item_music.set_db("song");
        item_music.set_obj_js("song");
        item_music.set_id(data_music.id_doc);
        item_music.set_class('col-md-4 mb-3');
        item_music.set_name(data_music.name);
        item_music.set_index(data_music.index);
        item_music.set_icon(carrot.url()+"/images/150.png");
        item_music.set_id_icon("pic_music_"+carrot.tool.id(data_music.id_doc));
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
        if(data_music.mp3!="") html_body+='<span id="btn_play_music_'+data_music.index+'" role="button" class="status_music float-end text-success btn-play-music m-1" onclick="carrot.song.play(\''+data_music.index+'\');"><i class="fa-sharp fa-solid fa-circle-play fa-2x"></i></span> ';
        if(data_music.link_ytb!="") html_body+='<span id="btn_play_video_'+data_music.index+'" role="button" class="status_video float-end text-success btn-play-video m-1"  onclick="carrot.song.play(\''+data_music.index+'\',\'video\');"><i class="fa-sharp fa-solid fa-film fa-2x"></i></span> ';
        html_body+='</div>';

        item_music.set_body(html_body);
        return item_music;
    }

    get_info(id){
        carrot.loading("Get data info "+id);
        carrot.data.get("song_info",id,(data)=>{
            carrot.song.info(data);
        },()=>{
            carrot.server.get("song",id,(data)=>{
                carrot.data.add("song_info",data);
                carrot.song.info(data);
            });
        });
    }

    info(data){
        carrot.hide_loading();
        carrot.change_title(data.name,"?page=song&id="+data.id_doc,"song");
        carrot.song.data_info_cur=data;
        carrot.data.img(carrot.tool.id(data.id_doc),data.avatar,"pic_music_"+carrot.tool.id(data.id_doc));
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_name(data.name);
        box_info.set_icon_image(carrot.url()+"/images/150.png");
        box_info.set_icon_id("pic_music_"+carrot.tool.id(data.id_doc));
        box_info.set_db("song");
        box_info.set_obj_js("song");
        box_info.add_attrs("fa-solid fa-guitar",'<l class="lang" key_lang="genre">Genre</l>',data.genre);
        box_info.add_attrs("fa-solid fa-calendar-days",'<l class="lang" key_lang="album">Album</l>',data.album);
        box_info.add_attrs("fa-solid fa-user",'<l class="lang" key_lang="artist">Artist</l>',data.artist);
        box_info.add_attrs("fa-solid fa-language",'<l class="lang" key_lang="country">Country</l>',data.lang);

        box_info.add_body('<h4 class="fw-semi fs-5 lang" key_lang="describe">Lyrics</h4>','<p class="fs-8 text-justify">'+data.lyrics.replaceAll(". ","</br>")+'</p>');
        box_info.set_protocol_url("music://show/"+data.id_doc);

        box_info.add_btn("btn_download","fa-solid fa-file-arrow-down","Download","carrot.song.act_download()");
        box_info.add_btn("btn_pay","fa-brands fa-paypal","Download","carrot.song.pay()");

        var html_head_left='';
        if(data.mp3!="") html_head_left+='<i id="btn_info_play_audio" role="button" class="fa-sharp fa-solid fa-circle-play fa-5x text-success mt-2 mr-2" onclick="carrot.song.play_music_info();"></i> ';
        if(data.link_ytb!="") html_head_left+='<i id="btn_info_play_video" role="button" class="fa-sharp fa-solid fa-film fa-5x text-success mt-2" onclick="carrot.song.play_music_info(\'video\');"></i>';
        box_info.set_header_left(html_head_left);

        carrot.show(carrot.song.menu()+box_info.html());
        carrot.song.check_event();

        $("#btn_download").removeClass("d-inline");
        $("#btn_pay").removeClass("d-inline");

        if(carrot.song.check_pay(data.id_doc)){
            $("#btn_download").show();
            $("#btn_pay").hide();
        }else{
            $("#btn_download").hide();
            $("#btn_pay").show();
        }
    }

    check_event(){
        carrot.player_media.create();
        carrot.player_media.set_act_next(carrot.song.next_music);
        carrot.player_media.set_act_prev(carrot.song.prev_music);

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

    play(index,type='music'){
        carrot.song.type_player_media=type;
        if(carrot.song.type_player_media=="music")
            carrot.player_media.open('#btn_play_music_'+index,carrot.song.play_music_by_data(carrot.song.objs[index]));
        else
            carrot.player_media.open('#btn_play_video_'+index,carrot.song.play_video_by_data(carrot.song.objs[index]));
    }

    play_music_info(type='music'){
        if(type=='music')
            carrot.player_media.open('#btn_info_play_audio',carrot.song.play_music_by_data(carrot.song.data_info_cur));
        else
            carrot.player_media.open('#btn_info_play_video',carrot.song.play_video_by_data(carrot.song.data_info_cur));
    }            

    play_music_by_data(song){
        carrot.song.type_player_media="music";
        carrot.player_media.play_music(song.name,song.artist,song.album,song.mp3,song.avatar);
    }

    play_video_by_data(song){
        carrot.song.type_player_media="video";
        carrot.player_media.play_youtube(song.name,song.artist,song.album,song.mp3,song.avatar,song.link_ytb);
    }

    delete_all_data(){
        carrot.song.objs=null;
        carrot.data.clear("song");
        carrot.data.clear("song_info");
        carrot.data.clear("images");
        carrot.msg("Delete all data success!","success");
    }

    next_music(){
        carrot.song.index_song_cur++;
        if(carrot.song.index_song_cur>=carrot.song.objs.length) carrot.song.index_song_cur=0;
        if(carrot.song.type_player_media=="music")
            carrot.player_media.open('#btn_play_music_'+carrot.song.index_song_cur,carrot.song.play_music_by_data(carrot.song.objs[carrot.song.index_song_cur]));
        else
            carrot.player_media.open('#btn_play_video_'+carrot.song.index_song_cur,carrot.song.play_video_by_data(carrot.song.objs[carrot.song.index_song_cur]));
    }

    prev_music(){
        carrot.song.index_song_cur--;
        if(carrot.song.index_song_cur<=0) carrot.song.index_song_cur=carrot.song.objs.length;
        if(carrot.song.type_player_media=="music")
            carrot.song.play_music_by_data(carrot.song.objs[carrot.song.index_song_cur]);
        else
            carrot.song.play_video_by_data(carrot.song.objs[carrot.song.index_song_cur]);
    }

    check_music(){
        var link_ytb=$("#link_ytb").val();
        if(link_ytb.trim()==""){
            carrot.msg("Link Youtube Not Null!","error");
            return false;
        }
        var id_ytb=carrot.player_media.get_youtube_id(link_ytb);
        $("#link_ytb").val("https://www.youtube.com/watch?v="+id_ytb);
        $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id_ytb + "&key="+carrot.config.key_api_google_youtube, function(data) {
            $("#name").val(data.items[0].snippet.title);
            if(data.items[0].snippet.defaultLanguage!=null){
                var lang_song=data.items[0].snippet.defaultLanguage;
                var l_sog=lang_song.split("-");
                $("#lang").val(l_sog[0]);
            }
            $("#album").val(data.items[0].snippet.channelTitle);
            if(data.items[0].snippet.tags!=null){
                var tags=data.items[0].snippet.tags;
                $("#artist").val(tags[0]);
            }else{
                $("#artist").val(data.items[0].snippet.channelTitle);
            }
            $("#publishedAt").val(data.items[0].snippet.publishedAt);
            var day_ytb = new Date(data.items[0].snippet.publishedAt);
            $("#year").val(day_ytb.getFullYear());
            $('.richText-editor').html(data.items[0].snippet.description.replace(/\n/g,'<br/>'));
            var thumbnails_ytb=data.items[0].snippet.thumbnails;
            var html_thumb='';
            html_thumb+='<div class="form-group">';
            html_thumb+='<a href="'+thumbnails_ytb.medium.url+'" target="_blank"><img class="rounded" src="'+thumbnails_ytb.medium.url+'"></a>';
            html_thumb+='</div>';
            $("#link_ytb_tip").html(html_thumb);

            var link_ytb_check="https://www.youtube.com/watch?v="+id_ytb;
            carrot.db.collection("song").where("link_ytb","==",link_ytb_check).get().then((querySnapshot) => {
                $("#song_check").html("");
                querySnapshot.forEach((doc) => {
                    $("#song_check").html('<i class="fa-solid fa-triangle-exclamation text-danger"></i> Có rồi mà đừng thêm vào!');
                });
            }).catch((error) => {
                carrot.log_error(error);
                $("#song_check").html(error);
            });

        })
    }

    list_for_home(){
        var html="";
        if(carrot.song.objs!=null){
            carrot.player_media.create();
            carrot.player_media.set_act_next(carrot.song.next_music);
            carrot.player_media.set_act_prev(carrot.song.prev_music);
            var list_song=carrot.random(carrot.song.objs);
            carrot.song.objs=list_song;
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="fa-solid fa-music fs-6 me-2"></i> <l class="lang" key_lang="other_music">Other Music</l>';
            html+='<span role="button" onclick="carrot.song.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div id="other_code" class="row m-0">';
            for(var i=0;i<12;i++){
                var song=list_song[i];
                song["index"]=i;
                html+=carrot.song.box_item(song).html();
            }
            html+='</div>';
        }
        return html;
    }

    act_download(){
        window.open(carrot.song.data_info_cur.mp3, "_blank");
    }

    pay_success(carrot){
        $("#btn_download").show();
        $("#btn_pay").hide();
        localStorage.setItem("buy_song_"+carrot.song.data_info_cur.id_doc,"1");
        carrot.song.act_download();
    }

    check_pay(id){
        if(localStorage.getItem("buy_song_"+id)!=null)
            return true;
        else
            return false;
    }

    pay(){
        carrot.show_pay("song","Download Music ("+carrot.song.data_info_cur.name+")","Get file mp3 thi song from Carrot Music","1.99",carrot.song.pay_success);
    }
}
carrot.song=new Song();
if(carrot.call_show_on_load_pagejs) carrot.song.show();