class Carrot_List_Item{
    id;
    id_icon="";
    index;
    icon_img=null;
    icon_font="fa-solid fa-star-of-life";
    carrot;
    name;
    tip=null;
    body=null;
    class="col-md-4 mb-3";
    class_icon="pe-0 col-3";
    class_icon_col="col-1";
    class_body="mt-2 col-12";
    db_collection=null;
    obj_js=null;

    s_act_edit;
    s_act_click='';
    s_act_del;
    s_btn_dev_extra='';

    constructor(carrot){
        this.carrot=carrot;
    }

    set_body(body){
        this.body=body;
    }

    set_id(id){
        this.id=id;
    }

    set_id_icon(id_icon){
        this.id_icon='id="'+id_icon+'"';
    }

    set_name(name){
        this.name=name;
    }

    set_title(s_title){
        this.set_name(s_title);
    }

    set_label(s_label){
        this.set_name(s_label);
    }

    set_icon(s_url){
        this.icon_img=s_url;
    }

    set_icon_font(s_name_font){
        this.icon_font=s_name_font;
    }

    set_tip(tip){
        this.tip=tip;
    }

    set_db_collection(db_collection){
        this.db_collection=db_collection;
        if(this.obj_js==null) this.obj_js=db_collection;
    }

    set_db(db_collection){
        this.set_db_collection(db_collection);
    }

    set_obj_js(s_obj_call){
        this.obj_js=s_obj_call;
    }

    set_class(s_class){
        this.class=s_class;
        return this;
    }

    set_class_icon(s_class){
        this.class_icon=s_class;
    }

    set_class_icon_col(s_class){
        this.class_icon_col=s_class;
    }

    set_class_body(s_class){
        this.class_body=s_class;
    }

    set_index(index){
        this.index=index;
    }

    set_act_edit(s_fnc_edit){
        this.s_act_edit=s_fnc_edit;
    }

    set_act_click(s_fnc_click){
        this.s_act_click=s_fnc_click;
    }

    set_act_delete(s_fnc_del){
        this.s_act_del=s_fnc_del;
    }

    set_btn_dev_extra(html_extra){
        this.s_btn_dev_extra=html_extra;
    }

    html(){
        var s_htm_act_click='';

        if(this.s_act_click!=''){
            s_htm_act_click='onclick="'+this.s_act_click+'"';
        }

        var html="<div class='box_app "+this.class+"' id=\""+this.id+"\" key_search=\""+this.name+"\" data-sort='"+this.index+"'>";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
            html+='<div class="row">';
                if(this.icon_img!=null) 
                    html+='<div role="button" '+s_htm_act_click+' class="img-cover '+this.class_icon+' '+this.db_collection+'_icon" db_collection="'+this.db_collection+'" app_id="'+this.id+'"  obj_id="'+this.id+'" obj_index="'+this.index+'"><img '+this.id_icon+' class="rounded" src="'+this.icon_img+'" alt="'+this.name+'"></div>';
                else 
                    html+='<div class="pe-0 '+this.class_icon_col+' text-center"><i id="'+this.id_icon+'" role="button" '+s_htm_act_click+' class="'+this.icon_font+' fa-2x" obj_id="'+this.id+'" obj_index="'+this.index+'"></i></div>';

                html+='<div class="det '+ this.class_body+'">';
                    if(this.name!=undefined) html+="<h5 class='mb-0 fs-6 mt-0'>"+this.name+"</h5>";
                        if(this.tip!=null)html+="<span class='fs-8'>"+this.tip+"</span>"; 
                        if(this.body!=null){
                            html+="<div class='row'>";
                            html+=this.body;
                            html+="</div>";
                        }
                        if(this.db_collection!=null)html+=this.carrot.btn_dev(this.db_collection,this.id,this.obj_js,this.s_act_edit,this.s_act_del,this.s_btn_dev_extra);
                        html+="</div>";
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        return html;
    }
}

class Carrot_Info{

    id="";
    name="";

    s_icon_id="";
    s_icon_font="";
    s_icon_image="";
    s_related_title="";
    s_obj_js="";

    s_db="";
    list_attr=[];
    list_body=[];
    list_related=[];
    list_contain=[];

    constructor(s_id){
        this.id=s_id;
    }

    set_name(s_name){
        this.name=s_name;
    }

    set_icon_font(icon_font){
        this.s_icon_font=icon_font;
    }

    set_icon_image(url_image){
        this.s_icon_image=url_image;
    }

    set_icon_id(id){
        this.s_icon_id=id;
    }
    
    set_db(s_name_db){
        this.s_db=s_name_db;
    }

    set_obj_js(obj_js){
        this.s_obj_js=obj_js;
    }

    set_related_title(title){
        this.s_related_title=title;
    }

    add_related(data){
        this.list_related.push(data);
    }

    add_attrs(s_icon_font,s_name,s_val){
        var obj_attr={};
        obj_attr["icon"]=s_icon_font;
        obj_attr["name"]=s_name;
        obj_attr["value"]=s_val;
        this.list_attr.push(obj_attr);
    }

    add_body(s_title,s_body){
        var obj_box={};
        obj_box["title"]=s_title;
        obj_box["body"]=s_body;
        this.list_body.push(obj_box);
    }

    add_contain(contain){
        this.list_contain.push(contain);
    }

    html(){
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';

                    html+='<div class="col-md-4 p-3">';
                        if(this.s_icon_image!="") html+='<img class="w-100" id="'+this.s_icon_id+'" src="'+this.s_icon_image+'" alt="Info Icon">';
                    html+='</div>';

                    html+='<div class="col-md-8 p-2">';
                        if(this.name!="") html+='<h4 class="fw-semi fs-4 mb-3">'+this.name+'</h4>';
                        if(this.s_db!="") html+=carrot.btn_dev(this.s_db,this.id,this.s_obj_js);

                        if(this.list_attr.length>0){
                            html+='<div class="row">';
                            $(this.list_attr).each(function(index,data){
                                html+='<div index="'+index+'" class="col-md-4 col-6 text-center mb-2">';
                                    html+='<b>'+data.name+' <i class="'+data.icon+'"></i></b>';
                                    html+='<p>'+data.value+'</p>';
                                html+='</div>';
                            });
                            html+='</div>';
                        }

                        html+='<div class="row pt-4">';
                            html+='<div class="col-12 text-center">';
                            html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                            html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success"><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button>';
                            html+='</div>';
                        html+='</div>';

                    html+='</div>';
                html+="</div>";

                $(this.list_body).each(function(index,data){
                    html+='<div index="'+index+'" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                        html+='<h4>'+data.title+'</h4>';
                        html+='<p class="fs-8 text-justify">'+data.body+'</p>';
                    html+='</div>';
                });

                $(this.list_contain).each(function(index,data){html+=data;});

            html+="</div>";
    
            html+='<div class="col-md-4" id="box_related">';
                html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3">'+this.s_related_title+'</h4>';
                $(this.list_related).each(function(index,data){
                    data["index"]=index;
                    html+=data;
                });
            html+='</div>';
            

        html+="</div>";
        html+="</div>";

        return html;
    }
}