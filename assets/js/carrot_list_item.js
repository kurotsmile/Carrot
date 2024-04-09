class Carrot_List_Item{
    id;
    index;
    icon_img=null;
    icon_font="fa-solid fa-star-of-life";
    carrot;
    name;
    tip=null;
    body=null;
    class="col-md-4 mb-3";
    class_icon="pe-0 col-3";
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
    }

    set_class_icon(s_class){
        this.class_icon=s_class;
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
            s_htm_act_click='onclick="carrot.get_doc(\''+this.db_collection+'\',\''+this.id+'\','+this.s_act_click+')"';
        }

        var html="<div class='box_app "+this.class+"' id=\""+this.id+"\" key_search=\""+this.name+"\" data-sort='"+this.index+"'>";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
            html+='<div class="row">';
                if(this.icon_img!=null) 
                    html+='<div role="button" '+s_htm_act_click+' class="img-cover '+this.class_icon+' '+this.db_collection+'_icon" db_collection="'+this.db_collection+'" app_id="'+this.id+'"  obj_id="'+this.id+'" obj_index="'+this.index+'"><img class="rounded" src="'+this.icon_img+'" alt="'+this.name+'"></div>';
                else 
                    html+='<div class="pe-0 col-1 text-center"><i role="button" '+s_htm_act_click+' class="'+this.icon_font+' fa-2x" obj_id="'+this.id+'" obj_index="'+this.index+'"></i></div>';

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