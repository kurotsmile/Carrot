class Carrot_App{
    carrot;
    obj_app=null;
    type_show;

    constructor(carrot){
        this.type_show="all";
        this.carrot=carrot;
        this.load_obj_app();

        carrot.register_page("home","carrot.app.list()","carrot.app.show_edit_app_done");
        carrot.register_page("app","carrot.app.list_app()","carrot.app.show_edit_app_done");
        carrot.register_page("game","carrot.app.list_game()","carrot.app.show_edit_app_done");

        var btn_home=carrot.menu.create("home").set_label("Home").set_lang("home").set_icon("fa-solid fa-home").set_type("main");
        var btn_apps=carrot.menu.create("app").set_label("Applications").set_lang("app").set_icon("fa-solid fa-mobile").set_type("main");
        var btn_games=carrot.menu.create("game").set_label("Games").set_lang("game").set_icon("fa-solid fa-gamepad").set_type("main");
        var btn_add_apps=carrot.menu.create("app").set_label("Add App").set_icon("fa-solid fa-mobile").set_type("add");
        $(btn_home).click(function(){carrot.app.list();});
        $(btn_apps).click(function(){carrot.app.list_app();});
        $(btn_games).click(function(){carrot.app.list_game();});
        $(btn_add_apps).click(function(){carrot.app.show_box_add_or_edit_app(null);});
    }
    
    load_obj_app(){
        if (localStorage.getItem("obj_app") != null) this.obj_app=JSON.parse(localStorage.getItem("obj_app"));
    }

    save_obj_app(){
        localStorage.setItem("obj_app", JSON.stringify(this.obj_app));
    }

    delete_obj_app(){
        localStorage.removeItem("obj_app");
        this.obj_app=null;
    }

    show_list_app_and_game(type="all"){
        this.type_show=type;
        if(this.carrot.check_ver_cur("app")){
            if(this.obj_app==null){
                this.carrot.get_list_doc("app",this.get_data_app_done);
            }
            else{
                this.carrot.log("Show Home load data.. Cache");
                this.show_list_app_from_data();
            }
        }else{
            this.carrot.get_list_doc("app",this.get_data_app_done);
        }
    }

    get_data_app_done(apps,carrot){
        carrot.log("Get app data from sever");
        carrot.app.obj_app=apps;
        carrot.app.save_obj_app();
        carrot.update_new_ver_cur("app",true);
        if(carrot.app.type_show!="") carrot.app.show_list_app_from_data();
    }

    show_list_app_from_data(){
        var carrot=this.carrot;
        var list_app=Array();
        if(carrot.app.type_show=="all"){
            carrot.change_title_page("Carrot store", "?p=home","home");
            list_app=carrot.convert_obj_to_list(this.obj_app);
        }

        if(carrot.app.type_show=="app"){
            carrot.change_title_page("Apps", "?p=app","app");
            $(carrot.convert_obj_to_list(this.obj_app)).each(function(index,emp){
                if(emp.type == "app") list_app.push(emp);
            });
        }

        if(carrot.app.type_show=="game"){
            carrot.change_title_page("Game", "?p=game","game");
            $(carrot.convert_obj_to_list(this.obj_app)).each(function(index,emp){
                if(emp.type == "game") list_app.push(emp);
            });
        }

        this.show_list_app(list_app);
    }

    list(){
        this.show_list_app_and_game("all");
    }

    list_app(){
        this.show_list_app_and_game("app");
    }

    list_game(){
        this.show_list_app_and_game("game");
    }

    box_app_item(data_app,s_class='col-md-4 mb-3'){
        var key_name="name_"+this.carrot.lang;
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
    
                        if(this.carrot.list_link_store!=null){
                            var html_store_link="";
                            $(this.carrot.list_link_store).each(function(index,store){
                                if(data_app[store.key]!=null){
                                    var link_store_app=data_app[store.key];
                                    if(link_store_app!='') html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                }
                            });
                            if(html_store_link!="") html_main_contain+="<div class='row'><div class='col-12'>"+html_store_link+"</div></div>";
                        }
    
                        html_main_contain+=this.carrot.btn_dev("app",data_app.id);
    
                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
        return html_main_contain;
    }

    show_list_app(list_app){
        var html_main_contain="";
        var carrot=this.carrot;
        html_main_contain+='<div id="all_app" class="row m-0">';
        $(list_app).each(function(intdex,data_app) {
            html_main_contain+=carrot.app.box_app_item(data_app,'col-md-4 mb-3');
        });
        html_main_contain+="</div>";

        carrot.body.html(html_main_contain);
        this.check_btn_for_list_app();
    }

    show_app_by_id(id_box_app){
        this.carrot.log("Show app by id:"+id_box_app);
        if(this.obj_app==null){
            this.type_show="";
            this.carrot.get_list_doc("app",this.get_data_app_done);
            this.get_data_app
            this.carrot.log("Load info app "+id_box_app+" from sever");
            this.carrot.get_doc("app",id_box_app,this.show_app_info)
        }else{
            if(this.obj_app[id_box_app]==null){
                this.carrot.log("Load info app "+id_box_app+" from sever");
                this.carrot.get_doc("app",id_box_app,this.show_app_info)
            }else{
                this.carrot.log("Load info app "+id_box_app+" from cache");
                var data_app=JSON.parse(this.obj_app[id_box_app]);
                this.show_app_info(data_app,this.carrot);
            }
        }
    }

    show_app_info(data,carrot){
        if(data==null) $.MessageBox(carrot.l("no_obj"));
        carrot.change_title_page(data.name_en,"?p=app&id="+data.id);
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

                        if(carrot.list_link_store!=null){
                            var html_store_link="";
                            var html_store_link_lager="";
                            $(carrot.list_link_store).each(function(index,store){
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
                                html+='<p class="lang" key_lang="ads_in_app">Contains Ads</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>In-App <i class="fa-solid fa-cart-shopping"></i></b>';
                                html+='<p class="lang" key_lang="in_app">In-app purchases</p>';
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
            
            var list_app=carrot.convert_obj_to_list(carrot.app.obj_app);
            list_app= list_app.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            $(list_app).each(function(intdex,app_item){
                if(data.type==app_item.type&&data.id!=app_item.id) html+=carrot.app.box_app_item(app_item,'col-md-12 mb-3');
            });
            html+='</div>';
    
        html+="</div>";
        html+="</div>";
        carrot.app.type_show="all";
        carrot.show(html);
        carrot.app.check_btn_for_list_app();
    }

    check_btn_for_list_app(){
        var carrot=this.carrot;
        $(".app_icon").click(async function(){
            var id_box_app = $(this).attr("app_id");
            carrot.app.show_app_by_id(id_box_app);
        });
        carrot.check_event();
    }

    show_edit_app_done(data_app,carrot){
        if(data_app!=null)
            carrot.app.show_box_add_or_edit_app(data_app);
        else
            $.MessageBox("Ứng dụng không còn tồn tại!");
    }

    show_box_add_or_edit_app(data_app){
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
    
        $.each(this.carrot.list_lang, function (index, data_lang) {
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
    
        $.each(this.carrot.list_link_store, function (index, data_store) {
            obj_app["tip_lang_"+data_store.key] = { type: "caption", message: "<i class='fa-solid "+data_store.icon+"'></i> <b>"+data_store.name+"</b> Thiết lập liên kết ("+data_store.key+")" };

            var obj_input_link_store = Object();
            obj_input_link_store["type"] = "input";
            obj_input_link_store["label"] = "Link Store - (" + data_store.name + ") - " + data_store.key;
            if(data_app!=null&&data_app[data_store.key]!="") obj_input_link_store["defaultValue"]=data_app[data_store.key];
            obj_app[data_store.key] = obj_input_link_store;
        });
    
        customer_field_for_db(obj_app,'app','name_en','Add App successfully');
    
        $.MessageBox({
            message: s_title_box,
            input: obj_app,
            top: "auto",
            buttonFail: "Cancel"
        }).done(this.carrot.act_done_add_or_edit);
    }
}