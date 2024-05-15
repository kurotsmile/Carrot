class Appp{
    
    objs=null;
    link_store=null;
    status_view='publish';
    type_view='all';

    show(){
        if(carrot.check_ver_cur("link_store")==false){
            carrot.data.clear("stores");
            carrot.log("Get link store new version "+carrot.get_ver_cur("link_store"));
            carrot.update_new_ver_cur("link_store",true);
            this.get_data_link_store(carrot.appp.act_get_data_link_store_done);
        }else{
            carrot.data.list("stores").then((data)=>{
                this.link_store=data;
                this.show_all();
            }).catch(()=>{
                this.get_data_link_store(carrot.appp.act_get_data_link_store_done);
            });
        }
    }
    
    back_show_all(){
        carrot.change_title_page(carrot.l("app","App and Game"),"?page=app","appp");
        carrot.appp.show();
    }

    list(){
        carrot.appp.type_view='all';
        carrot.data.clear("apps");
        carrot.data.clear("app_info");
        carrot.appp.get_data(carrot.appp.load_list_app_by_array);
    }

    show_all(){
        var id_app=carrot.get_param_url("id");
        if(id_app!=undefined){
            id_app=decodeURI(id_app);
            carrot.appp.show_app_by_id(id_app);
        }else{
            carrot.loading("Get data app and game");
            this.type_view="all";
            carrot.appp.get_data(carrot.appp.act_get_data_app_done);
        }
    }

    show_app(){
        this.type_view="app";
        carrot.appp.get_data(carrot.appp.act_get_data_app_done);
    }

    show_game(){
        this.type_view="game";
        carrot.appp.get_data(carrot.appp.act_get_data_app_done);
    }

    show_app_publish(){
        this.type_view="all";
        this.status_view="publish";
        carrot.appp.get_data_from_server(carrot.appp.act_get_data_app_done);
    }

    show_app_draft(){
        this.type_view="all";
        this.status_view="draft";
        carrot.appp.get_data_from_server(carrot.appp.act_get_data_app_done);
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
            $(carrot.random(stores)).each(function(index,s){
                s["index"]=index;
                $("#all_store_contain").append(carrot.appp.box_store_item(s));
            });
            carrot.appp.link_store=stores;
            carrot.data.list("apps").then((data)=>{
                $("#all_app_contain").html('');
                var list_app=carrot.random(data);
                $(list_app).each(function(index,app){
                    if(index>=12) return false;
                    app["index"]=index;
                    $("#all_app_contain").append(carrot.appp.box_item(app).html());
                });
                carrot.appp.check_event();
            },()=>{
                carrot.appp.get_data(carrot.appp.act_get_data_app_done_home);
            });
        }).catch(()=>{
            this.get_data_link_store(carrot.appp.act_get_data_link_store_done_home);
        })
    }

    act_get_data_link_store_done_home(stores){
        carrot.hide_loading();
        $("#all_store_contain").html('');
        $(carrot.random(stores)).each(function(index,s){
            carrot.data.add("stores",s);
            s["index"]=index;
            $("#all_store_contain").append(carrot.appp.box_store_item(s));
        });
        carrot.appp.link_store=stores;
        carrot.appp.get_data(carrot.appp.act_get_data_app_done_home);
    }

    act_get_data_app_done_home(data){
        carrot.hide_loading();
        $("#all_app_contain").html('');
        $(data).each(function(index,app){
            app["index"]=index;
            carrot.data.add("apps",app);
        });

        var list_app=carrot.random(data);
        $(list_app).each(function(index,app){
            if(index>=12) return false;
            app["index"]=index;
            $("#all_app_contain").append(carrot.appp.box_item(app).html());
        });
        carrot.appp.check_event();
    }

    get_data_link_store(act_done){
        carrot.loading("Get data link store");
        var q=new Carrot_Query("link_store");
        q.get_data(act_done);
    }

    act_get_data_link_store_done(data){
        $(data).each(function(index,store){
            carrot.data.add("stores",store);
        });
        carrot.appp.link_store=data;
        carrot.appp.show_all();
    }

    get_data(act_done){
        if(carrot.check_ver_cur("app")==false){
            carrot.data.clear("apps");
            carrot.data.clear("app_info");
            carrot.log("Get data app new version "+carrot.get_ver_cur("app"));
            carrot.appp.get_data_from_server(act_done);
            carrot.update_new_ver_cur("app",true);
        }else{
            carrot.data.list("apps").then((data)=>{
                act_done(data);
            }).catch(()=>{
                carrot.appp.get_data_from_server(act_done);
            });
        }
    }

    get_data_from_server(act_done){
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
        q.get_data(act_done);
    }

    act_get_data_app_done(data){
        carrot.appp.objs=data;
        $(data).each(function(index,data_app){
            data_app["index"]=index;
            carrot.data.add("apps",data_app);
        });
        carrot.appp.load_list_app_by_array(data);
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
            if(carrot.appp.status_view==array_app[i].status) $("#all_app").append(carrot.appp.box_item(array_app[i]).html());
        }
        carrot.appp.check_event();
    }

    check_event(){
        $(".owl-carousel").owlCarousel();
        if(carrot.appp.type_view=='all') carrot.tool.list_other_and_footer("appp");
        else carrot.tool.list_other_and_footer("appp",'type',carrot.appp.type_view);
        carrot.check_event();
    }

    add(){
        var new_data_app=new Object();
        new_data_app["icon"]="";
        new_data_app["type"]="";
        $(carrot.langs.list_lang).each(function(index,lang){
            new_data_app["name_"+lang.key]="";
            new_data_app["describe_"+lang.key]="";
        });
        new_data_app["youtube_link"]="";
        $(carrot.appp.link_store).each(function(index,store){
            var key_val=store.key;
            new_data_app[key_val]="";
        });
        new_data_app["img1"]="";
        new_data_app["img2"]="";
        new_data_app["img3"]="";
        new_data_app["img4"]="";
        new_data_app["img5"]="";
        new_data_app["status"]="";
        new_data_app["data_extension"]="";
        this.frm_add_or_edit(new_data_app).set_title("Add App").set_msg_done("Add app success!").set_type("add").show();
    }

    edit(data,carrot){
        carrot.appp.frm_add_or_edit(data).set_title("Edit App").set_msg_done("Edit app success!").set_type("update").show();
    } 

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_app",carrot);
        frm.set_icon("fa-solid fa-mobile-button");
        frm.set_collection("app");
        frm.set_document("name_en");
        var list_lang=carrot.langs.list_lang;
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
        $(carrot.appp.link_store).each(function(index,store){
            store["index"]=index;
            var key_val=store.key;
            frm.create_field(store.key).set_label("<i class='"+store.icon+"'></i> "+store.name).set_value(data[key_val]);
        });
        frm.create_field("img1").set_label("Image Describe 1").set_type("file").set_value(data.img1).set_type_file("image/*");
        frm.create_field("img2").set_label("Image Describe 2").set_type("file").set_value(data.img2).set_type_file("image/*");
        frm.create_field("img3").set_label("Image Describe 3").set_type("file").set_value(data.img3).set_type_file("image/*");
        frm.create_field("img4").set_label("Image Describe 4").set_type("file").set_value(data.img4).set_type_file("image/*");
        frm.create_field("img5").set_label("Image Describe 5").set_type("file").set_value(data.img5).set_type_file("image/*");
        var field_status=frm.create_field("status").set_label("Status").set_value(data.status).set_type("select");
        field_status.add_option("draft","Draft");
        field_status.add_option("publish","Publish");
        frm.create_field("hr2").set_type("line");
        var field_data_extension=frm.create_field("data_extension").set_label("Link Page Other").set_value(data['data_extension']);
        var btn_data=new Carrot_Btn();
        btn_data.set_icon("fa-solid fa-object-group");
        btn_data.set_act("alert('Thie ke data')");
        field_data_extension.add_btn(btn_data);
        return frm;
    }

    box_item(data_app){
        if(data_app==null) return '';
        var key_name="name_"+carrot.lang;
        carrot.data.load_image(data_app.id_doc,data_app.icon,"icon_app_"+data_app.id_doc.replace(/[\s!@#$%^&*()]/g, ''));
        var app_item=new Carrot_List_Item(carrot);
        app_item.set_icon("images/150.png");
        app_item.set_id(data_app.id_doc);
        app_item.set_id_icon("icon_app_"+data_app.id_doc.replace(/[\s!@#$%^&*()]/g, ''));
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
            html_body+='<li class="col-4 btn" onclick="carrot.appp.show_app();"><span class="text-secondary float-end"><i class="fa-solid fa-mobile"></i></span></li>';
        else
            html_body+='<li class="col-4 btn" onclick="carrot.appp.show_game();"><span class="text-secondary float-end"><i class="fa-solid fa-gamepad"></i></span></li>';
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
        app_item.set_class('col-md-4 mb-3');
        app_item.set_id(data_app.id_doc);
        app_item.set_db_collection("app");
        app_item.set_obj_js("appp");
        app_item.set_act_click("carrot.appp.show_app_by_id('"+data_app.id_doc+"')");
        return app_item;
    }

    add_link_store(){
        var data_new={};
        data_new["icon"]="";
        data_new["img"]="";
        data_new["key"]="";
        data_new["name"]="";
        data_new["link"]="";
        carrot.appp.frm_add_or_edit_link_store(data_new).set_title("Add Store").show();
    }

    edit_link_store(data,carrot){
        carrot.appp.frm_add_or_edit_link_store(data).set_title("Update Store").show();
    }

    frm_add_or_edit_link_store(data){
        var frm=new Carrot_Form("frm_link_store",carrot);
        frm.set_icon("fa-solid fa-store");
        frm.set_db("link_store","key");
        frm.create_field("key").set_label("Key").set_val(data["key"]);
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon (Font)").set_val(data["icon"]);
        frm.create_field("img").set_label("Image (Url)").set_val(data["img"]).set_type("file").set_type_file("image/*");
        frm.create_field("link").set_label("Link All App").set_val(data["link"]);
        return frm;
    }

    box_store_item(data){
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
        store_item.set_act_edit("appp.edit_link_store");
        store_item.set_act_click("carrot.appp.show_store_by_id('"+data.id_doc+"')");
        return store_item.html();
    }
    
    box_qr(data){
        var html='';
        html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html+='<div class="col-md-4 text-center">';
                html+='<h4 class="fw-semi fs-5 lang" key_lang="qr_code">QR Code</h4>';
                html+='<div id="qr_cdoe" class="rounded m-1"></div>';
                html+='<small class="m-1 lang" key_lang="qr_code_tip">Use other devices capable of scanning and recognizing qr code barcodes to continue using the current link</small>';
            html+='</div>';

            html+='<div class="col-md-8">';
                html+='<h4 class="fw-semi fs-5"><l class="lang" key_lang="other_store">Other Link</l></h4>';
                if(carrot.appp.link_store!=null){
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

    get(id,act_done){
        if(carrot.data.get("app_info",id,(data)=>{
            act_done(data);
        },()=>{
            carrot.server.get_doc("app",id,(data)=>{
                carrot.data.add("app_info",data);
                act_done(data);
            });
        })); 
    }

    show_app_by_id(id_app){
        carrot.loading("Get data app "+id_app);
        carrot.appp.get(id_app,carrot.appp.show_app_info);
    }

    menu(){
        var html='';
        var s_class='';
        html+='<div class="row mb-2">';
            html+='<div class="col-12">';
                html+='<div class="btn-group mr-2" role="group">';
                    if(this.type_view=='all') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_all();"><i class="fa-solid fa-table-list"></i> <l class="lang" key_lang="view_all">All</l></div>';
                    if(this.type_view=='app') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app();"><i class="fa-solid fa-mobile"></i> <l class="lang" key_lang="app">App</l></div>';
                    if(this.type_view=='game') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_game();"><i class="fa-solid fa-gamepad"></i> <l class="lang" key_lang="game">Game</l></div>';
                html+='</div>';
                html+=' <div class="btn-group" role="group">';
                    if(this.status_view=='publish') s_class='active'; else s_class='';
                    html+='<div class="btn dev btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app_publish();"><i class="fa-solid fa-van-shuttle"></i> Public App</div>';
                    if(this.status_view=='draft') s_class='active'; else s_class='';
                    html+='<div class="btn dev btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app_draft();"><i class="fa-solid fa-layer-group"></i> Draft App</div>';
                    html+=carrot.tool.btn_export("app");
                    html+='<div class="btn dev btn-sm btn-danger" onclick="carrot.appp.clear_all_data();"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</div>';
                html+='</div>';

                html+=' <div class="btn-group" role="group">';
                    if(this.type_view=="stores") s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_other_store();"><i class="fa-solid fa-store"></i> <l class="lang" key_lang="other_store">Other Store</l></div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    show_app_info(data){
        carrot.hide_loading();
        carrot.change_title_page(data.name_en,"/?page=app&id="+data.id_doc,"appp");
        carrot.data.load_image(data.id_doc,data.icon,"app_icon_info");
        carrot.appp.type_view=data.type;
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_icon_image("images/512.png");
        box_info.set_icon_id("app_icon_info")
        box_info.set_db("app");
        box_info.set_obj_js("appp");
        box_info.set_name(data.name_en);
        box_info.off_qr();

        $(carrot.appp.link_store).each(function(index,store){
            store["index"]=index;
            if(data[store.id_doc]!=undefined&&data[store.id_doc]!="") box_info.add_attrs(store.icon,store.name,"<a href='"+data[store.id_doc]+"' target='_blank'><img class='w-50' src='"+store.img+"'/></a>","");
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

        if(data["data_extension"]!=null){
            if(data["data_extension"]!="") box_info.add_btn('btn_extension_1','fa-solid fa-square-up-right',"Football","carrot.football.show()");
        }

        if(data["img1"]!=""&&data["img1"]!=undefined){
                var html_img='<div class="owl-carousel owl-theme">';
                for(var i=1;i<=8;i++){
                    var key_img_data="img"+i;
                    var id_img=key_img_data+"_"+data.id_doc.replace(/[^\w]/gi,'');
                    if(data[key_img_data]!=""&&data[key_img_data]!=undefined){
                        carrot.data.load_image(id_img,data[key_img_data],id_img);
                        html_img+='<img class="'+id_img+'" src="images/512.png"/>';
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
        carrot.appp.check_event();
    }

    box_app_tip(id){
        $("#app_tip").html(carrot.loading_html());
        carrot.appp.get(id,(data)=>{
            var html='';
            var name_loca='';
            if(data["name_"+carrot.lang]!=null) name_loca=data["name_"+carrot.lang];
            if(name_loca=='') name_loca=data.name_en;
            html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html+='<div class="col-md-3 text-center">';
                html+='<img id="icon_app_'+data_app.id_doc.replace(/[\s!@#$%^&*()]/g, '')+'" src="'+carrot.url()+'/images/150.png" class="w-100"/>';
            html+='</div>';

            html+='<div class="col-md-9">';
                html+='<h4 class="fw-semi fs-5">'+name_loca+'</h4>';
                html+='<h5 class="fw-semi fs-9">'+data.name_en+'</h5>';
                html+='<small class="m-1 lang" key_lang="app_tip">The above content is all included in this application, please download the corresponding application to explore and experience great features.</small>';
                html+='<div class="fs-9"><i class="fa-solid fa-link"></i> <b>Link</b> : '+carrot.url()+'?page=app&id='+id+'</div>';
                
                if(carrot.appp.link_store!=null){
                    var html_store_link="<br/>";
                    $(carrot.appp.link_store).each(function(index,store){
                        if(data[store.key]!=null){
                            var link_store_app=data[store.key];
                            if(link_store_app!='') html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                        }
                    });
                    html+=html_store_link+'<br/>';
                }

                html+='<button class="btn btn-success mt-2" onclick="carrot.appp.show_app_by_id(\''+id+'\')"><i class="fa-solid fa-square-up-right"></i> <l class="lang" key_lang="visit">visit</l></button>';
            html+='</div>';
            html+='</div>';
            $("#app_tip").html(html);
            carrot.data.load_image(data_app.id_doc,data_app.icon,"icon_app_"+data_app.id_doc.replace(/[\s!@#$%^&*()]/g, ''));
        });
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