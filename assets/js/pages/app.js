class app_carrot{
    
    objs=null;
    link_store=null;
    status_view='publish';
    type_view='all';

    show(){
        this.get_data_link_store();
    }
    
    show_all(){
        this.type_view="all";
        this.get_data();
    }

    show_app(){
        this.type_view="app";
        this.get_data();
    }

    show_game(){
        this.type_view="game";
        this.get_data();
    }

    show_app_publish(){
        this.status_view="publish";
        this.get_data();
    }

    show_app_draft(){
        this.status_view="draft";
        this.get_data();
    }

    get_data_link_store(){
        carrot.show_loading_page("Load all link store...");
        var q=new Carrot_Query("link_store");
        q.get_data(this.act_get_data_link_store_done);
    }

    act_get_data_link_store_done(data){
        carrot.appp.link_store=data;
        carrot.appp.show_all();
    }

    get_data(){
        carrot.show_loading_page("Load data "+this.type_view+"...");
        var q=new Carrot_Query("app");
        q.add_select("name_"+carrot.lang);
        q.add_select("name_en");
        q.add_select("icon");
        q.add_select("type");

        $(carrot.appp.link_store).each(function(index,store){
            q.add_select(store.key);
        });

        q.add_where("status",this.status_view);
        if(this.type_view!="all") q.add_where("type",this.type_view);
        q.get_data(this.act_get_data_app_done);
    }

    act_get_data_app_done(data){
        var html="";
        html+=carrot.appp.menu();
        html+='<div id="all_app" class="row m-0"></div>';
        carrot.show(html);

        $(data).each(function(index,data_app){
            data_app["index"]=index;
            $("#all_app").append(carrot.appp.box_app_item(data_app));
        });
        carrot.check_event();
    }

    box_app_item(data_app,s_class='col-md-4 mb-3'){
        if(data_app==null) return '';
        var key_name="name_"+carrot.lang;
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
        html+='<div class="row dev mb-2">';
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
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app_publish();"><i class="fa-solid fa-van-shuttle"></i> Public App</div>';
                    if(this.status_view=='draft') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.appp.show_app_draft();"><i class="fa-solid fa-layer-group"></i> Draft App</div>';
                    html+='<div class="btn btn-sm btn-danger" onclick="carrot.appp.clear_all_data();"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    clear_all_data(){
        carrot.type_view="all";
        carrot.status_view="publish";
        setTimeout(3000,()=>{carrot.appp.show();});
        carrot.msg("Delete all data app success!","success");
    }
}

var appp=new app_carrot();
carrot.appp=appp;
appp.show();