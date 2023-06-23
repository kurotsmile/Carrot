class AI_Key_Block{
    carrot;
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("block");
        carrot.menu.create_menu("add_key_block").set_label("Add Key Block").set_type("add");
        carrot.menu.create_menu("list_key_block").set_label("List Key Block").set_type("dev");
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