class Carrot_Avatar{
    carrot;
    icon="fa-regular fa-image-portrait";
    obj_avatar=null;
    type_show="list";
    emp_msg_field_avatar=null;

    constructor(carrot){
        this.carrot=carrot;
        $(this.carrot.menu.create("add_avatar").set_label("Add Avatar").set_icon(this.icon).set_type("add")).click(function(){carrot.avatar.add()});
        $(this.carrot.menu.create("list_avatar").set_label("List Avatar").set_icon(this.icon).set_type("dev")).click(function(){carrot.avatar.list();});

        if(localStorage.getItem("obj_avatar")!=null) this.obj_avatar=JSON.parse(localStorage.getItem("obj_avatar"));
    }

    save_obj_avatar(){
        localStorage.setItem("obj_avatar",JSON.stringify(this.obj_avatar));
    }

    add(){
        var avatar_data=new Object();
        avatar_data["id"]=this.carrot.create_id();
        avatar_data["name"]="";
        avatar_data["icon"]="";
        avatar_data["type"]="boy";
        this.frm_add_or_edit(avatar_data).set_title("Add Avatar").show();
    }

    edit(data,carrot){
        carrot.avatar.frm_add_or_edit(data).set_title("Edit Avatar").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_avatar",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("user-avatar","id");
        frm.create_field("id").set_label("ID").set_type("id").set_val(data.id);
        frm.create_field("type").set_label("Type").add_option("boy","Boy").add_option("girl","Girl").set_val(data.type).set_type("select");
        frm.create_field("icon").set_label("Icon").set_type("file").set_type_file("image/*").set_val(data.icon);
        return frm;
    }

    list(){
        this.type_show="list";
        this.carrot.change_title_page("Avatar","?p=avatar","avatar");
        if(this.obj_avatar==null)
            this.carrot.get_list_doc("user-avatar",this.show_list_avatar);
        else
            this.get_data_avatars();
    }

    get_data_avatars(){
        Swal.showLoading();
        this.carrot.get_list_doc("user-avatar",this.act_done_get_data_avatars);
    }

    act_done_get_data_avatars(avatars,carrot){
        Swal.close();
        carrot.avatar.obj_avatar=avatars;
        carrot.avatar.save_obj_avatar();
        if(carrot.avatar.type_show=="list")
            carrot.avatar.show_list_avatar(avatars,carrot);
        else
            carrot.avatar.done_msg_list_select();
    }

    show_list_avatar(avatars,carrot){
        var list_avatar=carrot.obj_to_array(avatars);
        var html="<div class='row m-0'>";
        $(list_avatar).each(function(index,avt){
            var item_avatar=new Carrot_List_Item(carrot);
            item_avatar.set_id(avt.id);
            item_avatar.set_index(index);
            item_avatar.set_db("user-avatar");
            item_avatar.set_obj_js("avatar");
            item_avatar.set_icon(avt.icon);
            item_avatar.set_tip(avt.type);
            item_avatar.set_title(avt.id);
            item_avatar.set_class("col-md-2 mb-3");
            item_avatar.set_class_icon("col-md-12 mb-3 col-12");
            html+=item_avatar.html();
        });
        html+="</div>";
        carrot.show(html);
        carrot.check_event();
    }

    msg_list_select(emp){
        this.emp_msg_field_avatar=emp;
        this.type_show="msg";
        if(this.obj_avatar==null)
            this.get_data_avatars();
        else
            this.done_msg_list_select();
    }

    done_msg_list_select(){
        var html='';
        var list_avatar=carrot.obj_to_array(this.obj_avatar);
        list_avatar= list_avatar.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
        $(list_avatar).each(function(index,avatar){
            if(index<20){
                html+="<img role='button' onclick='carrot.avatar.select_avatar_for_user(this)' style='width:50px' class='rounded m-1' src='"+avatar.icon+"'/>";
            }
        });
        
        Swal.fire({
            title: 'Select Avatar',
            html:html,
            showCancelButton: false
        });
    }

    select_avatar_for_user(emp){
        var img_src=$(emp).attr("src");
        var emp_img=$(this.emp_msg_field_avatar).attr("emp_img");
        $("#"+emp_img).attr("src",img_src);
        $(this.emp_msg_field_avatar).attr("value",img_src);
        Swal.close();
    }
}