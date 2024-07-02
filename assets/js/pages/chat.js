class Chat{
    objs=null;
    obj_info_cur=null;
    obj_animations=null;
    obj_func=null;
    list_animation_act=Array();

    icon="fa-solid fa-comments";
    orderBy_at="date_create";
    orderBy_type="DESCENDING";

    where_a="status";
    where_b="==";
    where_c="passed";

    show_type="list_chat";

    constructor(){
        var btn_list_chat=carrot.menu.create_menu("list_chat").set_label("List Chat").set_icon(this.icon).set_type("main").set_lang("chat");
        $(btn_list_chat).click(function(){carrot.chat.show_all_chat(carrot.lang);});
        carrot.menu.create_menu("add_chat").set_label("Add Chat").set_icon(this.icon).set_act("carrot.chat.add()").set_type("add");

        fetch('data_animations.json').then(response => response.json()).then((text) => {
            carrot.chat.obj_animations=text;
            $.each(carrot.chat.obj_animations, function(k,v) {
                $.each(v.data, function(k_data,v_data) {
                    carrot.chat.list_animation_act.push(v_data.name);
                });
            });
        });

        fetch('data_chat_func.json').then(response => response.json()).then((text) => {
            carrot.chat.obj_func=text;
            carrot.chat.funcs=carrot.chat.obj_func.funcs;
        });
    }

    show(){
        var id=carrot.get_param_url("id");
        if(id!=undefined){
            var lang_chat=carrot.get_param_url("lang_chat");
            if(lang_chat!=undefined) lang_chat=carrot.langs.lang_setting;
            carrot.langs.lang_setting=lang_chat;
            carrot.chat.get_info(id);
        }
        else{
            carrot.chat.list();
        }
    }

    list(){
        carrot.loading("Get all chat data and show");
        carrot.change_title_page("All Chat",carrot.url()+"?page=chat","All Chat");
        carrot.chat.where_a="status";
        carrot.chat.where_c="passed";
        carrot.chat.get_data(carrot.chat.load_list_by_data);
    }

    get_list_by_key(opera_a,opera_c){
        carrot.loading("Show list by key ("+opera_a+"=="+opera_c+")");
        carrot.chat.objs=null;
        carrot.chat.orderBy_at='date_create';
        carrot.chat.show_type='msg';
        carrot.chat.where_a=opera_a;
        carrot.chat.where_c=opera_c;
        carrot.chat.get_data(carrot.chat.load_list_by_data);
    }

    get_list_orderBy(opera_a,opera_c){
        carrot.loading("Order list by  ("+opera_a+" -> "+opera_c+")");
        carrot.chat.objs=null;
        carrot.chat.orderBy_at=opera_a;
        carrot.chat.orderBy_type=opera_c;
        carrot.chat.get_data(carrot.chat.load_list_by_data);
    }

    get_data(act_done){
        if(carrot.chat.objs!=null){
            act_done(carrot.chat.objs);
        }else{
            carrot.chat.get_data_from_server(act_done,()=>{
                carrot.msg("Error!","error");
            });
        }
    }

    get_data_from_server(act_done,act_fail){
        var q=new Carrot_Query("chat-"+carrot.langs.lang_setting);
        q.add_select("id");
        q.add_select("key");
        q.add_select("msg");
        q.add_select("status");
        q.add_select("reports");
        q.add_select("lang");
        q.add_select("sex_user");
        q.add_select("sex_character");
        q.add_select("color");
        q.add_select("link");
        q.add_select("pater");
        q.add_select("func");
        q.add_where(carrot.chat.where_a,carrot.chat.where_c);
        q.set_order(carrot.chat.orderBy_at,carrot.chat.orderBy_type);
        q.set_limit(100);
        q.get_data((chats)=>{
            carrot.chat.objs=chats;
            act_done(chats);
        },act_fail);
    }

    load_list_by_data(data){
        carrot.chat.show_type="list_chat";
        carrot.hide_loading();
        var html=carrot.chat.menu();
        html+='<div class="row" id="all_chat"></div>';
        carrot.show(html);
        $(data).each(function(index,c){
            c["index"]=index;
            $("#all_chat").append(carrot.chat.box_item(c).html());
        });
        carrot.chat.check_event();
    }

    get_icon(data){
        var s_color_icon='';
        var s_icon="";
        if(data.status=="passed") s_color_icon=" text-success ";
        if(data.status=="reserve") s_color_icon=" text-warning ";

        if(data.pater!=''&&data.pater!='0'){
            s_icon="fa-solid fa-comments mt-2 "+s_color_icon+" chat_icon";
        }else if(data.key=="hit"){
            s_icon="fa-solid fa-hand-fist mt-2 "+s_color_icon+" chat_icon";
        }else if(data.key=="tip"){
            s_icon="fa-solid fa-circle-question mt-2 "+s_color_icon+" chat_icon";
        }
        else{
            if(data.func!="0"){
                if(data.func=="1") s_icon="fa-solid fa-file-audio mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="2") s_icon="fa-solid fa-cloud-sun mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="3") s_icon="fa-solid fa-shirt mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="4") s_icon="fa-solid fa-brain mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="5") s_icon="fa-solid fa-circle-play mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="6") s_icon="fa-solid fa-compact-disc mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="7") s_icon="fa-solid fa-record-vinyl mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="9") s_icon="fa-solid fa-radio mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="10") s_icon="fa-solid fa-star-half-stroke mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="11") s_icon="fa-solid fa-square-share-nodes mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="12") s_icon="fa-solid fa-power-off mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="13") s_icon="fa-solid fa-images mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="14") s_icon="fa-solid fa-forward-step mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="15") s_icon="fa-solid fa-circle-pause mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="16") s_icon="fa-solid fa-rocket mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="17") s_icon="fa-solid fa-lightbulb mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="18") s_icon="fa-regular fa-lightbulb mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="19") s_icon="fa-brands fa-app-store-ios mt-2 "+s_color_icon+" chat_icon";
                else if(data.func=="20") s_icon="fa-solid fa-store mt-2 "+s_color_icon+" chat_icon";
                else s_icon="fa-solid fa-atom mt-2 "+s_color_icon+" chat_icon";
            }else if(data.link!=""){
                s_icon="fa-sharp fa-solid fa-link mt-2 "+s_color_icon+" chat_icon";
            }else if(data.func!="0"){
                s_icon="fa-solid fa-comment-dots mt-2 "+s_color_icon+" chat_icon";
            }else{
                s_icon="fa-solid fa-comment mt-2 "+s_color_icon+" chat_icon";
            }
        }
        return s_icon;
    }

    box_item(data){
        var item_list=new Carrot_List_Item(carrot);
        var s_body='';
        var s_key=data.key;
        var s_btn_extra='';

        if(carrot.chat.where_c!=s_key){
            s_btn_extra=s_btn_extra+'<div role="button" class="dev btn btn-success btn-sm mr-2" onclick="carrot.chat.get_list_by_key(\'key\',\''+s_key+'\');return false;"><i class="fa-solid fa-comment-dots"></i></div>';
        }
 
        item_list.set_index(data.index);
        item_list.set_id(data.id_doc);

        if(data.pater!=''&&data.pater!='0'){
            s_btn_extra=s_btn_extra+'<div role="button" db_collection="chat-'+carrot.langs.lang_setting+'" db_document="'+data.pater+'" class="dev btn btn_app_edit bg-secondary text-white btn-sm mr-2" onclick="carrot.chat.edit" db_obj="carrot.chat"><i class="fa-solid fa-feather"></i></div>';
        }

        s_btn_extra=s_btn_extra+'<div role="button" db_collection="chat-'+carrot.langs.lang_setting+'" db_document="'+data.id+'" class="dev btn bg-info text-white btn-sm mr-2" onclick="carrot.chat.replication(this)" db_obj="carrot.chat"><i class="fa-solid fa-viruses"></i></div>';

        item_list.set_icon_font(carrot.chat.get_icon(data));
        item_list.set_btn_dev_extra(s_btn_extra);
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

        if(carrot.chat.show_type=="compare"&&data.lang=="vi"){
            s_body+='<i id="btn_clone_chat" role="button" data-json="'+encodeURIComponent(JSON.stringify(data))+'" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id_doc+'" onclick="carrot.chat.clone_chat(this);return false;" class="fa-solid fa-clone dev float-end fa-2x text-success m-1"></i>';
        }else{
            s_body+='<i id="btn_add_father_chat" role="button" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id_doc+'" onclick="carrot.chat.add_chat_with_father(this);return false;" class="fa-solid fa-square-plus float-end fa-2x text-success m-1"></i>';
            s_body+='<i id="btn_clone_chat" role="button" data-json="'+encodeURIComponent(JSON.stringify(data))+'" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id_doc+'" onclick="carrot.chat.clone_chat(this);return false;" class="fa-solid fa-clone dev float-end fa-2x text-success m-1"></i>';
            if(data.lang!="vi") s_body+='<i id="btn_translate_chat" role="button" onclick="tr_emp(\'chat_msg_'+data.index+'\',\''+carrot.langs.lang_setting+'\',\'vi\');return false;" class="fa-solid fa-language float-end fa-2x text-success m-1 dev"></i>';
            s_body+='<i id="btn_list_child_chat" role="button" onclick="carrot.chat.show_list_child(\''+data.id_doc+'\');return false;" class="fa-solid fa-comments float-end fa-2x text-success m-1"></i>';
            s_body+='<i id="btn_check_same_chat" role="button" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" key_chat="'+data.key+'" onclick="carrot.chat.show_check_same_key(this);return false;" class="fa-solid fa-rectangle-list float-end fa-2x text-success m-1"></i>';
        }

        item_list.set_body('<div class="col-12">'+s_body+'</div>');
        item_list.set_class_body("mt-2 col-11 fs-9");
        item_list.set_db("chat-"+carrot.langs.lang_setting);
        item_list.set_obj_js("chat");
        item_list.set_act_click("carrot.chat.get_info('"+data.id_doc+"')");
        return item_list;
    }

    add(){
        carrot.chat.show_add_or_edit_chat(carrot.chat.data_new_chat()).set_title("Add chat").set_msg_done("Add Chat Success!").show();
    }

    data_new_chat(){
        var data_new_chat=Object();
        data_new_chat["id"]="chat"+carrot.create_id();
        if(carrot.chat.where_a=='key'&&carrot.chat.where_c!='')
            data_new_chat["key"]=carrot.chat.where_c;
        else
            data_new_chat["key"]="";
        data_new_chat["msg"]="";
        data_new_chat["status"]="pending";
        data_new_chat["sex_user"]="0";
        data_new_chat["sex_character"]="0";
        data_new_chat["color"]="#ffffff";
        data_new_chat["icon"]="";
        data_new_chat["act"]="";
        data_new_chat["face"]="0";
        data_new_chat["func"]="";
        data_new_chat["mp3"]="";
        data_new_chat["link"]="";
        data_new_chat["pater"]="";
        data_new_chat["user"]=carrot.user.get_user_login();
        data_new_chat["date_create"]=new Date().toISOString();
        data_new_chat["lang"]=carrot.langs.lang_setting;
        return data_new_chat;
    }

    edit_chat_by_id(id,lang){
        carrot.loading("Get chat "+id);
        carrot.server.get_doc("chat-"+lang,id,(data)=>{
            carrot.hide_loading();
            carrot.chat.edit(data,carrot);
        });
    }

    edit(data,carrot){
        if(data["lang"]==null){
            data["lang"]=carrot.langs.lang_setting;
        }else{
            if(data["lang"]=="") data["lang"]=carrot.langs.lang_setting;
        }
        if(data["date_create"]==null||data["date_create"]=='') data["date_create"]=new Date().toISOString();
        carrot.chat.show_add_or_edit_chat(data).set_title("Update Chat").set_msg_done("Update Chat Success!").show();
        if(data["pater"]!="") carrot.chat.show_chat_father_in_form();
    }

    show_add_or_edit_chat(data){
        var frm=new Carrot_Form("chat",carrot);
        frm.set_icon_font(carrot.chat.icon);
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
        btn_translate_key.set_act("tr_inp('key','vi','"+carrot.langs.lang_setting+"')");
        frm.create_field("key").set_label("Key").set_val(data["key"]).set_tip("Câu hỏi người dùng đối với Ai").add_btn(btn_translate_key).add_btn(btn_add_msg).add_btn_toLower();
        var btn_add_key_fnc=new Carrot_Btn();
        btn_add_key_fnc.set_label(" Add Key func");
        btn_add_key_fnc.set_icon("fa-solid fa-circle-plus");
        btn_add_key_fnc.set_class("btn-sm mt-1 btn-light fs-9");
        btn_add_key_fnc.set_act("carrot.chat.add_key_fnc_for_msg_field()");
        var btn_translate=new Carrot_Btn();
        btn_translate.set_icon("fa-solid fa-language");
        btn_translate.set_class("btn-sm mt-1 btn-light fs-9");
        btn_translate.set_label(" translate");
        btn_translate.set_act("tr_inp('msg','vi','"+carrot.langs.lang_setting+"')");
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
        var btn_random_action=new Carrot_Btn();
        btn_random_action.set_icon("fa-solid fa-shuffle");
        btn_random_action.set_act("carrot.chat.sel_random_action()");
        var btn_list_action=new Carrot_Btn();
        btn_list_action.set_icon("fa-solid fa-list");
        btn_list_action.set_act("carrot.chat.show_list_category_action_animations()");
        frm.create_field("act").set_label("Action").set_val(data["act"]).add_btn(btn_random_action).add_btn(btn_list_action);

        var btn_random_face=new Carrot_Btn();
        btn_random_face.set_icon("fa-solid fa-shuffle");
        btn_random_face.set_act("carrot.chat.sel_random_face()");
        var field_face=frm.create_field("face").set_label("Face").set_val(data["face"]).set_type("select").add_btn(btn_random_face);
        for(var i=0;i<=18;i++) field_face.add_option(i,"Face "+i);
        var field_func=frm.create_field("func").set_label("Function App").set_val(data["func"]).set_type("select");
        for (let i = 0; i < this.funcs.length; i++) {
            field_func.add_option(i,this.funcs[i]);
        }

        frm.create_field("mp3").set_label("Mp3 (Url audio)").set_val(data["mp3"]);

        var btn_add_func_sys=new Carrot_Btn();
        btn_add_func_sys.set_icon("fa-solid fa-square-plus");
        btn_add_func_sys.set_act("carrot.chat.add_sys_fnc_for_link_field()");
        frm.create_field("link").set_label("Link (url Web or  URL scheme App)").set_val(data["link"]).add_btn(btn_add_func_sys);
        frm.create_field("pater").set_label("Pater").set_val(data["pater"]).set_tip("Father chat details");
        frm.create_field("pater_details").set_label("Pater Details").set_val("Preview Pater Details").set_type("msg");
        frm.create_field("user").set_label("User").set_val(data["user"]).set_type("user");
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        frm.create_field("lang").set_label("Lang").set_type("lang").set_val(data["lang"]);

        var btn_list_child=new Carrot_Btn();
        btn_list_child.set_icon("fa-solid fa-child");
        btn_list_child.set_act("carrot.chat.show_list_child('"+data["id"]+"')");
        frm.add_btn(btn_list_child);

        frm.set_act_done("carrot.chat.reload_list()");
        return frm;
    }

    add_chat_with_father(emp){
        var father=$(emp).parent().parent().parent().parent().parent().parent();
        var father_emp=$(father).clone();
        var father_emp_sex_user=$(emp).attr("sex_user");
        var father_emp_sex_character=$(emp).attr("sex_character");
        var father_emp_id_chat=$(emp).attr("id_chat");

        var data_new=carrot.chat.data_new_chat();
        $(father_emp).find("#btn_add_father_chat").remove();
        $(father_emp).find(".dev").remove();
        data_new["father_emp"]=father_emp.html();
        data_new["sex_user"]=father_emp_sex_user;
        data_new["sex_character"]=father_emp_sex_character;
        data_new["pater"]=father_emp_id_chat;
        carrot.chat.show_add_or_edit_chat(data_new).set_title("Continue the conversation").set_msg_done("Add chat success!").show();
    }

    menu(){
        var html_menu='';
        var s_class_active='';
        html_menu+='<div class="row">';
        html_menu+='<div class="col-10 m-0 btn-toolbar btn-sm" role="toolbar" aria-label="Toolbar with button groups">';
        if(carrot.chat.where_a=='key'&&carrot.chat.where_c!=''){
            if(carrot.chat.show_type=="list_chat") s_class_active=""; else s_class_active="active";
            html_menu+='<button class="btn dev btn-success btn-sm '+s_class_active+'" onclick="carrot.chat.show_compare_msg();return false;"><i class="fa-solid fa-table-columns"></i></button>';
        }
        html_menu+='<div role="group" aria-label="First group"  class="btn-group mr-2 btn-sm">';
        html_menu+=carrot.langs.list_btn_lang_select('btn-success');
        html_menu+='</div>';
                html_menu+='<div role="group" aria-label="First group"  class="btn-group mr-2 btn-sm">';
                if(carrot.chat.show_type=='info') html_menu+='<button onclick="carrot.chat.list();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-caret-left"></i> <l class="lang" key_lang="back">Back</l></button>';
                html_menu+='<button onclick="carrot.chat.add()" type="button" class="btn btn-info btn-sm"><i class="fa-solid fa-circle-plus"></i> Add New Chat</button>';
                html_menu+='<button onclick="carrot.chat.del_multiple()" type="button" class="btn dev btn-danger btn-sm"><i class="fa-solid fa-eraser"></i></button>';
                html_menu+=carrot.tool.btn_export("chat-"+carrot.langs.lang_setting,"chat-"+carrot.langs.lang_setting);
                html_menu+='<button onclick="carrot.chat.delete_all_data()" type="button" class="btn dev btn-danger btn-sm"><i class="fa-solid fa-trash"></i></button>';
                html_menu+='<button onclick="carrot.chat.select_all()" type="button" class="btn dev btn-dark btn-sm"><i class="fa-solid fa-check-to-slot"></i></button>';
        
                html_menu+='<div class="btn-group" role="group">';
                    html_menu+='<button class="btn btn-success dropdown-toggle btn-sm" type="button" id="btn_status_chat" data-bs-toggle="dropdown" aria-expanded="true" >';
                        html_menu+='<i class="fa-solid fa-cat"></i> Status';
                        if(carrot.chat.where_a=="status") html_menu+=" ("+carrot.chat.where_c+")";
                    html_menu+='</button>';
                    html_menu+='<div class="dropdown-menu" aria-labelledby="btn_status_chat">';
                        html_menu+='<button onclick="carrot.chat.get_list_by_key(\'status\',\'pending\');return false;" type="button" class="dropdown-item"><i class="fa-regular fa-circle"></i> Pending - Chờ kiểm duyệt</button>';
                        html_menu+='<button onclick="carrot.chat.get_list_by_key(\'status\',\'passed\');return false;"  type="button" class="dropdown-item"><i class="fa-solid fa-circle-check"></i> Passed - Sử dụng</button>';
                        html_menu+='<button onclick="carrot.chat.get_list_by_key(\'status\',\'reserve\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-circle-half-stroke"></i> Reserve - Dự phòng</button>';
                    html_menu+='</div>';
        
                html_menu+='</div>';
        
                html_menu+='<div class="btn-group" role="group">';
                    html_menu+='<button class="btn btn-success dropdown-toggle btn-sm" type="button" id="btn_order" data-bs-toggle="dropdown" aria-expanded="true" >';
                        html_menu+='<i class="fa-solid fa-filter"></i> Order By';
                        html_menu+=' ('+carrot.chat.orderBy_at+')';
                    html_menu+='</button>';
                    html_menu+='<div class="dropdown-menu" aria-labelledby="btn_order">';
                        html_menu+='<button onclick="carrot.chat.get_list_orderBy(\'date_create\',\'DESCENDING\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-arrow-up-short-wide"></i> Date</button>';
                        html_menu+='<button onclick="carrot.chat.get_list_orderBy(\'date_create\',\'ASCENDING\');return false;"  type="button" class="dropdown-item"><i class="fa-solid fa-arrow-down-short-wide"></i> Date</button>';
                        html_menu+='<button onclick="carrot.chat.get_list_orderBy(\'key\',\'DESCENDING\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-arrow-up-short-wide"></i> Key</button>';
                        html_menu+='<button onclick="carrot.chat.get_list_orderBy(\'key\',\'ASCENDING\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-arrow-down-short-wide"></i> Key</button>';
                    html_menu+='</div>';
                html_menu+='</div>';
        
                html_menu+='<div class="btn-group" role="group">';
                    html_menu+='<button class="btn btn-success dropdown-toggle btn-sm" type="button" id="btn_list_msg" data-bs-toggle="dropdown" aria-expanded="true" >';
                        html_menu+='<i class="fa-solid fa-comment-dots"></i> Msg';
                        if(carrot.chat.where_a=='key'&&carrot.chat.where_c!='') html_menu+=' ('+carrot.chat.where_c+')';
                    html_menu+='</button>';
                    html_menu+='<div class="dropdown-menu" aria-labelledby="btn_list_msg">';
                        html_menu+='<div onclick="carrot.chat.get_list_by_key(\'key\',\'hit\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-hand-back-fist"></i> hit</div>';
                        html_menu+='<div onclick="carrot.chat.get_list_by_key(\'key\',\'tip\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-circle-question"></i> tip</div>';
                        html_menu+='<div onclick="carrot.chat.get_list_by_key(\'key\',\'found_song\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-magnifying-glass-plus"></i> found_song</div>';
                        html_menu+='<div onclick="carrot.chat.get_list_by_key(\'key\',\'no_found_song\');return false;" type="button" class="dropdown-item"><i class="fa-solid fa-magnifying-glass-minus"></i> no_found_song</div>';
                        html_menu+='<div onclick="carrot.chat.get_list_by_function();return false;" type="button" class="dropdown-item"><i class="fa-solid fa-atom"></i> Function</div>';
                        html_menu+='<div onclick="carrot.chat.get_list_by_user();return false;" type="button" class="dropdown-item"><i class="fa-solid fa-user"></i> User</div>';
                        for(var i=0;i<24;i++){
                            if(carrot.chat.where_a=='key'){
                                if(carrot.chat.where_c=='hi_'+i) s_class_active="active"; else s_class_active="";
                            }
                            html_menu+='<div onclick="carrot.chat.get_list_by_key(\'key\',\'hi_'+i+'\');return false;" type="button" class="dropdown-item '+s_class_active+'"><i class="fa-solid fa-comments"></i> hi_'+i+'</div>';
                        }
                    html_menu+='</div>';
                html_menu+='</div>';
                html_menu+='</div>';
                html_menu+='</div>';

                html_menu+='<div class="col-2 text-end btn-sm">';
                html_menu+='<div role="group" aria-label="Last group" class="btn-group btn-sm">';
                    html_menu+='<button onclick="carrot.chat.list();return false;" type="button" class="btn btn-success btn-sm active"><i class="fa-brands fa-rocketchat"></i> All Chat</button>';
                    html_menu+='<button onclick="carrot.js(\'chat_log\',\'chat_log\',\'carrot.chat_log.list()\');return false;" type="button" class="btn btn-success btn-sm "><i class="fa-solid fa-cat"></i> Log</button>';
                    html_menu+='<button onclick="carrot.js(\'chat_block\',\'chat_block\',\'carrot.chat_block.show()\');return false;" type="button" class="btn btn-success btn-sm"><i class="fa-solid fa-shield-halved"></i> Key Block</button>';
                    html_menu+='</div>';
                html_menu+='</div>';
            
            html_menu+='</div>';

        return html_menu;
    }

    sel_random_action(){
        var random_action=Math. floor(Math. random() * carrot.chat.list_animation_act.length);
        $('#act').val(carrot.chat.list_animation_act[random_action]);
    }

    sel_random_face(){
        var length_face=$('#face').children('option').length-1;
        var random_face=Math. floor(Math. random() * length_face) + 1;
        $('#face').val(random_face);
    }

    show_chat_father_in_form(){
        var val_pater_id=$("#pater").val();
        carrot.server.get("chat-"+carrot.langs.lang_setting,val_pater_id,(data)=>{
            var box_c=carrot.chat.box_item(data);
            box_c.set_class("col-12");
            $("#pater_details").html(box_c.html());
            carrot.check_event();
        },()=>{
            $("#pater_details").html('<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> No Found Chat</span>');
        });
    }

    add_sys_fnc_for_link_field(){
        var index_func=parseInt($("#func").val());
        var name_arr_func=carrot.chat.funcs[index_func];
        carrot.chat.show_list_link_extension(carrot.chat.obj_func[name_arr_func]);
    }

    show_list_link_extension(obj_array){
        var html='';
        var index_func=parseInt($("#func").val());
        $(obj_array).each(function(index,key){
            html+='<button onclick="carrot.chat.select_sys_func_for_link(\''+key+'\');" class="btn btn-sm btn-info m-1"><i class="fa-solid fa-atom"></i> '+key+'</button>';
            if(index_func==19){
                html+='<a href="https://play.google.com/store/apps/details?id='+key+'" class="btn btn-sm btn-success m-1" target="_blank"><i class="fa-solid fa-link"></i></a>';
            }
        });
        Swal.fire({
            title:"Add func sys",
            html:html
        });
    }

    select_sys_func_for_link(s_key){
        $('#link').val(s_key);
        Swal.close();
    }

    add_key_fnc_for_msg_field(){
        var list_parameter_msg=Array("{ten_user}","{ten_nv}","{gio}","{phut}","{ngay}","{thang}","{nam}","{thu}","{key_chat}","{song_name}");
        var html='';
        $(list_parameter_msg).each(function(index,key){
            html+='<button onclick="carrot.chat.select_key_parameter_for_msg(\''+key+'\');" class="btn btn-sm btn-info m-1"><i class="fa-brands fa-keycdn"></i> '+key+'</button>';
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

    show_list_category_action_animations(){
        var html='';
        $.each(this.obj_animations, function(k,v) {
            html+='<button onclick="carrot.chat.show_list_action_animations_by_cat(\''+k+'\');" class="btn btn-sm btn-info m-1"><i class="fa-solid fa-radiation"></i> '+v.name+'</button>';
        });

        Swal.fire({
            title:"List Category Actions",
            html:html
        });
    }

    show_list_action_animations_by_cat(index_cat){
        var obj_cat=this.obj_animations[index_cat];
        var html='';
        $.each(obj_cat.data, function(k,v) {
            html+='<button onclick="carrot.chat.sel_action_animation(\''+v.name+'\');" class="btn btn-sm btn-info m-1"><i class="fa-solid fa-person-running"></i> '+v.name+'</button>';
        });

        Swal.fire({
            title:"List Category Actions",
            html:html
        });
    }

    sel_action_animation(s_name_animation){
        Swal.close();
        $("#act").val(s_name_animation);
    }

    show_check_same_key(emp){
        var key_chat=$(emp).attr("key_chat");
        carrot.loading("Get List key same");
        var q=new Carrot_Query("chat-"+carrot.langs.lang_setting);
        q.add_where("key",key_chat);
        q.set_limit(50);
        q.get_data((data)=>{
            carrot.hide_loading();
            var html='';
            html+=carrot.chat.list_data_chat_in_table(data);
            
            var frm=new Carrot_Form('ai_same_key',carrot);
            frm.set_title("Key Same");

            var table_list=frm.create_field("table_list");
            table_list.set_type("msg");
            table_list.set_val(html);

            var btn_del_item=frm.create_btn();
            btn_del_item.set_icon('fa-solid fa-trash-can');
            btn_del_item.set_label("Delete items");
            btn_del_item.set_class("btn dev btn-primary");
            btn_del_item.set_act("carrot.chat.del_multiple()");

            frm.off_btn_done();
            frm.show();
        });
    }

    list_data_chat_in_table(data){
        var html='';
        html+='<table class="table table-sm table-hover">';
        html+='<tbody>';
        $(data).each(function(index,item_data){
            item_data["index"]=index;
            html+='<tr>';
                html+='<td class="fs-9 d-block text-justify">';
                    html+=' <input class="form-check-input chat_checkbox dev" type="checkbox" role="button" data-chat-id="'+item_data.id_doc+'" emp_type="msg"/> ';
                    html+='<i class="'+carrot.chat.get_icon(item_data)+'"></i> ';
                    if(item_data.sex_user=='0') html+='<i class="fa-solid fa-mars text-primary"></i>'; else html+='<i class="fa-solid fa-venus text-danger"></i>';
                    html+=' <i class="fa-sharp fa-solid fa-right-left"></i> ';
                    if(item_data.sex_character=='0') html+='<i class="fa-solid fa-person text-primary"></i>'; else html+='<i class="fa-solid fa-person-dress text-danger"></i>';
                    html+=' <b>'+item_data["key"]+'</b> : '+item_data["msg"];
                html+='</td>';
                html+='<td class="w-10">';
                    html+='<i role="button" onclick="carrot.ai.chat.delete_chat_in_msg(this);" class="float-end dev fs-9 fa-solid fa-trash text-danger m-1" db_collection="chat-'+carrot.langs.lang_setting+'" db_document="'+item_data.id+'" db_obj="carrot.ai.chat"></i>';
                    html+='<i role="button" class="float-end dev btn_app_edit fs-9 fa-solid fa-pen-to-square m-1" onclick="carrot.ai.chat.edit" db_collection="chat-'+carrot.langs.lang_setting+'" db_document="'+item_data.id+'" db_obj="carrot.ai.chat"></i>';
                html+='</td>';
            html+='</tr>';
        });

        html+='</tbody>';
        html+='</table>';
        return html;
    }

    show_list_child(id_chat_father){
        carrot.loading("Get list chat child in ("+id_chat_father+")");
        var q=new Carrot_Query("chat-"+carrot.langs.lang_setting);
        q.add_where("pater",id_chat_father);
        q.set_limit(50);
        q.get_data((data)=>{
            console.log(data);
            carrot.hide_loading();
            var html='';
            html+=carrot.chat.list_data_chat_in_table(data);
            
            var frm=new Carrot_Form('ai_list_child',carrot);
            frm.set_title("child conversation list");

            var table_list=frm.create_field("table_list");
            table_list.set_type("msg");
            table_list.set_val(html);

            var btn_del_item=frm.create_btn();
            btn_del_item.set_icon('fa-solid fa-trash-can');
            btn_del_item.set_label("Delete items");
            btn_del_item.set_class("btn dev btn-primary");
            btn_del_item.set_act("carrot.chat.del_multiple()");

            frm.off_btn_done();
            frm.show();

            carrot.check_event();
        },()=>{
            carrot.msg("Error","error");
        });
    }

    check_event(){
        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            if(carrot.chat.show_type=="compare"){
                carrot.langs.lang_setting=key_change;
                carrot.chat.show_compare_msg_list();
            }
            else{
                carrot.chat.objs=null;
                carrot.langs.lang_setting=key_change;
                carrot.chat.list();
            }  
        });

        if(carrot.chat.obj_info_cur!=null) carrot.tool.list_other_and_footer("chat","func",carrot.chat.obj_info_cur.func);
        carrot.tool.box_app_tip("AI Lover");
        carrot.check_event();
    }

    get_info(id){
        carrot.loading("Get data ("+id+"-"+carrot.langs.lang_setting+")");
        carrot.server.get("chat-"+carrot.langs.lang_setting,id,(data)=>{
            carrot.chat.info(data);
        });
    }

    info(data){
        carrot.chat.obj_info_cur=data;
        carrot.change_title_page("Chat Info",carrot.url()+"?page=chat&id="+data.id_doc+"&lang_chat="+carrot.langs.lang_setting,"chat");
        carrot.chat.show_type="info";
        carrot.hide_loading();
        var html=carrot.chat.menu();
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_db("chat-"+carrot.langs.lang_setting);
        box_info.set_obj_js("chat");
        box_info.set_icon_font(carrot.chat.get_icon(data)+" fa-10x");
        box_info.set_name(data.key);

        if(data.sex_user=="0")
            box_info.add_attrs("fa-solid fa-mars text-primary",'<l class="lang" key_lang="sex">Sex</l>','<l class="lang" key_lang="boy">Boy</l>');
        else
            box_info.add_attrs("fa-solid fa-venus text-danger",'<l class="lang" key_lang="sex">Sex</l>','<l class="lang" key_lang="girl">Girl</l>');
        box_info.add_attrs("fa-brands fa-suse",'<l class="lang" key_lang="status">Status</l>',data.status);
        box_info.add_attrs("fa-solid fa-palette",'<l class="lang" key_lang="color">Color</l>',data.color);
        box_info.add_attrs("fa-solid fa-smile",'<l class="lang" key_lang="icon">Icon</l>',data.icon);
        box_info.add_attrs("fa-regular fa-calendar",'<l class="lang" key_lang="date_create">Date Create</l>',data.date_create);
        if(data.user.name!=undefined) box_info.add_attrs("fa-solid fa-user-nurse",'<l class="lang" key_lang="author">Author</l>',data.user.name);
        if(data.func!=undefined){
            var index_func=parseInt(data.func);
            box_info.add_attrs("fa-solid fa-atom",'Function',carrot.chat.funcs[index_func]);
        }
    
        if(data.link!="") box_info.add_attrs("fa-solid fa-link",'Link',data.link);
           
        box_info.set_protocol_url("ailover://data/"+data.id_doc);

        box_info.add_body('<i class="fa-solid fa-message"></i> '+data.key,'<i class="fa-solid fa-diagram-successor"></i> '+data.msg);

        data["collection"]="chat-"+carrot.langs.lang_setting;
        box_info.add_contain(carrot.rate.box_report(data));
        box_info.add_contain(carrot.rate.box_comment(data));

        html+=box_info.html();
        carrot.show(html);
        carrot.chat.check_event();
    }

    clone_chat(emp){
        var data_json=$(emp).data("json");
        var data_new=JSON.parse(decodeURIComponent(data_json));
        data_new["id"]="chat"+carrot.create_id();
        data_new["lang"]=carrot.langs.lang_setting;
        data_new["date_create"]=new Date().toISOString();
        var frm=carrot.chat.show_add_or_edit_chat(data_new).set_title("Clone Chat").set_msg_done("Add chat success!");
        if(carrot.chat.show_type=='compare')
            frm.set_act_done("carrot.chat.show_compare_msg_list()");
        else
            frm.set_act_done("carrot.chat.reload_list()");
        frm.show();
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

    delete_all_data(){
        carrot.msg("Delete all data success!","success");
        carrot.chat.reload_list();
    }

    replication(emp){
        var db_collection=$(emp).attr("db_collection");
        var db_document=$(emp).attr("db_document");
        carrot.get_doc(db_collection,db_document,this.replication_load_data);
    }

    replication_load_data(data,carrot){
        Swal.close();

        var list_lang=carrot.langs.list_lang;
        var html='';

        $.each(list_lang, function(index, lang) {
            if(lang.key!=carrot.langs.lang_setting){
                carrot.chat.translateData(data, lang.key);
            }
        });

        html+='<div class="modal-header">';
        html+='<h5 class="modal-title"><i class="fa-solid fa-viruses"></i> Replication</h5>';
        html+='<button type="button" class="close box_close" data-dismiss="modal" aria-label="Close"><i class="fa-solid fa-circle-xmark"></i></button>';
        html+='</div>';

        html+='<div id="frm_replication_all_item" class="modal-body">';

        html+='</div>';

        html+='<div class="modal-footer">';
            html+='<button id="btn_replication_close" type="button" class="btn btn-secondary box_close" data-dismiss="modal"><i class="fa-solid fa-circle-xmark"></i> Close</button>';
        html+='</div>';
        carrot.box(html);

        $(".box_close").click(function(){
            $('#box').modal('hide'); 
        });
    }

    translateData(data_chat, targetLanguage) {
        var apiUrl = "https://translation.googleapis.com/language/translate/v2?key="+carrot.config.key_api_google_translate;
        var keyData = {
            q: data_chat.key,
            target: targetLanguage
        };
        var msgData = {
            q: data_chat.msg,
            target: targetLanguage
        };

        $.when(
            $.post(apiUrl, keyData),
            $.post(apiUrl, msgData)
        ).done(function(keyResponse, msgResponse) {
            var key=keyResponse[0].data.translations[0].translatedText;
            var msg=msgResponse[0].data.translations[0].translatedText;
            data_chat.key=key.toLowerCase();
            data_chat.msg=msg.toLowerCase();
            data_chat.lang=targetLanguage;
            var html='<ul style="border-bottom: solid 1px lightgrey;">';
            html+='<li><b>'+data_chat.lang+'</b><li>';
            html+='<li>Key: <span style="color:black">'+data_chat.key+'</span><li>';
            html+='<li>Msg: <span style="color:black">'+data_chat.msg+'</span><li>';
            html+='</ul>';
            $("#frm_replication_all_item").append(html);
            carrot.set_doc("chat-"+data_chat.lang,data_chat.id,data_chat);
        });
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

    reload_list(){
        carrot.chat.objs=null;
        setTimeout(() => {
            carrot.chat.get_data(carrot.chat.load_list_by_data);
        }, 500);
    }

    list_for_home(){
        var html='';
        if(carrot.chat.objs!=null){
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="fa-solid fa-comment-dots"></i> <l class="lang" key_lang="chat">Chat</l>';
            html+='<span role="button" onclick="carrot.chat.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
            html+='<div id="other_football" class="row m-0">';
            $(carrot.random(carrot.chat.objs)).each(function(index,c){
                if(index<12){
                    c["index"]=index;
                    html+=carrot.chat.box_item(c).html();
                }else{
                    return false;
                }
            });
            html+='</div>';
        }
        return html;
    }
}

carrot.chat=new Chat();
if(carrot.call_show_on_load_pagejs) carrot.chat.show();