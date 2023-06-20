class Carrot_Site{
    firebaseConfig_mainhost;
    count_act_dev = 0;
    mode_site = "nomal";
    is_dev=false;
    is_localhost=false;
    lang;
    lang_url="";
    lang_web=Object();
    list_link_store=null;
    list_lang;
    recognition=null;

    obj_app=null;
    obj_lang_web=Object();
    obj_version_new=null;
    obj_version_cur=null;

    name_collection_cur="";
    name_document_cur="";
    id_page;
    body;

    user;
    music;
    ai_lover;
    code;
    icon;
    background;
    
    constructor(){
        var carrot=this;
        this.firebaseConfig_mainhost={
            apiKey: "AIzaSyDzsx1KYLZL5COz1NaTD8cOz8GYalX2Dxc",
            authDomain: "carrotstore.firebaseapp.com",
            projectId: "carrotstore",
            storageBucket: "carrotstore.appspot.com",
            messagingSenderId: "745653792874",
            appId: "1:745653792874:web:55d78113cd3dea7c28da13",
            measurementId: "G-KXDDJ42JFN"
        }

        if (localStorage.getItem("is_localhost") == null) {
            this.is_localhost = false;
        } else {
            if (localStorage.getItem("is_localhost") == "false")
                this.is_localhost = false;
            else
                this.is_localhost = true;
        }

        if(localStorage.getItem("mode_site") != null) this.mode_site = localStorage.getItem("mode_site");
        if(localStorage.getItem("is_dev") != null) this.is_dev = localStorage.getItem("is_dev");
        if(localStorage.getItem("lang_web")!=null) this.lang_web=JSON.parse(localStorage.getItem("lang_web"));
        if(localStorage.getItem("link_store")!=null) this.list_link_store=JSON.parse(localStorage.getItem("link_store"));
        if(localStorage.getItem("lang") == null) this.change_lang("en"); else this.lang = localStorage.getItem("lang");
       
        this.list_lang=Array();
        this.load_obj_app();
        this.load_list_lang();
        this.load_recognition();
        this.load_obj_version_new();
        this.load_obj_version_cur();

        $("#key_lang").html(this.lang);
        $("#btn_change_lang").click(function(){ carrot.show_list_lang();});

        this.body=$("#main_contain");
        
        $('head').append('<script type="text/javascript" src="assets/js/main.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_form.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_user.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_music.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_code.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_icon.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_background.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/ai_lover.js?ver='+this.get_ver_cur("js")+'"></script>');

        this.user=new Carrot_user(this);
        this.music=new Carrot_Music(this);
        this.code=new Carrot_Code(this);
        this.icon=new Carrot_Icon(this);
        this.background=new Carrot_Background(this);
        this.ai_lover=new Ai_Lover(this);
    };

    load_recognition(){
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var carrot=this;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        
        this.recognition.onresult = function(event) {
            var speechResult = event.results[0][0].transcript.toLowerCase();
            $("#txt_recognition_msg").removeClass("text-primary").addClass("text-success").html(speechResult);
            carrot.act_search(s_key_search);
            carrot.log('Confidence: ' + speechResult);
        }

        this.recognition.onspeechend = function() { carrot.recognition.stop();}
        
        this.recognition.onerror = function(event) {
            $("#txt_recognition_msg").removeClass("text-primary").removeClass("text-success").removeClass("text-danger").html(event.error);
        }
          
        this.recognition.onaudiostart = function(event) {
            $("#txt_recognition_msg").addClass("text-primary").html(carrot.l("recognition_start","Speak into the microphone to search..."));
            $("#txt_recognition").removeClass("d-none");
            $("#box_input_search").addClass("d-none");
            carrot.log('SpeechRecognition.onaudiostart');
        }
          
        this.recognition.onaudioend = function(event) {
            carrot.recognition.stop();
            carrot.log('SpeechRecognition.onaudioend');
        }
          
        this.recognition.onend = function(event) {
            $("#txt_recognition").addClass("d-none");
            $("#box_input_search").removeClass("d-none");
            carrot.log('SpeechRecognition.onend');
        }
          
        this.recognition.onnomatch = function(event) {carrot.log('SpeechRecognition.onnomatch');}
        this.recognition.onsoundstart = function(event) {carrot.log('SpeechRecognition.onsoundstart');}
        this.recognition.onsoundend = function(event) {carrot.log('SpeechRecognition.onsoundend');}
        this.recognition.onspeechstart = function (event) {carrot.log('SpeechRecognition.onspeechstart');}
        this.recognition.onstart = function(event) {carrot.log('SpeechRecognition.onstart');}
    }

    act_mode_dev() {
        this.count_act_dev++;
        if (this.count_act_dev >= 3) {
            this.is_dev = true;
            localStorage.setItem("is_dev", this.is_dev);
            $("#btn_model_site").show();
            this.count_act_dev = 0;
            $.MessageBox("Active Model Dev!");
        }
    }

    change_mode_site(){
        if (this.mode_site == "nomal")
            this.mode_site = "dev";
        else
            this.mode_site = "nomal";
        localStorage.setItem("mode_site",this.mode_site);
        this.check_mode_site();
    }

    check_mode_site() {
        if (this.is_dev) {
            $("#btn_model_site").show();
            if (this.mode_site == "nomal")
                $(".dev").each(function () { $(this).hide(100); });
            else
                $(".dev").each(function () { $(this).show(100); });
        } else {
            $("#btn_model_site").hide();
            $(".dev").each(function () { $(this).hide(100); });
        }

        if (this.is_localhost) {
            $("#btn_mode_host").html('<i class="fa-brands fa-dev fs-6 me-2"></i> Localhost');
        } else {
            $("#btn_mode_host").html('<i class="fa-sharp fa-solid fa-database fs-6 me-2"></i> Googlehost');
        }
    }

    start_recognition(){
        this.recognition.start();
    }

    show_error_connect_sever(){
        var htm_msg="<div class='row text-center'>";
        htm_msg="<div class='col-12 text-center'>";
        htm_msg+="<img src='images/upgrade.png' class='mx-auto d-block' width='200px;' alt='Upgrade'/>";
        htm_msg+="<h5>"+this.l("error_connect_sever","Data server connection failed!")+"</h5>";
        htm_msg+="<p class='text-justify'>"+this.l("error_connect_sever_msg","We are doing system maintenance and upgrading in a few hours. But you can use the functions with offline mode when you have previously visited,The site will be back to normal when the upgrade is done!")+"</p>";
        htm_msg+="<p><i class='text-secondary'>"+this.l("error_connect_sever_thanks","Sorry for this inconvenience!")+"</i><p>";
        htm_msg+="</div>";
        htm_msg+="</div>";
        $.MessageBox({message:htm_msg});
    }

    async get_all_data_lang_web(){
        this.log("get_all_data_lang_web");
        this.get_doc("lang_web",this.lang,this.get_data_lang_web_done);
    }

    get_data_lang_web_done(data,carrot){
        carrot.lang_web=data;
        carrot.obj_lang_web[carrot.lang]=JSON.stringify(carrot.lang_web);
        localStorage.setItem("lang_web",JSON.stringify(carrot.lang_web));
        localStorage.setItem("obj_lang_web",JSON.stringify(carrot.obj_lang_web));
        carrot.load_data_lang_web();
    }

    convert_apps_to_list(){
        return this.convert_obj_to_list(this.obj_app);
    }

    convert_obj_to_list(obj_carrot){
        var list_obj=Array();
        $.each(obj_carrot,function(key,val){
            list_obj.push(JSON.parse(val));
        });
        return list_obj;
    }

    show_home(){
        this.load_obj_app();
        if(this.obj_app==null){
            this.log("Show Home load data.. Get data from sever");
            this.get_all_data_app();
        }
        else{
            this.log("Show Home load data.. Cache");
            this.show_list_app(this.convert_apps_to_list());
        }
        this.change_title_page("Carrot store", "?p=home","home");
    }

    show_all_app(){
        this.log('show_all_app');
        var list_app_mobile=Array();
        $(this.convert_apps_to_list()).each(function(index,emp){
            if(emp.type == "app") list_app_mobile.push(emp);
        });
        this.show_list_app(list_app_mobile);
    }

    show_all_game(){
        this.log('show_all_game');
        var list_game=Array();
        $(this.convert_apps_to_list()).each(function(index,emp){
            if(emp.type == "game") list_game.push(emp);
        });
        this.show_list_app(list_game);
    }
    
    show_edit_version_data_version(act_done){
        var obj_data_ver = Object();
        $.each(this.obj_version_new,function(key,value){        
            obj_data_ver[key]={'type':'input','defaultValue':value,'label':key};
        });
        $.MessageBox({
            message: "Edit version",
            input: obj_data_ver,
            top: "auto",
            buttonFail: "Cancel"
        }).done(act_done);
    }

    load_obj_app(){
        if (localStorage.getItem("obj_app") != null) this.obj_app=JSON.parse(localStorage.getItem("obj_app"));
    }

    load_list_lang(){
        if (localStorage.getItem("list_lang") == null)
            this.list_lang=new Array();
        else 
            this.list_lang=JSON.parse(localStorage.getItem("list_lang"));
    }

    load_obj_version_new(){
        if(localStorage.getItem("obj_version_new")!=null) this.obj_version_new=JSON.parse(localStorage.getItem("obj_version_new"));
        else this.obj_version_new=new Object();
    }

    load_obj_version_cur(){
        if(localStorage.getItem("obj_version_cur")!=null) this.obj_version_cur=JSON.parse(localStorage.getItem("obj_version_cur"));
        else this.obj_version_cur=new Object();
    }

    save_obj_app(){
        localStorage.setItem("obj_app", JSON.stringify(this.obj_app));
    }

    save_obj_version_new(){
        localStorage.setItem("obj_version_new", JSON.stringify(this.obj_version_new));
    }

    save_obj_version_cur(){
        localStorage.setItem("obj_version_cur", JSON.stringify(this.obj_version_cur));
    }

    check_ver_cur(s_item){
        if(this.obj_version_cur==null){ 
            return false;
        }
        else{
            if(this.obj_version_cur[s_item]!=null){
                if(this.obj_version_cur[s_item]==this.obj_version_new[s_item]) return true;
                else return false;
            }
            else return false;
        }
    }

    update_new_ver_cur(s_item,is_save=false){
        if(this.obj_version_new[s_item]!=null){
            this.obj_version_cur[s_item]=this.obj_version_new[s_item];
            if(is_save) this.save_obj_version_cur();
        } 
        else{
            this.obj_version_cur[s_item]="0.0";
            this.obj_version_new[s_item]="0.0"
            if(is_save){
                this.save_obj_version_cur();
                this.save_obj_version_new();
            }
        }
        
    }

    get_ver_cur(s_item){
        if(this.obj_version_cur==null){ 
            return "0.0";
        }
        else{
            if(this.obj_version_cur[s_item]!=null)
                return this.obj_version_cur[s_item];
            else 
                return "0.0";
        }
    }

    delete_obj_app(){
        localStorage.removeItem("obj_app");
        this.obj_app=new Object();
    }

    save_list_lang(){
        localStorage.setItem("list_lang", JSON.stringify(this.list_lang));
    }

    save_list_link_store(){
        localStorage.setItem("link_store", JSON.stringify(this.list_link_store));
    }

    change_lang(s_key){
        this.lang=s_key;
        localStorage.setItem("lang", s_key);
        $("#key_lang").html(s_key);
    }

    change_title_page(s_title,s_url,id){
        document.title =s_title;
        this.id_page=id;
        if(this.lang_url!=""&&s_url!="") s_url=this.get_url()+s_url+"&lang="+this.lang;
        if(s_url!="")
            window.history.pushState(s_title, 'Title', s_url);
        else
            window.history.pushState(s_title,"",null);
    }

    load_data_lang_web() {
        var carrot=this;
        $(".lang").each(function(index,emp){
            var key_lang=$(emp).attr("key_lang");
            if(carrot.lang_web[key_lang]!=null){
                $(emp).html(carrot.lang_web[key_lang].trim());
            }
        });
        this.check_mode_site();
    }

    box_app_item(data_app,s_class){
        var key_name="name_"+this.lang;
        var s_url_icon="";
        if(data_app.icon!=null) s_url_icon=data_app.icon;
        if(s_url_icon=="") s_url_icon="images/150.png";
        var html_main_contain="<div class='box_app "+s_class+"' id=\""+data_app.id+"\" key_search=\""+data_app[key_name]+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                    html_main_contain+='<div role="button" class="img-cover pe-0 col-3 app_icon" app_id="'+data_app.id+'"><img class="rounded" src="'+s_url_icon+'" alt="'+data_app[key_name]+'"></div>';
                    html_main_contain+='<div class="det mt-2 col-9">';
                        html_main_contain+="<h5 class='mb-0 fs-6'>"+data_app[key_name]+"</h5>";
                        html_main_contain+="<span class='fs-8'>"+data_app.name_en+"</span>";
    
                        html_main_contain+='<ul class="row">';
                            html_main_contain+='<li class="col-8 ratfac">';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi fa-solid fa-star"></i>';
                            html_main_contain+='</li>';
                            if(data_app.type=="app")
                                html_main_contain+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-mobile"></i></span></li>';
                            else
                                html_main_contain+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-gamepad"></i></span></li>';
                        html_main_contain+='</ul>';
    
                        if(this.list_link_store!=null){
                            var html_store_link="";
                            $(this.list_link_store).each(function(index,store){
                                if(data_app[store.key]!=null){
                                    var link_store_app=data_app[store.key];
                                    if(link_store_app!='') html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                }
                            });
                            if(html_store_link!="") html_main_contain+="<div class='row'><div class='col-12'>"+html_store_link+"</div></div>";
                        }
    
                        html_main_contain+=this.btn_dev("app",data_app.id);
    
                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
        return html_main_contain;
    }

    show_list_app(list_app){
        var html_main_contain="";
        var carrot=this;
        html_main_contain+='<div id="all_app" class="row m-0">';
        $(list_app).each(function(intdex,data_app) {
            html_main_contain+=carrot.box_app_item(data_app,'col-md-4 mb-3');
        });
        html_main_contain+="</div>";

        $("#main_contain").html(html_main_contain);
        this.check_btn_for_list_app();
    }

    show_app_by_id(id_box_app){
        this.log("Show app by id:"+id_box_app);
        if(this.obj_app[id_box_app]==null){
            this.log("Load info app "+id_box_app+" from sever");
            this.get_doc("app",id_box_app,this.show_app_info)
        }else{
            this.log("Load info app "+id_box_app+" from cache");
            var data_app=JSON.parse(this.obj_app[id_box_app]);
            this.show_app_info(data_app,this);
        }
        return false;
    }

    show_app_info(data,carrot){
        if(data==null) $.MessageBox(carrot.l("no_obj"));
        this.change_title_page(data.name_en,"?p=app&id="+data.id);
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3">';
                        html+='<img class="w-100" src="'+data.icon+'" alt="'+data.name_en+'">';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data["name_"+carrot.lang]+'</h4>';

                        html+=carrot.btn_dev("app",data.id);

                        if(this.list_link_store!=null){
                            var html_store_link="";
                            var html_store_link_lager="";
                            $(this.list_link_store).each(function(index,store){
                                if(data[store.key]!=null){
                                    var link_store_app=data[store.key];
                                    if(link_store_app.trim()!=""){
                                        html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                        html_store_link_lager+="<a class='mt-6 mb-6 mr-6 ml-6 d-inline' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><img style='width:100px' src='"+store.img+"'></a> ";
                                    }
                                }
                            });
                            if(html_store_link!="") html+="<div class='row pt-4'><div class='col-md-12 col-12 text-center'>"+html_store_link+"</div></div>";
                            if(html_store_link_lager!="") html+="<div class='row pt-4'><div class='col-md-12 col-12 text-center'>"+html_store_link_lager+"</div></div>";
                        }

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
                                if(data.type=="game"){
                                    html+='<b>Game <i class="fa-solid fa-gamepad"></i></b>';
                                    html+='<p class="lang" key_lang="game">Game</p>';
                                } 
                                else{
                                    html+='<b>App <i class="fa-solid fa-mobile"></i></b>';
                                    html+='<p class="lang" key_lang="app">Application</p>';
                                }
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
                                html+='<b><l class="lang" key_lang="author">Author</l> <i class="fa-solid fa-user-group-simple"></i></b>';
                                html+='<p>Thanh <i class="fa-solid fa-heart"></i> Nhung</p>';
                            html+='</div>';
                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-12 text-center">';
                            html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                            html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success"><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button>';
                            html+='</div>';
                        html+='</div>';

                    html+='</div>';
                html+="</div>";
    
                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="describe">About this Game</h4>';
                    html+='<p class="fs-8 text-justify">'+data["describe_"+carrot.lang]+'</p>';
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
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_apps">Related Apps</h4>';
            
            var list_app=this.convert_apps_to_list();
            list_app= list_app.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            $(list_app).each(function(intdex,app_item){
                if(data.type==app_item.type&&data.id!=app_item.id) html+=carrot.box_app_item(app_item,'col-md-12 mb-3');
            });
            html+='</div>';
    
        html+="</div>";
        html+="</div>";
        $("#main_contain").html(html);
        window.scrollTo(0, 0);
        carrot.check_btn_for_list_app();
    }

    check_btn_for_list_app(){
        var carrot=this;
        $(".app_icon").click(async function(){
            var id_box_app = $(this).attr("app_id");
            carrot.show_app_by_id(id_box_app);
        });

        this.check_event();
        this.load_data_lang_web();
    }

    check_event(){
        var carrot=this;
        
        $("#box_input_search").change(function(){
            var inp_text=$("#box_input_search").val();
            carrot.act_search(inp_text);
        });

        $(".btn_app_export").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            carrot.act_download_json_by_collection_and_doc(db_collection,db_document);
        });

        $(".btn_app_import").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            var obj_data=new Object();
            obj_data["collection"]=db_collection;
            obj_data["document"]=db_document;
            carrot.show_import_json_box(obj_data);
        });

        $(".btn_app_edit").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            carrot.log("Edit "+db_collection+" : "+db_document);
            if(db_collection=="app") carrot.get_doc(db_collection,db_document,carrot.show_edit_app_done);
            if(db_collection=="icon") carrot.get_doc(db_collection,db_document,carrot.icon.show_edit_icon_done);
            if(db_collection=="user-avatar") carrot.get_doc(db_collection,db_document,carrot.ai_lover.show_edit_avatar_done);
            if(db_collection=="song") carrot.get_doc(db_collection,db_document,carrot.music.show_edit_music_done);
            if(db_collection=="code") carrot.code.show_edit(db_document);
        });

        $(".btn_app_del").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            $.MessageBox({
                buttonDone  : "Yes",
                buttonFail  : "No",
                message     : "Bạn có chắc chắng là xóa  <b>"+db_collection+"</b>.<b class='text-info'>"+db_document+"</b> này không?"
            }).done(function(){
                carrot.act_del_obj(db_collection,db_document);
            });
        });

        $("#btn_share").click(function(){
            carrot.show_share();
        });

        $('#register_protocol_url').click(function(){
            carrot.register_protocol_url(); 
        });

        this.check_mode_site();
    }

    act_search(s_key_search){
        $(".box_app").each(function(index,emp){
            var id_box=$(emp).attr("id");
            var key_search=$(emp).attr("key_search");
            if(id_box.search(s_key_search)!=-1||key_search.search(s_key_search)!=-1) $(emp).show();
            else $(emp).hide();
        });
    }

    show_edit_app_done(data_app,carrot){
        if(data_app!=null)
            carrot.show_box_add_or_edit_app(data_app,carrot.act_done_add_or_edit);
        else
            $.MessageBox("Ứng dụng không còn tồn tại!");
    }

    show_box_add_or_edit_app(data_app,act_done){
        var s_title_box='';
        if(data_app==null)s_title_box="<b>Add Application</b>";
        else s_title_box="<b>Update Application</b>";
        var obj_app = Object();
        obj_app["tip_app"] = { type: "caption", message: "Thông tin cơ bản" };
    
        var obj_input_icon = Object();
        obj_input_icon["type"] = "input";
        obj_input_icon["label"] = "Icon App";
        if(data_app!=null&&data_app["icon"]!="") obj_input_icon["defaultValue"]=data_app["icon"];
        obj_app["icon"] = obj_input_icon;
    
        var obj_input_type = Object();
        obj_input_type["type"] = "select";
        obj_input_type["label"] = "Type App";
        obj_input_type["options"] = { "app": "app", "game": "game" };
        if(data_app!=null&&data_app["icon"]!="") 
            obj_input_type["defaultValue"]=data_app["type"];
        else
            obj_input_type["defaultValue"] = "app";
        obj_app["type"] = obj_input_type;
    
        obj_app["tip_name"] = { type: "caption", message: "Tên và mô tả" };
    
        $.each(this.list_lang, function (index, data_lang) {
            obj_app["tip_lang_"+data_lang.key] = { type: "caption", message: "<img style='width:20px;' src='"+data_lang.icon+"'/> <b>"+data_lang.name+"</b> Thiết lập giao diện ngôn ngữ ("+data_lang.key+")" };

            if(data_lang.key=="en") obj_app["lang_en_required"] = { type: "caption", message: "<b class='text-danger'>*Bắt buột</b>:không để trống quốc gia này để thêm mới và cập nhật<br/><i class='text-secondary'>Vì đây là trường id chính xác định ứng dụng</i>" };

            var obj_input_name = Object();
            obj_input_name["type"] = "input";
            obj_input_name["label"] = "Name - " + data_lang.name;
            if(data_app!=null&&data_app["name_" + data_lang.key]!="") obj_input_name["defaultValue"]=data_app["name_" + data_lang.key];
            obj_app["name_" + data_lang.key] = obj_input_name;
    
            var obj_input_describe = Object();
            obj_input_describe["type"] = "textarea";
            obj_input_describe["label"] = "Describe - " + data_lang.name;
            obj_input_describe["rows"]="10";
            if(data_app!=null&&data_app["describe_" + data_lang.key]!="") obj_input_describe["defaultValue"]=data_app["describe_" + data_lang.key];
            obj_app["describe_" + data_lang.key] = obj_input_describe;
    
        });
    
        obj_app["tip_link"] = { type: "caption", message: "Các Liên kết tới các store khác" };
    
        $.each(this.list_link_store, function (index, data_store) {
            obj_app["tip_lang_"+data_store.key] = { type: "caption", message: "<i class='fa-solid "+data_store.icon+"'></i> <b>"+data_store.name+"</b> Thiết lập liên kết ("+data_store.key+")" };

            var obj_input_link_store = Object();
            obj_input_link_store["type"] = "input";
            obj_input_link_store["label"] = "Link Store - (" + data_store.name + ") - " + data_store.key;
            if(data_app!=null&&data_app[data_store.key]!="") obj_input_link_store["defaultValue"]=data_app[data_store.key];
            obj_app[data_store.key] = obj_input_link_store;
        });
    
        customer_field_for_db(obj_app,'app','name_en','','Add App successfully');
    
        $.MessageBox({
            message: s_title_box,
            input: obj_app,
            top: "auto",
            buttonFail: "Cancel"
        }).done(act_done);
    }

    uniq = function(){
        return 'id' + (new Date()).getTime();
    }

    l(key,lang_en_default=""){
        if (this.lang_web[key] != null) 
            return this.lang_web[key].trim();
        else{
            if(lang_en_default=="")
                return key;
            else
                return lang_en_default;
        }  
    }

    async act_download_json_by_collection_and_doc(name_collection, name_document) {
        this.name_collection_cur=name_collection;
        this.name_document_cur=name_document;
        this.get_doc(name_collection,name_document,this.done_get_file_json)
    }

    done_get_file_json(data_json,carrot){
        if(data_json==null){ $.MessageBox(carrot.l("no_obj")); return;}
        var fileContents = JSON.stringify(data_json, null, 2);
        var fileName = carrot.name_collection_cur+"-"+carrot.name_document_cur+ ".json";

        var pp = document.createElement('a');
        pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
        pp.setAttribute('download', fileName);
        pp.click();
    }

    show_import_json_box(data_show){
        var carrot=this;
        if(data_show==null){
            data_show=new Object();
            data_show["collection"]="";
            data_show["document"]="";
        }
        $.MessageBox({
            input    : {db_collection:{'label': "Collection","defaultValue":data_show["collection"]},db_document:{'label': "Document ID","defaultValue":data_show["document"]},data:{'type': 'textarea','label': "Nhập kiểu dữ liệu văn bảng dạng json:"}},
            message  : "Import JSON document text"
        }).done(function(data, button){
            if(data.data==""){$.MessageBox("Dữ liệu json trống không thể import!");return false}
            var s_collection=data.db_collection;
            var s_document=data.db_document;
            var data_import=JSON.parse(data.data);
            delete(data.db_collection);
            delete(data.db_document);
            delete(data.data);
            carrot.set_doc(s_collection,s_document,data_import);
            if(s_collection=="app") carrot.delete_obj_app();
            $.MessageBox("Import Data Json Success!!!");
        });
    }

    show_share(){
        let shareData = {
            title: 'Carrot Store',
            text: 'Get Now',
            url:  window.location.href,
        }
        navigator.share(shareData)
    }

    register_protocol_url(){
        if (!window.navigator || !window.navigator.registerProtocolHandler) {
            $.MessageBox("Your browser does not support the Stellar-protocol: SEP-0007. Use Chrome, Opera or Firefox to open web+stellar links")
        } else {
            navigator.registerProtocolHandler("web+app", `${window.location.origin}/?p=app&id=%s`,"Carrot App");
        }
    }

    show_import_json_file(){
        var carrot=this;
        var html='';
        html+='<div class="row"><div class="col-12"><input type="file" id="input-file-import"></div></div>';
        html+='<div class="row"><pre><code class="language-json col-12" id="file_contain"></code></pre></div>';
        $("#main_contain").html(html);
        $("#input-file-import").on('change',function() {
            var file = $(this).get(0).files;
            var reader = new FileReader();
            reader.readAsText(file[0]);
            reader.addEventListener("load", function(e) {
                var textFromFileLoaded = e.target.result;
                console.log(textFromFileLoaded);
                var obj_json=JSON.parse(textFromFileLoaded);
                carrot.import_json_by_data(obj_json);
                var jsonPretty = JSON.stringify(obj_json, null, '\t');
                $("#file_contain").html(jsonPretty);
                hljs.highlightAll();
            })
        });
    }

    log(s_msg,s_status="info") {
        console.log(s_msg);
        if(this.mode_site=="dev") SnackBar({message: s_msg,timeout: 5000,status:s_status});
    }

    show_list_lang(){
        var carrot=this;
        var obj_list_lang=Object();
        var userLang = navigator.language || navigator.userLanguage; 
        var n_lang=userLang.split("-")[0];

        $(this.list_lang).each(function(index,lang){
            var m_activer_color='';
            if(lang.key==carrot.lang)
                m_activer_color='btn-primary';
            else{
                if(carrot.obj_lang_web[lang.key]!=null)
                    m_activer_color='btn-secondary';
                else if(n_lang==lang.key) 
                    m_activer_color='btn-info';
                else
                    m_activer_color='btn-dark';
            }
                
            var m_lang="<div role='button' style='margin:3px;float:left' class='item_lang btn d-inline btn-sm text-left "+m_activer_color+"' key='"+lang.key+"'><img src='"+lang.icon+"' width='20px'/> "+lang.name+"</div>";
            obj_list_lang["lang_"+index]={'type':'caption',message:m_lang,'customClass':'d-inline'};
        });

        $.MessageBox({
            title :carrot.l("select_lang"),
            input:obj_list_lang,
            width:'360'
        });

        $(".item_lang").click(function(){
            var key_lang = $(this).attr("key");
            if (key_lang != carrot.lang) {
                carrot.change_lang(key_lang);
                carrot.get_all_data_lang_web();
                carrot.load_data_lang_web();
                carrot.check_show_by_id_page();
                $(".messagebox_button_done").click();
            };
        });
    }

    show_editor_code_js(){
        var html='';
        html+='<style>.editor {border-radius: 6px;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);font-family:  monospace;font-size: 14px;font-weight: 400;height: 340px;letter-spacing: normal;line-height: 20px;padding: 10px;tab-size: 4;}</style>';
        html+='<div class="row m-0">';
            html+='<div class="editor language-js"></div>';
        html+='</div>';
        $("#main_contain").html(html);
        this.create_editor_code();
    }

    get_url(){
        return location.protocol+"//"+location.hostname+location.pathname;
    }

    change_host_connection(){
        if (this.is_localhost){
            this.is_localhost=false;
            localStorage.setItem("is_localhost", "false");
        }
        else{
            this.is_localhost=true;
            localStorage.setItem("is_localhost", "true");
        }
            
        this.check_mode_site();
        this.delete_obj_app();
        this.icon.delete_obj_icon();
        this.music.delete_obj_song();
        this.setup_sever_db();
        this.check_version_data();
        $.MessageBox("Thay đổi kế độ kết nối cơ sở dữ liệu thành công! Load lại trang để làm mới các chức năng!");
    }

    get_param_url(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) return sParameterName[1];
        }
    }

    check_show_by_id_page() {
        this.id_page = this.get_param_url("p");
        this.log("check_show_by_id_page : "+this.id_page);
        if(this.id_page == "privacy_policy") $("#btn_privacy_policy").click();
        else if(this.id_page=="app"){
            var id_app=this.get_param_url("id");
            if(id_app!=""){
                id_app=decodeURI(id_app);
                this.show_app_by_id(id_app);
            }
            else this.show_all_app();
        }
        else if(this.id_page=="game") this.show_all_game();
        else if(this.id_page=="music"){
            var id_songs=this.get_param_url("id");
            if(id_songs!=null){
                id_songs=decodeURI(id_songs);
                this.music.show_info_music_by_id(id_songs);
            }else{
                this.music.show_list_music();
            }
        }
        else if(this.id_page=="about_us") $("#btn_about_us").click();
        else if(this.id_page=="address_book") $("#btn_address_book").click();
        else if(this.id_page=="wallpapers") this.show_all_wallpaper();
        else if(this.id_page=="icon") this.icon.show_all_icon();
        else if(this.id_page=="code") this.code.show_list_code();
        else this.show_home();
        this.log("ID_page:"+this.id_page);
    }

    show(s_html){
        this.body.html(s_html);
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 2000);
    }

    btn_dev(db_collection,db_document){
        var html='';
        html+="<div class='row dev d-flex'>";
            html+="<div class='dev col-12 d-flex btn-group'>";
                html+="<div role='button' class='dev btn btn_app_edit btn-warning btn-sm mr-2' db_collection='"+db_collection+"' db_document='"+db_document+"'><i class=\"fa-solid fa-pen-to-square\"></i></div> ";
                html+="<div role='button' class='dev btn btn_app_del btn-danger btn-sm mr-2'  db_collection='"+db_collection+"' db_document='"+db_document+"'><i class=\"fa-solid fa-trash\"></i></div> ";
                html+="<div role='button' class='dev btn btn_app_export btn-dark btn-sm mr-2'  db_collection='"+db_collection+"' db_document='"+db_document+"'><i class=\"fa-solid fa-download\"></i></div> ";
                html+="<div role='button' class='dev btn btn_app_import btn-info btn-sm mr-2'  db_collection='"+db_collection+"' db_document='"+db_document+"'><i class=\"fa-solid fa-upload\"></i></div>";
            html+="</div>";
        html+="</div>";
        return html;
    }

    box(html){
        $('#box').modal('show');
        $('#box_body').html(html);
    }

    delete_cache_obj_by_collection(db_collection){
        if(db_collection=="app") this.delete_obj_app();
        if(db_collection=="icon") this.icon.delete_obj_icon();
        if(db_collection=="song") this.song.delete_obj_song();
        if(db_collection=="code") this.code.delete_obj_code();
        if(this.id_page=="address_book") this.user.delete_obj_phone_book();
    }

}