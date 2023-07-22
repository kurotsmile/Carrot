class AI_Chat{
    carrot;
    icon="fa-solid fa-comments";

    orderBy_at="date_create";
    orderBy_type="desc";
    where_a="status";
    where_b="==";
    where_c="pending";

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("chat","carrot.ai.chat.list()","carrot.ai.chat.edit","carrot.ai.chat.show","carrot.ai.chat.reload");
        var btn_list_chat=carrot.menu.create_menu("list_chat").set_label("List Chat").set_icon(this.icon).set_type("main").set_lang("chat");
        var btn_add_chat=carrot.menu.create_menu("add_chat").set_label("Add Chat").set_icon(this.icon).set_act("carrot.ai.chat.show_add()").set_type("add");
        $(btn_list_chat).click(function(){carrot.ai.chat.show_all_chat(carrot.lang);});
    }

    show_add(){
        this.show_add_or_edit_chat(this.data_new_chat()).set_title("Add chat").set_msg_done("Add Chat Success!").show();
    }

    data_new_chat(){
        var data_new_chat=Object();
        data_new_chat["id"]="chat"+this.carrot.create_id();
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
        data_new_chat["date_create"]=new Date().toISOString();
        data_new_chat["lang"]=this.carrot.lang;
        return data_new_chat;
    }

    edit(data,carrot){
        if(data["lang"]==null||data["lang"]=='') data["lang"]=carrot.lang.lang_setting;
        carrot.ai_lover.chat.show_add_or_edit_chat(data).set_title("Update Chat").set_msg_done("Update Chat Success!").show();
    }

    show_add_or_edit_chat(data){
        var frm=new Carrot_Form("chat",this.carrot);
        frm.set_icon_font(this.icon);
        frm.set_db("chat-"+this.carrot.lang.lang_setting,"id");
        if(data.father_emp!=null){
            frm.create_field("father_emp").set_value(data["father_emp"]).set_type("msg").add_class("row").add_class("bg-light").add_class("p-2");
        }
        frm.create_field("id").set_label("Id chat").set_val(data["id"]).set_type("id");
        var btn_add_msg=new Carrot_Btn();
        btn_add_msg.set_icon("fa-solid fa-comment-dots");
        btn_add_msg.set_act("carrot.ai.chat.add_msg_for_key()");
        frm.create_field("key").set_label("Key").set_val(data["key"]).set_tip("Câu hỏi người dùng đối với Ai").add_btn(btn_add_msg);
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
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        frm.create_field("lang").set_label("Lang").set_type("lang").set_val(data["lang"]);
        return frm;
    }

    add_chat_with_father(emp){
        var father=$(emp).parent().parent().parent().parent().parent().parent();
        var father_emp=$(father).clone();
        var father_emp_sex_user=$(emp).attr("sex_user");
        var father_emp_sex_character=$(emp).attr("sex_character");
        var father_emp_id_chat=$(emp).attr("id_chat");

        var data_new=this.data_new_chat();
        $(father_emp).find("#btn_add_father_chat").remove();
        $(father_emp).find(".dev").remove();
        data_new["father_emp"]=father_emp.html();
        data_new["sex_user"]=father_emp_sex_user;
        data_new["sex_character"]=father_emp_sex_character;
        data_new["pater"]=father_emp_id_chat;
        this.show_add_or_edit_chat(data_new).set_title("Continue the conversation").set_msg_done("Add chat success!").show();
    }

    add_msg_for_key(){
        var html='';
        html+='<div class="row">';
        html+='<div class="col-12">';
        for(var i=0;i<=24;i++){
            html+='<span role="button" onclick="carrot.ai.chat.select_key_msg(\'hi_'+i+'\')" class="btn btn-info btn-sm m-1"><i class="fa-solid fa-comment-dots"></i> hi_'+i+'</span>';
        }
        html+='<span role="button" onclick="carrot.ai.chat.select_key_msg(\'hit\')" class="btn btn-info btn-sm m-1"><i class="fa-solid fa-hand-back-fist"></i> Hit</span>';
        html+='</div>';
        html+='</div>';

        Swal.fire({
            title: "Add Msg For Key",
            html: html,
            showCloseButton: true,
            focusConfirm: true
        });
    }

    select_key_msg(s_key){
        $("#key").val(s_key);
        Swal.close();
    }

    list(){
        this.show_all_chat(this.carrot.lang);
    }

    show_all_chat(lang_show=''){
        Swal.showLoading();
        if(lang_show!='') this.carrot.langs.lang_setting=lang_show;
        this.carrot.change_title_page("Ai Lover", "?p=chat","chat");
        this.carrot.db.collection("chat-"+this.carrot.langs.lang_setting).where(this.where_a,this.where_b,this.where_c).orderBy(this.orderBy_at,this.orderBy_type).limit(100).get().then((querySnapshot) => {
            var obj_data=Object();
            querySnapshot.forEach((doc) => {
                var item_data=doc.data();
                item_data["id"]=doc.id;
                obj_data[doc.id]=JSON.stringify(item_data);
            });
            Swal.close();
            this.act_done_show_all_chat(obj_data,this.carrot);
        }).catch((error) => {
            this.carrot.msg(error.message,"error",12000);
        });
    }

    get_list_orderBy(orderBy_at,orderBy_type){
        carrot.ai.chat.orderBy_at=orderBy_at;
        carrot.ai.chat.orderBy_type=orderBy_type;
        carrot.ai.chat.show_all_chat();
    }

    get_list_by_key(opera_a,opera_c){
        carrot.ai.chat.where_a=opera_a;
        carrot.ai.chat.where_c=opera_c;
        carrot.ai.chat.show_all_chat();
    }

    act_done_show_all_chat(datas,carrot){
        var html='';
        var html_menu='';
        html_menu+='<button id="btn_add_chat" type="button" class="btn btn-info btn-sm"><i class="fa-solid fa-circle-plus"></i> Add New Chat</button>';

        html_menu+='<div class="btn-group" role="group">';
            html_menu+='<button class="btn btn-success dropdown-toggle btn-sm" type="button" id="btn_status_chat" data-bs-toggle="dropdown" aria-expanded="true" >';
                html_menu+='<i class="fa-solid fa-cat"></i> Status';
            html_menu+='</button>';

            html_menu+='<div class="dropdown-menu" aria-labelledby="btn_status_chat">';
                html_menu+='<button onclick="carrot.ai.chat.get_list_by_key(\'status\',\'pending\');return false;" type="button" class="dropdown-item"><i class="fa-regular fa-circle"></i> Pending - Chờ kiểm duyệt</button>';
                html_menu+='<button onclick="carrot.ai.chat.get_list_by_key(\'status\',\'passed\');return false;"  type="button" class="dropdown-item"><i class="fa-solid fa-circle-check"></i> Passed - Sử dụng</button>';
                html_menu+='<button onclick="carrot.ai.chat.get_list_by_key(\'status\',\'reserve\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-circle-half-stroke"></i> Reserve - Dự phòng</button>';
            html_menu+='</div>';

        html_menu+='</div>';

        html_menu+='<div class="btn-group" role="group">';
                html_menu+='<button class="btn btn-success dropdown-toggle btn-sm" type="button" id="btn_order" data-bs-toggle="dropdown" aria-expanded="true" >';
                    html_menu+='<i class="fa-solid fa-filter"></i> Order By';
                html_menu+='</button>';
                html_menu+='<div class="dropdown-menu" aria-labelledby="btn_order">';
                    html_menu+='<button onclick="carrot.ai.chat.get_list_orderBy(\'date_create\',\'desc\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-arrow-up-short-wide"></i> Date</button>';
                    html_menu+='<button onclick="carrot.ai.chat.get_list_orderBy(\'date_create\',\'asc\');return false;"  type="button" class="dropdown-item"><i class="fa-solid fa-arrow-down-short-wide"></i> Date</button>';
                    html_menu+='<button onclick="carrot.ai.chat.get_list_orderBy(\'key\',\'desc\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-arrow-up-short-wide"></i> Key</button>';
                    html_menu+='<button onclick="carrot.ai.chat.get_list_orderBy(\'key\',\'asc\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-arrow-down-short-wide"></i> Key</button>';
                html_menu+='</div>';
            html_menu+='</div>';

            html_menu+='<div class="btn-group" role="group">';
            html_menu+='<button class="btn btn-success dropdown-toggle btn-sm" type="button" id="btn_list_msg" data-bs-toggle="dropdown" aria-expanded="true" >';
                html_menu+='<i class="fa-solid fa-comment-dots"></i> Msg';
            html_menu+='</button>';

            html_menu+='<div class="dropdown-menu" aria-labelledby="btn_list_msg">';
                for(var i=0;i<24;i++) html_menu+='<button onclick="carrot.ai.chat.get_list_by_key(\'key\',\'hi_'+i+'\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-comments"></i> hi_'+i+'</button>';
                html_menu+='<button onclick="carrot.ai.chat.get_list_by_key(\'key\',\'hit\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-hand-back-fist"></i> hit</button>';
            html_menu+='</div>';
        html_menu+='</div>';

        html+=carrot.ai.menu(html_menu);
        html+='<div class="row m-0">';
        var list_data=carrot.convert_obj_to_list(datas);
        $(list_data).each(function(index,data){
            data["index"]=index;
            html+=carrot.ai.chat.box_chat_item(data);
        });
        html+='</div>';
        carrot.show(html);
        carrot.ai.chat.check_event();
    }

    box_chat_item(data){
        var item_list=new Carrot_List_Item(carrot);
        var s_body='';
        item_list.set_index(data.index);
        item_list.set_id(data.id);
        if(data.pater!=''&&data.pater!='0')
            item_list.set_icon_font("fa-solid fa-comments mt-2 chat_icon");
        else
            item_list.set_icon_font("fa-sharp fa-solid fa-comment mt-2 chat_icon");
            
        item_list.set_name(data.key);
        item_list.set_tip('<i class="fa-solid fa-circle" style="color:'+data.color+'"></i> '+data.msg);

        if(data.status=="pending") s_body+='<i class="fa-regular fa-circle"></i> ';
        if(data.status=="passed") s_body+='<i class="fa-solid fa-circle-check"></i> ';
        if(data.status=="reserve") s_body+='<i class="fa-solid fa-circle-half-stroke"></i> ';
        s_body+="<b>Status:</b> "+data.status+" ";

        if(data.sex_user=='0') s_body+='<i class="fa-solid fa-mars text-primary"></i>'; else s_body+='<i class="fa-solid fa-venus text-danger"></i>';
        s_body+=' <i class="fa-sharp fa-solid fa-right-left"></i> ';
        if(data.sex_character=='0') s_body+='<i class="fa-solid fa-mars text-primary"></i>'; else s_body+='<i class="fa-solid fa-venus text-danger"></i>';

        s_body+='<i id="btn_add_father_chat" role="button" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id+'" onclick="carrot.ai.chat.add_chat_with_father(this);return false;" class="fa-solid fa-square-plus float-end fa-2x text-success"></i>';

        item_list.set_body('<div class="col-12">'+s_body+'</div>');
        item_list.set_class_body("mt-2 col-11 fs-9");
        item_list.set_db_collection("chat-"+carrot.langs.lang_setting);
        item_list.set_obj_js("carrot.ai.chat");
        item_list.set_act_edit("carrot.ai.chat.edit");
        return item_list.html();
    }

    check_event(){
        var carrot=this.carrot;
        this.carrot.check_event();
        var chat=this;
        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            chat.show_all_chat(key_change);
        });

        $("#btn_add_chat").click(function(){
            chat.show_add();
        });

        $("#box_input_search").change(function(){
            var key_search=$("#box_input_search").val();
            alert("key search:"+key_search);
            this.carrot.db.collection("chat-"+this.carrot.langs.lang_setting).where("key","==",key_search).orderBy(this.orderBy_at,this.orderBy_type).limit(100).get().then((querySnapshot) => {
                var obj_data=Object();
                querySnapshot.forEach((doc) => {
                    var item_data=doc.data();
                    item_data["id"]=doc.id;
                    obj_data[doc.id]=JSON.stringify(item_data);
                });
                Swal.close();
                this.act_done_show_all_chat(obj_data,this.carrot);
            }).catch((error) => {
                this.carrot.msg(error.message,"error",12000);
            });
        });

        $(".chat_icon").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.ai.chat.show(obj_id,carrot);
        });
    }

    show(id,carrot){
        carrot.get_doc("chat-"+carrot.langs.lang_setting,id,carrot.ai.chat.show_info);
    }

    show_info(data,carrot){
        carrot.change_title_page("Chat Info","?p=chat&id="+data.key,"chat");
        var html='';
        html='<div class="section-container p-2 p-xl-4">';
            html+='<div class="row">';
                html+='<div class="col-md-8 ps-4 ps-lg-3">';
                    html+='<div class="row bg-white shadow-sm">';
                        html+='<div class="col-md-2 p-3 text-center">';
                            html+='<i class="fa-solid fa-comment fa-3x"></i>;'
                        html+='</div>';

                        html+='<div class="col-md-10 p-2">';
                            html+='<h4 class="fw-semi fs-4 mb-3">'+data.key+'</h4>';
                            html+='<p class="fs-9">'+data.msg+'</p>';
                        html+='</div>';
                    html+='</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        carrot.show(html);
    }

    reload(carrot){
        carrot.ai.chat.list();
    }
}