class AI_Chat{
    carrot;
    icon="fa-solid fa-comments";
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("chat","carrot.ai.chat.list()","carrot.ai.chat.edit");
        var btn_list_chat=carrot.menu.create_menu("list_chat").set_label("List Chat").set_icon(this.icon).set_type("main").set_lang("chat");
        var btn_add_chat=carrot.menu.create_menu("add_chat").set_label("Add Chat").set_icon(this.icon).set_type("add");
        $(btn_list_chat).click(function(){carrot.ai.chat.show_all_chat(carrot.lang);});
        $(btn_add_chat).click(function(){carrot.ai.chat.show_add();});
    }

    show_add(){
        var data_new_chat=Object();
        data_new_chat["id"]=this.carrot.create_id();
        data_new_chat["key"]="";
        data_new_chat["msg"]="";
        data_new_chat["status"]="pending";
        data_new_chat["sex_user"]="0";
        data_new_chat["sex_character"]="0";
        data_new_chat["color"]="#ffffff";
        data_new_chat["icon"]="";
        data_new_chat["action"]="0";
        data_new_chat["face"]="0";
        data_new_chat["func"]="";
        data_new_chat["mp3"]="";
        data_new_chat["link"]="";
        data_new_chat["pater"]="0";
        data_new_chat["user"]=this.carrot.user.get_user_login_id();
        data_new_chat["limit"]="1";
        data_new_chat["lang"]=this.carrot.ai.setting_lang_change;
        this.show_add_or_edit_chat(data_new_chat).set_title("Add chat").show();
    }

    edit(data,carrot){
        if(data["lang"]!="") data["lang"]=carrot.ai.setting_lang_change;
        carrot.ai_lover.chat.show_add_or_edit_chat(data).set_title("Update Chat").show();
    }

    show_add_or_edit_chat(data){
        var frm=new Carrot_Form("chat",this.carrot);
        frm.set_icon_font(this.icon);
        frm.set_db("chat-"+data["lang"],"id");
        frm.create_field("id").set_label("Id chat").set_val(data["id"]).set_type("id");
        frm.create_field("key").set_label("Key").set_val(data["key"]).set_tip("Câu hỏi người dùng đối với Ai")
        frm.create_field("msg").set_label("Msg").set_val(data["msg"]).set_tip("Câu trả lời của Ai khi được hỏi đúng với từ khóa").set_type("textarea");
        frm.create_field("status").set_label("Status").set_val(data["status"]).set_type("select").add_option("pending","Pending - Chờ Duyệt").add_option("passed","Passed - Sử dụng").add_option("reserve","Reserve - Sử dụng tạm thời");
        frm.create_field("sex_user").set_label("Sex User").set_val(data["sex_user"]).set_type("select").add_option("0","Boy").add_option("1","Girl");
        frm.create_field("sex_character").set_label("Sex Character").set_val(data["sex_character"]).set_type("select").add_option("0","Boy").add_option("1","Girl");
        frm.create_field("color").set_label("Color").set_val(data["color"]).set_type("color");
        frm.create_field("icon").set_label("Icon").set_val(data["icon"]).set_type("icon");
        frm.create_field("action").set_label("Action").set_val(data["action"]);
        frm.create_field("face").set_label("Face").set_val(data["face"]);
        frm.create_field("func").set_label("Function App").set_val(data["func"]);
        frm.create_field("mp3").set_label("Mp3 (Url audio)").set_val(data["mp3"]);
        frm.create_field("link").set_label("Link (url Web or  URL scheme App)").set_val(data["link"]);
        frm.create_field("pater").set_label("Pater").set_val(data["pater"]);
        frm.create_field("user").set_label("User").set_val(data["user"]);
        frm.create_field("limit").set_label("Limit Chat").set_val(data["limit"]).set_type("slider");
        frm.create_field("lang").set_label("Lang").set_val(data["lang"]);
        return frm;
    }

    list(){
        this.show_all_chat(this.carrot.lang);
    }

    show_all_chat(lang_show){
        Swal.showLoading();
        this.carrot.ai.setting_lang_change=lang_show;
        this.carrot.change_title_page("Ai Lover", "?p=chat","chat");
        this.carrot.db.collection("chat-"+this.carrot.ai.setting_lang_change).where("status","==","pending").limit(100).get().then((querySnapshot) => {
            var obj_data=Object();
            querySnapshot.forEach((doc) => {
                var item_data=doc.data();
                item_data["id"]=doc.id;
                obj_data[doc.id]=JSON.stringify(item_data);
            });
            Swal.close();
            this.act_done_show_all_chat(obj_data,this.carrot);
        })
        .catch((error) => {
            this.carrot.log(error.message);
            Swal.close();
        });
    }

    act_done_show_all_chat(datas,carrot){
        var html='';
        html+='<div class="row mb-3">';
            html+='<div class="col-12 m-0 btn-toolba" role="toolbar" aria-label="Toolbar with button groups">';
            html+='<div role="group" aria-label="First group"  class="btn-group mr-2">';
                html+='<button id="btn_add_chat" type="button" class="btn btn-secondary btn-sm"><i class="fa-solid fa-circle-plus"></i> Add Chat</button>';
                html+=carrot.langs.list_btn_lang_select();
            html+='</div>';
            html+='</div>';
        html+='</div>';
        html+='<div class="row m-0">';
        var list_data=carrot.convert_obj_to_list(datas);
        $(list_data).each(function(index,data){
            var item_list=new Carrot_List_Item(carrot);
            var s_body='';
            item_list.set_id(data.id);
            if(data.parent==null)
                item_list.set_icon_font("fa-sharp fa-solid fa-comment mt-2");
            else
                item_list.set_icon_font("fa-solid fa-comments mt-2");
            item_list.set_name(data.key);
            item_list.set_tip('<i class="fa-solid fa-circle" style="color:'+data.color+'"></i> '+data.msg);
            if(data.sex_user=='0') s_body+='<i class="fa-solid fa-mars text-primary"></i>'; else s_body+='<i class="fa-solid fa-venus text-danger"></i>';
            s_body+=' <i class="fa-sharp fa-solid fa-right-left"></i> ';
            if(data.sex_character=='0') s_body+='<i class="fa-solid fa-mars text-primary"></i>'; else s_body+='<i class="fa-solid fa-venus text-danger"></i>';

            item_list.set_body('<div class="col-12">'+s_body+'</div>');
            item_list.set_class_body("mt-2 col-9");
            item_list.set_db_collection("chat-"+carrot.ai.setting_lang_change);
            html+=item_list.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.ai.chat.check_event();
    }

    check_event(){
        var chat=this;
        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            chat.show_all_chat(key_change);
        });

        $("#btn_add_chat").click(function(){
            chat.show_add();
        });
        this.carrot.check_event();
    }
}