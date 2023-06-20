class Carrot_Icon{
    carrot;
    obj_icon=null;
    
    constructor(carrot){
        this.carrot=carrot;
        this.load_obj_icon();
    }

    load_obj_icon(){
        if (localStorage.getItem("obj_icon") != null) this.obj_icon=JSON.parse(localStorage.getItem("obj_icon"));
    }

    save_obj_icon(){
        localStorage.setItem("obj_icon", JSON.stringify(this.obj_icon));
    }

    delete_obj_icon(){
        localStorage.removeItem("obj_icon");
        this.obj_icon=null;
    }

    show_all_icon(){
        if(this.carrot.check_ver_cur("icon")==false){
            this.carrot.log("Get list icon from sever and show");
            this.carrot.get_list_doc("icon",this.act_done_get_data_list_icon);
            this.carrot.update_new_ver_cur("icon",true);
        }else{
            if(this.obj_icon==null){
                this.carrot.log("Get list icon from sever and show");
                this.carrot.get_list_doc("icon",this.act_done_get_data_list_icon);
            }
            else{
                this.carrot.log("Show all data icon from cache!");
                this.show_all_icon_from_list_icon();
            }
        }
    }

    act_done_get_data_list_icon(ions,carrot){
        carrot.icon.obj_icon=ions;
        carrot.icon.save_obj_icon();
        carrot.icon.show_all_icon_from_list_icon();
    }

    show_box_add_or_edit_icon(data_icon){
        var s_title_box='';
        if(data_icon==null)s_title_box="<b>Add Icon</b>";
        else s_title_box="<b>Update Icon</b>";
        var obj_icon = Object();
        obj_icon["tip_icon"] = { type: "caption", message: "Thông tin cơ bản" };
        if(data_icon==null){
            data_icon=Object();
            data_icon["name"]='';
            data_icon["icon"]='';
            data_icon["color"]='';
        }else{
            if(data_icon["name"]=="") data_icon["name"]=data_icon["id"];
        }
        obj_icon["id"]={'type':'input','defaultValue':data_icon["id"], 'label':'ID'};
        obj_icon["name"]={'type':'input','defaultValue':data_icon["name"], 'label':'Name'};
        obj_icon["icon"]={'type':'input','defaultValue':data_icon["icon"], 'label':'Icon (url)'};
        obj_icon["color"]={'type':'color','defaultValue':data_icon["color"], 'label':'Color'};
        customer_field_for_db(obj_icon,'icon','id','show_all_icon','Add App successfully');
    
        $.MessageBox({
            message: s_title_box,
            input: obj_icon,
            top: "auto",
            buttonFail: "Cancel"
        }).done(this.carrot.act_done_add_or_edit);
    }

    show_edit_icon_done(data_icon,carrot){
        if(data_icon!=null)
            carrot.icon.show_box_add_or_edit_icon(data_icon);
        else
            $.MessageBox("Icon không còn tồn tại!");
    }

    show_all_icon_from_list_icon(){
        var carrot=this.carrot;
        carrot.change_title_page("Icon", "?p=icon","icon");
        var list_icon=carrot.convert_obj_to_list(this.obj_icon);
        var html_main_contain="";
        html_main_contain+='<div class="row m-0">';
        $(list_icon).each(function(index,data_icon) {
            var s_url_icon="";
            if(data_icon.icon!=null) s_url_icon=data_icon.icon;
            if(s_url_icon=="") s_url_icon="images/64.png";

            html_main_contain+="<div class='col-md-3 mb-3' id=\""+data_icon.id+"\" key_search=\""+data_icon.id+"\">";
                html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                    html_main_contain+='<div class="row">';
                    html_main_contain+='<div class="img-cover pe-0 col-3"><img class="rounded" src="'+s_url_icon+'" alt="'+data_icon.id+'"></div>';
                        html_main_contain+='<div class="det mt-2 col-9">';
                            html_main_contain+="<h5 class='mb-0 fs-6'>"+data_icon.id+"</h5>";
                            html_main_contain+="<span class='fs-8' style='color:"+data_icon.color+"'>"+data_icon.color+"</span>";
                        html_main_contain+="</div>";
                    html_main_contain+="</div>";

                    html_main_contain+=carrot.btn_dev("icon",data_icon.id);

                html_main_contain+="</div>";
            html_main_contain+="</div>";
        });
        html_main_contain+="</div>";
        carrot.body.html(html_main_contain);
        this.carrot.check_event();
    }
}