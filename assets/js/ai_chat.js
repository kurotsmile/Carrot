class AI_Chat{
    carrot;
    obj_chats=null;
    icon="fa-solid fa-comments";

    orderBy_at="date_create";
    orderBy_type="desc";
    where_a="status";
    where_b="==";
    where_c="pending";

    show_type="msg";

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("chat","carrot.ai.chat.list()","carrot.ai.chat.edit","carrot.ai.chat.show","carrot.ai.chat.reload");
        var btn_list_chat=carrot.menu.create_menu("list_chat").set_label("List Chat").set_icon(this.icon).set_type("main").set_lang("chat");
        $(btn_list_chat).click(function(){carrot.ai.chat.show_all_chat(carrot.lang);});
        carrot.menu.create_menu("add_chat").set_label("Add Chat").set_icon(this.icon).set_act("carrot.ai.chat.show_add()").set_type("add");
        if(localStorage.getItem("obj_chats")!=null) this.obj_chats=JSON.parse(localStorage.getItem("obj_chats"));
    }

    save_obj_chats(){
        localStorage.setItem("obj_chats",JSON.stringify(this.obj_chats));
    }

    show_add(){
        this.show_add_or_edit_chat(this.data_new_chat()).set_title("Add chat").set_msg_done("Add Chat Success!").show();
    }

    data_new_chat(){
        var data_new_chat=Object();
        data_new_chat["id"]="chat"+this.carrot.create_id();
        if(this.carrot.ai.chat.where_a=='key'&&this.carrot.ai.chat.where_c!='')
            data_new_chat["key"]=this.carrot.ai.chat.where_c;
        else
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
        data_new_chat["pater"]="";
        data_new_chat["user"]=this.carrot.user.get_user_login();
        data_new_chat["limit"]="1";
        data_new_chat["date_create"]=new Date().toISOString();
        data_new_chat["lang"]=this.carrot.langs.lang_setting;
        return data_new_chat;
    }

    edit(data,carrot){
        if(data["lang"]==null){
            data["lang"]=carrot.langs.lang_setting;
        }else{
            if(data["lang"]=="") data["lang"]=carrot.langs.lang_setting;
        }
        if(data["date_create"]==null||data["date_create"]=='') data["date_create"]=new Date().toISOString();
        carrot.ai_lover.chat.show_add_or_edit_chat(data).set_title("Update Chat").set_msg_done("Update Chat Success!").show();
        if(data["pater"]!="") carrot.ai_lover.chat.show_chat_father_in_form();
    }

    show_add_or_edit_chat(data){
        var frm=new Carrot_Form("chat",this.carrot);
        frm.set_icon_font(this.icon);
        frm.set_db("chat-"+carrot.langs.lang_setting,"id");
        if(data.father_emp!=null){
            frm.create_field("father_emp").set_value(data["father_emp"]).set_type("msg").add_class("row").add_class("bg-light").add_class("p-2");
        }
        frm.create_field("id").set_label("Id chat").set_val(data["id"]).set_type("id").set_main();
        var btn_add_msg=new Carrot_Btn();
        btn_add_msg.set_icon("fa-solid fa-comment-dots");
        btn_add_msg.set_act("carrot.ai.chat.add_msg_for_key()");
        var btn_translate_key=new Carrot_Btn();
        btn_translate_key.set_icon("fa-solid fa-language");
        btn_translate_key.set_act("tr_inp('key','vi','"+this.carrot.langs.lang_setting+"')");
        frm.create_field("key").set_label("Key").set_val(data["key"]).set_tip("Câu hỏi người dùng đối với Ai").add_btn(btn_translate_key).add_btn(btn_add_msg);
        var btn_add_key_fnc=new Carrot_Btn();
        btn_add_key_fnc.set_label(" Add Key func");
        btn_add_key_fnc.set_icon("fa-solid fa-circle-plus");
        btn_add_key_fnc.set_class("btn-sm mt-1 btn-light fs-9");
        btn_add_key_fnc.set_act("carrot.ai.chat.add_key_fnc_for_msg_field()");
        var btn_translate=new Carrot_Btn();
        btn_translate.set_icon("fa-solid fa-language");
        btn_translate.set_class("btn-sm mt-1 btn-light fs-9");
        btn_translate.set_label(" translate");
        btn_translate.set_act("tr_inp('msg','vi','"+this.carrot.langs.lang_setting+"')");
        var btn_paste=new Carrot_Btn();
        btn_paste.set_label(" paste");
        btn_paste.set_icon("fa-solid fa-paste");
        btn_paste.set_class("btn-sm mt-1 btn-light fs-9");
        btn_paste.set_act("paste_tag('msg')");
        frm.create_field("msg").set_label("Msg").set_val(data["msg"]).set_tip("Câu trả lời của Ai khi được hỏi đúng với từ khóa").set_type("textarea").add_btn(btn_add_key_fnc).add_btn(btn_translate).add_btn(btn_paste);
        frm.create_field("status").set_label("Status").set_val(data["status"]).set_type("select").add_option("pending","Pending - Chờ Duyệt").set_dev().add_option("passed","Passed - Sử dụng").add_option("reserve","Reserve - Sử dụng tạm thời");
        frm.create_field("sex_user").set_label("Sex User").set_val(data["sex_user"]).set_type("select").add_option("0","Boy").add_option("1","Girl");
        frm.create_field("sex_character").set_label("Sex Character").set_val(data["sex_character"]).set_type("select").add_option("0","Boy").add_option("1","Girl");
        frm.create_field("color").set_label("Color").set_val(data["color"]).set_type("color");
        frm.create_field("icon").set_label("Icon").set_val(data["icon"]).set_type("icon");
        var field_action=frm.create_field("action").set_label("Action").set_val(data["action"]).set_type("select");
        for(var i=0;i<=40;i++) field_action.add_option(i,"Action "+i);
        var field_face=frm.create_field("face").set_label("Face").set_val(data["face"]).set_type("select");
        for(var i=0;i<=18;i++) field_face.add_option(i,"Face "+i);
        var field_func=frm.create_field("func").set_label("Function App").set_val(data["func"]).set_type("select");
        field_func.add_option("0","None");
        field_func.add_option("1","Open Music");
        field_func.add_option("2","Open Weather");
        field_func.add_option("3","Open Fashion Shop");
        field_func.add_option("4","Open Brain");
        field_func.add_option("5","Play Music");
        field_func.add_option("6","Stop Music");
        field_func.add_option("7","Offline music playlist");
        field_func.add_option("8","Online music playlist");
        field_func.add_option("9","List of radio stations");
        field_func.add_option("10","Rate");
        field_func.add_option("11","Share");

        frm.create_field("mp3").set_label("Mp3 (Url audio)").set_val(data["mp3"]);
        frm.create_field("link").set_label("Link (url Web or  URL scheme App)").set_val(data["link"]);
        frm.create_field("pater").set_label("Pater").set_val(data["pater"]).set_tip("Father chat details");
        frm.create_field("pater_details").set_label("Pater Details").set_val("Preview Pater Details").set_type("msg");
        frm.create_field("user").set_label("User").set_val(data["user"]).set_type("user");
        frm.create_field("limit").set_label("Limit Chat").set_val(data["limit"]).set_type("slider");
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        frm.create_field("lang").set_label("Lang").set_type("lang").set_val(data["lang"]);
        return frm;
    }

    show_chat_father_in_form(){
        var val_pater_id=$("#pater").val();
        carrot.db.collection("chat-"+carrot.langs.lang_setting).doc(val_pater_id).get().then((doc) => {
            if (doc.exists) {
                var data_obj = doc.data();
                data_obj["id"]=doc.id;
                $("#pater_details").html(carrot.ai.chat.box_chat_item(data_obj,"col-md-12"));
                Swal.close();
                carrot.check_event();
            } else {
                $("#pater_details").html('<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> No Found Chat</span>');
                Swal.close();
            }
        }).catch((error) => {
            carrot.log_error(error);
        });
    }

    add_key_fnc_for_msg_field(){
        var list_parameter_msg=Array("{ten_user}","{ten_nv}","{gio}","{phut}","{ngay}","{thang}","{nam}","{thu}","{key_chat}");
        var html='';
        $(list_parameter_msg).each(function(index,key){
            html+='<button onclick="carrot.ai.chat.select_key_parameter_for_msg(\''+key+'\');" class="btn btn-sm btn-info m-1"><i class="fa-brands fa-keycdn"></i> '+key+'</button>';
        });
        Swal.fire({
            title:"Parameter Msg Key",
            html:html
        });
    }

    select_key_parameter_for_msg(s_key){
        var cursorPos = $('#msg').prop('selectionStart');
        var v = $('#msg').val();
        var textBefore = v.substring(0,  cursorPos);
        var textAfter  = v.substring(cursorPos, v.length);
    
        $('#msg').val(textBefore + s_key + textAfter);

        Swal.close();
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

    clone_chat(emp){
        var data_json=$(emp).data("json");
        var data_new=JSON.parse(decodeURIComponent(data_json));
        data_new["id"]="chat"+this.carrot.create_id();
        data_new["lang"]=this.carrot.langs.lang_setting;
        data_new["date_create"]=new Date().toISOString();
        var frm=this.show_add_or_edit_chat(data_new).set_title("Clone Chat").set_msg_done("Add chat success!");
        if(this.show_type=='msg')
            frm.set_act_done("carrot.ai.chat.reload(carrot)");
        else
            frm.set_act_done("carrot.ai.chat.show_compare_msg_list()");
        frm.show();
    }

    add_msg_for_key(){
        var html='';
        html+='<div class="row">';
        html+='<div class="col-12">';
        for(var i=0;i<=23;i++){
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
        if(lang_show!=''){
            this.carrot.langs.lang_setting=lang_show;
            carrot.register_page("chat-"+lang_show,"carrot.ai.chat.list()","carrot.ai.chat.edit","carrot.ai.chat.show","carrot.ai.chat.reload");
        }
        this.carrot.db.collection("chat-"+this.carrot.langs.lang_setting).where(this.where_a,this.where_b,this.where_c).orderBy(this.orderBy_at,this.orderBy_type).limit(100).get().then((querySnapshot) => {
            this.obj_chats=new Object();
            querySnapshot.forEach((doc) => {
                var item_data=doc.data();
                item_data["id"]=doc.id;
                this.obj_chats[doc.id]=JSON.stringify(item_data);
            });
            Swal.close();
            this.save_obj_chats();
            this.act_done_show_all_chat(this.obj_chats,this.carrot);
        }).catch((error) => {
            this.carrot.log_error(error);
        });
    }

    get_list_orderBy(orderBy_at,orderBy_type){
        carrot.ai.chat.orderBy_at=orderBy_at;
        carrot.ai.chat.orderBy_type=orderBy_type;
        carrot.ai.chat.show_all_chat();
    }

    get_list_by_key(opera_a,opera_c){
        carrot.ai.chat.show_type='msg';
        carrot.ai.chat.where_a=opera_a;
        carrot.ai.chat.where_c=opera_c;
        carrot.ai.chat.show_all_chat();
    }

    menu(){
        var html_menu='';
        var s_class_active='';

        carrot.change_title_page("Ai Lover", "?p=chat","chat");
        html_menu+='<button onclick="carrot.ai.chat.show_add()" type="button" class="btn btn-info btn-sm"><i class="fa-solid fa-circle-plus"></i> Add New Chat</button>';
        html_menu+='<button onclick="carrot.ai.chat.del_multiple()" type="button" class="btn dev btn-danger btn-sm"><i class="fa-solid fa-eraser"></i></button>';
        html_menu+='<button onclick="carrot.ai.chat.select_all()" type="button" class="btn dev btn-dark btn-sm"><i class="fa-solid fa-check-to-slot"></i></button>';

        html_menu+='<div class="btn-group" role="group">';
            html_menu+='<button class="btn btn-success dropdown-toggle btn-sm" type="button" id="btn_status_chat" data-bs-toggle="dropdown" aria-expanded="true" >';
                html_menu+='<i class="fa-solid fa-cat"></i> Status';
                if(carrot.ai.chat.where_a=="status") html_menu+=" ("+carrot.ai.chat.where_c+")";
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
                html_menu+=' ('+carrot.ai.chat.orderBy_at+')';
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
                if(carrot.ai.chat.where_a=='key'&&carrot.ai.chat.where_c!='') html_menu+=' ('+carrot.ai.chat.where_c+')';
            html_menu+='</button>';
            html_menu+='<div class="dropdown-menu" aria-labelledby="btn_list_msg">';
                for(var i=0;i<24;i++){
                    if(carrot.ai.chat.where_a=='key'){
                        if(carrot.ai.chat.where_c=='hi_'+i) s_class_active="active"; else s_class_active="";
                    }
                    html_menu+='<button onclick="carrot.ai.chat.get_list_by_key(\'key\',\'hi_'+i+'\');return false;" type="button" class="dropdown-item '+s_class_active+'"><i class="fa-solid fa-comments"></i> hi_'+i+'</button>';
                }
                html_menu+='<button onclick="carrot.ai.chat.get_list_by_key(\'key\',\'hit\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-hand-back-fist"></i> hit</button>';
            html_menu+='</div>';
        html_menu+='</div>';

        if(carrot.ai.chat.where_a=='key'&&carrot.ai.chat.where_c!=''){
            if(carrot.ai.chat.show_type=="msg") s_class_active=""; else s_class_active="active";
            html_menu+='<button class="btn dev btn-success btn-sm '+s_class_active+'" onclick="carrot.ai.chat.show_compare_msg();return false;"><i class="fa-solid fa-table-columns"></i></button>';
        }

        return carrot.ai.menu(html_menu);
    }

    act_done_show_all_chat(datas,carrot){
        var html='';
        html+=carrot.ai.chat.menu();
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

    box_chat_item(data,s_class="col-md-4 mb-3"){
        var item_list=new Carrot_List_Item(carrot);
        var s_body='';
        var s_key=data.key;
        var s_color_icon='';

        item_list.set_index(data.index);
        item_list.set_id(data.id);
        item_list.set_btn_dev_extra('<div role="button" class="dev btn btn-success btn-sm mr-2" onclick="carrot.ai.chat.get_list_by_key(\'key\',\''+s_key+'\');return false;"><i class="fa-solid fa-comment-dots"></i></div>');

        if(data.status=="passed") s_color_icon=" text-success ";
        if(data.status=="reserve") s_color_icon=" text-warning ";

        if(data.pater!=''&&data.pater!='0'){
            item_list.set_icon_font("fa-solid fa-comments mt-2 "+s_color_icon+" chat_icon");
        }else{
            if(data.link!="")
                item_list.set_icon_font("fa-sharp fa-solid fa-link mt-2 "+s_color_icon+" chat_icon");
            else
                item_list.set_icon_font("fa-sharp fa-solid fa-comment mt-2 "+s_color_icon+" chat_icon");
        }
            
        item_list.set_name(data.key);
        item_list.set_tip('<i class="fa-solid fa-circle" style="color:'+data.color+'"></i> '+' <span id="chat_msg_'+data.index+'">'+data.msg+'</span>');

        s_body+='<input type="checkbox" class="form-check-input chat_checkbox dev" role="button" data-chat-id="'+data.id+'" emp_type="box"/> ';
        if(data.reports!=null) s_body+='<i class="fa-solid fa-bug text-danger fa-fade"></i> ';
        if(data.status=="pending") s_body+='<i class="fa-regular fa-circle"></i> ';
        if(data.status=="passed") s_body+='<i class="fa-solid fa-circle-check text-success"></i> ';
        if(data.status=="reserve") s_body+='<i class="fa-solid fa-circle-half-stroke"></i> ';

        s_body+='<b>Status:</b> '+data.status+' ';

        if(data.sex_user=='0') s_body+='<i class="fa-solid fa-mars text-primary"></i>'; else s_body+='<i class="fa-solid fa-venus text-danger"></i>';
        s_body+=' <i class="fa-sharp fa-solid fa-right-left"></i> ';
        if(data.sex_character=='0') s_body+='<i class="fa-solid fa-person text-primary"></i>'; else s_body+='<i class="fa-solid fa-person-dress text-danger"></i>';

        if(carrot.ai.chat.show_type=="compare"&&data.lang=="vi"){
            s_body+='<i id="btn_clone_chat" role="button" data-json="'+encodeURIComponent(JSON.stringify(data))+'" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id+'" onclick="carrot.ai.chat.clone_chat(this);return false;" class="fa-solid fa-clone dev float-end fa-2x text-success m-1"></i>';
        }else{
            s_body+='<i id="btn_add_father_chat" role="button" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id+'" onclick="carrot.ai.chat.add_chat_with_father(this);return false;" class="fa-solid fa-square-plus float-end fa-2x text-success m-1"></i>';
            s_body+='<i id="btn_clone_chat" role="button" data-json="'+encodeURIComponent(JSON.stringify(data))+'" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id+'" onclick="carrot.ai.chat.clone_chat(this);return false;" class="fa-solid fa-clone dev float-end fa-2x text-success m-1"></i>';
            if(data.lang!="vi") s_body+='<i id="btn_translate_chat" role="button" onclick="tr_emp(\'chat_msg_'+data.index+'\',\''+carrot.langs.lang_setting+'\',\'vi\');return false;" class="fa-solid fa-language float-end fa-2x text-success m-1 dev"></i>';
            s_body+='<i id="btn_check_same_chat" role="button" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" key_chat="'+data.key+'" onclick="carrot.ai.chat.show_check_same_key(this);return false;" class="fa-solid fa-rectangle-list float-end fa-2x text-success m-1"></i>';
        }

        item_list.set_class(s_class);
        item_list.set_body('<div class="col-12">'+s_body+'</div>');
        item_list.set_class_body("mt-2 col-11 fs-9");
        item_list.set_db("chat-"+carrot.langs.lang_setting);
        item_list.set_obj_js("carrot.ai.chat");
        item_list.set_act_edit("carrot.ai.chat.edit");
        return item_list.html();
    }

    show_compare_msg(){
        this.show_type="compare";
        this.show_compare_msg_list();
    }

    show_compare_msg_list(){
        var html='';
        html+=this.menu();
        html+='<div class="row">';
            html+='<div class="col-md-6" >';
                html+='<div class="row" id="all_items_msg_tag"></div>';
            html+='</div>';

            html+='<div class="col-md-6" >';
                html+='<div class="row" id="all_items_msg_change"></div>';
            html+='</div>';
        html+='</div>';
        this.carrot.show(html);

        this.carrot.db.collection("chat-vi").where("key","==",this.where_c).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                querySnapshot.forEach((doc) => {
                    var data_chat=doc.data();
                    data_chat["id"]=doc.id;
                    $("#all_items_msg_tag").append(carrot.ai.chat.box_chat_item(data_chat,"col-12 col-md-12 mb-1"));
                });
                $("#all_items_msg_tag").append(this.box_compare_msg_add('vi'));

                this.carrot.db.collection("chat-"+this.carrot.langs.lang_setting).where("key","==",this.where_c).get().then((querySnapshot) => {
                    if(querySnapshot.docs.length>0){
                        var chats=new Object();
                        querySnapshot.forEach((doc) => {
                            var data_chat=doc.data();
                            data_chat["id"]=doc.id;
                            chats[doc.id]=JSON.stringify(data_chat);
                            $("#all_items_msg_change").append(carrot.ai.chat.box_chat_item(data_chat,"col-12 col-md-12 mb-1"));
                        });
                        $("#all_items_msg_change").append(this.box_compare_msg_add(this.carrot.langs.lang_setting));
                        this.check_event();
                    }else{
                        $("#all_items_msg_change").append(this.box_compare_msg_add(this.carrot.langs.lang_setting));
                        this.check_event();
                    }
                }).catch((error) => {
                    this.carrot.log_error(error);
                });

            }else{
                $("#all_items_msg_tag").append(this.box_compare_msg_add('vi'));
                this.check_event();
            }
        }).catch((error) => {
            this.carrot.log_error(error);
        });
    }

    add_compare_msg(key_msg,lang){
        var data_new=this.data_new_chat();
        data_new["key"]=key_msg;
        data_new["lang"]=lang;
        this.show_add_or_edit_chat(data_new).set_title("Add Msg "+key_msg+" ("+lang+")").set_msg_done("Add chat success!").show();
    }

    box_compare_msg_add(lang){
        var html='';
        html+='<div class="col-12 col-md-12 mb-1" role="button" onclick="carrot.ai.chat.add_compare_msg(\''+carrot.ai.chat.where_c+'\',\''+lang+'\')">';
            html+='<div class="app-cover p-2 shadow-md bg-success text-white">';
                html+='<div class="row">';
                    html+='<div class="col-12 col-md-12"><i class="fa-solid fa-circle-plus"></i> Add Chat</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    check_event(){
        var carrot=this.carrot;
        this.carrot.check_event();
        var chat=this;
        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            if(carrot.ai.chat.show_type=="msg"){
                chat.show_all_chat(key_change);
            }
            else{
                carrot.langs.lang_setting=key_change;
                chat.show_compare_msg_list();
            }  
        });

        $("#box_input_search").change(function(){
            carrot.show_loading_search();
            var key_search=$("#box_input_search").val();
            carrot.db.collection("chat-"+carrot.langs.lang_setting).where("key","==",key_search).orderBy(carrot.ai.chat.orderBy_at,carrot.ai.chat.orderBy_type).limit(100).get().then((querySnapshot) => {
                var obj_data=Object();
                querySnapshot.forEach((doc) => {
                    var item_data=doc.data();
                    item_data["id"]=doc.id;
                    obj_data[doc.id]=JSON.stringify(item_data);
                });
                Swal.close();
                carrot.ai.chat.act_done_show_all_chat(obj_data,carrot);
                carrot.hide_loading_search();
            }).catch((error) => {
                carrot.msg(error.message,"error",12000);
            });
        });

        $(".chat_icon").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.ai.chat.show(obj_id,carrot);
        });
    }

    del_multiple(){
        var count_del=0;
        $(".chat_checkbox").each(function(index,emp){
            var ckb=$(emp).is(':checked');
            var emp_type=$(emp).attr("emp_type");

            if(ckb){
                var chat_id=$(emp).data("chat-id");
                carrot.db.collection("chat-"+carrot.langs.lang_setting).doc(chat_id).delete().then(() => {
                    if(emp_type=="box"){
                        $(emp).parent().parent().parent().parent().parent().parent().remove();
                    }
                    else{
                        $(emp).parent().parent().remove();
                    } 
                }).catch((error) => {
                    carrot.log_error(error);
                });
                count_del++;           
            }
        });
        carrot.msg("Delete "+count_del+" chat success!");
    }

    show_check_same_key(emp){
        var key_chat=$(emp).attr("key_chat");
        Swal.showLoading();
        this.carrot.db.collection("chat-"+this.carrot.langs.lang_setting).where("key","==",key_chat).limit(100).get().then((querySnapshot) => {
            var html='';
            var s_class_status='';
            html+='<table class="table table-sm table-hover">';
            html+='<tbody>';
            querySnapshot.forEach((doc) => {
                var item_data=doc.data();
                item_data["id"]=doc.id;
                if(item_data["status"]=="passed") s_class_status='text-success'; else s_class_status='';
                html+='<tr>';
                    html+='<td class="fs-9 d-block text-justify">';
                        html+=' <input class="form-check-input chat_checkbox dev" type="checkbox" role="button" data-chat-id="'+item_data.id+'" emp_type="msg"/> ';
                        html+='<i class="fa-solid fa-circle-dot '+s_class_status+'"></i> ';
                        if(item_data.sex_user=='0') html+='<i class="fa-solid fa-mars text-primary"></i>'; else html+='<i class="fa-solid fa-venus text-danger"></i>';
                        html+=' <i class="fa-sharp fa-solid fa-right-left"></i> ';
                        if(item_data.sex_character=='0') html+='<i class="fa-solid fa-person text-primary"></i>'; else html+='<i class="fa-solid fa-person-dress text-danger"></i>';
                        html+=' <b>'+item_data["key"]+'</b> : '+item_data["msg"];
                    html+='</td>';
                    html+='<td class="w-10">';
                        html+='<i role="button" onclick="carrot.ai.chat.delete_chat_in_msg(this);" class="float-end dev fs-9 fa-solid fa-trash text-danger m-1" db_collection="chat-'+this.carrot.langs.lang_setting+'" db_document="'+item_data.id+'" db_obj="carrot.ai.chat"></i>';
                        html+='<i role="button" class="float-end dev btn_app_edit fs-9 fa-solid fa-pen-to-square m-1" onclick="carrot.ai.chat.edit" db_collection="chat-'+this.carrot.langs.lang_setting+'" db_document="'+item_data.id+'" db_obj="carrot.ai.chat"></i>';
                    html+='</td>';
                html+='</tr>';
            });

            html+='</tbody>';
            html+='</table>';

            Swal.close();

            var frm=new Carrot_Form('ai_same_key',carrot);
            frm.set_title("Key Same");

            var table_list=frm.create_field("table_list");
            table_list.set_type("msg");
            table_list.set_val(html);

            var btn_del_item=frm.create_btn();
            btn_del_item.set_icon('fa-solid fa-trash-can');
            btn_del_item.set_label("Delete items");
            btn_del_item.set_class("btn dev btn-primary");
            btn_del_item.set_act("carrot.ai.chat.del_multiple()");

            frm.off_btn_done();
            frm.show();

            this.carrot.check_event();
        }).catch((error) => {
            this.carrot.log_error(error);
        });
    }

    show(id,carrot){
        var id_chat=carrot.get_param_url("id");
        var lang_chat=carrot.get_param_url("lang_chat");
        if(id=="undefined"){
            carrot.get_doc("chat-"+lang_chat,id_chat,carrot.ai.chat.show_info);
        }
        else{
            if(lang_chat==undefined){
                carrot.get_doc("chat-"+carrot.langs.lang_setting,id,carrot.ai.chat.show_info);
            }else{
                carrot.get_doc("chat-"+lang_chat,id,carrot.ai.chat.show_info);
            }
        }
    }

    show_info(data,carrot){
        carrot.change_title_page("Chat Info","?p=chat&id="+data.id+"&lang_chat="+carrot.langs.lang_setting,"chat");
        if(data.lang==null){
            data.lang=carrot.langs.lang_setting;
        }
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
                            html+=carrot.btn_dev("chat-"+data.lang,data.id,"carrot.ai.chat","carrot.ai.chat.edit");
                            html+='<p class="fs-9">'+data.msg+'</p>';
                            html+='<div class="row pt-4">';

                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="sex_character">Sex Character</l> <i class="fa-solid fa-people-arrows"></i></b>';
                                    if(data.sex_character=="0")
                                        html+='<p><i class="fa-solid fa-person text-primary"></i> <l class="lang" key_lang="boy">'+data.sex_character+'</l></p>';
                                    else
                                        html+='<p><i class="fa-solid fa-person-dress text-danger"></i> <l class="lang" key_lang="girl">'+data.sex_character+'</l></p>';
                                html+='</div>';

                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="sex_user">Sex User</l> <i class="fa-solid fa-restroom"></i></b>';
                                    if(data.sex_user=="0")
                                        html+='<p><i class="fa-solid fa-mars text-primary"></i> <l class="lang" key_lang="boy">'+data.sex_user+'</l></p>';
                                    else
                                        html+='<p><i class="fa-solid fa-venus text-danger"></i> <l class="lang" key_lang="girl">'+data.sex_user+'</l></p>';
                                html+='</div>';

                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="status">Status</l> <i class="fa-brands fa-suse"></i></b>';
                                    html+='<p>'+data.status+'</p>';
                                html+='</div>';

                                if(data.color!=null&&data.color!="#FFFFFF"){
                                    html+='<div class="col-md-4 col-6 text-center">';
                                        html+='<b><l class="lang" key_lang="color">Color</l> <i class="fa-solid fa-palette"></i></b>';
                                        html+='<p style="color:'+data.color+'">'+data.color+'</p>';
                                    html+='</div>';
                                }

                                if(data.icon!=null&&carrot.icon.obj_icon!=null){
                                    var icon=carrot.icon.obj_icon[data.icon];
                                    if(icon!=null){
                                        icon=JSON.parse(icon);
                                        html+='<div class="col-md-4 col-6 text-center">';
                                            html+='<b><l class="lang" key_lang="icon">Icon</l> <i class="fa-solid fa-smile"></i></b>';
                                            html+='<p><img style="width:32px;" src="'+icon.icon+'"/></p>';
                                        html+='</div>';
                                    }
                                }

                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="date_create">Date Create</l> <i class="fa-regular fa-calendar"></i></b>';
                                    html+='<p>'+data.date_create+'</p>';
                                html+='</div>';

                                if(data.user.name!=undefined){
                                    html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="author">Author</l> <i class="fa-solid fa-user-nurse"></i></b>';
                                    html+='<p>'+data.user.name+'</p>';
                                    html+='</div>';
                                }

                            html+='</div>';
                        html+='</div>';

                    html+='</div>';

                    data["collection"]="chat-"+carrot.langs.lang_setting;
                    html+=carrot.rate.box_report(data);
                    html+=carrot.rate.box_comment(data);
                    html+=carrot.link_store.box_qrdoce();

                html+='</div>';

                html+='<div class="col-md-4">';
                html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_chat">Related Chat</h4>';
                var list_chat=carrot.convert_obj_to_list(carrot.ai.chat.obj_chats).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
                $(list_chat).each(function(index,chat){
                    if(index<=12){
                        chat.index=index;
                        html+=carrot.ai.chat.box_chat_item(chat,"col-md-12 mb-3");
                    }
                });
                html+='</div>';

            html+='</div>';
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
        carrot.ai.chat.check_event();
    }

    delete_chat_in_msg(emp){
        var db_collection=$(emp).attr("db_collection");
        var db_document=$(emp).attr("db_document");
        carrot.db.collection(db_collection).doc(db_document).delete().then(() => {
            $(emp).parent().parent().remove();
            $("#"+db_document).remove();
        }).catch((error) => {
            carrot.log_error(error);
        });
    }

    select_all(){
        $(".chat_checkbox").each(function(index,emp){
            $(emp).prop('checked', true);
        });
    }

    reload(carrot){
        carrot.ai.chat.show_all_chat(carrot.lang.lang_setting);
    }
}