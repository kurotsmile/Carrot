class Carrot_Music{
    carrot;
    obj_songs=null;
    audio_player=null;


    m_avatar=null;
    m_index=-1;

    emp_status_music=null;

    constructor(carrot){
        this.carrot=carrot;
        this.load_obj_song();
    }

    load_obj_song(){
        if(localStorage.getItem("obj_songs")!=null) this.obj_songs=JSON.parse(localStorage.getItem("obj_songs"));
    }

    delete_obj_songs(){
        localStorage.removeItem("obj_songs");
        this.obj_songs=null;
    }

    create_audio(){
        this.carrot.log("Create Audio Media Player");
        this.audio_player=new Audio();
        this.audio_player.addEventListener("loadeddata", () => {
            let duration = this.audio_player.duration;
            $("#m_timeStamp").attr('max',duration.toFixed(2));
            $("#m_time_end").html(this.formatTime(duration));
            if (this.audio_player.readyState >= 2){
                this.audio_player.play();
                $(this.emp_status_music).html('<i class="fa-regular fa-circle-stop fa-bounce fa-2x"></i>');
            }
        });

        this.audio_player.addEventListener("timeupdate", (event) => {
            $("#m_timeStamp").attr('value',this.audio_player.currentTime.toFixed(2));
            $("#m_time_play").html(this.formatTime(this.audio_player.currentTime));
        });
    }

    create_session(s_title,s_artist,s_album,s_url_avatar){
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: s_title,
              artist: s_artist,
              album: s_album,
              artwork: [
                {
                  src: s_url_avatar,
                  sizes: "384x384",
                  type: "image/jpg",
                }
              ],
            });
          
            navigator.mediaSession.setActionHandler("play", () => {
              /* Code excerpted. */
            });
            navigator.mediaSession.setActionHandler("pause", () => {
              /* Code excerpted. */
            });
            navigator.mediaSession.setActionHandler("stop", () => {
              /* Code excerpted. */
            });
            navigator.mediaSession.setActionHandler("seekbackward", () => {
              /* Code excerpted. */
            });
            navigator.mediaSession.setActionHandler("seekforward", () => {
              /* Code excerpted. */
            });
            navigator.mediaSession.setActionHandler("seekto", () => {
              /* Code excerpted. */
            });
            navigator.mediaSession.setActionHandler("previoustrack", () => {
                this.back_music();
            });
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                this.forward_music();
            });
        }
    }
    
    show_list_music(){
        if(this.carrot.check_ver_cur("song")==false){
            this.carrot.log("Get list song from sever and show");
            this.carrot.get_list_doc("song",this.act_done_list_music);
            this.carrot.update_new_ver_cur("song",true);
        }else{
            if(this.obj_songs==null){
                this.carrot.log("Get list song from sever and show");
                this.carrot.get_list_doc("song",this.act_done_list_music);
            }
            else{
                this.carrot.log("Show list song from cache");
                this.show_list_music_by_obj_songs(this.carrot);
            }
        }
    }

    act_done_list_music(obj_data,carrot){
        carrot.music.obj_songs=obj_data;
        localStorage.setItem("obj_songs",JSON.stringify(carrot.music.obj_songs));
        carrot.music.show_list_music_by_obj_songs(carrot);
    }

    show_list_music_by_obj_songs(carrot){
        carrot.change_title_page("Music", "?p=music","music");
        var list_song=carrot.convert_obj_to_list(this.obj_songs);
        var html='<div class="row m-0">';
        $(list_song).each(function(index,song){
            song["index"]=index;
            html+=carrot.music.box_music_item(song);
        });
        html+="</div>";
        carrot.body.html(html);
        if(carrot.music.audio_player==null){
            carrot.body.parent().parent().append(carrot.music.box_music_mini());
            carrot.music.create_audio();
        }
        carrot.music.check_event();
    }

    check_event(){
        var carrot=this.carrot;

        $(".btn-play-music").click(function(){
            var aud_name=$(this).attr("aud-name");
            carrot.music.play_music_by_name(aud_name);
        });

        $('#m_btn_stop').click(function(){
            $(".status_music").html('<i class="fa-sharp fa-solid fa-circle-play fa-2x"></i>');
            carrot.music.audio_player.pause();
            carrot.music.audio_player.currentTime=0;
            $("#music_player_mini").hide(100);
        });

        $("#m_btn_back").click(function(){
            carrot.music.back_music();
        });

        $("#m_btn_forward").click(function(){
            carrot.music.forward_music();
        });

        $(".btn_app_edit").click(async function () {
            var id_box_app = $(this).attr("app_id");
            carrot.get_doc("song",id_box_app,carrot.music.show_edit_music_done);
        });

        $(".btn_info_music").click(function(){
            var aud_id=$(this).attr("aud-name");
            carrot.music.show_info_music_by_id(aud_id);
        });

        $("#btn_mm_play").click(function(){
            carrot.music.change_status_pause_and_play();
        });

        carrot.check_event();
    }

    back_music(){
        this.m_index--;
        this.play_music_by_index(this.m_index);
    }

    forward_music(){
        this.m_index++;
        this.play_music_by_index(this.m_index);
    }

    pause_music(){
        this.audio_player.pause();
    }

    play_music(){
        this.audio_player.play();
    }

    change_status_pause_and_play(){
        if(this.audio_player.paused)
            this.play_music();
        else
            this.pause_music();

        this.check_status_mm_player();
    }

    check_status_mm_player(){
        $("#btn_mm_play").removeClass("fa-pause");
        $("#btn_mm_play").removeClass("fa-circle-play");
        if(this.audio_player.paused){
            $("#btn_mm_play").addClass("fa-circle-play");
        }else{
            $("#btn_mm_play").addClass("fa-pause");
        }
    }

    play_music_by_index(index_play){
        var list_music=this.carrot.convert_obj_to_list(this.obj_songs);
        if(index_play<0) index_play=list_music.length-1;
        if(index_play>list_music.length-1) index_play=0;

        this.m_index=index_play;
        var song=list_music[this.m_index];
        song["index"]=index_play;
        this.act_play_song(song);
    }

    play_music_by_name(s_name_audio){
        var song=JSON.parse(this.obj_songs[s_name_audio]);
        this.act_play_song(song);
    }

    act_play_song(song){
        if(this.carrot.id_page=="music"){
            $(".status_music").html('<i class="fa-sharp fa-solid fa-circle-play fa-2x"></i>');
            if(song.index!="") $("#status_music_"+song.index).html('<i class="fa-solid fa-spinner fa-spin-pulse fa-2x"></i>');
        }
        
        this.audio_player.src=song.mp3;
        this.audio_player.play();
        $("#music_player_mini").removeClass("d-none").hide().show(100);
        $("#m_name").html(song.name);
        $("#m_artist").html(song.artist);
        $("#m_avatar").css("background","url('"+song.avatar+"')");

        this.create_session(song.name,song.artist,"carrotstore.com",song.avatar);
    }

    show_info_music_by_id(s_name_id){
        this.carrot.log("show_info_music_by_id:"+s_name_id);
        var data=JSON.parse(this.obj_songs[s_name_id]);
        this.show_info_music(data);
    }

    show_info_music_by_index(index_music){
        this.carrot.log("show_info_music_by_index:"+index_music);
        var list_music=this.carrot.convert_obj_to_list(this.obj_songs);
        var data=JSON.parse(list_music[index_music]);
        data["index"]=index_music;
        this.show_info_music(data);
    }

    show_info_music(data){
        this.carrot.change_title_page(data.name,"?p=code&id="+data.id,"code");
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3 text-center">';
                        html+='<img class="w-100" src="'+data.avatar+'" alt="'+data.name+'">';
                        html+='<i role="button" class="fa-sharp fa-solid fa-circle-play fa-5x text-success mt-2 btn-play-music" aud-index="'+data.index+'" aud-name="'+data.name+'"></i>';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data.name+'</h4>';
                        html+=this.carrot.btn_dev("song",data.id);
                        
                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>3.9 <i class="fa-sharp fa-solid fa-eye"></i></b>';
                                html+='<p>11.6k <l class="lang"  key_lang="count_view">Reviews</l></p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>5M+ <i class="fa-solid fa-download"></i></b>';
                                html+='<p class="lang" key_lang="count_download">Downloads</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="genre">Genre</l> <i class="fa-solid fa-guitar"></i></b>';
                                html+='<p>'+data.genre+'</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>Ads <i class="fa-solid fa-window-restore"></i></b>';
                                html+='<p class="lang" key_lang="in_app">Contains Ads</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>In-App <i class="fa-solid fa-cart-shopping"></i></b>';
                                html+='<p class="lang" key_lang="contains_inapp">In-app purchases</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="artist">Artist</l> <i class="fa-solid fa-user"></i></b>';
                                html+='<p>'+data.artist+'</p>';
                            html+='</div>';
                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-12 text-center">';
                            html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                            html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success" ><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button>';
                            html+='</div>';
                        html+='</div>';

                    html+='</div>';
                html+="</div>";
    
                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="describe">Lyrics</h4>';
                    html+='<p class="fs-8 text-justify">'+data.lyrics.replaceAll(". ","</br>")+'</p>';
                html+='</div>';
    
                html+='<div class="about row p-2 py-3  bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="review">Review</h4>';
    
                    html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';
                        html+='<div class="col-md-12 align-items-center col-9 rcolm">';
                            html+='<div class="review">';
                                html+='<li class="col-8 ratfac">';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi fa-solid fa-star"></i>';
                                    html+='<i class="bi fa-solid fa-star"></i>';
                                html+='</li>';
                            html+='</div>';
    
                            html+='<h3 class="fs-6 fw-semi mt-2">Vinoth kumar<small class="float-end fw-normal"> 20 Aug 2022 </small></h3>';
                            html+='<div class="review-text">Great work, keep it up</div>';
    
                        html+='</div>';
                        html+='<div class="col-md-2"></div>';
                    html+='</div>';
    
                    html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';
                        html+='<div class="col-md-12 align-items-center col-9 rcolm">';
                            html+='<div class="review">';
                                html+='<li class="col-8 ratfac">';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi fa-solid fa-star"></i>';
                                    html+='<i class="bi fa-solid fa-star"></i>';
                                html+='</li>';
                            html+='</div>';
    
                            html+='<h3 class="fs-6 fw-semi mt-2">Vinoth kumar<small class="float-end fw-normal"> 20 Aug 2022 </small></h3>';
                            html+='<div class="review-text">Great work, keep it up</div>';
    
                        html+='</div>';
                        html+='<div class="col-md-2"></div>';
                    html+='</div>';
    
                    html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';
                        html+='<div class="col-md-12 align-items-center col-9 rcolm">';
                            html+='<div class="review">';
                                html+='<li class="col-8 ratfac">';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                    html+='<i class="bi fa-solid fa-star"></i>';
                                    html+='<i class="bi fa-solid fa-star"></i>';
                                html+='</li>';
                            html+='</div>';
    
                            html+='<h3 class="fs-6 fw-semi mt-2">Vinoth kumar<small class="float-end fw-normal"> 20 Aug 2022 </small></h3>';
                            html+='<div class="review-text">Great work, keep it up</div>';
    
                        html+='</div>';
                        html+='<div class="col-md-2"></div>';
                    html+='</div>';
    
                html+='</div>';
            html+="</div>";
    
            html+='<div class="col-md-4">';
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_songs">Related Song</h4>';
            var list_music_other= this.carrot.convert_obj_to_list(this.obj_songs).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            for(var i=0;i<list_music_other.length;i++){
                var song=list_music_other[i];
                if(data.id!=song.id) html+=this.carrot.music.box_music_item(song,'col-md-12 mb-3');
            };
            html+='</div>';
    
        html+="</div>";
        html+="</div>";
        this.carrot.body.html(html);

        if(this.carrot.music.audio_player==null){
            this.carrot.body.parent().parent().append(this.carrot.music.box_music_mini());
            this.carrot.music.create_audio();
        }
        this.check_event();
    }

    box_music_item(data_music,s_class='col-md-4 mb-3'){
        var s_url_icon="";
        if(data_music.avatar!=null) s_url_icon=data_music.avatar;
        if(s_url_icon=="") s_url_icon="images/150.png";
        var html_main_contain="<div class='box_app "+s_class+"' id=\""+data_music.id+"\"  key_search=\""+data_music.name+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                    html_main_contain+='<div role="button" class="img-cover pe-0 col-3 btn_info_music" id="m_'+data_music.index+'" aud-name="'+data_music.name+'"><img class="rounded" src="'+s_url_icon+'" alt="'+data_music.name+'"></div>';
                    html_main_contain+='<div class="det mt-2 col-9">';
                        html_main_contain+="<h5 class='mb-0 fs-6'>"+data_music.name+"</h5>";
                        
                        html_main_contain+='<ul class="row">';
                            html_main_contain+='<li class="col-8 ratfac">';
                            html_main_contain+="<span class='fs-8'>"+data_music.artist+"</span><br/>";
                                html_main_contain+='<i class="bi text-warning fa-solid fa-music"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-music"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-music"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-music"></i>';
                                html_main_contain+='<i class="bi fa-solid fa-music"></i>';
                            html_main_contain+='</li>';
                  
                            html_main_contain+='<li class="col-4 d-flex">';
                                html_main_contain+='<span role="button" class="btn_info_music text-secondary" aud-name="'+data_music.name+'" style="margin-right: 6px;"><i class="fa-sharp fa-solid fa-circle-info fa-2x"></i></span> ';
                                html_main_contain+='<span role="button" class="status_music float-end text-success btn-play-music"  aud-name="'+data_music.name+'"><i class="fa-sharp fa-solid fa-circle-play fa-2x"></i></span> ';
                            html_main_contain+='</li>';

                        html_main_contain+='</ul>';
        
                        html_main_contain+=this.carrot.btn_dev("song",data_music.id);
    
                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
        return html_main_contain;
    }

    box_music_mini(){
        var html='';
        html += '<section id="music_player_mini" class="music-player d-none">';
            html += '<header id="m_avatar" class="music-player--banner"></header>';
            html += '<main class="music-player--main">';
                html += '<div class="music-player--progress">';
                html += '<progress id="m_timeStamp" class="progress--progress-bar" value="0" max="100"></progress>';
                html += '<div class="progress--time" id="m_time_play">1:37</div>';
                html += '<div class="progress--time progress--time__end" id="m_time_end">3:52</div>';
                html += '</div>';
                html += '<div class="music-player--controls">';
                html += '<i id="btn_mm_play" class="fa fa-pause controls--play-button"></i>';

                html += '<div class="song-info">';
                    html += '<div class="song-info--title" id="m_name">Name song</div>';
                    html += '<div class="song-info--artist" id="m_artist">Artist</div>';
                    html += '</div>';
                    html += '<div class="controls--actions">';
                    html += '<i class="fa fa-retweet actions--repeat"></i>';
                    html += '<i role="button" class="fa fa-backward actions--back" id="m_btn_back"></i>';
                    html += '<i role="button" class="fa fa-forward actions--forward" id="m_btn_forward"></i>';
                    html += '<i role="button" class="fa-solid fa-circle-stop actions--stop" id="m_btn_stop"></i>';
                    html += '</div>';
                html += '</div>';
            html += '</main>';
        html += '</section>';
        return html;
    }

    show_edit_music_done(data_song,carrot){
        if(data_song!=null)
            carrot.music.show_add_or_edit_music(data_song);
        else
            $.MessageBox("Bài hát không còn tồn tại!");
    }

    show_add_or_edit_music(data_music){
        var s_title_box='';
        if(data_music==null)s_title_box="<b>Add Music</b>";
        else s_title_box="<b>Update Music</b>";
        var obj_music = Object();
        obj_music["tip_icon"] = { type: "caption", message: "Thông tin cơ bản" };
        if(data_music==null){
            data_music=Object();
            data_music["name"]='';
            data_music["avatar"]='';
            data_music["artist"]='';
            data_music["mp3"]='';
            data_music["lyrics"]='';
            data_music["link_ytb"]='';
            data_music["year"]='';
            data_music["lang"]='';
            data_music["genre"]='';
            data_music["album"]='';
        }else{
            if(data_music["name"]=="") data_music["name"]=data_music["id"];
        }

        var arr_lang=Array();
        $(this.carrot.list_lang).each(function(index,lang){arr_lang.push(lang.key);});

        var arr_year=Array();
        var year_cur=new Date().getFullYear();
        for(var i=1980;i<=(year_cur+1);i++) arr_year.push(i);

        if(data_music["year"]=='') data_music["year"]=year_cur;
        if(data_music["lang"]=='') data_music["lang"]=this.carrot.lang;

        var arr_genre=Array();
        arr_genre.push("pop");
        arr_genre.push("rock");
        arr_genre.push("jazz");
        arr_genre.push("r&b");
        arr_genre.push("blues");
        arr_genre.push("ballad");
        arr_genre.push("hip hop");
        arr_genre.push("country");
        arr_genre.push("dance");
        arr_genre.push("folk");
        arr_genre.push("dance");
        arr_genre.push("EDM");
        arr_genre.push("k-pop");

        if(data_music["id"]!="") obj_music["id"]={'type':'caption',message:"ID:"+data_music["id"]};
        obj_music["name"]={'type':'input','defaultValue':data_music["name"], 'label':'Name'};
        obj_music["avatar"]={'type':'input','defaultValue':data_music["avatar"], 'label':'Avatar (url)'};
        obj_music["artist"]={'type':'input','defaultValue':data_music["artist"], 'label':'Artist'};
        obj_music["mp3"]={'type':'input','defaultValue':data_music["mp3"], 'label':'Mp3 url'};
        obj_music["lyrics"]={'type':'textarea','defaultValue':data_music["lyrics"], 'label':'lyrics','rows':'10'};
        obj_music["genre"]={'type':'select','label':'Genre','options':arr_genre,defaultValue:data_music["genre"]};
        obj_music["link_ytb"]={'type':'input','defaultValue':data_music["link_ytb"], 'label':'link Youtube (url)'};
        obj_music["album"]={'type':'text','label':'Album',defaultValue:data_music["album"]};
        obj_music["year"]={'type':'select','label':'Year','options':arr_year,defaultValue:data_music["year"]};
        obj_music["lang"]={'type':'select','label':'Lang','options':arr_lang,defaultValue:data_music["lang"]};
        customer_field_for_db(obj_music,'song','name','','Add Music Successfully');
    
        $.MessageBox({
            message: s_title_box,
            input: obj_music,
            top: "auto",
            buttonFail: "Cancel"
        }).done(this.carrot.act_done_add_or_edit);
    }

    formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        var seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }
}

