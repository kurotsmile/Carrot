class Carrot_Background{
    carrot;
    obj_background=null;
    icon="fa-image fa-solid";
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("background","carrot.background.show_all_background()","carrot.background.edit")
        var add_bk=this.carrot.menu.create("add_background").set_label("Add Background").set_icon(this.icon).set_type("add");
        $(add_bk).click(function(){carrot.background.add();});
        var list_bk=this.carrot.menu.create("list_background").set_label("List Background").set_type("main").set_icon(this.icon).set_lang("wallpaper");
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
        carrot.change_title_page("Background","?p=background","background");
        html+='<div class="row m-0">';
        $(list_background).each(function(index,data) {
            html+="<div class='box_app col-md-3 mb-3' id=\""+data.id+"\"  key_search=\""+data.id+"\">";
                html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                        var url_background='';
                        if(data.icon!=null) url_background=data.icon;
                        if(url_background=="") url_background="images/avatar_default.png";
                        html+='<div class="img-cover" style="height:500px;overflow-y: hidden;"><img class="rounded" src="'+url_background+'" alt="'+data.id+'"></div>';
                        html+='<div class="det mt-2 col-9">';
                        html+="<h5 class='mb-0 fs-6'>"+data.id+"</h5>";
                        if(data.buy=="0")
                            html+='<span class="text-success"><i class="fa-solid fa-file-arrow-down"></i> Free</span>';
                        else
                            html+='<span class="text-primary"><i class="fa-solid fa-cart-shopping"></i> Buy</span>';
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

    add(){
        var data_bk=new Object();
        data_bk["id"]=this.carrot.create_id();
        data_bk["name"]="";
        data_bk["icon"]="";
        this.add_or_edit(data_bk).set_title("Add Background").show();
    }

    edit(data,carrot){
        carrot.background.add_or_edit(data).set_title("Edit Background").show();
    }
    
    add_or_edit(data){
        var frm=new Carrot_Form("frm_background",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("background","id");
        frm.set_title("Add or Edit Background");
        frm.create_field("id").set_label("ID").set_val(data.id).set_type("id");
        frm.create_field("name").set_label("Name").set_val(data.name);
        frm.create_field("icon").set_label("Icon (url)").set_val(data.icon).set_type("file").set_type_file("image/*");
        var item_sell=frm.create_field("buy").set_label("Status Sell").set_val(data.buy).set_type("select");
        item_sell.add_option("0","Free");
        item_sell.add_option("1","Buy");
        return frm;
    }

}