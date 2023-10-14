class AI_Key_Block{
    carrot;
    type_show="dev";
    constructor(carrot){
        this.carrot=carrot;
        var key_block=this;
        carrot.register_page("block","carrot.ai.key_block.list()","carrot.ai.key_block.edit");
        var btn_list=carrot.menu.create_menu("list_key_block").set_label("List Key Block").set_type("dev").set_icon("fa-solid fa-shield-halved");
        $(btn_list).click(function(){key_block.list();});
    }

    list(){
        this.carrot.change_title_page("Block Key","?p=block","block");
        this.show_list_by_key_lang(this.carrot.langs.lang_setting);
    }

    list_dev(){
        this.type_show="dev";
        this.list();
    }

    list_pub(){
        this.type_show="pub";
        this.list();
    }

    show_list_by_key_lang(s_key_lang){
        this.carrot.langs.lang_setting=s_key_lang;
        Swal.showLoading();
        this.carrot.db.collection("block").doc(s_key_lang).get().then((doc) => {
            if (doc.exists) {
                var data=doc.data();
                this.show_list_block_chat(data);
                Swal.close();
            } else { 
                console.log("No such document!");
                this.show_list_block_chat({chat:Array()});
                Swal.close();
            }
        }).catch((error) => {
            Swal.close();
            this.show_list_block_chat({chat:Array()});
            console.log("Error getting document:", error);
        });
    }

    add(){
        var data_key=new Object();
        data_key["key"]="";
        this.add_or_edit(data_key);
    }

    add_or_edit(data){
        var frm=new Carrot_Form("frm_key_block",this.carrot);
        frm.set_title("Add key block");
        frm.create_field("key").set_label("Key block").set_value(data["key"]);
        frm.show();
    }

    show_list_block_chat(data){
        var html = '';
        var list_block_chat=data.chat;
        var carrot=this.carrot;
        html+=carrot.ai.menu();
        
        if(this.type_show=="dev"){
            html+='<table class="table table-striped table-hover mt-6 table-responsive-sm" id="table_key_block">';
            html+='<thead class="thead-light">';
            html+='<tr>';
            html+='<th scope="col">Key Block</th>';
            html+='<th scope="col">Change</th>';
            html+='<th scope="col">Action</th>';
            html+='</tr>';
            html+='</thead>';
    
            html+='<tbody id="body_table_key_block">';
            for(var i = 0; i < list_block_chat.length; i++){
                html+='<tr>';
                html+='<td><b id="txt_'+i+'">'+list_block_chat[i]+'</b></td>';
                html+='<td><input class="form-control inp-key-block form-control-sm pt-0 pb-0 m-0" id="inp_'+i+'" value="'+list_block_chat[i]+'"/></td>';
                html+='<td>';
                    html+='<button class="btn btn-sm btn-secondary mr-3" type="button" onclick="paste_tag(\'inp_'+i+'\')"><i class="fa-solid fa-paste"></i></button> ';
                    html+='<button class="btn btn-sm btn-secondary mr-3" type="button" onclick="tr(\'txt_'+i+'\',\''+this.setting_lang_change+'\')"><i class="fa-solid fa-language"></i></button> ';
                    html+='<button class="btn btn-sm btn-danger" type="button" onclick=" $(this).parent().parent().remove();"><i class="fa-solid fa-trash"></i></button>';
                html+='</td>';
                html+='</tr>';
            }
            html+='</tbody>';
            html+='</table>';
            html+='<button id="btn_done_change_key_block" type="button" class="btn btn-primary mr-1 mt-1"><i class="fa-solid fa-square-check"></i> Done</button> ';
            html+='<button id="btn_add_field_key_block" type="button" class="btn btn-secondary mr-1 mt-1 btn-sm" ><i class="fa-solid fa-add"></i> Add Field</button>';
            this.carrot.show(html);
            new DataTable('#table_key_block', {responsive: true,pageLength:500});
            $("#btn_done_change_key_block").click(function(){
                var array_key_chat=Array();
                var data_add=Object();
                $(".inp-key-block").each(function(){
                    array_key_chat.push($(this).val());
                });
                data_add["chat"]=array_key_chat;
                carrot.set_doc("block",carrot.langs.lang_setting,data_add);
                carrot.msg("Cập nhật các từ khóa cấm ở quốc gia "+carrot.langs.lang_setting+" thành công!")
            });
            document.getElementById("btn_add_field_key_block").onclick = event => {  this.add_field_for_table_key_block();}

        }else{
            html+='<div class="row">';
            $(list_block_chat).each(function(index,data_key){
                var item_key=new Carrot_List_Item(carrot);
                item_key.set_index(index);
                item_key.set_icon_font("fa-solid fa-shield");
                item_key.set_name(data_key);
                item_key.set_class_body("mt-2 col-9");
                html+=item_key.html();
            });
            html+='</div>';
            this.carrot.show(html);
        }

        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            carrot.ai.key_block.show_list_by_key_lang(key_change);
        });
        carrot.check_event();
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
            html_new_field+= '<td><input class="form-control inp-key-block form-control-sm"  id="'+id_r+'" value="'+data.value+'"/></td>';
            html_new_field+='<td>';
                html_new_field+='<button class="btn btn-sm btn-secondary mr-3" type="button" onclick="paste_tag(\''+id_r+'\')"><i class="fa-solid fa-paste"></i></button> ';
                html_new_field+='<button class="btn btn-sm btn-secondary mr-3" type="button" onclick="tr_inp(\''+id_r+'\',\''+ai_lover.setting_lang_change+'\',\'vi\')"><i class="fa-solid fa-language"></i></button> ';
                html_new_field+='<button class="btn btn-sm btn-danger" type="button" onclick=" $(this).parent().parent().remove();"><i class="fa-solid fa-trash"></i></button>'
            html_new_field+='</td>';
            html_new_field+='</tr>';
            $("#body_table_key_block").append(html_new_field);
        });
    }
}