class Carrot_Music{
    carrot;
    obj_songs=null;

    index_song_cur=-1;
    icon="fa-solid fa-music";
    id_page="song";
    is_video_player=false;

    info_song_cur=null;

    constructor(carrot){
        this.carrot=carrot;
        this.load_obj_song();

        carrot.register_page(this.id_page,"carrot.music.show_list_music()","carrot.music.edit","carrot.music.show_info_music_by_id","carrot.music.reload");
        var btn_add=carrot.menu.create("add_music").set_label("Add Music").set_icon(this.icon).set_type("add");
        $(btn_add).click(function(){carrot.music.add();});
        var btn_list=carrot.menu.create("list_music").set_label("Music").set_lang("music").set_icon(this.icon).set_type("main");
        $(btn_list).click(function(){carrot.music.show_list_music();});
    }

    load_obj_song(){
        if(localStorage.getItem("obj_songs")!=null) this.obj_songs=JSON.parse(localStorage.getItem("obj_songs"));
    }

    delete_obj_song(){
        localStorage.removeItem("obj_songs");
        this.obj_songs=null;
        this.carrot.delete_ver_cur(this.id_page);
    }

    show_list_music(){
        if(this.carrot.check_ver_cur("song")==false){
            this.carrot.log("Get list song from sever and show","alert");
            this.carrot.get_list_doc("song",this.act_done_list_music);
        }else{
            if(this.obj_songs==null){
                this.carrot.log("Get list song from sever and show","alert");
                this.carrot.get_list_doc("song",this.act_done_list_music);
            }
            else{
                this.carrot.log("Show list song from cache","success");
                this.show_list_music_by_obj_songs(this.carrot);
            }
        }
    }

    act_done_list_music(obj_data,carrot){
        carrot.update_new_ver_cur("song",true);
        carrot.music.obj_songs=obj_data;
        localStorage.setItem("obj_songs",JSON.stringify(carrot.music.obj_songs));
        carrot.music.show_list_music_by_obj_songs(carrot);
    }

    show_list_music_by_obj_songs(carrot){
        carrot.change_title_page("Music", "?p="+this.id_page,this.id_page);
        carrot.player_media.create();
        carrot.player_media.set_act_next(carrot.music.next_music);
        carrot.player_media.set_act_prev(carrot.music.prev_music);
        var list_song=carrot.convert_obj_to_list(this.obj_songs);
        var html='<div class="row m-0">';
        $(list_song).each(function(index,song){
            song["index"]=index;
            html+=carrot.music.box_music_item(song);
        });
        html+="</div>";
        carrot.show(html);
        carrot.music.check_event();
    }

    check_event(){
        var carrot=this.carrot;

        $(".btn-play-music").unbind('click');
        $(".btn-play-music").click(function(){
            var aud_name=$(this).attr("aud-name");
            var aud_index=$(this).attr("aud-index");
            $(this).effect( "bounce","fast");
            carrot.player_media.index_song_cur=aud_index;
            carrot.player_media.open(this,carrot.music.play_music_by_name(aud_name));
        });

        $(".btn-play-video").unbind('click');
        $(".btn-play-video").click(function(){
            var aud_name=$(this).attr("aud-name");
            var aud_index=$(this).attr("aud-index");
            $(this).effect( "bounce","fast");
            carrot.player_media.index_song_cur=aud_index;
            carrot.player_media.open(this,carrot.music.play_video_by_name(aud_name));
        });

        $(".btn_info_music").unbind('click');
        $(".btn_info_music").click(function(){
            var aud_id=$(this).attr("obj_id");
            var aud_index=$(this).attr("obj_index");
            $(this).effect( "bounce","fast");
            carrot.player_media.index_song_cur=aud_index;
            carrot.music.show_info_music_by_id(aud_id,carrot);
        });

        $("#btn_download").unbind('click');
        $("#btn_download").click(function(){
            if(carrot.music.check_pay(carrot.music.info_song_cur.name))
                window.open(carrot.music.info_song_cur.mp3, "_blank");
            else
                carrot.show_pay("song","Download Music ("+carrot.music.info_song_cur.name+")","Get file mp3 thi song from Carrot Music","1.99",carrot.music.pay_success);
        })

        carrot.check_event();
    }

    play_by_index(index_play){
        var list_music=this.carrot.obj_to_array(this.obj_songs);
        if(index_play<0) index_play=list_music.length-1;
        if(index_play>list_music.length-1) index_play=0;

        var song=list_music[index_play];
        if(this.is_video_player==false)
            this.play_music_by_name(song.name);
        else
            this.play_video_by_name(song.name);
    }

    play_music_by_name(s_name_audio){
        var song=JSON.parse(this.obj_songs[s_name_audio]);
        this.is_video_player=false;
        this.carrot.player_media.play_music(song.name,song.artist,song.album,song.mp3,song.avatar);
    }

    play_video_by_name(s_name_audio){
        var song=JSON.parse(this.obj_songs[s_name_audio]);
        this.is_video_player=true;
        this.carrot.player_media.play_youtube(song.name,song.artist,song.album,song.mp3,song.avatar,song.link_ytb);
    }

