class Carrot_List_Item{
    id;
    icon=null;
    carrot;
    name;
    tip;
    class="col-md-4 mb-3";
    constructor(carrot){
        this.carrot=carrot;
    }

    set_id(id){
        this.id=id;
    }

    set_name(name){
        this.name=name;
    }

    set_icon(s_url){
        this.icon=s_url;
    }

    set_tip(tip){
        this.tip=tip;
    }

    html(){
        var html='';
        var html="<div class='box_app "+this.class+"' id=\""+this.id+"\" key_search=\""+this.name+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
            html+='<div class="row">';
                if(this.icon!=null) html+='<div role="button" class="img-cover pe-0 col-3 app_icon" app_id="'+this.id+'"><img class="rounded" src="'+this.icon+'" alt="'+this.name+'"></div>';
                else html+='<div class="pe-0 col-1 text-center"><i class="fa-sharp fa-solid fa-comment-dots fa-2x"></i></div>';
                    html+='<div class="det mt-2 col-11">';
                    html+="<h5 class='mb-0 fs-6'>"+this.name+"</h5>";
                        html+="<span class='fs-8'>"+this.tip+"</span>";
                            /*
                                html+='<ul class="row">';
                                html+='<li class="col-8 ratfac">';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                                html+='</li>';
                                html+='</ul>';
                            */
                        html+=this.carrot.btn_dev("app",this.id);
                        html+="</div>";
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        return html;
    }
}