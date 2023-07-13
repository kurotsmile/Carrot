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

    /*Obj page*/
    lang;
    langs;
    lang_url="";
    recognition=null;

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
    
    constructor(){
        var carrot=this;
        this.firebaseConfig_mainhost={
            apiKey: "AIzaSyDzsx1KYLZL5COz1NaTD8cOz8GYalX2Dxc",
            authDomain: "carrotstore.firebaseapp.com",
            projectId: "carrotstore",
            storageBucket: "carrotstore.appspot.com",
            messagingSenderId: "745653792874",
            appId: "1:745653792874:web:55d78113cd3dea7c28da13",
            measurementId: "G-KXDDJ42JFN",
        }

        this.setup_sever_db();

        if(localStorage.getItem("mode_site") != null) this.mode_site = localStorage.getItem("mode_site");
        if(localStorage.getItem("is_dev") != null) this.is_dev = localStorage.getItem("is_dev");
        
        this.load_recognition();
        this.load_obj_version_new();
        this.load_obj_version_cur();
    };

    load_all_object_main(){
        var carrot=this;
        this.update_new_ver_cur("js",true);
        this.update_new_ver_cur("page",true);
        this.log("Load js ..."+this.get_ver_cur("js"),"null");
        this.body=$("#main_contain");

        if(this.is_dev)
            this.paypal_CLIENT_ID=this.paypal_dev_CLIENT_ID;
        else
            this.paypal_CLIENT_ID=this.paypal_pub_CLIENT_ID;

        $('head').append('<script type="text/javascript" src="assets/js/carrot_langs.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_link_store.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_app.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_form.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_user.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_music.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_code.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_icon.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_background.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_radio.js?ver='+this.get_ver_cur("js")+'"></script>');
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
        this.link_store=new Carrot_Link_Store(this);
        this.app=new Carrot_App(this);
        this.user=new Carrot_user(this);
        this.music=new Carrot_Music(this);
        this.code=new Carrot_Code(this);
        this.icon=new Carrot_Icon(this); 
        this.audio=new Carrot_Audio(this);
        this.radio=new Carrot_Radio(this);
        this.background=new Carrot_Background(this);
        this.bible=new Carrot_Bible(this);
        this.avatar=new Carrot_Avatar(this);
        this.ai_lover=new Ai_Lover(this);
        this.ai=this.ai_lover;
        this.privacy_policy=new Carrot_Privacy_Policy(this);
        this.about_us=new Carrot_About_Us(this);
        this.player_media=new Carrot_Player_Media(this);
        this.file=new Carrot_File(this);
        this.pay=new Carrot_Pay(this);
        this.rate=new Carrot_Rate(this);

        var btn_mod_host=this.menu.create("btn_mode_host").set_label("Change Mode Host").set_type("setting").set_icon("fa-brands fa-dev");
        $(btn_mod_host).click(function(){carrot.change_host_connection();});

        var btn_setting_ver=this.menu.create("data_version").set_label("Data Version").set_type("setting").set_icon("fa-regular fa-code-compare");
        $(btn_setting_ver).click(function(){carrot.show_edit_version_data_version();});

        var btn_export_file_json=this.menu.create("btn_export_file_json").set_label("Export Collection").set_type("setting").set_icon("fa-solid fa-file-export");
        $(btn_export_file_json).click(function(){carrot.download_json();});

        var btn_import_file_json=this.menu.create("btn_import_file_json").set_label("Import Collection (File)").set_type("setting").set_icon("fa-solid fa-file-import");
        $(btn_import_file_json).click(function(){carrot.show_import_json_file();});

        $("#btn_model_site").click(function(){carrot.change_mode_site();});

        if(!this.check_ver_cur("link_store"))this.link_store.get_all_data_link_store();
        if(!this.check_ver_cur("lang")) this.langs.get_all_data_lang();
        if(!this.check_ver_cur("lang_web")) this.langs.get_data_lang_web();

        this.user.show_info_user_login_in_header();
        this.menu.show();

        $(".btn-menu").click(function () {
            $(".btn-menu").removeClass("active");
            $(".btn-menu i").removeClass("fa-bounce");
            $(this).addClass("active");
            $(this).find("i").addClass("fa-bounce");
        });
    }

    setup_sever_db(){
        this.log("setup_sever_db","warning");
        if (localStorage.getItem("is_localhost") == null) {
            this.is_localhost = false;
        } else {
            if (localStorage.getItem("is_localhost") == "false")
                this.is_localhost = false;
            else
                this.is_localhost = true;
        }

        if(this.firebase==null) this.firebase =firebase.initializeApp(this.firebaseConfig_mainhost);
        this.storage = this.firebase.storage();
        this.db = this.firebase.firestore();
        if(this.is_localhost){
            this.db.useEmulator('localhost', 8082);
            this.storage.useEmulator('localhost', 9199);
        }
        if(this.db==null) this.show_error_connect_sever();
    }

    set_doc(s_collection,s_document,data){
        this.log("Set " + s_collection+"."+s_document+" from server","warning");
        this.db.collection(s_collection).doc(s_document).set(data);
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
        this.load_bar();
        this.db.collection("setting_web").doc("version").get().then((doc) => {
            if (doc.exists) {
                var ver_data_new=doc.data();
                this.obj_version_new=ver_data_new;
                this.save_obj_version_new();
                this.save_obj_version_cur();
                this.load_page();
                this.load_bar();
            } else {
                this.log("No new verstion data","error");
                this.load_page();
            }
        }).catch((error) => {
            this.log(error.message,"error");
            this.show_error_connect_sever();
            this.load_page();
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

    show_error_connect_sever(){
        Swal.fire({
            icon:'error',
            title: this.l("error_connect_sever","Data server connection failed!"),
            html: this.l("error_connect_sever_msg","We are doing system maintenance and upgrading in a few hours. But you can use the functions with offline mode when you have previously visited,The site will be back to normal when the upgrade is done!")+"<p><i class='text-secondary'>"+this.l("error_connect_sever_thanks","Sorry for this inconvenience!")+"</i><p>",
            imageUrl: 'images/upgrade.png',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Upgrade'
        });
    }

    convert_obj_to_list(obj_carrot){
        var list_obj=Array();
        $.each(obj_carrot,function(key,val){
            list_obj.push(JSON.parse(val));
        });
        return list_obj;
    }

    obj_to_array(objs){
        return this.convert_obj_to_list(objs);
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
        frm.show();
    }
    
    done_update_data_version(){
        this.obj_version_new=null;
        this.obj_version_cur=null;
        this.save_obj_version_new();;
        this.save_obj_version_cur();
        //location.reload();
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
            $.MessageBox("Document "+db_doc_id+" successfully deleted!");
            this.delete_cache_obj_by_collection(db_collection);
            console.log("Document "+db_doc_id+" successfully deleted!");
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
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this "+db_collection+"."+db_document+" ?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) carrot.act_del_obj(db_collection,db_document);
            })
        });

        $("#btn_share").click(function(){carrot.show_share();});
        $('#register_protocol_url').click(function(){carrot.register_protocol_url();});
        
        this.rate.check_event();
        this.check_mode_site();
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
        html+='<div class="row"><div class="col-12"><input type="file" id="input-file-import"></div></div>';
        html+='<div class="row"><pre><code class="language-json col-12" id="file_contain"></code></pre></div>';
        this.show(html);

        $("#input-file-import").on('change',function() {
            var file = $(this).get(0).files;
            var reader = new FileReader();
            reader.readAsText(file[0]);
            reader.addEventListener("load", function(e) {
                var textFromFileLoaded = e.target.result;
                var obj_json=JSON.parse(textFromFileLoaded);
                carrot.import_json_by_data(obj_json);
                var jsonPretty = JSON.stringify(obj_json, null, '\t');
                $("#file_contain").html(jsonPretty);
                hljs.highlightAll();
            })
        });
    }

    import_json_by_data(data){
        var name_collection = data.collection;
        var all_item = data.all_item;
        var carrot=this;
        $.each(all_item, function (index, d) {
            var doc_id = d["id_import"];
            delete d["id_import"];
            carrot.db.collection(name_collection).doc(doc_id).set(d);
        });
        $.MessageBox("Import Success!");
    }

    log(s_msg,s_status="info") {
        console.log(s_msg);
        if(s_status=="alert") s_msg="warning";
        if(this.mode_site=="dev") SnackBar({message: s_msg,timeout: 5000,status:s_status,position:'tr'});
    }

    log_error(error) {
        if(this.mode_site=="dev"){
            console.log(error);
            Swal.fire({
                title: error.name,
                icon: 'error',
                html: error.toString(),
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

    load_page(){
        this.load_all_object_main();
        this.check_show_by_id_page();
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
                this.load_bar();
                $("#load_bar").css("width","100%");
                this.home();
            };
        }else{
            this.load_bar();
            $("#load_bar").css("width","100%");
            this.home();
        }
    }

    show(s_html){
        this.body.html(s_html);
        window.scrollTo(0,0); 
        $("#head").show();
        $("#head_nav").show();
    }

    btn_dev(db_collection,db_document,obj_js=null,func_edit=null,func_del=null){
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
                    html+="<div role='button' class='dev btn btn_app_del btn-danger btn-sm mr-2'  db_collection='"+db_collection+"' db_document='"+db_document+"' db_obj='"+obj_js+"'><i class=\"fa-solid fa-trash\"></i></div> ";

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
                carrot.set_doc("order",id_product+"_"+carrot.create_id(),details);
                act_done(carrot);
                carrot.msg("Pay success!");
            });
            }
        }).render('#paypal-button-container');
    }

    home(){
        var html="";
        if(this.app.obj_app!=null){
            this.change_title_page("Carrot store", "?p=home","home");
            html+=this.app.list_for_home();
            html+=this.music.list_for_home();
            html+=this.code.list_for_home();
            html+=this.icon.list_for_home();
            html+=this.user.list_for_home();
            html+=this.audio.list_for_home();
            html+=this.radio.list_for_home();
            html+=this.bible.list_for_home();
            this.show(html);
            this.app.check_btn_for_list_app();
            this.music.check_event();
            this.code.check_event();
            this.user.check_event();
            this.audio.check_event();
            this.radio.check_event();
            this.bible.check_event();
        }else{
            this.app.list();
        }
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

    show_404(){
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
        html+='<a role="button" class="btn btn-primary" onClick="carrot.home();return false;">Go Home</a>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        this.show(html);
        this.check_event();
    }
}