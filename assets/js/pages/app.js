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
            console.log(store);
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
        $("#all_app_contain").html('<div class="col-12 text-center"><i class="fa-solid fa-spinner fa-3x fa-spin"></i></div>');
        if(this.objs!=null){
            $("#all_app_contain").html('');

            $(carrot.convert_obj_to_list_array(carrot.appp.objs)).each(function(index,data){
                if(index>=12) return false;
                $("#all_app_contain").append(carrot.appp.box_app_item(data));
            });
        }
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
        var html="<div class='box_app "+s_class+"' id=\""+data_app.id+"\" key_search=\""+data_app[key_name]+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                    html+='<div role="button" class="img-cover pe-0 col-3 app_icon" app_id="'+data_app.id+'"><img id="icon_app_'+data_app.index+'" class="rounded" src="images/150.png" alt="'+data_app[key_name]+'"></div>';
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

                        if(carrot.appp.link_store!=null){
                            var html_store_link="";
                            $(carrot.appp.link_store).each(function(index,store){
                                if(data_app[store.key]!=null){
                                    var link_store_app=data_app[store.key];
                                    if(link_store_app!='') html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                }
                            });
                            if(html_store_link!="") html+="<div class='row'><div class='col-12'>"+html_store_link+"</div></div>";
                        }
    
                        html+=carrot.btn_dev("app",data_app.id);
    
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        html+="</div>";
        return html;
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