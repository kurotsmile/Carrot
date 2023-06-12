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
        console.log(this.carrot);
        var list_lang=this.carrot.list_lang;

        this.setting_lang_change=data_lang_change['id'];

        $.each(list_lang,function(i,lang){
            if(lang.key==data_lang_change.id)
                html+='<button type="button" class="btn btn-light btn-sm mr-1 mt-1"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
            else
                html+='<button type="button" class="btn btn-secondary btn-sm mr-1 mt-1"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
        });

        html += '<table class="table table-striped" id="table_setting_lang">';
        html += '<thead class="thead-light">';
        html += '<tr>';
        html += '<th scope="col">Key</th>';
        html += '<th scope="col">Value</th>';
        html += '<th scope="col">New Lang</th>';
        html += '</tr>';
        html += '</thead>';

        html += '<tbody>';
        $.each(data_lang_tag, function(key, value){
            var s_val_change='';
            if(data_lang_change!=null){
                if(data_lang_change[key]!=null){
                    s_val_change=data_lang_change[key];
                }
            }
            html += '<tr>';
            html += '<td scope="col"><b>'+key+'</b></td>';
            html += '<td scope="col">'+value+'</td>';
            html += '<td scope="col"><input type="text" value="'+s_val_change+'" class="form-control inp-lang input-sm" data-key="'+key+'"></td>';
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';

        html+='<button id="btn_done_setting_lang" type="button" class="btn btn-primary mr-1 mt-1">Done</button> ';
        $("#main_contain").html(html);
    }
}