class Carrot_List_Item{
    id;
    icon_img=null;
    icon_font="fa-solid fa-star-of-life";
    carrot;
    name;
    tip;
    body=null;
    class="col-md-4 mb-3";
    class_icon="pe-0 col-3";
    db_collection=null;
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
    }

    set_db(db_collection){
        this.set_db_collection(db_collection);
    }

    set_class(s_class){
        this.class=s_class;
    }

    set_class_icon(s_class){
        this.class_icon=s_class;
    }

    html(){
        var html='';
        var html="<div class='box_app "+this.class+"' id=\""+this.id+"\" key_search=\""+this.name+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
            html+='<div class="row">';
                if(this.icon_img!=null) html+='<div role="button" class="img-cover '+this.class_icon+' app_icon" app_id="'+this.id+'"><img class="rounded" src="'+this.icon_img+'" alt="'+this.name+'"></div>';
                else html+='<div class="pe-0 col-1 text-center"><i class="'+this.icon_font+' fa-2x"></i></div>';
                    html+='<div class="det mt-2 col-11">';
                    html+="<h5 class='mb-0 fs-6'>"+this.name+"</h5>";
                        html+="<span class='fs-8'>"+this.tip+"</span>"; 
                        if(this.body!=null){
                            html+="<div class='row'>";
                            html+=this.body;
                            tml+="</div>";
                        }
                        if(this.db_collection!=null)html+=this.carrot.btn_dev(this.db_collection,this.id);
                        html+="</div>";
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        return html;
    }
}