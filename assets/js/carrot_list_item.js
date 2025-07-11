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
        this.id_icon=id_icon;
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
                    html+='<div role="button" '+s_htm_act_click+' class="img-cover '+this.class_icon+' '+this.db_collection+'_icon" db_collection="'+this.db_collection+'" app_id="'+this.id+'"  obj_id="'+this.id+'" obj_index="'+this.index+'"><img  class="rounded '+this.id_icon+'" src="'+this.icon_img+'" alt="'+this.name+'"></div>';
                else 
                    html+='<div class="pe-0 '+this.class_icon_col+' text-center"><i id="'+this.id_icon+'" role="button" '+s_htm_act_click+' class="'+this.icon_font+' fa-2x" obj_id="'+this.id+'" obj_index="'+this.index+'"></i></div>';

                html+='<div class="det '+ this.class_body+'">';
                    if(carrot.tool.alive(this.name)) html+="<h5 class='mb-0 fs-6 mt-0'>"+this.name+"</h5>";
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
    s_icon_col_class="col-md-4";
    s_obj_js="";
    s_protocol_url="";

    s_header_left_content="";
    s_header_right_content="";

    s_db="";
    list_attr=[];
    list_body=[];
    list_related=[];
    list_contain=[];
    list_footer=[];
    list_btn=[];
    is_show_qr=true;
    is_show_app_tip=true;

    constructor(s_id){
        this.id=s_id;
    }

    set_title(s_title){
        this.name=s_title;
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

    set_icon_img(url){
        this.set_icon_image(url);
    }

    set_icon_id(id){
        this.s_icon_id=id;
    }

    set_id_icon(id){
        this.s_icon_id=id;
    }

    set_icon_col_class(s_class){
        this.s_icon_col_class=s_class;
    }
    
    set_db(s_name_db){
        this.s_db=s_name_db;
    }

    set_obj_js(obj_js){
        this.s_obj_js=obj_js;
    }

    set_protocol_url(url){
        this.s_protocol_url=url;
    }

    set_header_left(content){
        this.s_header_left_content=content;
    }

    set_header_right(content){
        this.s_header_right_content=content;
    }

    add_btn(id,icon,label,act_click,type='btn'){
        var btn_head={};
        btn_head["id"]=id;
        btn_head["icon"]=icon;
        btn_head["label"]=label;
        btn_head["act"]=act_click;
        btn_head["type"]=type;
        this.list_btn.push(btn_head);
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

    add_attr(s_icon_font,s_name,s_val){
        this.add_attrs(s_icon_font,s_name,s_val);
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

    add_footer(footer){
        this.list_footer.push(footer);
    }

    off_qr(){
        this.is_show_qr=false;
    }

    off_app_tip(){
        this.is_show_app_tip=false;
    }

    html(){
        var html='<div class="section-container p-2 p-xl-2 pt-0">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';

                    html+='<div class="'+this.s_icon_col_class+' p-3 text-center">';
                        if(this.s_icon_image!="") html+='<img class="w-100 '+this.s_icon_id+'" src="'+this.s_icon_image+'" alt="Info Icon">';
                        if(this.s_icon_font!="") html+='<i class="w-100 '+this.s_icon_font+' fa-5x" id="'+this.s_icon_id+'" alt="Info Icon"></i>';
                        if(this.s_header_left_content!="") html+=this.s_header_left_content;
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
                            if(this.s_protocol_url!="") html+='<a href="'+this.s_protocol_url+'" id="register_protocol_url" type="button"  class="btn d-inline btn-success m-1"><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </a>';
                            $(this.list_btn).each(function(index,btn){
                                if(btn.type=="btn")
                                    html+=' <button id="'+btn["id"]+'" index="'+index+'" onclick="'+btn["act"]+'" type="button" class="btn d-inline btn-success m-1"><i class="'+btn["icon"]+'"></i> '+btn["label"]+'</button>';
                                else
                                    html+=' <a id="'+btn["id"]+'" target="_blank" index="'+index+'" href="'+btn["act"]+'" type="button" class="btn d-inline btn-success m-1"><i class="'+btn["icon"]+'"></i> '+btn["label"]+'</a>';
                            });
                            html+='</div>';
                        html+='</div>';
                        
                        if(this.s_header_right_content!="") html+=this.s_header_right_content;

                    html+='</div>';
                html+="</div>";

                $(this.list_body).each(function(index,data){
                    html+='<div index="'+index+'" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                        html+='<h4>'+data.title+'</h4>';
                        html+='<p class="fs-8 text-justify" style="white-space: pre-line;">'+data.body+'</p>';
                    html+='</div>';
                });

                $(this.list_contain).each(function(index,data){html+=data;});

                if(this.is_show_qr) html+=carrot.tool.box_qr();
                if(this.is_show_app_tip){
                    html+='<div id="app_tip"></div>';
                }
            html+="</div>";
    
            html+='<div class="col-md-4" id="box_related_contain">';
                html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3"><i class="fa-solid fa-dice-d6"></i> <l class="lang" key_lang="same_category">Same Category</l></h4>';
                html+='<div class="row" id="box_related">';
                $(this.list_related).each(function(index,data){
                    html+=data;
                }); 
                html+='</div>';
            html+='</div>';
        
        html+="</div>";
        html+="</div>";

        html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
        html+='<i class="fa-solid fa-boxes-stacked fs-6 me-2"></i> <l class="lang" key_lang="other_category">Other Category</l>';
        html+='<span role="button" onclick="carrot.'+this.s_obj_js+'.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
        html+='<div class="row" id="box_footer">';
                if(this.list_footer.length>0){
                    $(this.list_footer).each(function(index,footer){
                        html+=footer;
                    });
                }
        html+='</div>';
        return html;
    }
}