class Chat{

    show(){
        carrot.change_title_page("All Chat","?page=chat","All Chat");
        var html='<div id="all_chat" class="row"></div>';
        carrot.show(html);
        var q=new Carrot_Query("chat-vi");
        q.set_limit(100);
        q.get_data((chats)=>{
            $(chats).each(function(index,c){
                $("#all_chat").append(carrot.chat.box_item(c).html());
            });
        });
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

        if(carrot.ai.chat.where_c!=s_key){
            s_btn_extra=s_btn_extra+'<div role="button" class="dev btn btn-success btn-sm mr-2" onclick="carrot.ai.chat.get_list_by_key(\'key\',\''+s_key+'\');return false;"><i class="fa-solid fa-comment-dots"></i></div>';
        }
 
        item_list.set_index(data.index);
        item_list.set_id(data.id);

        if(data.pater!=''&&data.pater!='0'){
            s_btn_extra=s_btn_extra+'<div role="button" db_collection="chat-'+carrot.langs.lang_setting+'" db_document="'+data.pater+'" class="dev btn btn_app_edit bg-secondary text-white btn-sm mr-2" onclick="carrot.ai.chat.edit" db_obj="carrot.ai.chat"><i class="fa-solid fa-feather"></i></div>';
        }

        s_btn_extra=s_btn_extra+'<div role="button" db_collection="chat-'+carrot.langs.lang_setting+'" db_document="'+data.id+'" class="dev btn bg-info text-white btn-sm mr-2" onclick="carrot.ai.chat.replication(this)" db_obj="carrot.ai.chat"><i class="fa-solid fa-viruses"></i></div>';

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

        if(carrot.ai.chat.show_type=="compare"&&data.lang=="vi"){
            s_body+='<i id="btn_clone_chat" role="button" data-json="'+encodeURIComponent(JSON.stringify(data))+'" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id+'" onclick="carrot.ai.chat.clone_chat(this);return false;" class="fa-solid fa-clone dev float-end fa-2x text-success m-1"></i>';
        }else{
            s_body+='<i id="btn_add_father_chat" role="button" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id+'" onclick="carrot.ai.chat.add_chat_with_father(this);return false;" class="fa-solid fa-square-plus float-end fa-2x text-success m-1"></i>';
            s_body+='<i id="btn_clone_chat" role="button" data-json="'+encodeURIComponent(JSON.stringify(data))+'" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" id_chat="'+data.id+'" onclick="carrot.ai.chat.clone_chat(this);return false;" class="fa-solid fa-clone dev float-end fa-2x text-success m-1"></i>';
            if(data.lang!="vi") s_body+='<i id="btn_translate_chat" role="button" onclick="tr_emp(\'chat_msg_'+data.index+'\',\''+carrot.langs.lang_setting+'\',\'vi\');return false;" class="fa-solid fa-language float-end fa-2x text-success m-1 dev"></i>';
            s_body+='<i id="btn_list_child_chat" role="button" onclick="carrot.ai.chat.show_list_child(\''+data.id+'\');return false;" class="fa-solid fa-comments float-end fa-2x text-success m-1"></i>';
            s_body+='<i id="btn_check_same_chat" role="button" sex_user="'+data.sex_user+'" sex_character="'+data.sex_character+'" key_chat="'+data.key+'" onclick="carrot.ai.chat.show_check_same_key(this);return false;" class="fa-solid fa-rectangle-list float-end fa-2x text-success m-1"></i>';
        }

        item_list.set_body('<div class="col-12">'+s_body+'</div>');
        item_list.set_class_body("mt-2 col-11 fs-9");
        item_list.set_db("chat-"+carrot.langs.lang_setting);
        item_list.set_obj_js("carrot.ai.chat");
        item_list.set_act_edit("carrot.ai.chat.edit");
        return item_list;
    }

    add(){
        carrot.chat.show_add_or_edit_chat(carrot.chat.data_new_chat()).set_title("Add chat").set_msg_done("Add Chat Success!").show();
    }

