class app_carrot{
    
    objs=null;
    status_view='all';

    show(){
        carrot.show_loading_page();
        carrot.db.collection("app").where("status","==","publish").limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                var html="";
                html+=this.menu();
                html+='<div id="all_app" class="row m-0">';
                html+='</div>';
                carrot.show(html);

                this.objs=Object();
                querySnapshot.forEach((doc) => {
                    var data_app=doc.data();
                    data_app["id"]=doc.id;
                    this.objs[doc.id]=data_app;
                    $("#all_app").append(this.box_app_item(data_app));
                }); 
            }
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

                        if(carrot.link_store.list_link_store!=null){
                            var html_store_link="";
                            $(carrot.link_store.list_link_store).each(function(index,store){
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
            html+='<div class="col-md-12">';
                html+='<div class="btn-group" role="group">';
                    if(this.status_view=='all') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.app.get_all_data_app();"><i class="fa-solid fa-table-list"></i> All App</div>';
                    if(this.status_view=='publish') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.app.get_public_data_app();"><i class="fa-solid fa-van-shuttle"></i> Public App</div>';
                    if(this.status_view=='draft') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.app.get_draft_data_app();"><i class="fa-solid fa-layer-group"></i> Draft App</div>';
                    html+='<div class="btn btn-sm btn-danger" onclick="carrot.app.delete_all_data();"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }
}

var appp=new app_carrot();
carrot.appp=appp;
appp.show();