    show_info_music_by_id(s_name_id,carrot){
        carrot.log("show_info_music_by_id:"+s_name_id);
        if(carrot.music.obj_songs[s_name_id]!=null){
            var data=JSON.parse(carrot.music.obj_songs[s_name_id]);
            carrot.music.show_info_music(data);
        }else{
            carrot.msg("Bài hát không tồn tại","error");
            carrot.show_404();
        }

    }

    show_info_music(data){
        this.carrot.change_title_page(data.name,"?p="+this.id_page+"&id="+data.id,this.id_page);
        this.carrot.player_media.create();
        this.carrot.player_media.set_act_next(this.carrot.music.next_music);
        this.carrot.player_media.set_act_prev(this.carrot.music.prev_music);
        data["index"]=this.index_song_cur;
        this.info_song_cur=data;
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3 text-center">';
                        html+='<img class="w-100" src="'+data.avatar+'" alt="'+data.name+'">';
                        if(data.mp3!="") html+='<i role="button" class="fa-sharp fa-solid fa-circle-play fa-5x text-success mt-2 mr-2 btn-play-music" aud-index="'+data.index+'" aud-name="'+data.name+'"></i> ';
                        if(data.link_ytb!="") html+='<i role="button" class="fa-sharp fa-solid fa-film fa-5x text-success mt-2 btn-play-video" aud-index="'+data.index+'" aud-name="'+data.name+'"></i>';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data.name+'</h4>';
                        html+=this.carrot.btn_dev("song",data.id);
                        html+='<div class="row pt-4">';
                            if(data.genre!=''){
                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="genre">Genre</l> <i class="fa-solid fa-guitar"></i></b>';
                                    html+='<p>'+data.genre+'</p>';
                                html+='</div>';
                            }

                            if(data.album!=''){
                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b>Album <i class="fa-solid fa-album"></i></b>';
                                    html+='<p class="lang" key_lang="album">'+data.album+'</p>';
                                html+='</div>';
                            }

                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="year">Year</l> <i class="fa-solid fa-calendar-days"></i></b>';
                                html+='<p class="lang" key_lang="contains_inapp">'+data.year+'</p>';
                            html+='</div>';

                            if(data.artist!=''){
                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="artist">Artist</l> <i class="fa-solid fa-user"></i></b>';
                                    html+='<p>'+data.artist+'</p>';
                                html+='</div>';
                            }

                            if(data.lang!=''){
                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="country">Country</l> <i class="fa-solid fa-language"></i></b>';
                                    html+='<p>'+data.lang+'</p>';
                                html+='</div>';
                            }

                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-12 text-center">';
                                html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                                html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success" ><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button> ';
                                if(data.mp3!=""){
                                    if(this.check_pay(data.name))
                                        html+='<button id="btn_download" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                                    else
                                        html+='<button id="btn_download" type="button" class="btn d-inline btn-info"><i class="fa-brands fa-paypal"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                                }
                                    
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
        this.carrot.show(html);
        this.check_event();
    }

    box_music_item(data_music,s_class='col-md-4 mb-3'){
        var s_url_avatar="";
        if(data_music.avatar!=null) s_url_avatar=data_music.avatar;
        if(s_url_avatar=="") s_url_avatar="images/150.png";
        var item_music=new Carrot_List_Item(this.carrot);
        item_music.set_db("song");
        item_music.set_obj_js("music");
        item_music.set_id(data_music.id);
        item_music.set_class(s_class);
        item_music.set_name(data_music.name);
        item_music.set_index(data_music.index);
        item_music.set_icon(s_url_avatar);
        item_music.set_class_icon("pe-0 col-3 btn_info_music");
        item_music.set_class_body("mt-2 col-9");
        var html_body='';
        html_body+='<li class="col-6 ratfac">';
            if(data_music.artist!='') html_body+='<span class="d-block fs-8 mb-2">'+data_music.artist+'</span>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-music fa-2xs"></i>';
            html_body+='<i class="bi fa-solid fa-music fa-2xs"></i>';
        html_body+='</li>';

        html_body+='<div class="col-6 d-flex">'; 
        html_body+='<span role="button" class="btn_info_music text-info" aud-name="'+data_music.name+'" obj_id="'+data_music.id+'" obj_index="'+data_music.index+'" style="margin-right: 6px;"><i class="fa-sharp fa-solid fa-circle-info fa-2x"></i></span> ';
        if(data_music.link_ytb!="") html_body+='<span role="button" class="status_video float-end text-success btn-play-video"  aud-name="'+data_music.name+'" aud-index="'+data_music.index+'" style="margin-right: 6px;"><i class="fa-sharp fa-solid fa-film fa-2x"></i></span> ';
        if(data_music.mp3!="") html_body+='<span role="button" class="status_music float-end text-success btn-play-music"  aud-name="'+data_music.name+'" aud-index="'+data_music.index+'"><i class="fa-sharp fa-solid fa-circle-play fa-2x"></i></span> ';
        html_body+='</div>';

        item_music.set_body(html_body);
        return item_music.html();
    }

    add(){
        var data_music=new Object();
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
        data_music["lang"]=this.carrot.lang;
        this.frm_add_or_edit(data_music).set_title("Add Music").set_msg_done("Add song success!").show();
        this.extenion_fnc_form();
    }

    edit(data,carrot){
        carrot.music.frm_add_or_edit(data).set_title("Edit Music").set_msg_done("Update song success!").show();
        carrot.music.extenion_fnc_form();
    }

    extenion_fnc_form(){
        var carrot=this.carrot;
        $("#name").on("change",function(){
            var val_name=$(this).val();
            var url_song='https://carrotstore.web.app/?p=song&id='+encodeURIComponent(val_name);
            $("#name_tip").attr("role","button");
            $("#name_tip").html(url_song);
            $("#name_tip").click(async function(){
                await navigator.clipboard.writeText(url_song);
                carrot.msg("Copy Success!");
                $("#name_tip").removeClass("text-muted").addClass("text-success");
            });
        })
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_music",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("song","name");
        var btn_ytb_avatar=new Carrot_Btn();
        btn_ytb_avatar.set_onclick("carrot.music.get_link_avatar_ytb()");
        btn_ytb_avatar.set_icon("fa-solid fa-wand-magic-sparkles");
        frm.create_field("link_ytb").set_label("link ytb").add_btn_download_ytb().set_val(data["link_ytb"]).add_btn(btn_ytb_avatar).set_tip("Dán liên kết Youtube vào đây để nhập tự động thông tin bài hát");
        frm.create_field("name").set_label("Name").set_val(data["name"]).set_tip("Create id url by name").add_btn_search_google().add_btn_search_ytb().add_btn_toLower();
        frm.create_field("avatar").set_label("Avatar (url)").set_val(data["avatar"]).set_type("file").set_type_file("image/*");
        frm.create_field("artist").set_label("Artist").set_val(data["artist"]);
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
        var lang_field=frm.create_field("lang").set_label("Lang").set_val(data["lang"]).set_type("select");
        $(this.carrot.langs.list_lang).each(function(index,lang_data){
            lang_field.add_option(lang_data.key,lang_data.name);
        });
        return frm;
    }

    get_link_avatar_ytb(){
        var link_ytb=$("#link_ytb").val();
        var id_ytb=this.carrot.player_media.get_youtube_id(link_ytb);
        $("#link_ytb").val("https://www.youtube.com/watch?v="+id_ytb);
        $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id_ytb + "&key=AIzaSyDtrxOBgBfiRLaxKP0p_UzfE2-hsjHNKBw", function(data) {
            console.log(data);
            $("#name").val(data.items[0].snippet.title);
            if(data.items[0].snippet.defaultLanguage!=null){
                var lang_song=data.items[0].snippet.defaultLanguage;
                var l_sog=lang_song.split("-");
                $("#lang").val(l_sog[0]);
            }
            $("#album").val(data.items[0].snippet.channelTitle);
            var tags=data.items[0].snippet.tags;
            $("#artist").val(tags[0]);
            var day_ytb = new Date(data.items[0].snippet.publishedAt);
            $("#year").val(day_ytb.getFullYear());
            $('.richText-editor').html(data.items[0].snippet.description.replace(/\n/g,'<br/>'));
            var thumbnails_ytb=data.items[0].snippet.thumbnails;
            var html_thumb='';
            html_thumb+='<div class="form-group">';
            html_thumb+='<a href="'+thumbnails_ytb.medium.url+'" target="_blank"><img class="rounded" src="'+thumbnails_ytb.medium.url+'"></a>';
            html_thumb+='</div>';
            $("#link_ytb_tip").html(html_thumb);
        });
    }

