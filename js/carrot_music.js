class Carrot_Music{
    carrot;
    obj_songs=null;
    audio_player=null;

    m_timeStamp=null;
    m_avatar=null;
    m_index=-1;

    emp_status_music=null;

    constructor(carrot){
        this.carrot=carrot;
        if(localStorage.getItem("obj_songs")!="") this.obj_songs=JSON.parse(localStorage.getItem("obj_songs"));
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
        if(this.obj_songs==null){
            this.carrot.log("Get list song from sever and show");
            this.carrot.get_list_doc("song",this.act_done_list_music);
        }
        else{
            this.carrot.log("Show list song from cache");
            this.show_list_music_by_obj_songs(this.carrot);
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
        carrot.check_mode_site();

        $('.app_icon').click(function() {
            var aud_song_url=$(this).attr("aud_song");
            var aud_avatar_url=$(this).attr("aud_avatar");
            var aud_artist=$(this).attr("aud_artist");
            var aud_name=$(this).attr("aud_name");
            var aud_index=$(this).attr("aud_index");
            if(carrot.music.emp_status_music!=null) $(carrot.music.emp_status_music).html('<i class="fa-sharp fa-solid fa-circle-play"></i>');
            carrot.music.emp_status_music=$(this).parent().find(".status_music");
            carrot.music.emp_status_music.html('<i class="fa-solid fa-spinner fa-spin-pulse"></i>');
            carrot.music.audio_player.src=aud_song_url;
            carrot.music.m_index=parseInt(aud_index);
            carrot.music.audio_player.play();
            carrot.music.m_timeStamp=$("#m_timeStamp");

            $("#music_player_mini").removeClass("d-none").hide().show(100);
            $("#m_name").html(aud_name);
            $("#m_artist").html(aud_artist);
            $("#m_avatar").css("background","url('"+aud_avatar_url+"')");
        });

        $('#m_btn_stop').click(function(){
            carrot.music.emp_status_music.html('<i class="fa-sharp fa-solid fa-circle-play"></i>');
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

        
        $(".btn_app_del").click(async function () {
            var id_box_app = $(this).attr("app_id");
            $.MessageBox({
                buttonDone  : "Yes",
                buttonFail  : "No",
                message     : "Bạn có chắc chắng là xóa ứng dụng "+id_box_app+" này không?"
            }).done(function(){
                carrot.act_del_obj("song",id_box_app);
            });
        });
    }

    back_music(){
        this.m_index--;
        this.play_music_by_index(this.m_index);
    }

    forward_music(){
        this.m_index++;
        this.play_music_by_index(this.m_index);
    }

    play_music_by_index(index_play){
        var list_music=this.carrot.convert_obj_to_list(this.obj_songs);
        if(index_play<0) index_play=list_music.length-1;
        if(index_play>list_music.length-1) index_play=0;

        this.m_index=index_play;
        var song=list_music[this.m_index];
        

        if(this.carrot.id_page=="music"){
            $(".status_music").html('<i class="fa-sharp fa-solid fa-circle-play"></i>');
            var emp_ui_music=$("#m_"+index_play);
            this.emp_status_music=$(emp_ui_music).parent().find(".status_music");
            this.emp_status_music.html('<i class="fa-solid fa-spinner fa-spin-pulse"></i>');
        }
        
        this.audio_player.src=song.mp3;
        this.audio_player.play();
        $("#music_player_mini").removeClass("d-none").hide().show(100);
        $("#m_name").html(song.name);
        $("#m_artist").html(song.artist);
        $("#m_avatar").css("background","url('"+song.avatar+"')");
    }

    box_music_item(data_music,s_class='col-md-4 mb-3'){
        var s_url_icon="";
        if(data_music.avatar!=null) s_url_icon=data_music.avatar;
        if(s_url_icon=="") s_url_icon="images/150.png";
        var html_main_contain="<div class='box_app "+s_class+"' id=\""+data_music.id+"\"  key_search=\""+data_music.name+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                    html_main_contain+='<div role="button" class="img-cover pe-0 col-3 app_icon" id="m_'+data_music.index+'" aud_index="'+data_music.index+'" aud_artist="'+data_music.artist+'" aud_song="'+data_music.mp3+'" aud_avatar=\"'+data_music.avatar+'\" aud_name=\"'+data_music.name+'\" app_id="'+data_music.id+'"><img class="rounded" src="'+s_url_icon+'" alt="'+data_music.name+'"></div>';
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
                                html_main_contain+='<span role="button" class="status_music text-secondary float-end mr-3"><i class="fa-sharp fa-solid fa-circle-play fa-2x"></i></span> ';
                                html_main_contain+='<span role="button" class="info_music text-secondary float-end" style="margin-left: 6px;"><i class="fa-sharp fa-solid fa-circle-info fa-2x"></i></span> ';
                            html_main_contain+='</li>';

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

        if(data_music["id"]!="") obj_music["id"]={'type':'caption',message:"ID:"+data_music["id"]};
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