    data_new_chat(){
        var data_new_chat=Object();
        data_new_chat["id"]="chat"+carrot.create_id();
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
        data_new_chat["act"]="";
        data_new_chat["face"]="0";
        data_new_chat["func"]="";
        data_new_chat["mp3"]="";
        data_new_chat["link"]="";
        data_new_chat["pater"]="";
        data_new_chat["user"]=this.carrot.user.get_user_login();
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
        frm.create_field("key").set_label("Key").set_val(data["key"]).set_tip("Câu hỏi người dùng đối với Ai").add_btn(btn_translate_key).add_btn(btn_add_msg).add_btn_toLower();
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
        var btn_random_action=new Carrot_Btn();
        btn_random_action.set_icon("fa-solid fa-shuffle");
        btn_random_action.set_act("carrot.ai.chat.sel_random_action()");
        var btn_list_action=new Carrot_Btn();
        btn_list_action.set_icon("fa-solid fa-list");
        btn_list_action.set_act("carrot.ai.chat.show_list_category_action_animations()");
        frm.create_field("act").set_label("Action").set_val(data["act"]).add_btn(btn_random_action).add_btn(btn_list_action);

        var btn_random_face=new Carrot_Btn();
        btn_random_face.set_icon("fa-solid fa-shuffle");
        btn_random_face.set_act("carrot.ai.chat.sel_random_face()");
        var field_face=frm.create_field("face").set_label("Face").set_val(data["face"]).set_type("select").add_btn(btn_random_face);
        for(var i=0;i<=18;i++) field_face.add_option(i,"Face "+i);
        var field_func=frm.create_field("func").set_label("Function App").set_val(data["func"]).set_type("select");
        for (let i = 0; i < this.funcs.length; i++) {
            field_func.add_option(i,this.funcs[i]);
        }

        frm.create_field("mp3").set_label("Mp3 (Url audio)").set_val(data["mp3"]);

        var btn_add_func_sys=new Carrot_Btn();
        btn_add_func_sys.set_icon("fa-solid fa-square-plus");
        btn_add_func_sys.set_act("carrot.ai.chat.add_sys_fnc_for_link_field()");
        frm.create_field("link").set_label("Link (url Web or  URL scheme App)").set_val(data["link"]).add_btn(btn_add_func_sys);
        frm.create_field("pater").set_label("Pater").set_val(data["pater"]).set_tip("Father chat details");
        frm.create_field("pater_details").set_label("Pater Details").set_val("Preview Pater Details").set_type("msg");
        frm.create_field("user").set_label("User").set_val(data["user"]).set_type("user");
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        frm.create_field("lang").set_label("Lang").set_type("lang").set_val(data["lang"]);

        var btn_list_child=new Carrot_Btn();
        btn_list_child.set_icon("fa-solid fa-child");
        btn_list_child.set_act("carrot.ai.chat.show_list_child('"+data["id"]+"')");
        frm.add_btn(btn_list_child);
        return frm;
    }

    sel_random_action(){
        var random_action=Math. floor(Math. random() * this.list_animation_act.length);
        $('#act').val(this.list_animation_act[random_action]);
    }

    show_list_category_action_animations(){
        var html='';
        $.each(this.obj_animations, function(k,v) {
            html+='<button onclick="carrot.ai.chat.show_list_action_animations_by_cat(\''+k+'\');" class="btn btn-sm btn-info m-1"><i class="fa-solid fa-radiation"></i> '+v.name+'</button>';
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
            html+='<button onclick="carrot.ai.chat.sel_action_animation(\''+v.name+'\');" class="btn btn-sm btn-info m-1"><i class="fa-solid fa-person-running"></i> '+v.name+'</button>';
        });

        Swal.fire({
            title:"List Category Actions",
            html:html
        });
    }

    
}

carrot.chat=new Chat();
if(carrot.call_show_on_load_pagejs) carrot.chat.show();