    reload(carrot){
        carrot.music.delete_obj_song();
        carrot.music.show_list_music();
    }

    list_for_home(){
        var html="";
        if(this.obj_songs!=null){
            this.carrot.player_media.create();
            this.carrot.player_media.set_act_next(this.carrot.music.next_music);
            this.carrot.player_media.set_act_prev(this.carrot.music.prev_music);
            var list_song=this.carrot.obj_to_array(this.obj_songs);
            list_song= list_song.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_music">Other Music</l>';
            html+='<span role="button" onclick="carrot.music.show_list_music()" class="btn float-end btn-sm btn-secondary"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div id="other_code" class="row m-0">';
            for(var i=0;i<12;i++){
                var song=list_song[i];
                html+=this.box_music_item(song);
            }
            html+='</div>';
        }
        return html;
    }

    pay_success(carrot){
        $("#btn_download").removeClass("btn-info").addClass("btn-success").html('<i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l>');
        localStorage.setItem("buy_song_"+carrot.music.info_song_cur.name,"1");
        window.open(carrot.music.info_song_cur.mp3, "_blank");
    }

    check_pay(id_name_song){
        if(localStorage.getItem("buy_song_"+id_name_song)!=null)
            return true;
        else
            return false;
    }

    next_music(carrot){
        carrot.music.index_song_cur+=1;
        carrot.music.play_by_index(carrot.music.index_song_cur);
    }

    prev_music(carrot){
        carrot.music.index_song_cur-=1;
        carrot.music.play_by_index(carrot.music.index_song_cur);
    }
}

