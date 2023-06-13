class Ai_Lover{
    carrot;
    setting_lang_change;
    setting_lang_collection;

    constructor(cr) {
        this.carrot=cr;
        this.setting_lang_change='';
        this.setting_lang_collection='';
    }

    async show_all_chat(querySnapshot) {
        var html = '';
        html += '<table class="table table-striped" id="table_all_chat">';
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
        var list_lang=this.carrot.list_lang;
        var ai_lover=this;

        html+='<h3>Dịch thuật đa ngôn ngữ <small class="text-muted">'+this.setting_lang_collection+'</small></h3>';

        $.each(list_lang,function(i,lang){
            if(lang.key==ai_lover.setting_lang_change)
                html+='<button type="button" class="btn btn-light btn-sm mr-1 mt-1 btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
            else
                html+='<button type="button" class="btn btn-secondary btn-sm mr-1 mt-1 btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
        });

        html += '<table class="table table-striped table-hover" id="table_setting_lang">';
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


}