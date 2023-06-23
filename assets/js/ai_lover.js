class Ai_Lover{
    key_block;
    chat;
    carrot;
    setting_lang_change="en";
    setting_lang_collection;

    constructor(cr) {
        this.carrot=cr;
        this.setting_lang_change='';
        this.setting_lang_collection='';

        this.chat=new AI_Chat(this.carrot);
        this.key_block=new AI_Key_Block(this.carrot);
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
}