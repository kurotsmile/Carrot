class Ai_Lover{
    db;
    constructor(db_set) {
        this.db=db_set;
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

    show_setting_lang(){
        var html = '';
        html += '<table class="table table-striped" id="table_setting_lang">';
        html += '<thead class="thead-light">';
        html += '<tr>';
        html += '<th scope="col">Key</th>';
        html += '<th scope="col">Value</th>';
        html += '</tr>';
        html += '</thead>';
        $("#main_contain").html(html);
    }
}