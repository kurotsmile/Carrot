class AI_Chat{
    carrot;
    constructor(carrot){
        this.carrot=carrot;
    }

    show_add(){
        var data_new_chat=Object();
        data_new_chat["id"]=this.carrot.create_id();
        data_new_chat["msg"]="";
        data_new_chat["color"]="#ffffff";
        data_new_chat["lang"]="fr";
        data_new_chat["action"]="0";
        this.show_add_or_edit_chat(data_new_chat);
    }

    show_add_or_edit_chat(data){
        var frm=new Carrot_Form("chat",this.carrot);
        frm.set_title("Add Chat");
        frm.set_db("chat-"+data["lang"],data["id"]);
        frm.create_field("id").set_label("Id chat").set_val(data["id"]).set_type("id");
        frm.create_field("key").set_label("Key").set_val(data["key"]).set_tip("Câu hỏi người dùng đối với Ai")
        frm.create_field("msg").set_label("Msg").set_val(data["msg"]).set_tip("Câu trả lời của Ai khi được hỏi đúng với từ khóa");
        frm.create_field("color").set_label("Color").set_val(data["color"]);
        frm.create_field("action").set_label("Action").set_val(data["action"]);
        frm.create_field("lang").set_label("Lang").set_val(data["lang"]);
        frm.act_done();
    }
}