class Carrot_Music{
    carrot;
    obj_songs=null;
    audio_player=null;

    m_timeStamp=null;
    m_avatar=null;

    emp_status_music=null;

    constructor(carrot){
        this.carrot=carrot;
        if(localStorage.getItem("obj_songs")!="") this.obj_songs=JSON.parse(localStorage.getItem("obj_songs"));
    }

    create_audio(){
        this.audio_player=new Audio();
        this.audio_player.addEventListener("loadeddata", () => {
            let duration = this.audio_player.duration;
            $(this.m_timeStamp).attr('max',duration.toFixed(2));
            $("#m_time_end").html(this.formatTime(duration));
            if (this.audio_player.readyState >= 2){
                this.audio_player.play();
                $(this.emp_status_music).html('<i class="fa-regular fa-circle-stop fa-bounce"></i>');
            }
        });

        this.audio_player.addEventListener("timeupdate", (event) => {
            $(this.m_timeStamp).attr('value',this.audio_player.currentTime.toFixed(2));
            $(this.m_timeStamp).val(this.audio_player.currentTime.toFixed(2));
            $("#m_time_play").html(this.formatTime(this.audio_player.currentTime));
        });
    }
    
    show_list_music(){
        this.carrot.get_list_doc("song",this.act_done_list_music);
    }

    act_done_list_music(obj_data,carrot){
        carrot.change_title_page("Music", "?p=music","music");
        carrot.music.obj_songs=obj_data;
        var list_song=carrot.convert_obj_to_list(obj_data);
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
        carrot.check_mode_site();

        $('.app_icon').click(function() {
            var aud_song_url=$(this).attr("aud_song");
            var aud_avatar_url=$(this).attr("aud_avatar");
            var aud_artist=$(this).attr("aud_artist");
            var aud_name=$(this).attr("aud_name");
            if(carrot.music.emp_status_music!=null) $(carrot.music.emp_status_music).html('<i class="fa-sharp fa-solid fa-circle-play"></i>');
            carrot.music.emp_status_music=$(this).parent().find(".status_music");
            carrot.music.emp_status_music.html('<i class="fa-solid fa-spinner fa-spin-pulse"></i>');
            carrot.music.audio_player.src=aud_song_url;
            carrot.music.audio_player.play();
            carrot.music.m_timeStamp=$("#m_timeStamp");

            $("#music_player_mini").removeClass("d-none").hide().show(100);
            $("#m_name").html(aud_name);
            $("#m_artist").html(aud_artist);
            $("#m_avatar").css("background","url('"+aud_avatar_url+"')");
        });

        $('#m_btn_stop').click(function(){
            carrot.music.audio_player.pause();
            carrot.music.audio_player.currentTime=0;
            $("#music_player_mini").hide(100);
        });
    }

    box_music_item(data_music,s_class='col-md-4 mb-3'){
        var s_url_icon="";
        if(data_music.avatar!=null) s_url_icon=data_music.avatar;
        if(s_url_icon=="") s_url_icon="images/150.png";
        var html_main_contain="<div class='box_app "+s_class+"' id=\""+data_music.id+"\"  key_search=\""+data_music.name+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                    html_main_contain+='<div role="button" class="img-cover pe-0 col-3 app_icon" aud_index="'+data_music.index+'" aud_artist="'+data_music.artist+'" aud_song="'+data_music.mp3+'" aud_avatar=\"'+data_music.avatar+'\" aud_name=\"'+data_music.name+'\" app_id="'+data_music.id+'"><img class="rounded" src="'+s_url_icon+'" alt="'+data_music.name+'"></div>';
                    html_main_contain+='<div class="det mt-2 col-9">';
                        html_main_contain+="<h5 class='mb-0 fs-6'>"+data_music.name+"</h5>";
                        html_main_contain+="<span class='fs-8'>"+data_music.artist+"</span>";
    
                        html_main_contain+='<ul class="row">';
                            html_main_contain+='<li class="col-8 ratfac">';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi fa-solid fa-star"></i>';
                            html_main_contain+='</li>';
                 
                            html_main_contain+='<li class="col-4"><span class="status_music text-secondary float-end"><i class="fa-sharp fa-solid fa-circle-play"></i></li>';

                        html_main_contain+='</ul>';
        
                        html_main_contain+="<div class='row' style='margin-top:6px;'>";
                        html_main_contain+="<div class='col-6'><div class='btn dev btn_app_edit btn-warning btn-sm' app_id='"+data_music.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</div></div>";
                        html_main_contain+="<div class='col-6'><div class='btn dev btn_app_del btn-danger btn-sm' app_id='"+data_music.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</div></div>";
                        html_main_contain+="</div>";
    
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
                html += '<i class="fa fa-pause controls--play-button"></i>';

                html += '<div class="song-info">';
                    html += '<div class="song-info--title" id="m_name">Name song</div>';
                    html += '<div class="song-info--artist" id="m_artist">Artist</div>';
                    html += '</div>';
                    html += '<div class="controls--actions">';
                    html += '<i class="fa fa-retweet actions--repeat"></i>';
                    html += '<i class="fa fa-backward actions--back"></i>';
                    html += '<i class="fa fa-forward actions--forward"></i>';
                    html += '<i class="fa-solid fa-circle-stop actions--stop" id="m_btn_stop"></i>';
                    html += '</div>';
                html += '</div>';
            html += '</main>';
        html += '</section>';
        return html;
    }

    show_add_or_edit_music(data_music,act_done){
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

        obj_music["name"]={'type':'input','defaultValue':data_music["name"], 'label':'Name'};
        obj_music["avatar"]={'type':'input','defaultValue':data_music["avatar"], 'label':'Avatar (url)'};
        obj_music["artist"]={'type':'input','defaultValue':data_music["artist"], 'label':'Artist'};
        obj_music["mp3"]={'type':'input','defaultValue':data_music["mp3"], 'label':'Mp3 url'};
        obj_music["lyrics"]={'type':'textarea','defaultValue':data_music["lyrics"], 'label':'lyrics','rows':'10'};
        obj_music["link_ytb"]={'type':'input','defaultValue':data_music["link_ytb"], 'label':'link Youtube (url)'};
        obj_music["year"]={'type':'select','label':'Year','options':arr_year,defaultValue:data_music["year"]};
        obj_music["lang"]={'type':'select','label':'Lang','options':arr_lang,defaultValue:data_music["lang"]};
        customer_field_for_db(obj_music,'song','name','','Add Music Successfully');
    
        $.MessageBox({
            message: s_title_box,
            input: obj_music,
            top: "auto",
            buttonFail: "Cancel"
        }).done(act_done);
    }

    formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        var seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }
}

