class Carrot_Icon{
    carrot;
    obj_icon=null;
    icon="fa-solid fa-face-smile";
    
    constructor(carrot){
        this.carrot=carrot;
        this.load_obj_icon();

        carrot.register_page("icon","carrot.icon.list()","carrot.icon.edit");
        var btn_add=carrot.menu.create("add_icon").set_label("Add Icon").set_type("add").set_icon(this.icon);
        $(btn_add).click(function(){carrot.icon.add();});
        var btn_list=carrot.menu.create("list_icon").set_label("Add Icon").set_type("main").set_lang("icon").set_icon(this.icon);
        $(btn_list).click(function(){carrot.icon.list();});
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

    list(){
        if(this.carrot.check_ver_cur("icon")==false){
            this.carrot.log("Get list icon from sever and show");
            this.carrot.get_list_doc("icon",this.act_done_get_data_list_icon);
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
        carrot.update_new_ver_cur("icon",true);
    }

    show_all_icon_from_list_icon(){
        var carrot=this.carrot;
        carrot.change_title_page("Icon", "?p=icon","icon");
        var list_icon=carrot.convert_obj_to_list(this.obj_icon);
        var html="";
        html+='<div class="row m-0">';
        $(list_icon).each(function(index,data_icon) {
            html+=carrot.icon.box_icon_item(data_icon);
        });
        html+="</div>";
        carrot.show(html);
        this.carrot.check_event();
    }

    box_icon_item(data_icon){
        if(data_icon["name"]==null) data_icon["name"]=data_icon.id;
        var s_url_icon="";
        if(data_icon.icon!=null) s_url_icon=data_icon.icon;
        if(s_url_icon=="") s_url_icon="images/64.png";
        var item_icon=new Carrot_List_Item(carrot);
        item_icon.set_db("icon");
        item_icon.set_id(data_icon.name);
        item_icon.set_class("col-md-2 mb-2 col-sm-3")
        item_icon.set_class_icon("col-md-12 mb-3 col-12 text-center");
        item_icon.set_icon(s_url_icon);
        item_icon.set_name(data_icon.id);
        item_icon.set_body("<span class='fs-8' style='color:"+data_icon.color+"'>"+data_icon.color+"</span>");
        return item_icon.html();
    }

    add(){
        var data_icon=new Object();
        data_icon["name"]="";
        data_icon["icon"]="";
        data_icon["color"]="";
        this.add_or_edit(data_icon).set_title("Add icon").set_msg_done("Add icon success!").show();
    }

    edit(data_icon,carrot){
        carrot.icon.add_or_edit(data_icon).set_title("Update icon").set_msg_done("Update icon success!").show();
    }

    add_or_edit(data){
        var frm=new Carrot_Form("frm_icon",this.carrot);
        frm.set_db("icon","name");
        frm.set_icon_font(this.icon);
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon").set_val(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("color").set_label("Color").set_val(data["color"]).set_type("color");
        return frm;
    }

    list_for_home(){
        var html='';
        if(this.obj_icon!=null){
            var list_icon=this.carrot.obj_to_array(this.obj_icon);
            list_icon= list_icon.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_icon">Other Icon</l>';
            html+='<span role="button" onclick="carrot.icon.list()" class="btn float-end btn-sm btn-secondary"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
            html+='<div id="other_code" class="row m-0">';
            for(var i=0;i<12;i++){
                var icon=list_icon[i];
                html+=this.box_icon_item(icon);
            }
            html+='</div>';
        }
        return html;
    }
}