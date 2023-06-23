class Carrot_Site{
    /*Config Mode Web*/
    firebaseConfig_mainhost;
    count_act_dev = 0;
    mode_site = "nomal";
    is_dev=false;
    is_localhost=false;

    /*Obj page*/
    lang;
    lang_url="";
    lang_web=Object();
    list_link_store=null;
    list_lang;
    recognition=null;

    obj_lang_web=Object();
    obj_version_new=null;
    obj_version_cur=null;

    name_collection_cur="";
    name_document_cur="";
    id_page;
    body;
    obj_page=new Object();

    /*Firebase*/
    db;
    app;

    /*Obj Main*/
    user;
    music;
    ai_lover;ai;
    code;
    icon;
    audio;
    background;
    menu;
    avatar;
    
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

        this.setup_sever_db();

        if(localStorage.getItem("mode_site") != null) this.mode_site = localStorage.getItem("mode_site");
        if(localStorage.getItem("is_dev") != null) this.is_dev = localStorage.getItem("is_dev");
        if(localStorage.getItem("lang_web")!=null) this.lang_web=JSON.parse(localStorage.getItem("lang_web"));
        if(localStorage.getItem("link_store")!=null) this.list_link_store=JSON.parse(localStorage.getItem("link_store"));
        if(localStorage.getItem("lang") == null) this.change_lang("en"); else this.lang = localStorage.getItem("lang");
       
        this.list_lang=Array();
        
        this.load_list_lang();
        this.load_recognition();
        this.load_obj_version_new();
        this.load_obj_version_cur();

        $("#key_lang").html(this.lang);
        $("#btn_change_lang").click(function(){ carrot.show_list_lang();});

        this.body=$("#main_contain");
        
        $('head').append('<script type="text/javascript" src="assets/js/main.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_app.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_form.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_user.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_music.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_code.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_icon.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_background.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/ai_lover.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/ai_chat.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_menu.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_list_item.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_audio.js?ver='+this.get_ver_cur("js")+'"></script>');
        $('head').append('<script type="text/javascript" src="assets/js/carrot_avatar.js?ver='+this.get_ver_cur("js")+'"></script>');

        this.menu=new Carrot_Menu(this);
        this.app=new Carrot_App(this);
        this.user=new Carrot_user(this);
        this.music=new Carrot_Music(this);
        this.code=new Carrot_Code(this);
        this.icon=new Carrot_Icon(this);
        this.audio=new Carrot_Audio(this);
        this.background=new Carrot_Background(this);
        this.ai_lover=new Ai_Lover(this);
        this.ai=this.ai_lover;
        this.avatar=new Carrot_Avatar(this);
    };

    setup_sever_db(){
        this.log("setup_sever_db");
        this.app =firebase.initializeApp(this.firebaseConfig_mainhost);
        this.db = this.app.firestore();
        if (this.is_localhost) this.db.useEmulator('localhost', 8082);
        if(this.db==null) this.show_error_connect_sever();
    }

    set_doc(s_collection,s_document,data){
        this.log("Set doc: collection:" + s_collection+" document:"+s_document);
        this.db.collection(s_collection).doc(s_document).set(data);
    }

    get_doc(s_collection,s_id_document,act_done){
        this.log("Get doc: collection:" + s_collection+" document:"+s_id_document);
        this.db.collection(s_collection).doc(s_id_document).get().then((doc) => {
            if (doc.exists) {
                var data_obj = doc.data();
                data_obj["id"]=doc.id;
                act_done(data_obj,this);
            } else {
                console.log("No such document!");
                act_done(null,this)
            }
        }).catch((error) => {
            act_done(null,this);
            console.log("Error getting document:", error);
        });
    }

    get_list_doc(s_collection,act_done){
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
            this.log(error.message)
            act_done(null,this);
        });
    }

    get_all_data_link_store() {
        this.log("get_all_data_link_store");
        this.db.collection("link_store").get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.list_link_store=Array();
                querySnapshot.forEach((doc) => {
                    var data_link_store=doc.data();
                    data_link_store["id"]=doc.id;
                    this.list_link_store.push(data_link_store);
                });
                this.save_list_link_store();
                this.update_new_ver_cur("link_store");
            }
        }).catch((error) => {
            this.log(error.message)
        });
    };

    get_all_data_lang() {
        this.db.collection("lang").get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.list_lang=Array();
                querySnapshot.forEach((doc) => {
                    var lang_data = doc.data();
                    lang_data["id"]=doc.id;
                    this.list_lang.push(lang_data);
                });
                this.save_list_lang();
                this.update_new_ver_cur("lang");
            }
        }).catch((error) => {
            this.log(error.message)
        });
    };

    check_version_data(){
        this.db.collection("setting_web").doc("version").get().then((doc) => {
            if (doc.exists) {
                var ver_data_new=doc.data();
                this.obj_version_new=ver_data_new;

                if(!this.check_ver_cur("link_store")) this.get_all_data_link_store();
                if(!this.check_ver_cur("lang")) this.get_all_data_lang();
                if(!this.check_ver_cur("lang_web")) this.get_all_data_lang_web();

                this.update_new_ver_cur("js");
                this.update_new_ver_cur("page");
                this.save_obj_version_new();
                this.save_obj_version_cur();

                this.check_show_by_id_page();
            } else {
                this.log("No new verstion data");
                this.check_show_by_id_page();
            }
        }).catch((error) => {
            this.log(err.message);
            this.show_error_connect_sever();
            this.check_show_by_id_page();
        });
    }

    act_done_edit_version_data_version(data){
        carrot.db.collection("setting_web").doc("version").set(data)
        $.MessageBox("Change version data site success!");
        carrot.check_version_data();
    }

    act_done_add_or_edit=(data)=>{
        this.log("act_done_add_or_edit");
        var act_msg_success=data.act_msg_success;
        var db_collection=data.db_collection;
        var db_doc=data.db_doc;

        delete(data.act_msg_success);
        delete(data.db_collection);
        delete(data.db_doc);
        this.db.collection(db_collection).doc(data[db_doc]).set(data);
        this.delete_cache_obj_by_collection(db_collection);
        $.MessageBox(act_msg_success);
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
        this.load_data_lang_web();
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

    get_all_data_lang_web(){
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

    register_page(id_page,event_show_page,event_edit){
        var obj_data=new Object();
        obj_data["edit"]=event_edit;
        obj_data["show"]= event_show_page;
        this.obj_page[id_page]=obj_data;
    }

    show_home(){
        this.app.show_list_app_and_game();
        this.change_title_page("Carrot store", "?p=home","home");
    }

    show_edit_version_data_version(){
        var obj_data_ver = Object();
        $.each(this.obj_version_new,function(key,value){        
            obj_data_ver[key]={'type':'input','defaultValue':value,'label':key};
        });
        $.MessageBox({
            message: "Edit version",
            input: obj_data_ver,
            top: "auto",
            buttonFail: "Cancel"
        }).done(this.act_done_edit_version_data_version);
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

    save_obj_version_new(){
        localStorage.setItem("obj_version_new", JSON.stringify(this.obj_version_new));
    }

    save_obj_version_cur(){
        localStorage.setItem("obj_version_cur", JSON.stringify(this.obj_version_cur));
    }

    act_del_obj(db_collection,db_doc_id){
        this.db.collection(db_collection).doc(db_doc_id).delete().then(() => {
            $.MessageBox("Document "+db_doc_id+"successfully deleted!");
            this.delete_cache_obj_by_collection(db_collection);
            console.log("Document "+db_doc_id+"successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
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
    }

    check_event(){
        var carrot=this;
        
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

        $(".btn_app_edit").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            carrot.log("Edit "+db_collection+" : "+db_document);
            if(carrot.obj_page[carrot.id_page]!=null){
                carrot.get_doc(carrot.id_page,db_document,carrot.act_edit_by_page_register);
            }else{
                if(db_collection=="app") carrot.get_doc(db_collection,db_document,carrot.app.show_edit_app_done);
                if(db_collection=="icon") carrot.get_doc(db_collection,db_document,carrot.icon.show_edit_icon_done);
                if(db_collection=="user-avatar") carrot.get_doc(db_collection,db_document,carrot.ai_lover.show_edit_avatar_done);
                if(db_collection=="song") carrot.get_doc(db_collection,db_document,carrot.music.show_add_or_edit_music);
                if(carrot.id_page=="chat") carrot.get_doc(db_collection,db_document,carrot.ai_lover.chat.show_edit);
                if(carrot.id_page=="address_book") carrot.get_doc(db_collection,db_document,carrot.user.show_box_add_or_edit_phone_book);
            }
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

    act_edit_by_page_register(data,carrot){
        eval(carrot.obj_page[carrot.id_page].edit)(data,carrot);
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
        return 'id' + (new Date()).getTime();
    }

    create_id(){
        return this.uniq();
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
        if(this.obj_page[this.id_page]!=null){
            eval( this.obj_page[this.id_page].show);
        }else{
            if(this.id_page == "privacy_policy") $("#btn_privacy_policy").click();
            else if(this.id_page=="app"){
                var id_app=this.get_param_url("id");
                if(id_app!=""){
                    id_app=decodeURI(id_app);
                    this.app.show_app_by_id(id_app);
                }
                else this.app.show_all_app();
            }
            else if(this.id_page=="game") this.app.show_all_game();
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
            else if(this.id_page=="chat") this.ai_lover.show_all_chat(this.lang);
            else this.show_home();
        };
    }

    show(s_html){
        this.body.html(s_html);
        $('body').animate({scrollTop:0}, 1000);
    }

    btn_dev(db_collection,db_document){
        var html='';
        html+="<div class='row dev d-flex'>";
            html+="<div class='dev col-6 d-flex btn-group'>";
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
        if(db_collection=="app") this.app.delete_obj_app();
        if(db_collection=="icon") this.icon.delete_obj_icon();
        if(db_collection=="song") this.music.delete_obj_song();
        if(db_collection=="code") this.code.delete_obj_code();
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

    show_setting_lang_by_key(s_key_lang_change="",s_collection){    
        var data_obj_lang_tag=new Object();
        var data_obj_lang_change=new Object();
        
        this.ai.setting_lang_change=s_key_lang_change;
        this.db.collection(s_collection).doc("en").get().then((doc) => {
            if (doc.exists) {
                data_obj_lang_tag = doc.data();
                data_obj_lang_tag["id"]=doc.id;
                this.db.collection(s_collection).doc(s_key_lang_change).get().then((doc) => {
                    if (doc.exists) {
                        data_obj_lang_change = doc.data();
                        data_obj_lang_change["id"]=doc.id;
                        this.ai.setting_lang_collection=s_collection;
                        this.ai.show_setting_lang(data_obj_lang_tag,data_obj_lang_change);
                    }
                }).catch((error) => {
                    this.log(error.message)
                });
            }
        }).catch((error) => {
            this.log(error.message)
        });
    }

    show_all_block_chat_by_lang(s_key_lang=''){
        if(s_key_lang=='') s_key_lang=this.lang;
        this.db.collection("block").doc(s_key_lang).get().then((doc) => {
            if (doc.exists) {
                var data_list_key_block=doc.data();
                data_list_key_block["lang"]=doc.id;
                this.ai.show_list_block_chat(data_list_key_block);
            }else{
                $.MessageBox("Chưa có danh sách từ cấm!");
                var data_list_key_block=new Object();
                data_list_key_block["lang"]=s_key_lang;
                data_list_key_block["chat"]=Array("new_key_block");
                carrot.ai_lover.show_list_block_chat(data_list_key_block);
            }
        }).catch((error) => {
            $.MessageBox("Chưa có danh sách từ cấm!");
            var data_list_key_block=new Object();
            data_list_key_block["lang"]=s_key_lang;
            data_list_key_block["chat"]=Array("new_key_block");
            carrot.ai_lover.show_list_block_chat(data_list_key_block);
        });
    }

    msg(msg,s_icon='success'){
        Swal.fire({icon:s_icon,title: msg,showConfirmButton: false,timer: 1500})
    }
}