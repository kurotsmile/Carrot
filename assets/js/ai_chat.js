class AI_Chat{
    carrot;
    constructor(carrot){
        this.carrot=carrot;
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
        data_new_chat["lang"]=this.carrot.lang;
        this.show_add_or_edit_chat(data_new_chat);
    }

    show_edit(data,carrot){
        if(data["lang"]==null) data["lang"]=carrot.ai.setting_lang_change;
        carrot.ai_lover.chat.show_add_or_edit_chat(data);
    }

    show_add_or_edit_chat(data){
        var frm=new Carrot_Form("chat",this.carrot);
        frm.set_title("Add Chat");
        frm.set_db("chat-"+data["lang"],data["id"]);
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
        frm.show();
    }
}