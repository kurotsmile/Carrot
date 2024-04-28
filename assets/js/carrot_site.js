class Carrot_Site{
    /*Config Mode Web*/
    firebaseConfig_mainhost;
    count_act_dev = 0;
    mode_site = "nomal";
    is_dev=false;
    is_localhost=false;
    paypal_pub_CLIENT_ID="AYgLieFpLUDxi_LBdzDqT2ucT4MIa-O0vwX7w3CKGfQgMGROOHu-xz2y5Jes77owCYQ1eLmOII_ch2VZ";
    paypal_dev_CLIENT_ID="AcW86yX1h7Mae8ofqkhDol9d9kq5zI4fVY5jKuRT45uTwQw52aYYDNI5AwjrKw7tAExqW5N128z1qLF1";
    paypal_CLIENT_ID="";
    index_server=0;

    /*Obj page*/
    lang;
    langs;
    lang_url="";
    recognition=null;
    style_mode="sun";

    obj_version_new=null;
    obj_version_cur=null;

    name_collection_cur="";
    name_document_cur="";
    id_page;
    body;
    obj_page=new Object();
    load_bar_count_data=0;

    /*Firebase*/
    db;
    auth;
    firebase;
    storage;

    /*Obj Main*/
    user;
    link_store;
    music;
    ai_lover;ai;
    code;
    icon;
    audio;
    background;
    bible;
    menu;
    avatar;
    player_media;
    file;
    pay;
    radio;
    rate;
    ebook;
    config;
    server;

    call_show_on_load_pagejs=true;
    
    constructor(){
        if(localStorage.getItem("index_server")!=null)this.index_server=parseInt(localStorage.getItem("index_server"));

        fetch('rabbit.data?=2.2').then(response => response.text()).then((text) => {
            var data_text=atob(text);
            this.config=JSON.parse(data_text);
            this.setup_sever_db(this.index_server);
        }); 
    };

    setup_sever_db(index_sever){
        this.firebaseConfig_mainhost=this.config.server[index_sever];
        this.log("setup_sever_db","warning");
        if (localStorage.getItem("is_localhost") == null) {
            this.is_localhost = false;
        } else {
            if (localStorage.getItem("is_localhost") == "false")
                this.is_localhost = false;
            else
                this.is_localhost = true;
        }

        this.firebase =firebase.initializeApp(this.firebaseConfig_mainhost);
        this.auth=this.firebase.auth();
        this.storage = this.firebase.storage();
        this.db = this.firebase.firestore();
        if(this.is_localhost){
            this.auth.useEmulator("http://localhost:9099", { disableWarnings: true });
            this.db.useEmulator('localhost', 8082);
            this.storage.useEmulator('localhost', 9199);
        }
        
        if(localStorage.getItem("mode_site") != null) this.mode_site = localStorage.getItem("mode_site");
        if(localStorage.getItem("is_dev") != null) this.is_dev = localStorage.getItem("is_dev");

        this.load_recognition();
        this.load_obj_version_new();
        this.load_obj_version_cur();
        this.check_version_data();
    }

    set_doc(s_collection,s_document,data){
        this.log("Set " + s_collection+"."+s_document+" from server","warning");
        this.db.collection(s_collection).doc(s_document).set(data);
    }

    set_doc_merge(s_collection,s_document,data,act_done=null){
        this.log("Set " + s_collection+"."+s_document+" from server","warning");
        this.db.collection(s_collection).doc(s_document).set(data,{merge:true}).then(() => {
            if(act_done!=null) eval(act_done)(carrot);
        });
    }

    update_doc(s_collection,s_document,data){
        this.log("Update " + s_collection+"."+s_document+" from server","warning");
        var washingtonRef = this.db.collection(s_collection).doc(s_document);
        return washingtonRef.update(data).then(() => {
            console.log("Document successfully updated!");
        }).catch((error) => {
            console.error("Error updating document: ", error);
        });
    }

    edit_doc(s_collection,s_document,data){
        this.update_doc(s_collection,s_document,data);
    }

    get_doc(s_collection,s_id_document,act_done){
        Swal.showLoading();
        this.log("Get " + s_collection+"."+s_id_document+" from server","warning");
        this.db.collection(s_collection).doc(s_id_document).get().then((doc) => {
            if (doc.exists) {
                var data_obj = doc.data();
                data_obj["id"]=doc.id;
                Swal.close();
                act_done(data_obj,this);
            } else {
                console.log("No such document!");
                Swal.close();
                act_done(null,this);
            }
        }).catch((error) => {
            console.log(error);
            Swal.close();
            this.log_error(error);
            act_done(null,this);
        });
    }

    get_list_doc(s_collection,act_done){
        this.log("Get List " + s_collection+" from server","warning");
        this.db.collection(s_collection).get().then((querySnapshot) => {
            var obj_data=Object();
            querySnapshot.forEach((doc) => {
                var item_data=doc.data();
                item_data["id"]=doc.id;
                obj_data[doc.id]=JSON.stringify(item_data);
            });
            act_done(obj_data,this);
        })
        .catch((error) => {
            this.log_error(error);
            act_done(null,this);
        });
    }

    check_version_data(){
        this.log("Load js version:"+this.get_ver_cur("js"),"null");
        $('head').append('<script type="text/javascript" src="assets/js/carrot_server.js?ver='+this.get_ver_cur("js")+'"></script>'); 
        this.server=new Carrot_Server();
        carrot.load_bar();
        carrot.server.get_doc("setting_web","version",(data)=>{
            
            carrot.obj_version_new=data;
            carrot.save_obj_version_new();
            carrot.save_obj_version_cur();
            carrot.load_bar();

            this.update_new_ver_cur("js",true);
            this.update_new_ver_cur("page",true);
            
            this.body=$("#main_contain");
    
            if(this.is_dev)
                this.paypal_CLIENT_ID=this.paypal_dev_CLIENT_ID;
            else
                this.paypal_CLIENT_ID=this.paypal_pub_CLIENT_ID;
    
            $('head').append('<script type="text/javascript" src="assets/js/carrot_data.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_langs.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_link_store.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_form.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_user.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_music.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_code.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_background.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_radio.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_ebook.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_rate.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/ai_lover.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/ai_chat.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_menu.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_list_item.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_pay.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_player_media.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_file.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_audio.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_avatar.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/ai_key_block.js?ver='+this.get_ver_cur("js")+'sd"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_bible.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_about_us.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="assets/js/carrot_privacy_policy.js?ver='+this.get_ver_cur("js")+'"></script>');
            $('head').append('<script type="text/javascript" src="https://www.paypal.com/sdk/js?client-id='+this.paypal_CLIENT_ID+'"></script>');
    
            this.menu=new Carrot_Menu(this);
            this.langs=new Carrot_Langs(this);
    
            var btn_home_new=this.menu.create("btn_home_new").set_label("Home new").set_lang("home").set_icon("fa-solid fa-home");
            $(btn_home_new).click(function(){carrot.home_page();});
    
            var btn_app=this.menu.create("btn_app").set_label("App and Game").set_lang("app").set_icon("fa-solid fa-gamepad");
            $(btn_app).click(function(){
                if(carrot.appp!=null)
                    carrot.appp.back_show_all();
                else
                    carrot.load_js_page("app","Appp","carrot.appp.back_show_all()");
            });
    
            var btn_add_apps=carrot.menu.create("app").set_label("Add App").set_icon("fa-solid fa-mobile").set_type("add");
            $(btn_add_apps).click(function(){
                if(carrot.appp!=null) carrot.appp.add();
                else carrot.load_js_page("app","app","carrot.appp.add()");
            });
    
            this.link_store=new Carrot_Link_Store(this);
            this.user=new Carrot_user(this);
            this.music=new Carrot_Music(this);
            this.code=new Carrot_Code(this);
    
            var btn_midi=this.menu.create("btn_midi_piano").set_label("Midi").set_lang("midi").set_icon("fa-solid fa-drum");
            $(btn_midi).click(function(){
                if(carrot.midi!=null)
                    carrot.midi.show_list();
                else
                    carrot.load_js_page("piano","Midi","carrot.midi.show_list()");
            });

            var btn_ico=this.menu.create("btn_ico").set_label("Icon").set_type("dev").set_lang("icon").set_icon("fa-solid fa-face-smile");
            $(btn_ico).click(function(){
                if(carrot.ico!=null)
                    carrot.ico.show();
                else
                    carrot.load_js_page("ico","ico","carrot.ico.show()");
            });

            this.audio=new Carrot_Audio(this);
            this.radio=new Carrot_Radio(this);
            this.background=new Carrot_Background(this);
            this.bible=new Carrot_Bible(this);
            this.ebook=new Carrot_Ebook(this);
            this.avatar=new Carrot_Avatar(this);
            this.ai_lover=new Ai_Lover(this);
            this.ai=this.ai_lover;
            this.privacy_policy=new Carrot_Privacy_Policy(this);
            this.about_us=new Carrot_About_Us(this);
            this.player_media=new Carrot_Player_Media(this);
            this.file=new Carrot_File(this);
            this.pay=new Carrot_Pay(this);
            this.rate=new Carrot_Rate(this);
            this.data=new Carrot_data("carrotstore5","1.5");
            
            var btn_mod_host=this.menu.create("btn_mode_host").set_label("Change Mode Host").set_type("setting").set_icon("fa-brands fa-dev");
            $(btn_mod_host).click(function(){carrot.change_host_connection();});
    
            var btn_server_host=this.menu.create("btn_mode_host").set_label(this.firebaseConfig_mainhost.projectId).set_type("setting").set_icon("fa-solid fa-server");
            $(btn_server_host).click(function(){carrot.show_list_change_server();});
    
            var btn_setting_ver=this.menu.create("data_version").set_label("Data Version").set_type("setting").set_icon("fa-regular fa-code-compare");
            $(btn_setting_ver).click(function(){carrot.show_edit_version_data_version();});
    
            var btn_export_file_json=this.menu.create("btn_export_file_json").set_label("Export Collection").set_type("setting").set_icon("fa-solid fa-file-export");
            $(btn_export_file_json).click(function(){carrot.download_json();});
    
            var btn_import_file_json=this.menu.create("btn_import_file_json").set_label("Import Collection (File)").set_type("setting").set_icon("fa-solid fa-file-import");
            $(btn_import_file_json).click(function(){carrot.show_import_json_file();});
    
            var btn_site_map=this.menu.create("btn_site_map").set_label("Site Map").set_type("setting").set_icon("fa-solid fa-sitemap");
            $(btn_site_map).click(function(){carrot.show_site_map();});
    
            var btn_update_config=this.menu.create("btn_update_config").set_label("Update File Config").set_type("setting").set_icon("fa-solid fa-file");
            $(btn_update_config).click(function(){carrot.act_update_file_config();});
    
            var btn_del_all=this.menu.create("btn_del_all").set_label("Delete all data cache").set_type("setting").set_icon("fa-solid fa-trash-can");
            $(btn_del_all).click(function(){carrot.act_delete_all_data();});
    
            $("#btn_model_site").click(function(){carrot.change_mode_site();});
    
            if(carrot.check_ver_cur("lang")==false) carrot.langs.get_all_data_lang();
            if(carrot.check_ver_cur("lang_web")==false) carrot.langs.get_data_lang_web();
    
            this.user.show_info_user_login_in_header();
            this.menu.show();
    
            $(".btn-menu").click(function () {
                $(".btn-menu").removeClass("active");
                $(".btn-menu i").removeClass("fa-bounce");
                $(this).addClass("active");
                $(this).find("i").addClass("fa-bounce");
            });
    
            var TodayDate = new Date();
            var m = TodayDate.getMonth();m++;
            $("#logo_carrot").attr("src",this.url()+"/images/logo/logo_"+m+".png");
    
            if(carrot.check_ver_cur("lang")==false){
                carrot.log("Get lang new version "+carrot.get_ver_cur("lang"));
                carrot.server.get_collection("lang",(data)=>{
                    carrot.langs.list_lang=data;
                    carrot.check_show_by_id_page();
                });
                carrot.update_new_ver_cur("lang",true);
            }
            else{
                carrot.check_show_by_id_page();
            }
        },()=>{
            carrot.act_next_server_when_fail();
        });
    }

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

    start_recognition(){
        this.recognition.start();
    }

    act_mode_dev() {
        this.count_act_dev++;
        if (this.count_act_dev >= 3) {
            this.is_dev = true;
            localStorage.setItem("is_dev", this.is_dev);
            $("#btn_model_site").removeClass("d-none");
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
            $("#btn_model_site").removeClass("d-none").addClass("d-inline").show();
            if (this.mode_site == "nomal"){
                $("#btn_model_site").removeClass("d-none").show().html('<i class="fa-solid fa-box"></i>');
                $(".dev.btn-dev").each(function () { $(this).removeClass("d-none").removeClass("d-inline") });
                $(".dev").each(function () { $(this).hide(100); });
            }
            else{
                $("#btn_model_site").removeClass("d-none").removeClass("d-inline").show().html('<i class="fa-brands fa-dev"></i>');
                $(".dev.btn-dev").each(function () { $(this).removeClass("d-none").addClass("d-inline") });
                $(".dev").each(function () { $(this).show(100); });
            }
        } else {
            $("#btn_model_site").removeClass("d-none").removeClass("d-inline").hide();
            $(".dev").each(function () { $(this).hide(100); });
            $(".dev.btn-dev").each(function () { $(this).removeClass("d-none").removeClass("d-inline") });
        }

        if (this.is_localhost) {
            $("#btn_mode_host").html('<i class="fa-brands fa-dev fs-6 me-2"></i> Localhost');
        } else {
            $("#btn_mode_host").html('<i class="fa-sharp fa-solid fa-database fs-6 me-2"></i> Googlehost');
        }
        this.langs.load_data_lang_web();
    }

    convert_obj_to_list(obj_carrot){
        var list_obj=Array();
        $.each(obj_carrot,function(key,val){
            list_obj.push(JSON.parse(val));
        });
        return list_obj;
    }

    convert_obj_to_list_array(obj_carrot){
        var list_obj=Array();
        $.each(obj_carrot,function(key,val){
            list_obj.push(val);
        });
        return list_obj;
    }

    obj_to_array(objs){
        return this.convert_obj_to_list(objs);
    }

    random(arr){
        return arr.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    }

    register_page(id_page,event_show_page,event_edit,event_info='',event_reload=''){
        var obj_data=new Object();
        obj_data["edit"]=event_edit;
        obj_data["show"]= event_show_page;
        obj_data["info"]= event_info;
        obj_data["reload"]= event_reload;
        this.obj_page[id_page]=obj_data;
    }

    show_edit_version_data_version(){
        var frm=new Carrot_Form("frm_ver",this);
        frm.set_title("Change Version Data");
        frm.set_db("setting_web","version");
        frm.on_db_doc();
        frm.set_act_done("carrot.done_update_data_version()");
        frm.set_msg_done("Update verion data success");
        $.each(this.obj_version_new,function(key,value){   
            frm.create_field(key).set_label(key).set_val(value).set_type("number");
        });
        var btn_add_level=frm.create_btn();
        btn_add_level.set_icon("fa-solid fa-arrows-up-to-line");
        btn_add_level.set_act("carrot.add_level_all_field_version()");
        frm.show();
    }

    add_level_all_field_version(){
        $(".cr_field").each(function(index,emp){
            var val_ver=$(emp).val();
            val_ver=parseFloat(val_ver)+0.1;
            val_ver=val_ver.toFixed(2);
            $(emp).val(val_ver);
        });
    }
    
    done_update_data_version(){
        this.obj_version_new=null;
        this.obj_version_cur=null;
        this.save_obj_version_new();;
        this.save_obj_version_cur();
    }

    load_obj_version_new(){
        if(localStorage.getItem("obj_version_new")!=null) this.obj_version_new=JSON.parse(localStorage.getItem("obj_version_new"));
        else this.obj_version_new=new Object();
    }

    load_obj_version_cur(){
        if(localStorage.getItem("obj_version_cur")!=null) this.obj_version_cur=JSON.parse(localStorage.getItem("obj_version_cur"));
        else this.obj_version_cur=new Object();
    }

    save_obj_version_new(){
        localStorage.setItem("obj_version_new", JSON.stringify(this.obj_version_new));
    }

    save_obj_version_cur(){
        localStorage.setItem("obj_version_cur", JSON.stringify(this.obj_version_cur));
    }

    act_del_obj(db_collection,db_doc_id){
        this.db.collection(db_collection).doc(db_doc_id).delete().then(() => {
            carrot.msg("Document "+db_doc_id+" successfully deleted!");
            this.delete_cache_obj_by_collection(db_collection);
            if($('#'+db_doc_id).length)
                $('#'+db_doc_id).remove();
            else
                this.call_func_by_id_page(db_collection,"reload");
        }).catch((error) => {
            this.log_error(error);
        });
    }

    download_json() {
        var name_collection = prompt("Enter collection json", "Enter name collection");
        if (name_collection == "") return;
        var data_json = Object();
        data_json["all_item"] = Array();
        data_json["collection"] = name_collection;
        this.db.collection(name_collection).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data_app = doc.data();
                data_app["id_import"] = doc.id;
                data_json.all_item.push(data_app);
            });
            this.act_download_file_json(data_json,name_collection)
        }).catch((error) => {
            this.log(error.message)
        });
    }

    act_download_file_json(data_json,name_file){
        var fileContents = JSON.stringify(data_json, null, 2);
        var fileName = name_file + ".json";

        var pp = document.createElement('a');
        pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
        pp.setAttribute('download', fileName);
        pp.click();
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
        if(this.obj_version_new==null) this.obj_version_new=new Object();

        if(this.obj_version_new[s_item]!=null){
            if(this.obj_version_cur==null) this.obj_version_cur=new Object();
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

    delete_ver_cur(s_item){
        this.obj_version_cur[s_item]="0.0";
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

    change_title_page(s_title,s_url,id){
        document.title =s_title;
        this.id_page=id;
        if(this.lang_url!=""&&s_url!="") s_url=this.get_url()+s_url+"&lang="+this.lang;
        if(s_url!="")
            window.history.pushState(s_title, 'Title', s_url);
        else
            window.history.pushState(s_title,"",null);
    }

    check_event(){
        var carrot=this;
        
        $("#box_input_search").unbind('change');
        $("#box_input_search").change(function(){
            var inp_text=$("#box_input_search").val();
            carrot.act_search(inp_text);
        });

        $(".btn_app_export").click(function(){
            carrot.name_collection_cur=$(this).attr("db_collection");
            carrot.name_document_cur=$(this).attr("db_document");
            carrot.act_download_json_by_collection_and_doc();
        });

        $(".btn_app_import").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            var obj_data=new Object();
            obj_data["collection"]=db_collection;
            obj_data["document"]=db_document;
            carrot.show_import_json_box(obj_data);
        });

        $(".btn_app_edit").unbind('click');
        $(".btn_app_edit").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            var db_obj=$(this).attr("db_obj");
            var event_fun=$(this).attr("onclick");
            carrot.log("Edit "+db_collection+" : "+db_document);
            if(event_fun!=undefined)
                carrot.get_doc(db_collection,db_document,eval(event_fun));
            else
                carrot.get_doc(db_collection,db_document,eval("carrot."+db_obj+".edit"));
        });

        $(".btn_app_del").unbind('click');
        $(".btn_app_del").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            var event_fun=$(this).attr("onclick");
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this "+db_collection+"."+db_document+" ?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed){
                    if(event_fun!=undefined)
                        eval(event_fun);
                    else
                        carrot.act_del_obj(db_collection,db_document);
                }
            })
        });

        $("#btn_share").click(function(){carrot.show_share();});
        $('#register_protocol_url').click(function(){carrot.register_protocol_url();});

        this.rate.check_event();
        this.check_mode_site();

        $("#qr_cdoe").qrcode({
            render: 'canvas',
            minVersion: 1,
            maxVersion: 40,
            ecLevel: 'L',
            left: 0,
            top: 0,
            size: 200,
            fill: '#428400',
            background: null,
            text: window.location.href,
            radius: 5,
            quiet: 0,
            mode:  0,
            mSize: 0.1,
            mPosX: 0.5,
            mPosY: 0.5,
            label: 'no label',
            fontname: 'sans',
            fontcolor: '#000',
            image: null
        });
        $("#qr_cdoe").attr("id","qr_cdoe_done_success");

        $('[data-toggle="tooltip"]').tooltip();
    }

    act_edit_by_page_register(data,carrot){
        eval(carrot.obj_page[carrot.id_page].edit)(data,carrot);
    }

    call_func_by_id_page(id_page,func){
        if(carrot.obj_page[id_page]!=null) eval(carrot.obj_page[id_page][func])(carrot);
    }

    act_search(s_key_search){
        $(".box_app").each(function(index,emp){
            var id_box=$(emp).attr("id");
            var key_search=$(emp).attr("key_search");
            if(id_box.search(s_key_search)!=-1||key_search.search(s_key_search)!=-1) $(emp).show();
            else $(emp).hide();
        });
    }

    uniq = function(){
        return (new Date()).getTime();
    }

    create_id(){
        return this.uniq();
    }

    l(key,lang_en_default=""){
        if(this.langs!=null)
            return this.langs.get_val_lang(key,lang_en_default);
        else
            return lang_en_default;
    }

    l_html(key,lang_en_default=""){
        var s_val='';
        if(this.langs!=null)
            s_val=this.langs.get_val_lang(key,lang_en_default);
        else
            s_val=lang_en_default;
        return '<l class="lang" key_lang="'+key+'">'+s_val+'</l>';
    }

    download_json_doc() {
        this.name_collection_cur = prompt("Enter collection", "Enter name collection");
        if(this.name_collection_cur=="") return;
        this.name_document_cur = prompt("Enter document", "Enter document in collection");
        if (this.name_document_cur== "") return;
        this.act_download_json_by_collection_and_doc();
    }

    act_download_json_by_collection_and_doc() {
        this.get_doc(this.name_collection_cur,this.name_document_cur,this.done_get_file_json)
    }

    done_get_file_json(data_json,carrot){
        data_json["collection"]=carrot.name_collection_cur;
        var fileName = carrot.name_collection_cur+"-"+carrot.name_document_cur+ ".json";
        carrot.act_download_file_json(data_json,fileName);
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
            if(s_collection=="app") carrot.app.delete_obj_app();
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
        html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-6">';
                html+='<form>';
                html+='<div class="form-row">';
                html+='<h2>Import Data</h2>';
                html+='</div>';
                html+='<div class="form-row">';
                        html+='<div class="custom-file">';
                            html+='<label for="input-file-import"><i class="fa-solid fa-database"></i> File data json</label>';
                            html+='<input type="file" class="custom-file-input form-control"" id="input-file-import">';
                            html+='<small id="emailHelp" class="form-text text-muted">Upload <b>json</b> data file to update data into the system</small>';
                        html+='</div>';
                html+='</div>';
                html+='</form>';
            html+='</div>';
            html+='<div class="col-6">';
                html+='<form>';
                html+='<div class="form-row">';
                html+='<h2>Export Data</h2>';
                html+='</div>';
                html+='<div class="form-row">';
                        html+='<div class="custom-file">';
                            html+='<label for="input-file-import"><i class="fa-solid fa-file-arrow-down"></i> Download file json database </label>';
                            html+='<br/><div class="btn btn-success mr-1" role="button" onclick="carrot.download_json();return false;"><i class="fa-solid fa-download"></i> Download Collection</div> ';
                            html+='<div class="btn btn-success" role="button" onclick="carrot.download_json_doc();return false;"><i class="fa-solid fa-file-arrow-down"></i> Download Doc</div>';
                            html+='<br/>';
                            html+='<small id="emailHelp" class="form-text text-muted">Download <b>json</b> data file to backup data into the system</small>';
                        html+='</div>';
                html+='</div>';
                html+='</form>';
            html+='</div>';
        html+='</div>';

        html+='<div class="row"><pre><code class="language-json col-12" id="file_contain"></code></pre></div>';
        html+='</div>';
        this.show(html);
        

        $("#input-file-import").on('change',function() {
            var file = $(this).get(0).files;
            var reader = new FileReader();
            reader.readAsText(file[0]);
            Swal.showLoading();
            reader.addEventListener("load", function(e) {
                var textFromFileLoaded = e.target.result;
                var obj_json=JSON.parse(textFromFileLoaded);

                if(obj_json.collection==null){
                    carrot.msg("Collection not found in File json","error");
                    return false;
                }

                var name_collection = obj_json.collection;
                if(obj_json.all_item==null){
                    delete obj_json["collection"];
                    carrot.db.collection(name_collection).doc(obj_json.id).set(obj_json);
                    carrot.msg("Import Document Data Success!");
                }else{
                    var all_item = obj_json.all_item;
                    
    
                    $.each(all_item, function (index, d) {
                        var doc_id = d["id_import"];
                        delete d["id_import"];
                        carrot.db.collection(name_collection).doc(doc_id).set(d);
                    });

                    carrot.msg("Import Collection Data Success!");
                }
                var jsonPretty = JSON.stringify(obj_json, null, '\t');
                $("#file_contain").html(jsonPretty);
                hljs.highlightAll();
            })
        });
    }

    log(s_msg,s_status="info") {
        console.log(s_msg);
        if(s_status=="alert") s_status="warning";
        if(this.mode_site=="dev") SnackBar({message: s_msg,timeout: 5000,status:s_status,position:'tr'});
    }

    log_error(error) {
        if(this.mode_site=="dev"){
            console.log(error);
            var html='';
            html+='<p>'+error.toString()+'</p>';
            if(error.stack!=null) html+='<p class="fs-9">'+error.stack+'</p>';
            Swal.fire({
                title: error.name,
                icon: 'error',
                html:html,
                showCloseButton: true,
                focusConfirm: true
            });
        }
    }

    get_url(){
        var s_port='';
        if(location.port!="") s_port=":"+location.port;
        return location.protocol+"//"+location.hostname+s_port+location.pathname;
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
        this.app.delete_obj_app();
        this.icon.delete_obj_icon();
        this.music.delete_obj_song();
        this.setup_sever_db();
        this.msg("Thay đổi chế độ kết nối cơ sở dữ liệu thành công! Load lại trang để làm mới các chức năng!");
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
        this.load_bar();
        $("#head").show();
        $("#head_nav").show();
        this.id_page = this.get_param_url("p");
        if(this.id_page!=undefined){
            this.log("check_show_by_id_page : "+this.id_page,"info");
            var obj_page_show=this.obj_page[this.id_page];
            if(obj_page_show!=null){
                var id_obj=this.get_param_url("id");
                if(id_obj!=undefined){
                    id_obj=decodeURI(id_obj);
                    eval(obj_page_show.info)(id_obj,carrot);
                }
                else{
                    eval(obj_page_show.show);
                }
                $("#load_bar").css("width","100%");
            }else{
                this.load_js_page(this.id_page);
            };
        }else{
            var id_page=this.get_param_url("page");
            if(id_page!=undefined){
                this.load_js_page(id_page);
            }else{
                this.load_bar();
                $("#load_bar").css("width","100%");
                this.load_js_page("home");
            }
        }
    }

    show(s_html){
        this.body.html(s_html);
        window.scrollTo(0,0); 
        $("#head").show();
        $("#head_nav").show();
    }

    btn_dev(db_collection,db_document,obj_js=null,func_edit=null,func_del=null,extra_content=''){
        var html='';
        if(obj_js==null) obj_js=db_collection;
        html+="<div class='row dev d-flex mt-2'>";
            html+="<div class='dev col-6 d-flex btn-group'>";
                if(func_edit!=null)
                    html+="<div role='button' class='dev btn btn_app_edit btn-warning btn-sm mr-2' onclick='"+func_edit+"'  db_collection='"+db_collection+"' db_document='"+db_document+"' db_obj='"+obj_js+"'><i class=\"fa-solid fa-pen-to-square\"></i></div> ";
                else
                    html+="<div role='button' class='dev btn btn_app_edit btn-warning btn-sm mr-2' db_collection='"+db_collection+"' db_document='"+db_document+"' db_obj='"+obj_js+"'><i class=\"fa-solid fa-pen-to-square\"></i></div> ";

                if(func_del!=null)
                    html+="<div role='button' class='dev btn btn_app_del btn-danger btn-sm mr-2' onclick='"+func_del+"'><i class=\"fa-solid fa-trash\"></i></div> ";
                else
                    html+="<div role='button' class='dev btn btn_app_del btn-danger btn-sm mr-2' db_collection='"+db_collection+"' db_document='"+db_document+"' db_obj='"+obj_js+"'><i class=\"fa-solid fa-trash\"></i></div> ";

                html+=extra_content;
                html+="<div role='button' class='dev btn btn_app_export btn-dark btn-sm mr-2'  db_collection='"+db_collection+"' db_document='"+db_document+"' db_obj='"+obj_js+"'><i class=\"fa-solid fa-download\"></i></div> ";
                html+="<div role='button' class='dev btn btn_app_import btn-info btn-sm mr-2'  db_collection='"+db_collection+"' db_document='"+db_document+"' db_obj='"+obj_js+"'><i class=\"fa-solid fa-upload\"></i></div>";
            html+="</div>";
        html+="</div>";
        return html;
    }

    box(html){
        $('#box_body').html(html);
        $('#box').modal("show");
    }

    delete_cache_obj_by_collection(db_collection){
        if(db_collection=="app") this.app.delete_obj_app();
        if(db_collection=="icon") this.icon.delete_obj_icon();
        if(db_collection=="song") this.music.delete_obj_song();
        if(db_collection=="code") this.code.delete_obj_code();
        if(db_collection=="audio") this.audio.delete_obj_audios();
        if(this.id_page=="address_book") this.user.delete_obj_phone_book();
    }

    show_lis_by_collection(db_collection){
        this.get_list_doc(db_collection,this.act_done_show_collection);
    }

    act_done_show_collection(datas,carrot){
        var html='';
        html+='<div class="row m-0">';
        var list_data=carrot.convert_obj_to_list(datas);
        $(list_data).each(function(index,data){
            var item_list=new Carrot_List_Item(carrot);
            item_list.set_id(data.id);
            item_list.set_name(data.key);
            item_list.set_tip(data.msg);
            item_list.set_db_collection("app");
            html+=item_list.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    msg(msg,s_icon='success',timer=6500){
        if(s_icon=="alert") s_icon="warning";
        Swal.fire({
            icon:s_icon,
            title: msg,
            showCloseButton: true,
            focusConfirm: false
        });
    }

    show_pay(id_product,name_product,tip_product,price,act_done){
        var carrot=this;
        Swal.fire({
            title: name_product,
            html: '<div id="paypal-button-container"></div>',
            showCloseButton: true,
            focusConfirm: false
        });
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code:'USD',
                            value: price,
                            breakdown: {item_total: {value: price, currency_code: 'USD'}}
                        },
                        items: [
                            {
                                name: name_product,
                                quantity: "1",
                                description: tip_product,
                                sku: id_product,
                                category: "DIGITAL_GOODS",
                                unit_amount:{
                                    currency_code: "USD",
                                    value:price
                                }
                            }
                        ],
                    }]
                });
            },
            onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                if(carrot.in_app_pay!=null){
                    $.each(carrot.in_app_pay, function (key, val) {
                        details[key]=val;
                    });               
                }
                carrot.set_doc("order",id_product+"_"+carrot.create_id(),details);
                act_done(carrot);
                carrot.msg("Pay success!");
            });
            }
        }).render('#paypal-button-container');
    }

    load_bar(){
        if ($("#load_bar").length > 0){
            this.load_bar_count_data+=2;
            var val_show=(this.load_bar_count_data*10);
            $("#load_bar").css("width",val_show+"%");
        }
    }

    del_file(emp){
        var path_file=$(emp).attr("fullPath");
        var carrot=this;
        var storageRef = carrot.storage.ref();
        var desertRef =storageRef.child(path_file);
        desertRef.delete().then(() => {
            $(emp).parent().remove();
            carrot.log("Delete file "+path_file+" Success!","success");
        }).catch((error) => {
            carrot.log(error);
        });
    }

    home_page(){
        if(carrot.home!=null)
            carrot.home.show();
        else
            carrot.load_js_page("home","Home","carrot.home.show()");
    }

    html_404(list_btn=null){
        var html='';
        html+='<div class="d-flex align-items-center justify-content-center vh-100">';
        html+='<div class="text-center row">';
        html+='<div class=" col-md-6">';
        html+='<img src="images/404.png" alt="404" class="img-fluid">';
        html+='</div>';
        html+='<div class=" col-md-6 mt-5">';
        html+='<p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p>';
        html+='<p class="lead">';
        html+='The page you’re looking for doesn’t exist.';
        html+='</p>';
        html+='<a role="button" class="btn btn-success" onClick="carrot.home_page();return false;"><i class="fa-solid fa-house"></i> Go Home</a>';
        if(list_btn!=null){
            $(list_btn).each(function(index,btn){
                html+=btn.html();
            });
        }
        html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    show_404(list_btn=null){
        var html=this.html_404(list_btn);
        this.show(html);
        this.check_event();
    }

    show_site_map(){
        var s_xml_app='';
        var s_xml_song='';

        this.show('<textarea id="data_xml_site_map" name="data_xml_site_map" class="language-xml hljs" rows="4" cols="50" style="width:100%;height:100%"></textarea>');

        var todays = new Date().toISOString().slice(0, 10);
        var q=new Carrot_Query("app");
        q.add_select("name_en");
        carrot.loading();
        q.get_data((apps)=>{
            $(apps).each(function(index,app){
                carrot.hide_loading();
                s_xml_app+='<url>';
                s_xml_app+='<loc>https://carrotstore.web.app/?page=app&id='+app.id_doc+'</loc>';
                s_xml_app+='<lastmod>'+todays+'</lastmod>';
                s_xml_app+='<changefreq>daily</changefreq>';
                s_xml_app+='<priority>1</priority>';
                s_xml_app+='</url>';
            });

            var q_song=new Carrot_Query("song");
            q_song.add_select("name");
            q_song.get_data((songs)=>{
                $(songs).each(function(index,song){
                    s_xml_song+='<url>';
                    s_xml_song+='<loc>https://carrotstore.web.app/?page=song&id='+song.id_doc+'</loc>';
                    s_xml_song+='<lastmod>'+todays+'</lastmod>';
                    s_xml_song+='<changefreq>daily</changefreq>';
                    s_xml_song+='<priority>0.9</priority>';
                    s_xml_song+='</url>';
                }); 

                var s_xml='<?xml version="1.0" encoding="UTF-8"?>\n';
                s_xml+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
                s_xml+=s_xml_app+"\n"+s_xml_song+"\n";
                s_xml+='</urlset>';

                carrot.hide_loading();
                $("#data_xml_site_map").val(s_xml);
                hljs.highlightAll();
            });
        });
    }

    show_loading_search(){
        $("#search_status_icon").attr("class","fa-solid fa-spinner fa-spin-pulse");
    }

    hide_loading_search(){
        $("#search_status_icon").attr("class","fa-sharp fa-solid fa-magnifying-glass");
        $("#box_input_search").val("");
    }

    loading(msg=''){
        if(msg!='') msg=msg+'<br/><br/>';
        Swal.fire({
            title: 'Please wait...',
            html: msg+'<i class="fa-solid fa-ghost fa-bounce"></i> <i class="fa-solid fa-ghost fa-beat-fade" style="color: green;"></i> <i class="fa-solid fa-ghost fa-bounce"></i> <i class="fa-solid fa-ghost fa-beat-fade" style="color: green;"></i> <i class="fa-solid fa-ghost fa-flip" style="color: #63E6BE;"></i>',
            didOpen: () => {
              Swal.showLoading()
            }
          });
    }

    hide_loading(){
        Swal.close();
    }

    change_style_mode(){
        $("#btn_model_style_icon").removeClass("fa-moon");
        $("#btn_model_style_icon").removeClass("fa-sun");
        if(this.style_mode=="sun"){
            this.style_mode="moon";
            $("#btn_model_style_icon").addClass("fa-sun");
            $("#style_obj").attr("href","assets/css/style2.css?ver="+this.get_ver_cur("js"));
        }
        else{
            this.style_mode="sun";
            $("#btn_model_style_icon").addClass("fa-moon");
            $("#style_obj").attr("href","assets/css/style.css?ver="+this.get_ver_cur("js"));
        }
    }

    show_list_change_server(){
        var frm=new Carrot_Form("frm_list_server",this);
        frm.set_title("Change Server Database");
        frm.off_btn_done();
        frm.set_msg_done("Update verion data success");

        var dropdown_server=frm.create_field("server_db");
        dropdown_server.set_label("Select Server");
        dropdown_server.set_type("select");

        var index_sel=0;
        $(this.config.server).each(function(index,server){
            dropdown_server.add_option(index,server.projectId);
            if(server.projectId==carrot.firebaseConfig_mainhost.projectId) index_sel=index;
        });
        dropdown_server.set_val(index_sel);

        frm.create_btn().set_act("carrot.act_done_change_server()").set_label("Done");
        frm.show();
    }

    act_done_change_server(){
        this.index_server=parseInt($("#server_db").val());
        localStorage.setItem("index_server",this.index_server);
        location.reload();
    }

    act_update_file_config(){
        fetch('config.json?=2.2').then(response => response.text()).then((text) => {
            const binaryData = btoa(text);
            const blob = new Blob([binaryData], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'rabbit.data';
            link.click();
            URL.revokeObjectURL(url);
            this.msg("Update File config success!","success");
        }); 
    }

    act_next_server_when_fail(){
        this.index_server++;
        if(this.index_server>=this.config.server.length) this.index_server=0;
        localStorage.setItem("index_server",this.index_server);
        setTimeout(500,()=>{
            location.reload();
        });
    }

    act_delete_all_data(){
        localStorage.clear();
        localStorage.setItem("index_server",this.index_server);
        location.reload();
    }

    load_js_page(file_name_js_page, className=null, callback=null) {
        var url="assets/js/pages/"+file_name_js_page+".js?ver="+this.get_ver_cur("js");
        if(className!=null){
            if (window.hasOwnProperty(className)) {
                eval(callback);
                return;
            }
            this.call_show_on_load_pagejs=false;
        }else{
            this.call_show_on_load_pagejs=true;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                if(callback!=null) eval(callback);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        })
        .then(() => {
            if (typeof callback === 'function') {
                if(callback!=null) eval(callback);
            }
        })
        .catch(error => {
            carrot.home_page();
        });
    }

    url(){
        var base_url=window.location.origin;
        if(base_url=="https://kurotsmile.github.io"){
            return base_url+"/Carrot";
        }else{
            return window.location.origin;
        }
    }
}