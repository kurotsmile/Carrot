class Ai_Lover{
    chat;
    carrot;
    setting_lang_change;
    setting_lang_collection;

    constructor(cr) {
        this.carrot=cr;
        this.setting_lang_change='';
        this.setting_lang_collection='';

        this.chat=new AI_Chat(this.carrot);

        var ai=this;
        var btn_list_chat=this.carrot.menu.create_menu("list_chat").set_label("List Chat").set_icon("fa-solid fa-comments").set_type("dev");
        $(btn_list_chat).click(function(){ai.show_all_chat(ai.carrot.lang);});
        var btn_add_chat=this.carrot.menu.create_menu("add_chat").set_label("Add Chat").set_icon("fa-solid fa-list").set_type("add");
        $(btn_add_chat).click(function(){ai.chat.show_add();});
    }

    show_all_chat(lang_show){
        this.setting_lang_change=lang_show;
        this.carrot.change_title_page("Ai Lover", "?p=chat","chat");
        this.carrot.db.collection("chat-"+this.setting_lang_change).where("status","==","pending").limit(100).get().then((querySnapshot) => {
            var obj_data=Object();
            querySnapshot.forEach((doc) => {
                var item_data=doc.data();
                item_data["id"]=doc.id;
                obj_data[doc.id]=JSON.stringify(item_data);
            });
            this.act_done_show_all_chat(obj_data,this.carrot);
        })
        .catch((error) => {
            this.carrot.log(error.message)
        });
    }

    act_done_show_all_chat(datas,carrot){
        var html='';
        html+='<div class="row m-0">';
            html+='<div class="col-12 m-0 btn-toolba" role="toolbar" aria-label="Toolbar with button groups">';
            html+='<div role="group" aria-label="First group">';
            html+=this.list_btn_lang_select();
            html+='</div>';
            html+='</div>';
        html+='</div>';
        html+='<div class="row m-0">';
        var list_data=carrot.convert_obj_to_list(datas);
        $(list_data).each(function(index,data){
            var item_list=new Carrot_List_Item(carrot);
            item_list.set_id(data.id);
            if(data.parent==null)
                item_list.set_icon_font("fa-sharp fa-solid fa-comment");
            else
                item_list.set_icon_font("fa-solid fa-comments");
            item_list.set_name(data.key);
            item_list.set_tip(data.msg);
            item_list.set_db_collection("chat-"+carrot.ai_lover.setting_lang_change);
            html+=item_list.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.ai_lover.check_event();
    }

    check_event(){
        var ai_lover=this;
        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            ai_lover.show_all_chat(key_change);
        });
        this.carrot.check_event();
    }

    list_btn_lang_select(){
        var html='';
        var ai_lover=this;
        html+='<div class="dropdown">';
        html+='<button class="btn btn-secondary dropdown-toggle btn-sm mr-1 mt-1 mb-1" type="button" id="btn_list_lang_ai" data-bs-toggle="dropdown" aria-expanded="true" >';
        html+='<i class="fa-solid fa-rectangle-list"></i> Change country';
        html+='</button>';
        html+='<div class="dropdown-menu" aria-labelledby="btn_list_lang_ai">';
        $.each(this.carrot.list_lang,function(i,lang){
            if(lang.key==ai_lover.setting_lang_change)
                html+='<button type="button" class="dropdown-item active btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
            else
                html+='<button type="button" class="dropdown-item  btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
        });
        html+='</div>';
        html+='</div>';
 
        return html;
    }


    done_edit_chat(data,carrot){
        if(data==null) $.MessageBox("Ứng dụng không còn tồn tại!");
        
        carrot.ai_lover.show_edit_object(data,carrot);
    }

    show_edit_object(data_obj,carrot){
        var obj_input=new Object();
        customer_field_for_db(data_obj,"chat-"+carrot.ai_lover.setting_lang_change,'id','Edit Obj Success');
        $.each(data_obj,function(key,val){
            var obj_emp=data_obj[key];
            if(key=="act_msg_success"){
                val=obj_emp.defaultValue;
                obj_input[key]={'defaultValue':val,'customClass':'d-none'};
            }
            else if(key=="db_collection"){
                val=obj_emp["defaultValue"];
                obj_input[key]={'defaultValue':val,'customClass':'d-none'};
            }
            else if(key=="db_doc"){
                val=obj_emp["defaultValue"];
                obj_input[key]={'defaultValue':val,'customClass':'d-none'};
            }
            else if(key=="act_name_before"){
                val=obj_emp["defaultValue"];
                obj_input[key]={'defaultValue':val,'customClass':'d-none'};
            }
            else{
                if(key=='color')
                obj_input[key]={'label':key,'defaultValue':val,'type':'color'};
                else if(key=='msg')
                    obj_input[key]={'label':key,'defaultValue':val,'type':'textarea'};
                else if(key=='status')
                    obj_input[key]={'label':key,'defaultValue':val,'type':'select', 'options':{'pending':'pending','passed':'passed','reserve':'reserve'}};
                else
                    obj_input[key]={'label':key,'defaultValue':val,'type':'input'};
            }
        });
        $.MessageBox({
            input:obj_input,
            buttonDone  : "Yes",
            buttonFail  : "No",
            message     : "Cập nhật đối tượng"
        }).done(carrot.act_done_add_or_edit);
    }

    show_setting_lang(data_lang_tag,data_lang_change){
        var html = '';
        var ai_lover=this;
        html +='<h3>Dịch thuật đa ngôn ngữ <small class="text-muted">'+this.setting_lang_collection+'</small></h3>';
        html +=this.list_btn_lang_select();
        html += '<table class="table table-striped table-hover mt-3" id="table_setting_lang">';
        html += '<thead class="thead-light">';
        html += '<tr>';
        html += '<th scope="col" class="w-10">Key</th>';
        html += '<th scope="col" class="w-25">Value</th>';
        html += '<th scope="col">New Lang</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody id="body_table_lang_setting">';
        
        $.each(data_lang_tag, function(key, value){
            var s_val_change='';
            if(data_lang_change!=null){
                if(data_lang_change[key]!=null){
                    s_val_change=data_lang_change[key];
                }
            }

            if(key=='id'&&s_val_change=='') s_val_change=ai_lover.setting_lang_change;
            html += '<tr>';
            html += '<td scope="col" class="w-10"><b>'+key+'</b></td>';
            html += '<td scope="col" class="w-25">';
                html += '<span id="txt_'+key+'">'+value+'</span> '
                if(key!='id') html += '<button class="btn btn-outline-secondary btn-sm" type="button" onclick="copy_txt_tag(\'txt_'+key+'\')"><i class="fa-solid fa-copy"></i></button> <button class="btn btn-outline-secondary btn-sm" type="button" onclick="tr(\'txt_'+key+'\',\''+ai_lover.setting_lang_change+'\')"><i class="fa-solid fa-language"></i></button>';
            html += '</td>';
            html += '<td scope="col">';
                html += '<div class="input-group">';
                    html += '<input id="inp_'+key+'" type="text" value="'+s_val_change+'" class="form-control inp-lang input-sm" data-key="'+key+'"/>';
                    html += '<div class="input-group-append">';
                    if(key!="id") html += '<button class="btn btn-outline-secondary" type="button" onclick="paste_tag(\'inp_'+key+'\')"><i class="fa-solid fa-paste"></i> Paste</button>';
                    if(data_lang_change.id=="en"&&key!="id") html += '<button class="btn btn-danger" type="button" onclick=" $(this).parent().parent().parent().parent().remove();"><i class="fa-solid fa-trash"></i> Delete</button>';
                    html += '</div>';
                html += '</div>';
            html += '</td>';
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';

        html+='<button id="btn_done_setting_lang" type="button" class="btn btn-primary mr-1 mt-1"><i class="fa-solid fa-square-check"></i> Done</button> ';
        if(data_lang_change.id=="en") html+='<button id="btn_add_field_setting_lang" type="button" class="btn btn-secondary mr-1 mt-1 btn-sm" ><i class="fa-solid fa-add"></i> Add Field</button>';
        $("#main_contain").html(html);
        if(data_lang_change.id=="en") document.getElementById("btn_add_field_setting_lang").onclick = event => {  this.add_field_for_setting_lang();}
        new DataTable('#table_setting_lang', {responsive: true,pageLength:1000});

        var carrot=this.carrot;

        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            carrot.show_setting_lang_by_key(key_change,ai_lover.setting_lang_collection);
        });

        $("#btn_done_setting_lang").click(function(){
            var data_inp_lang=new Object();
            $(".inp-lang").each(function(index,emp){
                var key_lang=$(this).attr("data-key");
                var val_lang=$(this).val();
                data_inp_lang[key_lang]=val_lang;
            });
            carrot.set_doc(ai_lover.setting_lang_collection,ai_lover.setting_lang_change,data_inp_lang);
            $.MessageBox("Cập nhật "+ai_lover.setting_lang_collection+" - "+ai_lover.setting_lang_change+" thành công!")
        });
    }

    add_field_for_setting_lang(){
        $.MessageBox({
            message: "Add Field for Setting language",
            input: {key:{'type':'text','label':'Key New Language'},value:{'type':'text','label':'Value New Language'}},
            top: "auto",
            buttonFail: "Cancel"
        }).done(function(data){
            var html_new_field='<tr>';
            html_new_field+='<td scope="col" class="w-10"><b>'+data.key+'</b></td>';
            html_new_field+='<td scope="col" class="w-25">New key <b class="text-danger">('+data.key+')</b></td>';
            html_new_field+='<td scope="col">';
                html_new_field += '<div class="input-group">';
                    html_new_field+='<input id="inp_'+data.key+'" type="text" value="'+data.value+'" class="form-control inp-lang input-sm" data-key="'+data.key+'"/>';
                    html_new_field+='<div class="input-group-append">';
                        html_new_field+='<button class="btn btn-outline-secondary" type="button" onclick="paste_tag(\'inp_'+data.key+'\')"><i class="fa-solid fa-paste"></i> Paste</button>';
                        html_new_field+='<button class="btn btn-danger" type="button" onclick=" $(this).parent().parent().parent().parent().remove();"><i class="fa-solid fa-trash"></i> Delete</button>';
                    html_new_field += '</div>'; 
                html_new_field += '</div>';   
            html_new_field+='</td>';
            html_new_field+='</tr>';
            $("#body_table_lang_setting").append(html_new_field);
        });
    }

    show_list_block_chat(list_key_block_chat){
        var html = '';
        var list_block_chat=list_key_block_chat.chat;
        this.setting_lang_change=list_key_block_chat.lang;
        html += this.list_btn_lang_select();
        html += '<table class="table table-striped table-hover mt-6" id="table_key_block">';
        html += '<thead class="thead-light">';
        html += '<tr>';
        html += '<th scope="col">Key Block</th>';
        html += '<th scope="col">Change</th>';
        html += '<th scope="col">Action</th>';
        html += '</tr>';
        html += '</thead>';

        html += '<tbody id="body_table_key_block">';
        for(var i = 0; i < list_block_chat.length; i++){
            html += '<tr>';
            html += '<td><b id="txt_'+i+'">'+list_block_chat[i]+'</b></td>';
            html += '<td><input class="form-control inp-key-block input-sm" id="inp_'+i+'" value="'+list_block_chat[i]+'"/></td>';
            html += '<td>';
                html+='<button class="btn btn-secondary mr-3" type="button" onclick="paste_tag(\'inp_'+i+'\')"><i class="fa-solid fa-paste"></i></button> ';
                html+='<button class="btn btn-secondary mr-3" type="button" onclick="tr(\'txt_'+i+'\',\''+this.setting_lang_change+'\')"><i class="fa-solid fa-language"></i></button> ';
                html+='<button class="btn btn-danger" type="button" onclick=" $(this).parent().parent().remove();"><i class="fa-solid fa-trash"></i></button>';
            html += '</td>';
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        html+='<button id="btn_done_change_key_block" type="button" class="btn btn-primary mr-1 mt-1"><i class="fa-solid fa-square-check"></i> Done</button> ';
        html+='<button id="btn_add_field_key_block" type="button" class="btn btn-secondary mr-1 mt-1 btn-sm" ><i class="fa-solid fa-add"></i> Add Field</button>';
        $("#main_contain").html(html);
        new DataTable('#table_key_block', {responsive: true,pageLength:1000});
        var carrot=this.carrot;
        var ai_lover=this;

        $("#btn_done_change_key_block").click(function(){
            var array_key_chat=Array();
            var data_add=Object();
            $(".inp-key-block").each(function(){
                array_key_chat.push($(this).val());
            });
            data_add["chat"]=array_key_chat;
            carrot.set_doc("block",ai_lover.setting_lang_change,data_add);
            $.MessageBox("Cập nhật các từ khóa cấm thành công!");
        });

        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            carrot.show_all_block_chat_by_lang(key_change);
        });

        document.getElementById("btn_add_field_key_block").onclick = event => {  this.add_field_for_table_key_block();}
    }

    add_field_for_table_key_block(){
        var carrot=this.carrot;
        var id_r=carrot.uniq();
        var ai_lover=this;
        $.MessageBox({
            message: "Add Field for key block",
            input: {value:{'type':'text','label':'Value New key block'}},
            top: "auto",
            buttonFail: "Cancel"
        }).done(function(data){
            var html_new_field='<tr>';
            html_new_field+='<td>New key <b class="text-danger">('+data.value+')</b></td>';
            html_new_field+= '<td><input class="form-control inp-key-block input-sm"  id="'+id_r+'" value="'+data.value+'"/></td>';
            html_new_field+='<td>';
                html_new_field+='<button class="btn btn-secondary mr-3" type="button" onclick="paste_tag(\''+id_r+'\')"><i class="fa-solid fa-paste"></i></button> ';
                html_new_field+='<button class="btn btn-secondary mr-3" type="button" onclick="tr_inp(\''+id_r+'\',\''+ai_lover.setting_lang_change+'\',\'vi\')"><i class="fa-solid fa-language"></i></button> ';
                html_new_field+='<button class="btn btn-danger" type="button" onclick=" $(this).parent().parent().remove();"><i class="fa-solid fa-trash"></i></button>'
            html_new_field+='</td>';
            html_new_field+='</tr>';
            $("#body_table_key_block").append(html_new_field);
        });
    }

    show_list_avatar(list_avatar){
        var html="<div class='row m-0'>";

        $(list_avatar).each(function(index,avatar_user){
            var data_avatar=avatar_user.data();
            data_avatar.id=avatar_user.id;
            html+="<div class='col-md-3 mb-3' id=\""+data_avatar.id+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                    html+='<div class="img-cover pe-0 col-3"><img class="rounded" style="width:85px;height:85px" src="'+data_avatar.icon+'" alt="'+data_avatar.id+'"></div>';
                    html+='<div class="det mt-2 col-9">';
                        html+="<h5 class='mb-2 fs-6'>"+data_avatar.type+"</h5>";
                        html+="<div class='btn btn_app_edit btn-warning btn-sm d-inline' app_id='"+data_avatar.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</div> ";
                        html+="<div class='btn btn_app_del btn-danger btn-sm d-inline' app_id='"+data_avatar.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</div>";
                    html+="</div>";
                html+="</div>";

            html+="</div>";
            html+="</div>";
        });
        html+="</div>";
        $("#main_contain").html(html);

        var carrot=this.carrot;
        var ai_lover=this;
        $(".btn_app_edit").click(async function () {
            var id_box_app = $(this).attr("app_id");
            carrot.get_doc("user-avatar",id_box_app,ai_lover.show_edit_avatar_done);
        });

        $(".btn_app_del").click(async function () {
            var id_box_app = $(this).attr("app_id");
            var item_ui=$(this).parent().parent().parent().parent();
            $.MessageBox({
                buttonDone  : 'Yes',
                buttonFail  : 'No',
                message     : "Bạn có chắc chắng là xóa <b>Avatar</b> "+id_box_app+" này không?"
            }).done(function(){
                $(item_ui).remove();
                carrot.act_del_obj("user-avatar",id_box_app);
            });
        });
    }

    show_edit_avatar_done(data_avatar,carrot){
        if(data_avatar!=null)
            carrot.ai_lover.show_box_add_or_edit_avatar(data_avatar,carrot.act_done_add_or_edit);
         else
            $.MessageBox("<b>Avatar</b> không còn tồn tại!");
    }

    show_box_add_or_edit_avatar(data_avatar,act_done){
        var carrot=this.carrot;
        var s_title_box='';
        if(data_avatar==null)s_title_box="<b>Add Avatar</b>";
        else s_title_box="<b>Update Avatar</b>";
        var obj_avatar = Object();
        obj_avatar["tip_avatar"] = { type: "caption", message: "Thông tin cơ bản" };
        if(data_avatar==null){
            data_avatar=Object();
            data_avatar["id"]=carrot.uniq();
            data_avatar["name"]='';
            data_avatar["type"]='boy';
        }else{
            if(data_avatar["id"]=="") data_avatar["id"]=carrot.uniq();
        }
        obj_avatar["id"]={'type':'input','defaultValue':data_avatar["id"], 'label':'ID'};
        obj_avatar["type"]={'type':'select','defaultValue':data_avatar["type"], 'label':'Type','options':{ "boy": "Boy", "girl": "Girl" }};
        obj_avatar["icon"]={'type':'input','defaultValue':data_avatar["icon"], 'label':'Image avatar (url)'};
        customer_field_for_db(obj_avatar,'user-avatar','id','Add Avatar successfully');
    
        $.MessageBox({
            message: s_title_box,
            input: obj_avatar,
            top: "auto",
            buttonFail: "Cancel"
        }).done(act_done);
    }
}