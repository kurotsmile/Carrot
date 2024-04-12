class Appp{
    
    objs=null;
    link_store=null;
    status_view='publish';
    type_view='all';

    show(){
        carrot.data.list("stores").then((data)=>{
            this.link_store=data;
            this.show_all();
        }).catch(()=>{
            this.get_data_link_store();
        })
    }
    
    show_all(){
        this.type_view="all";
        carrot.data.list("apps").then((data)=>{
            carrot.appp.load_list_app_by_array(data);
        }).catch(()=>{
            carrot.appp.get_data();
        });
    }

    show_app(){
        this.type_view="app";
        carrot.data.list("apps").then((data)=>{
            carrot.appp.load_list_app_by_array(data);
        }).catch(()=>{
            carrot.appp.get_data();
        });
    }

    show_game(){
        this.type_view="game";
        carrot.data.list("apps").then((data)=>{
            carrot.appp.load_list_app_by_array(data);
        }).catch(()=>{
            carrot.appp.get_data();
        });
    }

    show_app_publish(){
        this.type_view="all";
        this.status_view="publish";
        carrot.appp.get_data();
    }

    show_app_draft(){
        this.type_view="all";
        this.status_view="draft";
        carrot.appp.get_data();
    }

    show_other_store(){
        this.type_view="stores";
        var html=this.menu();
        html+='<div id="all_app" class="row m-0">';
        $(this.link_store).each(function(index,store){
            var item_store=new Carrot_List_Item(carrot);
            item_store.set_icon_font(store.icon);
            item_store.set_class_icon_col("col-2");
            item_store.set_class_body("col-10");
            item_store.set_name(store.name);
            html+=item_store.html();
        });
        html+='</div>';
        carrot.show(html);
        this.check_event();
    }

    show_for_home(){
        carrot.data.list("stores").then((stores)=>{
            $("#all_store_contain").html('');
            $(stores).each(function(index,s){
                s["index"]=index;
                $("#all_store_contain").append(carrot.appp.box_store_item(s));
            });
            carrot.appp.link_store=stores;

            carrot.data.list("apps").then((data)=>{
                $("#all_app_contain").html('');
                $(data).each(function(index,app){
                    if(index>=12) return false;
                    app["index"]=index;
                    $("#all_app_contain").append(carrot.appp.box_app_item(app));
                });
            });
        });
        carrot.appp.check_event();
    }

    get_data_link_store(){
        carrot.loading("Get data link store");
        var q=new Carrot_Query("link_store");
        q.get_data(this.act_get_data_link_store_done);
    }

    act_get_data_link_store_done(data){
        $(data).each(function(index,store){
            carrot.data.add("stores",store);
        });
        carrot.appp.link_store=data;
        carrot.appp.show_all();
    }

    get_data(){
        carrot.loading("Get data app and game");
        var q=new Carrot_Query("app");
        q.add_select("name_"+carrot.lang);
        q.add_select("name_en");
        q.add_select("icon");
        q.add_select("type");
        q.add_select("status");

        $(carrot.appp.link_store).each(function(index,store){
            q.add_select(store.key);
        });

        q.add_where("status",this.status_view);
        if(this.type_view!="all") q.add_where("type",this.type_view);
        q.get_data(this.act_get_data_app_done);
    }

    act_get_data_app_done(data){
        carrot.appp.objs={};
        var array_app=[];
        $(data).each(function(index,data_app){
            data_app["index"]=index;
            carrot.appp.objs[data_app.id_doc]=data_app;
            carrot.data.add("apps",data_app);
            array_app.push(data_app);
        });
        carrot.appp.load_list_app_by_array(array_app);
    }

    load_list_app_by_array(array_app){
        carrot.change_title_page("App and Game","?page=app","appp");
        Swal.close();
        var html="";
        html+=carrot.appp.menu();
        html+='<div id="all_app" class="row m-0"></div>';
        carrot.show(html);

        for(var i=0;i<array_app.length;i++){
            if(carrot.appp.type_view!="all"){
                if(carrot.appp.type_view!=array_app[i].type) continue;
            }
            if(carrot.appp.status_view==array_app[i].status) $("#all_app").append(carrot.appp.box_app_item(array_app[i]));
        }
        carrot.appp.check_event();
    }

    check_event(){
        carrot.check_event();
    }

    box_app_item(data_app,s_class='col-md-4 mb-3'){
        if(data_app==null) return '';
        var key_name="name_"+carrot.lang;
        var s_url_icon="";
        if(data_app.icon!=null) s_url_icon=data_app.icon;
        if(s_url_icon=="") s_url_icon="images/150.png";
        
        carrot.data.load_image(data_app.id_doc,data_app.icon,"icon_app_"+data_app.index);
        var app_item=new Carrot_List_Item(carrot);
        app_item.set_icon("images/150.png");
        app_item.set_id_icon("icon_app_"+data_app.index);
        app_item.set_class_icon_col("col-3");
        app_item.set_class_body("col-9");
        app_item.set_name(data_app[key_name]);
        app_item.set_tip(data_app.name_en);

        var html_body='';
        html_body+='<ul class="row">';
            html_body+='<li class="col-8 ratfac">';
            html_body+='<i class="bi text-warning fa-solid fa-star"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-star"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-star"></i>';
            html_body+='<i class="bi text-warning fa-solid fa-star"></i>';
            html_body+='<i class="bi fa-solid fa-star"></i>';
        html_body+='</li>';

        if(data_app.type=="app")
            html_body+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-mobile"></i></span></li>';
        else
            html_body+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-gamepad"></i></span></li>';
        html_body+='</ul>';

        if(carrot.appp.link_store!=null){
            var html_store_link="";
            $(carrot.appp.link_store).each(function(index,store){
                if(data_app[store.key]!=null){
                    var link_store_app=data_app[store.key];
                    if(link_store_app!='') html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                }
            });
            html_body+="<div class='row'><div class='col-12'>"+html_store_link+"</div></div>";
        }

        app_item.set_body(html_body);
        app_item.set_class(s_class);
        app_item.set_id(data_app.id_doc);
        app_item.set_db_collection("app");
        app_item.set_act_click("carrot.appp.show_info(this)");
        return app_item.html();
    }

    box_store_item(data){
        var store_item=new Carrot_List_Item(carrot);
        store_item.set_icon("images/298x168.jpg");
        store_item.set_class_icon("col-md-12 mb-3 col-12 text-center");
        store_item.set_name(data.icon+" "+data.name);
        store_item.set_class("col-md-2 mb-2 col-sm-3");
        store_item.set_tip(data.id_doc);
        return store_item.html();
    }

    show_info(emp){
        var id_app=$(emp).attr("obj_id");
        carrot.server.get_doc("app",id_app,this.act_get_data_info_app_done);
    }

    act_get_data_info_app_done(data){
        carrot.data.add("app_info",data);
        carrot.appp.show_app_info(data,carrot);
    }

    menu(){
        var html='';
        var s_class='';
        html+='<div class="row mb-2">';
            html+='<div class="col-12">';
                html+='<div class="btn-group mr-2" role="group">';
                    if(this.type_view=='all') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_all();"><i class="fa-solid fa-table-list"></i> All</div>';
                    if(this.type_view=='app') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app();"><i class="fa-solid fa-mobile"></i> App</div>';
                    if(this.type_view=='game') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_game();"><i class="fa-solid fa-gamepad"></i> Game</div>';
                html+='</div>';
                html+=' <div class="btn-group" role="group">';
                    if(this.status_view=='publish') s_class='active'; else s_class='';
                    html+='<div class="btn dev btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app_publish();"><i class="fa-solid fa-van-shuttle"></i> Public App</div>';
                    if(this.status_view=='draft') s_class='active'; else s_class='';
                    html+='<div class="btn dev btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app_draft();"><i class="fa-solid fa-layer-group"></i> Draft App</div>';
                    html+='<div class="btn dev btn-sm btn-danger" onclick="carrot.appp.clear_all_data();"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</div>';
                html+='</div>';

                html+=' <div class="btn-group" role="group">';
                    if(this.type_view=="stores") s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_other_store();"><i class="fa-solid fa-store"></i> Other Store</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    show_app_info(data,carrot){
        carrot.app.obj_app_cur=data;
        if(data==null) $.MessageBox(carrot.l("no_obj"));
        carrot.change_title_page(data.name_en,"?page=app&id="+data.id_doc,"app");
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3">';
                        html+='<img class="w-100" src="'+data.icon+'" alt="'+data.name_en+'">';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data["name_"+carrot.lang]+'</h4>';

                        html+=carrot.btn_dev("app",data.id_doc);

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

                if(data.youtube_link!=null&&data.youtube_link!=""){
                    var id_ytb=carrot.player_media.get_youtube_id(data.youtube_link);
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
                            html+='<table class="table table-responsive table-striped">';
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
                                                html+='<a class="link_app text-break" title="'+store.name+'" target="_blank" href="'+link_store_app+'">'+link_store_app+'</a>';
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
                html+=carrot.rate.box_rank(data);

            html+="</div>";
    
            html+='<div class="col-md-4" id="box_related_app">';
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
        if(carrot.app.obj_app==null) carrot.app.get_list_related_apps();
    }


    clear_all_data(){
        carrot.type_view="all";
        carrot.status_view="publish";
        carrot.data.clear("apps");
        carrot.data.clear("stores");
        setTimeout(3000,()=>{carrot.appp.show();});
        carrot.msg("Delete all data app success!","success");
    }
}

var appp=new Appp();
carrot.appp=appp;
if(carrot.call_show_on_load_pagejs) carrot.appp.show();