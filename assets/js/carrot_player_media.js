class Carrot_Player_Media{
    carrot;

    emp_player=null;
    audio_player=null;

    act_next=null;
    act_prev=null;
    type="audio";

    constructor(carrot){
        this.carrot=carrot;
    }

    create(){
        if(this.audio_player==null){
            this.carrot.log("Create Audio Media Player");
            this.audio_player=new Audio();
            this.audio_player.addEventListener("loadeddata", () => {
                let duration = this.audio_player.duration;
                $("#m_timeStamp").attr('max',duration.toFixed(2));
                $("#m_time_end").html(this.formatTime(duration));
                if (this.audio_player.readyState >= 2){
                    if(this.type!="video"){
                        $("#music_player_mini").effect("bounce","fast");
                        this.audio_player.play();
                        this.check_status_mm_player();
                    }
                }
            });
    
            this.audio_player.addEventListener("timeupdate", (event) => {
                $("#m_timeStamp").attr('value',this.audio_player.currentTime.toFixed(2));
                $("#m_time_play").html(this.formatTime(this.audio_player.currentTime));
            });
    
            this.carrot.body.parent().parent().append(this.ui_player());
            this.emp_player=$("#music_player_mini");
            $("#music_player_mini").draggable({scroll: true,axis: "x",cursor: "crosshair", handle: ".fa-up-down-left-right"});
        }
    }

    set_mediaSession(s_title,s_artist,s_album,s_url_avatar){
        var player_media=this;
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
                player_media.play();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                player_media.pause();
            });
            navigator.mediaSession.setActionHandler("stop", () => {
                player_media.stop();
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
                player_media.prev();
            });
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                player_media.next();
            });
        }
    }

    ui_player(){
        var html='';
        html += '<section id="music_player_mini" style="display:none" class="music-player">';
            html += '<div id="carrot_player_video"></div>';
            html += '<header id="m_avatar" onclick="carrot.player_media.off_avatar()" class="music-player--banner"></header>';
            html += '<main class="music-player--main">';
                html += '<div id="m_progress" class="music-player--progress">';
                html += '<progress id="m_timeStamp" class="progress--progress-bar" value="0" max="100"></progress>';
                html += '<div class="progress--time" id="m_time_play">1:37</div>';
                html += '<div class="progress--time progress--time__end" id="m_time_end">3:52</div>';
                html += '</div>';
                html += '<div id="m_controls" class="music-player--controls">';
                html += '<i id="btn_mm_play" onclick="carrot.player_media.play_or_pause()" class="fa fa-pause controls--play-button"></i>';

                html += '<div class="song-info">';
                    html += '<div class="song-info--title" id="m_name">Name song</div>';
                    html += '<div class="song-info--artist" id="m_artist">Artist</div>';
                    html += '</div>';
                    html += '<div class="controls--actions">';
                    html += '<i role="button" class="fa fa-solid fa-up-down-left-right"></i>'
                    html += '<i role="button" onClick="carrot.player_media.prev()" class="fa fa-backward" id="m_btn_back"></i>';
                    html += '<i role="button" onclick="carrot.player_media.next()" class="fa fa-forward " id="m_btn_forward"></i>';
                    html += '<i role="button" onclick="carrot.player_media.stop()" class="fa-solid fa-circle-stop" id="m_btn_stop"></i>';
                    html += '</div>';
                html += '</div>';
            html += '</main>';
        html += '</section>';
        return html;
    }

    set_name(name_song){
        $("#m_name").html(name_song);
        return this;
    }

    set_artist(artist_song){
        $("#m_artist").html(artist_song);
        return this;
    }

    off_avatar(){
        $('#carrot_player_video').html("").hide();
        $("#m_avatar").hide();
        $("#music_player_mini").css("height","80px");
        return this;
    }

    on_avatar(){
        $('#carrot_player_video').html("").hide();
        $("#m_avatar").show();
        $("#music_player_mini").css("height","233px");
        return this;
    }

    hide_avatar(){
        $("#m_avatar").hide();
        
    }

    on_video(){
        $('#carrot_player_video').show(100);
        $("#m_avatar").hide();
        $("#music_player_mini").css("height","233px");
        return this;
    }

    set_mp3(url_mp3){
        this.audio_player.src=url_mp3;
        return this;
    }

    play_or_pause(){
        if(this.audio_player.paused)
            this.audio_player.play();
        else
            this.audio_player.pause();
        this.check_status_mm_player();
    }

    play(){
        $("#music_player_mini").show(100);
        this.audio_player.play();
        this.check_status_mm_player();
        return this;
    }

    pause(){
        this.audio_player.pause();
        this.check_status_mm_player();
        return this;
    }

    stop(){
        this.audio_player.pause();
        this.audio_player.currentTime=0;
        $('#carrot_player_video').html("");
        if(this.type=="video") $("#music_player_mini").hide(100);
        if(this.type=="music") $("#music_player_mini").effect("explode");
        if(this.type=="audio") $("#music_player_mini").hide(100);
    }

    next(){
        if(this.act_next!=null) this.act_next(this.carrot);
    }

    prev(){
        if(this.act_prev!=null) this.act_prev(this.carrot);
    }

    open(emp_btn,act_open){
        if($('#music_player_mini').is(":visible")){
            $(emp_btn).effect("transfer", { to: $("#music_player_mini") }, 600,function(){
                act_open;
            });
        }else{
            $("#music_player_mini").show("slide", { direction: "right" }, 1000,function(){
                act_open;
            });
        }
    }

    set_act_next(act){
        this.act_next=act;
    }

    set_act_prev(act){
        this.act_prev=act;
    }

    set_avatar(url_avatar){
        $("#m_avatar").css("background-image","url('"+url_avatar+"')");
        return this;
    }

    set_link_ytb(link_ytb){
        var id_ytb=this.get_youtube_id(link_ytb);
        $('#carrot_player_video').html('');
        $('#carrot_player_video').html('<iframe width="100%" height="169" src="https://www.youtube.com/embed/'+id_ytb+'?autoplay=1&controls=0" title="Carrot video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>');
    }

    check_status_mm_player(){
        if(this.audio_player.paused){
            this.set_icon_play("play");
        }else{
            this.set_icon_play("pause");
        }
    }

    play_audio(name,artist,mp3){
        this.type="audio";
        this.set_name(name);
        this.set_artist(artist);
        this.set_mp3(mp3).play();
        this.off_avatar();
        this.set_icon_play("loading");
        $("#m_progress").show();
        $("#btn_mm_play").show();
        this.set_mediaSession(name,artist,"Carrot Audio",this.carrot.get_url()+"/images/298x168.jpg");
    }

    play_music(name,artist,album,mp3,avatar){
        this.type="music";
        this.set_name(name);
        this.set_artist(artist);
        this.set_mp3(mp3).play();
        this.on_avatar();
        this.set_avatar(avatar);
        this.set_icon_play("loading");
        $("#m_progress").show();
        $("#btn_mm_play").show();
        this.set_mediaSession(name,artist,album,avatar);
    }

    play_youtube(name,artist,album,mp3,avatar,link_ytb){
        this.type="video";
        this.set_name(name);
        this.set_artist(artist);
        this.set_mp3(mp3).pause();
        this.off_avatar();
        this.on_video();
        this.set_avatar(avatar);
        this.set_link_ytb(link_ytb);
        $("#m_progress").hide();
        $("#btn_mm_play").hide();
        this.set_mediaSession(name,artist,album,avatar);
    }

    formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        var seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    get_youtube_id(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    set_icon_play(s_icon){
        if(s_icon=="play") s_icon="fa-circle-play";
        if(s_icon=="pause") s_icon="fa-pause";
        if(s_icon=="loading") s_icon="fa-solid fa-spinner fa-spin";
        $("#btn_mm_play").removeClass("fa-pause");
        $("#btn_mm_play").removeClass("fa-circle-play");
        $("#btn_mm_play").removeClass("fa-solid");
        $("#btn_mm_play").removeClass("fa-spinner");
        $("#btn_mm_play").removeClass("fa-spin");
        $("#btn_mm_play").addClass(s_icon);
    }
}