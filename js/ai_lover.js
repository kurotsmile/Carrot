class Ai_Lover{
    carrot;
    setting_lang_change;
    setting_lang_collection;

    constructor(cr) {
        this.carrot=cr;
        this.setting_lang_change='';
        this.setting_lang_collection='';
    }

    list_btn_lang_select(){
        var html='';
        var ai_lover=this;
        $.each(this.carrot.list_lang,function(i,lang){
            if(lang.key==ai_lover.setting_lang_change)
                html+='<button type="button" class="btn btn-light btn-sm mr-1 mt-1 mb-1 btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
            else
                html+='<button type="button" class="btn btn-secondary btn-sm mr-1 mt-1 mb-1 btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
        });
        return html;
    }

    async show_all_chat(querySnapshot) {
        var html = '';
        html +=this.list_btn_lang_select();
        html += '<table class="table table-striped mt-6" id="table_all_chat">';
        html += '<thead class="thead-light">';
        html += '<tr>';
        html += '<th scope="col">Key</th>';
        html += '<th scope="col">Msg</th>';
        html += '<th scope="col">Icon</th>';
        html += '<th scope="col">Action</th>';
        html += '</tr>';
        html += '</thead>';
    
        html += '<tbody>';
        querySnapshot.forEach((doc) => {
            var data_chat=doc.data();
            var s_icon_sex_character;
            var s_icon_sex_user;

            if(data_chat.sex_character=="0") s_icon_sex_character='<i class="fa-solid fa-venus"></i>';
            else  s_icon_sex_character='<i class="fa-solid fa-mars"></i>';

            if(data_chat.sex_user=="0") s_icon_sex_user='<i class="fa-solid fa-venus"></i>';
            else  s_icon_sex_user='<i class="fa-solid fa-mars"></i>';

            data_chat["id"]=doc.id;
            html += '<tr>';
            html += '<td>'+s_icon_sex_user+' '+data_chat['key']+'</td>';
            html += '<td>'+s_icon_sex_character+' '+data_chat['msg']+'</td>';
            html += '<td>'+data_chat['icon']+'</td>';
            html += '<td>';
            html += '<span type="button"  role="button" class="btn  .text-warning ai_lover_edit_chat btn-sm mr-1" id_doc="'+data_chat['id']+'"><i class="fa-solid fa-edit"></i> Edit</span> ';
            html += '<span type="button"  role="button" class="btn text-danger ai_lover_del_chat btn-sm" id_doc="'+data_chat['id']+'"><i class="fa-solid fa-trash"></i> Delete</span>';
            html += '</td>';
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';
        $("#main_contain").html(html);
        new DataTable('#table_all_chat', {responsive: true,pageLength:100});
    }

    show_edit_object(data_obj,act_done){
        var obj_input=new Object();
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
        }).done(act_done);
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
}