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
        });
    }
    
    back_show_all(){
        carrot.change_title_page("App and Game","?page=app","appp");
        carrot.appp.show();
    }

    show_all(){
        var id_app=carrot.get_param_url("id");
        if(id_app!=undefined){
            id_app=decodeURI(id_app);
            carrot.data.get("app_info",id_app,(data)=>{
                carrot.appp.show_app_info(data);
            },()=>{
                carrot.server.get_doc("app",id_app,carrot.appp.act_get_data_app_done);
            });
        }else{
            this.type_view="all";
            carrot.data.list("apps").then((data)=>{
                carrot.appp.load_list_app_by_array(data);
            }).catch(()=>{
                carrot.appp.get_data();
            });
        }
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
            store["index"]=index;
            html+=carrot.appp.box_store_item(store);
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
                carrot.appp.check_event();
            });
        });
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
        $(".owl-carousel").owlCarousel();
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
        app_item.set_act_click("carrot.appp.show_app_by_id('"+data_app.id_doc+"')");
        return app_item.html();
    }

    box_store_item(data){
        console.log(data.id_doc);
        carrot.data.load_image(data.id_doc,data.img,"store_icon_"+data.id_doc);
        var store_item=new Carrot_List_Item(carrot);
        store_item.set_id(data.id_doc);
        store_item.set_db("link_store");
        store_item.set_icon("images/298x168.jpg");
        store_item.set_id_icon("store_icon_"+data.id_doc);
        store_item.set_class_icon("col-md-12 mb-3 col-12 text-center");
        store_item.set_name(data.name);
        store_item.set_class("col-md-2 mb-2 col-sm-3");
        store_item.set_tip('<i class="'+data.icon+'"></i> '+data.id_doc);
        store_item.set_act_click("carrot.appp.show_store_by_id('"+data.id_doc+"')");
        return store_item.html();
    }

    box_qr(data){
        var html='';
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
                    $(carrot.appp.link_store).each(function(index,store){
                        store["index"]=index;
                        if(data[store.key]!=null){
                            var link_store_app=data[store.key];
                            if(link_store_app.trim()!=""){
                                html+='<tr>';
                                    html+='<td><i class="'+store.icon+'"></i></td>';
                                    html+='<td>'+store.name+'</td>';
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
        return html;
    }

    show_store_by_id(id_store){
        carrot.data.get("stores",id_store,(data)=>{
            window.open(data.link,'_blank');
        });
    }

    show_app_by_id(id_app){
        carrot.loading();
        if(carrot.data.get("app_info",id_app,(data)=>{
            carrot.appp.show_app_info(data);
        },()=>{
            carrot.server.get_doc("app",id_app,carrot.appp.act_get_data_info_app_done);
        })); 
    }

    act_get_data_info_app_done(data){
        carrot.data.add("app_info",data);
        carrot.appp.show_app_info(data);
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

    show_app_info(data){
        carrot.hide_loading();
        carrot.change_title_page(data.name_en,"/?page=app&id="+data.id_doc,"appp");
        carrot.data.load_image(data.id_doc,data.icon,"app_icon_info");
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_icon_image("images/512.png");
        box_info.set_icon_id("app_icon_info")
        box_info.set_db("app");
        box_info.set_name(data.name_en);

        $(carrot.appp.link_store).each(function(index,store){
            store["index"]=index;
            if(data[store.id_doc]!=undefined) box_info.add_attrs(store.icon,store.name,"<a href='"+data[store.id_doc]+"' target='_blank'><img class='w-50' src='"+store.img+"'/></a>","");
        });

        box_info.add_attrs("fa-sharp fa-solid fa-eye",carrot.l_html("count_view","Reviews"),"3.9k");
        box_info.add_attrs("fa-solid fa-download",carrot.l_html("count_download","Downloads"),"5M+");

        if(data.type=="game")
            box_info.add_attrs("fa-solid fa-gamepad","Game",carrot.l_html("game","Downloads"));
        else
            box_info.add_attrs("fa-solid fa-gamepad","Application",carrot.l_html("app","Application"));

        box_info.add_attrs("fa-solid fa-window-restore",carrot.l_html("ads_in_app","Contains Ads"),"Unity,Admob,Carrot");
        box_info.add_attrs("fa-solid fa-cart-shopping",carrot.l_html("in_app","In-app purchases"),"In-App");

        var effect_font=["fa-fade", "fa-beat-fade", "fa-bounce", "fa-shake", "fa-flip"];
        var effect_random = Math.floor(Math.random() * effect_font.length);
        box_info.add_attrs("fa-solid fa-user-group-simple",carrot.l_html("author","Author"),'<p>Thanh <i class="fa-solid fa-heart '+effect_font[effect_random]+'" style="color: #ff0000;"></i> Nhung</p>');

        if(data["img1"]!=""&&data["img1"]!=undefined){
                var html_img='<div class="owl-carousel owl-theme">';
                for(var i=1;i<=8;i++){
                    var key_img_data="img"+i;
                    var id_img=key_img_data+"_"+data.id_doc.replace(/[^\w]/gi,'');
                    if(data[key_img_data]!=""&&data[key_img_data]!=undefined){
                        carrot.data.load_image(id_img,data[key_img_data],id_img);
                        html_img+='<img id="'+id_img+'" src="images/512.png"/>';
                        var id_img=key_img_data+"_"+data.id_doc;
                    }
                }
                html_img+='</div>';
            box_info.add_body('<h4 class="fw-semi fs-5 lang" key_lang="screenshots">Screenshots</h4>',html_img);
        }

        box_info.add_body('<h4 class="fw-semi fs-5 lang" key_lang="describe">About this App</h4>',data["describe_"+carrot.lang]);

        if(data.youtube_link!=null&&data.youtube_link!=""){
            var id_ytb=carrot.player_media.get_youtube_id(data.youtube_link);
            var html_video='<iframe width="100%" height="360" src="https://www.youtube.com/embed/'+id_ytb+'" title="'+data.name_en+'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
            box_info.add_body('<h4 class="fw-semi fs-5 lang" key_lang="intro_video">Intro video</h4>',html_video);
        }

        box_info.add_contain(carrot.appp.box_qr(data));
        box_info.add_contain(carrot.rate.box_rank(data));
        box_info.add_contain(carrot.rate.box_comment(data));

        carrot.show(box_info.html());

        carrot.data.list("apps").then((apps)=>{
            apps=carrot.random(apps);
            $(apps).each(function(index,app){
                if(index>=12) return false;
                app["index"]=index;
                $("#box_related").append(carrot.appp.box_app_item(app,'col-md-12 mb-3'));
            })
        });
        carrot.appp.check_event();
    }

    clear_all_data(){
        carrot.type_view="all";
        carrot.status_view="publish";
        carrot.data.clear("apps");
        carrot.data.clear("stores");
        carrot.data.clear("images");
        carrot.data.clear("app_info");
        setTimeout(3000,()=>{carrot.appp.show();});
        carrot.msg("Delete all data app success!","success");
    }
}

var appp=new Appp();
carrot.appp=appp;
if(carrot.call_show_on_load_pagejs) carrot.appp.show();