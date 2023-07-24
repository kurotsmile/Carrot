class Carrot_App{
    carrot;
    obj_app=null;
    type_show;
    icon="fa-solid fa-gamepad";

    constructor(carrot){
        this.type_show="all";
        this.carrot=carrot;
        this.load_obj_app();

        carrot.register_page("home","carrot.home()","carrot.app.edit","carrot.app.show_app_by_id","carrot.app.reload");
        carrot.register_page("app","carrot.app.list_app()","carrot.app.edit","carrot.app.show_app_by_id","carrot.app.reload");
        carrot.register_page("game","carrot.app.list_game()","carrot.app.edit","carrot.app.show_app_by_id","carrot.app.reload");

        var btn_home=carrot.menu.create("home").set_label("Home").set_lang("home").set_icon("fa-solid fa-home").set_type("main");
        var btn_apps=carrot.menu.create("app").set_label("Applications").set_lang("app").set_icon("fa-solid fa-mobile").set_type("main");
        var btn_games=carrot.menu.create("game").set_label("Games").set_lang("game").set_icon("fa-solid fa-gamepad").set_type("main");
        var btn_add_apps=carrot.menu.create("app").set_label("Add App").set_icon("fa-solid fa-mobile").set_type("add");
        $(btn_home).click(function(){carrot.app.list();});
        $(btn_apps).click(function(){carrot.app.list_app();});
        $(btn_games).click(function(){carrot.app.list_game();});
        $(btn_add_apps).click(function(){carrot.app.add();});
    }
    
    load_obj_app(){
        if (localStorage.getItem("obj_app") != null) this.obj_app=JSON.parse(localStorage.getItem("obj_app"));
    }

    save_obj(){
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
                this.carrot.log("Show list app:"+type);
                this.show_list_app_from_data();
            }
        }else{
            this.carrot.get_list_doc("app",this.get_data_app_done);
        }
    }

    get_data_app_done(apps,carrot){
        carrot.log("Get app data from sever");
        carrot.app.obj_app=apps;
        carrot.app.save_obj();
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
        if(this.obj_app!=null)
            this.carrot.home();
        else
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
        var html="<div class='box_app "+s_class+"' id=\""+data_app.id+"\" key_search=\""+data_app[key_name]+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                    html+='<div role="button" class="img-cover pe-0 col-3 app_icon" app_id="'+data_app.id+'"><img class="rounded" src="'+s_url_icon+'" alt="'+data_app[key_name]+'"></div>';
                    html+='<div class="det mt-2 col-9">';
                        html+="<h5 class='mb-0 fs-6'>"+data_app[key_name]+"</h5>";
                        html+="<span class='fs-8'>"+data_app.name_en+"</span>";
    
                        html+='<ul class="row">';
                            html+='<li class="col-8 ratfac">';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                            html+='</li>';
                            if(data_app.type=="app")
                                html+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-mobile"></i></span></li>';
                            else
                                html+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-gamepad"></i></span></li>';
                        html+='</ul>';

                        if(this.carrot.link_store.list_link_store!=null){
                            var html_store_link="";
                            $(this.carrot.link_store.list_link_store).each(function(index,store){
                                if(data_app[store.key]!=null){
                                    var link_store_app=data_app[store.key];
                                    if(link_store_app!='') html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                }
                            });
                            if(html_store_link!="") html+="<div class='row'><div class='col-12'>"+html_store_link+"</div></div>";
                        }
    
                        html+=this.carrot.btn_dev("app",data_app.id);
    
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        html+="</div>";
        return html;
    }

    show_list_app(list_app){
        var html="";
        var carrot=this.carrot;
        html+='<div id="all_app" class="row m-0">';
        $(list_app).each(function(index,data_app) {
            html+=carrot.app.box_app_item(data_app,'col-md-4 mb-3');
        });
        html+="</div>";

        if(this.type_show=="all"){
            carrot.load_bar();
            html+=carrot.link_store.list_for_home();
        }
        carrot.show(html);
        this.check_btn_for_list_app();
    }

    show_app_by_id(id_box_app,carrot){
        carrot.log("Show app by id:"+id_box_app,"info");
        if(carrot.check_ver_cur("app")){
            if(carrot.app.obj_app==null){
                carrot.log("Load info app "+id_box_app+" from sever","warning");
                carrot.get_doc("app",id_box_app,carrot.app.show_app_info);
            }else{
                if(carrot.app.obj_app[id_box_app]==null){
                    carrot.log("Load info app "+id_box_app+" from sever","warning");
                    carrot.get_doc("app",id_box_app,carrot.app.show_app_info);
                }else{
                    carrot.log("Load info app "+id_box_app+" from cache","success");
                    var data_app=JSON.parse(carrot.app.obj_app[id_box_app]);
                    carrot.app.show_app_info(data_app,carrot);
                }
            }
        }else{
            carrot.get_doc("app",id_box_app,carrot.app.show_app_info);
        }
    }

    show_app_info(data,carrot){
        if(data==null) $.MessageBox(carrot.l("no_obj"));
        carrot.change_title_page(data.name_en,"?p=app&id="+data.id,"app");
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

                        if(carrot.link_store.list_link_store!=null){
                            var html_store_link="";
                            var html_store_link_lager="";
                            $(carrot.link_store.list_link_store).each(function(index,store){
                                if(data[store.key]!=null){
                                    var link_store_app=data[store.key];
                                    if(link_store_app.trim()!=""){
                                        html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                        html_store_link_lager+="<a title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><img class='m-1' style='width:100px' src='"+store.img+"'></a> ";
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
                                var effect_font=["fa-fade", "fa-beat-fade", "fa-bounce", "fa-shake", "fa-flip"];
                                var effect_random = Math.floor(Math.random() * effect_font.length);
                                html+='<p>Thanh <i class="fa-solid fa-heart '+effect_font[effect_random]+'" style="color: #ff0000;"></i> Nhung</p>';
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

                if(data["img1"]!=""&&data["img1"]!=undefined){
                    html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="screenshots">Screenshots</h4>';
                        html+='<div class="owl-carousel owl-theme">';
                        for(var i=1;i<=8;i++){
                            var key_img_data="img"+i;
                            if(data[key_img_data]!=""&&data[key_img_data]!=undefined) html+='<img src="'+data[key_img_data]+'"/>';
                        }
                        html+='</div>';
                    html+='</div>';
                }
    
                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="describe">About this Game</h4>';
                    html+='<p class="fs-8 text-justify">'+data["describe_"+carrot.lang]+'</p>';
                html+='</div>';

                if(data.youtube_link!=null){
                    var id_ytb=this.carrot.player_media.get_youtube_id(data.youtube_link);
                    html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                        html+='<h4 class="fw-semi fs-5 lang" key_lang="intro_video">Intro video</h4>';
                        html+='<iframe width="100%" height="360" src="https://www.youtube.com/embed/'+id_ytb+'" title="'+data.name_en+'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
                    html+='</div>';
                }

                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<div class="col-md-4 text-center">';
                        html+='<h4 class="fw-semi fs-5 lang" key_lang="qr_code">QR Code</h4>';
                        html+='<div id="qr_cdoe" class="rounded m-1"></div>';
                        html+='<small class="m-1">Use other devices capable of scanning and recognizing qr code barcodes to continue using the current link</small>';
                    html+='</div>';

                    html+='<div class="col-md-8">';
                        html+='<h4 class="fw-semi fs-5" key_lang="qr_code">Other Link</h4>';
                        if(carrot.link_store.list_link_store!=null){
                            html+='<table class="table table-striped">';
                            $(carrot.link_store.list_link_store).each(function(index,store){
                                if(data[store.key]!=null){
                                    var link_store_app=data[store.key];
                                    if(link_store_app.trim()!=""){
                                        html+='<tr>';
                                            html+='<td>';
                                                html+='<i class="'+store.icon+'"></i>';
                                            html+='</td>';
                                            html+='<td>';
                                                html+=store.name;
                                            html+='</td>';
                                            html+='<td class="fs-6">';
                                                html+='<a class="link_app" title="'+store.name+'" target="_blank" href="'+link_store_app+'">'+link_store_app+'</a>';
                                            html+='</td>';
                                        html+='</tr>';
                                    }
                                }
                            });
                            html+='</table>';
                        }
                    html+='</div>';
                html+='</div>';

                html+=carrot.rate.box_comment(data);

            html+="</div>";
    
            html+='<div class="col-md-4">';
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_apps">Related Apps</h4>';
            
            var list_app=carrot.convert_obj_to_list(carrot.app.obj_app);
            list_app= list_app.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            $(list_app).each(function(index,app_item){
                if(index<12) if(data.type==app_item.type&&data.id!=app_item.id) html+=carrot.app.box_app_item(app_item,'col-md-12 mb-3');
            });
            html+='</div>';
    
        html+="</div>";
        html+="</div>";

        html+=carrot.app.list_for_home();
        carrot.app.type_show="all";
        carrot.show(html);
        carrot.app.check_btn_for_list_app();
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
            // modes
            // 0: normal
            // 1: label strip
            // 2: label box
            // 3: image strip
            // 4: image box
            mode:  0,
            mSize: 0.1,
            mPosX: 0.5,
            mPosY: 0.5,
            label: 'no label',
            fontname: 'sans',
            fontcolor: '#000',
        
            image: null
        });
    }

    check_btn_for_list_app(){
        var carrot=this.carrot;
        $(".app_icon").click(async function(){
            var id_box_app = $(this).attr("app_id");
            carrot.app.show_app_by_id(id_box_app,carrot);
        });
        $(".owl-carousel").owlCarousel();
        carrot.check_event();
    }

    add(){
        var new_data_app=new Object();
        new_data_app["icon"]="";
        new_data_app["type"]="";
        $(this.carrot.langs.list_lang).each(function(index,lang){
            new_data_app["name_"+lang.key]="";
            new_data_app["describe_"+lang.key]="";
        });
        new_data_app["youtube_link"]="";
        new_data_app["google_play"]="";
        new_data_app["amazon_app_store"]="";
        new_data_app["microsoft_store"]="";
        new_data_app["uptodown"]="";
        new_data_app["itch"]="";
        $(this.carrot.link_store.list_link_store).each(function(index,store){
            var key_val=store.key;
            new_data_app[key_val]="";
        });
        new_data_app["img1"]="";
        new_data_app["img2"]="";
        new_data_app["img3"]="";
        new_data_app["img4"]="";
        new_data_app["img5"]="";
        this.frm_add_or_edit(new_data_app).set_title("Add App").set_msg_done("Add app success!").set_type("add").show();
    }

    edit(data,carrot){
        carrot.app.frm_add_or_edit(data).set_title("Edit App").set_msg_done("Edit app success!").set_type("update").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_app",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("app","name_en");
        var list_lang=this.carrot.langs.list_lang;
        frm.create_field("icon").set_label("Icon").set_value(data.icon).set_type("file").set_type_file("image/*");
        frm.create_field("type").set_label("Type").add_option("app","App").add_option("game","Game").set_value(data.type).set_type("select");
        $(list_lang).each(function(index,lang){
            var key_name_lang="name_"+lang.key;
            var key_describe_lang="describe_"+lang.key;
            var img_tag='<img src="'+lang.icon+'" style="width:20px;"/>';
            var field_name=frm.create_field("name_"+lang.key).set_label(img_tag+" Name ("+lang.key+")").set_value(data[key_name_lang]);
            if(lang.key=="en") field_name.set_main();
            frm.create_field("describe_"+lang.key).set_label("Describe ("+lang.key+")").set_value(data[key_describe_lang]).set_type("textarea");
            frm.create_field("hr").set_type("line");
        });
        frm.create_field("youtube_link").set_label("Youtube link").set_type("link").set_value(data.youtube_link);
        $(this.carrot.link_store.list_link_store).each(function(index,store){
            var key_val=store.key;
            frm.create_field(store.key).set_label("<i class='"+store.icon+"'></i> "+store.name).set_value(data[key_val]);
        });
        frm.create_field("img1").set_label("Image Describe 1").set_type("file").set_value(data.img1).set_type_file("image/*");
        frm.create_field("img2").set_label("Image Describe 2").set_type("file").set_value(data.img2).set_type_file("image/*");
        frm.create_field("img3").set_label("Image Describe 3").set_type("file").set_value(data.img3).set_type_file("image/*");
        frm.create_field("img4").set_label("Image Describe 4").set_type("file").set_value(data.img4).set_type_file("image/*");
        frm.create_field("img5").set_label("Image Describe 5").set_type("file").set_value(data.img5).set_type_file("image/*");
        return frm;
    }

    reload(carrot){
        carrot.app.delete_obj_app();
        carrot.app.show_list_app_and_game("all");
    }

    list_for_home(){
        var list_app=this.carrot.obj_to_array(this.obj_app);
        var html='';
        list_app=list_app.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
        html+='<div class="row">';
        for(var i=0;i<12;i++){
            var app=list_app[i];
            html+=this.box_app_item(app);
        }
        html+='</div>';
        html+=carrot.link_store.list_for_home();
        return html;
    }

    site_map(){
        var xml='';
        this.carrot.db.collection("app").get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                querySnapshot.forEach((doc) => {
                    let today = new Date().toISOString().slice(0, 10);
                    xml+='<url>';
                    xml+='<loc>https://carrotstore.web.app/?p=app&id='+doc.id+'</loc>';
                    xml+='<lastmod>'+today+'</lastmod>';
                    xml+='<changefreq>daily</changefreq>';
                    xml+='<priority>0.9</priority>';
                    xml+='</url>';
                });
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
        });
        return xml;
    }
}