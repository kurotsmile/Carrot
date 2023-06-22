class Carrot_Background{
    carrot;
    obj_background=null;

    constructor(carrot){
        this.carrot=carrot;
        var add_bk=this.carrot.menu.create("add_background").set_label("Add Background").set_type("add");
        $(add_bk).click(function(){carrot.background.show_box_add_or_edit_wallpaper(null);});
        var list_bk=this.carrot.menu.create("list_background").set_label("List Background").set_type("main").set_icon("fa-image fa-solid").set_lang("wallpaper");
        $(list_bk).click(function(){carrot.background.show_all_background()});
    }

    load_obj_background(){
        if (localStorage.getItem("obj_background") != null) this.obj_background=JSON.parse(localStorage.getItem("obj_background"));
    }

    save_obj_background(){
        localStorage.setItem("obj_background", JSON.stringify(this.obj_background));
    }

    delete_obj_background(){
        localStorage.removeItem("obj_background");
        this.obj_background=null;
    }

    show_all_background(){
        if(this.carrot.check_ver_cur("background")==false){
            this.carrot.log("Get list Background from sever and show");
            this.carrot.get_list_doc("background",this.carrot.background.act_done_get_data_list_background);
            this.carrot.update_new_ver_cur("background",true);
        }else{
            if(this.obj_background==null){
                this.carrot.log("Get list background from sever and show");
                this.carrot.get_list_doc("background",this.carrot.background.act_done_get_data_list_background);
            }
            else{
                this.carrot.log("Show all data background from cache!");
                this.show_list_background_from_data();
            }
        }
    }

    act_done_get_data_list_background(backgrounds,carrot){
        carrot.background.obj_background=backgrounds;
        carrot.background.save_obj_background();
        carrot.background.show_list_background_from_data();
    }

    show_list_background_from_data(){
        var carrot=this.carrot;
        var list_background=carrot.convert_obj_to_list(this.obj_background);
        var html="";
        html+='<div class="row m-0">';
        $(list_background).each(function(index,data) {
            html+="<div class='box_app col-md-3 mb-3' id=\""+data.id+"\"  key_search=\""+data.id+"\">";
                html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                        var url_background='';
                        if(data.icon!=null) url_background=data.icon;
                        if(url_background=="") url_background="images/avatar_default.png";
                        html+='<div class="img-cover"><img class="rounded" src="'+url_background+'" alt="'+data.id+'"></div>';
                        html+='<div class="det mt-2 col-9">';
                        html+="<h5 class='mb-0 fs-6'>"+data.id+"</h5>";
                        html+="</div>";
                        html+=carrot.btn_dev("background",data.id);
                html+="</div>";
                html+="</div>";
            html+="</div>";
        });
        html+="</div>";
        carrot.body.html(html);
        carrot.check_event();
    }
    
    show_box_add_or_edit_wallpaper(data_wallpaper){
        var s_title_box='';
        var carrot=this.carrot;
        if(data_wallpaper==null) s_title_box="<b>Add Wallpaper</b>";
        else s_title_box="<b>Update Wallpaper</b>";
    
        var obj_wallpaper = Object();
        obj_wallpaper["tip_wallpaper"] = { type: "caption", message: "Thông tin cơ bản" };
    
        if(data_wallpaper==null){
            data_wallpaper=Object();
            data_wallpaper["name"]='';
            data_wallpaper["icon"]='';
        }else{
            if(data_wallpaper["name"]=="") data_wallpaper["name"]=data_wallpaper["id"];
        }
        obj_wallpaper["name"]={'type':'input','defaultValue':data_wallpaper["name"], 'label':'Name'};
        obj_wallpaper["icon"]={'type':'input','defaultValue':data_wallpaper["icon"], 'label':'Icon (url)'};
    
        customer_field_for_db(obj_wallpaper,'background','name','Add wallpaper successfully');
    
        $.MessageBox({
            message: s_title_box,
            input: obj_wallpaper,
            top: "auto",
            buttonFail: "Cancel"
        }).done(carrot.act_done_add_or_edit);
    }
    

}