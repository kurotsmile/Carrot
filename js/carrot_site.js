class Carrot_Site{
    mode_site = "nomal";
    firebaseConfig_mainhost;
    lang;
    lang_url="";
    lang_web=Object();
    list_link_store=null;
    list_lang;
    obj_app=Object();
    version=null;

    name_collection_cur="";
    name_document_cur="";

    constructor(){

        if(localStorage.getItem("mode_site") != null) this.mode_site = localStorage.getItem("mode_site");

        this.firebaseConfig_mainhost={
            apiKey: "AIzaSyDzsx1KYLZL5COz1NaTD8cOz8GYalX2Dxc",
            authDomain: "carrotstore.firebaseapp.com",
            projectId: "carrotstore",
            storageBucket: "carrotstore.appspot.com",
            messagingSenderId: "745653792874",
            appId: "1:745653792874:web:55d78113cd3dea7c28da13",
            measurementId: "G-KXDDJ42JFN"
        }

        if(localStorage.getItem("lang_web")!=null) this.lang_web=JSON.parse(localStorage.getItem("lang_web"));
        if(localStorage.getItem("link_store")!=null) this.list_link_store=JSON.parse(localStorage.getItem("link_store"));
        if(localStorage.getItem("lang") == null) this.change_lang("en"); else this.lang = localStorage.getItem("lang");
        this.list_lang=Array();
        this.load_obj_app();
        this.load_list_lang();
        this.version=this.get_version_data_cur();
    };

    change_mode_site(){
        if (this.mode_site == "nomal")
            this.mode_site = "dev";
        else
            this.mode_site = "nomal";
        localStorage.setItem("mode_site",this.mode_site);
        this.check_mode_site();
    }

    check_mode_site() {
        if (this.mode_site == "nomal")
            $(".dev").each(function () { $(this).hide(100); });
        else
            $(".dev").each(function () { $(this).show(100); });
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
        this.show_home();
    }

    async get_all_data_lang_web(){
        console.log("Carrot:get_all_data_lang_web");
        this.get_doc("lang_web",this.lang,this.get_data_lang_web_done);
    }

    get_data_lang_web_done(data,carrot){
        carrot.lang_web=data;
        localStorage.setItem("lang_web",JSON.stringify(carrot.lang_web));
        carrot.load_data_lang_web();
    }

    get_version_data_cur(){
        var data_version=Object();
        if(localStorage.getItem('v_app')!=null) data_version["app"]=localStorage.getItem('v_app'); else data_version["app"]="0.0";
        if(localStorage.getItem('v_lang')!=null) data_version["lang"]=localStorage.getItem('v_lang'); else data_version["lang"]="0.0";
        if(localStorage.getItem('v_lang_web')!=null) data_version["lang_web"]=localStorage.getItem('v_lang_web'); else data_version["lang_web"]="0.0";
        if(localStorage.getItem('v_js')!=null) data_version["js"]=localStorage.getItem('v_js'); else data_version["js"]="0.0";
        if(localStorage.getItem('v_css')!=null) data_version["css"]=localStorage.getItem('v_css'); else data_version["css"]="0.0";
        if(localStorage.getItem('v_link_store')!=null) data_version["link_store"]=localStorage.getItem('v_link_store'); else data_version["link_store"]="0.0";
        if(localStorage.getItem('v_page')!=null) data_version["page"]=localStorage.getItem('v_page'); else data_version["page"]="0.0";
        return data_version;
    }

    set_version_data_cur(data_version){
        localStorage.setItem('v_app',data_version["app"]);
        localStorage.setItem('v_lang',data_version["lang"]);
        localStorage.setItem('v_lang_web',data_version["lang_web"]);
        localStorage.setItem('v_js',data_version["js"]);
        localStorage.setItem('v_css',data_version["css"]);
        localStorage.setItem('v_link_store',data_version["link_store"]);
        localStorage.setItem('v_page',data_version["page"]);
        this.version=data_version;
    }

    convert_apps_to_list(){
        var list_app=Array();
        $.each(this.obj_app,function(key,val){
            list_app.push(JSON.parse(val));
        });
        return list_app;
    }

    show_home(){
        this.show_list_app(this.convert_apps_to_list());
    }

    show_all_app(){
        console.log('Carrot:show_all_app');
        var list_app_mobile=Array();
        $(this.convert_apps_to_list()).each(function(index,emp){
            if(emp.type == "app") list_app_mobile.push(emp);
        });
        this.show_list_app(list_app_mobile);
    }

    show_all_game(){
        console.log('Carrot:show_all_game');
        var list_game=Array();
        $(this.convert_apps_to_list()).each(function(index,emp){
            if(emp.type == "game") list_game.push(emp);
        });
        this.show_list_app(list_game);
    }
    
    show_edit_version_data_version(act_done){
        var data_version=this.get_version_data_cur();
        var obj_data_ver = Object();
    
        $.each(data_version,function(key,value){        
            obj_data_ver[key]={'type':'input','defaultValue':value,'label':key};
        })
    
        $.MessageBox({
            message: "Edit version",
            input: obj_data_ver,
            top: "auto",
            buttonFail: "Cancel"
        }).done(act_done);
    }

    load_obj_app(){
        if (localStorage.getItem("obj_app") == null) {
            this.obj_app=new Object();
        } else {
            this.obj_app=JSON.parse(localStorage.getItem("obj_app"));
        }
    }

    load_list_lang(){
        if (localStorage.getItem("list_lang") == null) {
            this.list_lang=new Array();
        } else {
            this.list_lang=JSON.parse(localStorage.getItem("list_lang"));
            this.show_list_lang_in_menu();
        }
    }

    save_obj_app(){
        localStorage.setItem("obj_app", JSON.stringify(this.obj_app));
    }

    delete_obj_app(){
        localStorage.removeItem("obj_app");
        this.obj_app=new Object();
        this.get_all_data_app();
    }
    
    save_list_lang(){
        localStorage.setItem("list_lang", JSON.stringify(this.list_lang));
        this.show_list_lang_in_menu();
    }

    save_list_link_store(){
        localStorage.setItem("link_store", JSON.stringify(this.list_link_store));
    }

    show_list_lang_in_menu(){
        $("#list_lang_1").html("");
        $("#list_lang_2").html("");
        console.log('show_list_lang_in_menu');
        for (let i = 0; i < this.list_lang.length; i++) {
            var lang_data=this.list_lang[i];
            var s_active='';
            if(lang_data.key==this.lang) s_active='active';
            if(i%2==0)
            $("#list_lang_1").append('<div class="dropdown-item item_lang '+s_active+'" role="button" key="' + lang_data.key + '"><img style="width:20px" src="' + lang_data.icon + '"/> ' + lang_data.name + '</div>');
            else
            $("#list_lang_2").append('<div class="dropdown-item item_lang '+s_active+'" role="button" key="' + lang_data.key + '"><img style="width:20px" src="' + lang_data.icon + '"/> ' + lang_data.name + '</div>');
        }
    }

    change_lang(s_key){
        this.lang=s_key;
        localStorage.setItem("lang", s_key);
        $("#key_lang").html(s_key);
    }

    change_title_page(s_title,s_url){
        document.title =s_title;
        if(this.lang_url!=""&&s_url!="") s_url=s_url+"&lang="+this.lang;
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
                                    html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                }
                            });
                            if(html_store_link!="") html_main_contain+="<div class='row'><div class='col-12'>"+html_store_link+"</div></div>";
                        }
    
                        html_main_contain+="<div class='row' style='margin-top:6px;'>";
                        html_main_contain+="<div class='col-6'><div class='btn dev btn_app_edit btn-warning btn-sm' app_id='"+data_app.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</div></div>";
                        html_main_contain+="<div class='col-6'><div class='btn dev btn_app_del btn-danger btn-sm' app_id='"+data_app.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</div></div>";
                        html_main_contain+="</div>";
    
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
        $("#box_input_search").change(function(){
            var inp_text=$("#box_input_search").val();
            $(".box_app").each(function(index,emp){
                var id_box=$(emp).attr("id");
                var key_search=$(emp).attr("key_search");
                if(id_box.search(inp_text)!=-1||key_search.search(inp_text)!=-1) $(emp).show();
                else $(emp).hide();
            });
        });
        this.check_btn_for_list_app();
    }

    show_app_info(data,carrot){
        if(data==null) $.MessageBox(carrot.l("no_app"));
        document.title = data.name_en;
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3">';
                        html+='<img class="w-100" src="'+data.icon+'" alt="">';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data["name_"+carrot.lang]+'</h4>';
                        html+='<button class="btn btn-primary w-45 fw-semi fs-8 py-2 me-3"> Download </button>';
                        html+='<button class="btn border ps-3 w-45 fw-semi fs-8 py-2 btn-outlie-primary"> Add to Wish List </button>';
                        html+="<button class='btn dev btn_app_edit btn-warning w-45 fw-semi fs-8 py-2 me-3' app_id='"+data.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</button>";
                        html+="<button class='btn dev btn_app_del btn-danger border ps-3 w-45 fw-semi fs-8 py-2' app_id='"+data.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</button>";
                        html+="<button class='btn dev btn_app_export btn-dark w-45 fw-semi fs-8 py-2 me-3' app_id='"+data.id+"' data-collection='app'><i class=\"fa-solid fa-download\"></i> Export Json</button>";
                        html+="<button class='btn dev btn_app_import btn-dark border ps-3 w-45 fw-semi fs-8 py-2' app_id='"+data.id+"'  data-collection='app'><i class=\"fa-solid fa-upload\"></i> Import</button>";
    
                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>3.9 <i class="fa-sharp fa-solid fa-eye"></i></b>';
                                html+='<p>11.6k <l class="lang"  key_lang="count_view">Reviews</l></p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>5M+ <i class="fa-solid fa-download"></i></b>';
                                html+='<p class="lang" key_lang="count_download">Downloads</p>';
                            html+='</div>';
                        html+='</div>';
    
                        html+='<div class="auth pt-4">';
                            html+='<h6 class="text-primary fw-semi mb-0">Zego Global Publishing</h6>';
                            html+='<p class="fs-8">contains Ads</p>';
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
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3">Related Apps</h4>';
            
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
            if(carrot.obj_app[id_box_app]==null){
                console.log("Load info app "+id_box_app+" from sever");
                carrot.get_doc("app",id_box_app,carrot.show_app_info)
            }else{
                console.log("Load info app "+id_box_app+" from cache");
                var data_app=JSON.parse(carrot.obj_app[id_box_app]);
                carrot.show_app_info(data_app,carrot);
            }
        });

        $(".btn_app_edit").click(async function () {
            var id_box_app = $(this).attr("app_id");
            carrot.get_doc("app",id_box_app,carrot.show_edit_app_done);
        });

        $(".btn_app_del").click(async function () {
            var id_box_app = $(this).attr("app_id");
            $.MessageBox({
                buttonDone  : "Yes",
                buttonFail  : "No",
                message     : "Bạn có chắc chắng là xóa ứng dụng "+id_box_app+" này không?"
            }).done(function(){
                carrot.act_del_obj("app",id_box_app);
            });
        });

        $(".btn_app_export").click(function(){
            var app_id=$(this).attr("app_id");
            var data_collection=$(this).attr("data-collection");
            carrot.act_download_json_by_collection_and_doc(data_collection,app_id);
        });

        $(".btn_app_import").click(function(){
            var app_id=$(this).attr("app_id");
            var data_collection=$(this).attr("data-collection");
            var obj_data=new Object();
            obj_data["collection"]=data_collection;
            obj_data["document"]=app_id;
            carrot.show_import_json_box(obj_data);
        });

        this.load_data_lang_web();
        this.check_mode_site();
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
        if(data_json==null){ $.MessageBox(carrot.l("no_app")); return;}
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
}