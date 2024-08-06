class Chat_Block{
    objs=null;

    show(){
        carrot.chat_block.list();
    }

    menu(){
        var html_menu='';
        html_menu+='<div class="row">';

        html_menu+='<div class="col-10 btn-sm">';
            html_menu+='<div role="group" aria-label="First group" class="btn-group btn-sm">';
                html_menu+=carrot.langs.list_btn_lang_select('btn-success','carrot.chat_block.change_lang');
                html_menu+=carrot.tool.btn_export("block","Key chat block");
                html_menu+='<button onclick="carrot.chat_block.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html_menu+='<button onclick="carrot.chat_block.add()" type="button" class="btn dev btn-info btn-sm"><i class="fa-solid fa-circle-plus"></i> Add Key</button>';
            html_menu+='</div>';
        html_menu+='</div>';

        html_menu+='<div class="col-2 text-end btn-sm">';
            html_menu+='<div role="group" aria-label="Last group" class="btn-group btn-sm">';
                    html_menu+='<button onclick="carrot.js(\'chat\',\'chat\',\'carrot.chat.list()\');return false;" type="button" class="btn btn-success btn-sm "><i class="fa-brands fa-rocketchat"></i> All Chat</button>';
                    html_menu+='<button onclick="carrot.js(\'chat_log\',\'chat_log\',\'carrot.chat_log.list()\');return false;" type="button" class="btn btn-success btn-sm "><i class="fa-solid fa-cat"></i> Log</button>';
                    html_menu+='<button onclick="carrot.chat_block.list();return false;" type="button" class="btn active btn-success btn-sm "><i class="fa-solid fa-shield-halved"></i> Key Block</button>';
            html_menu+='</div>';
        html_menu+='</div>';

        html_menu+='</div>';
        return html_menu;
    }

    list(){
        carrot.change_title("List Key Block",carrot.url()+"?page=chat_block","chat_block");
        carrot.loading("Get list key block chat");
        carrot.chat_block.get_data((data)=>{
            carrot.chat_block.load_list_by_data(data);
        });
    }

    load_list_by_data(data){
        carrot.hide_loading();
        var html=carrot.chat_block.menu();
        html+='<div class="row" id="list_key_block"><div>';
        carrot.show(html);
        $(data).each(function(index,block){
            $("#list_key_block").append(carrot.chat_block.box_item(block,index).html());
        });
        carrot.chat_block.check_event();
    }

    get_data(act_done){
        if(carrot.chat_block.objs!=null){
            act_done(carrot.chat_block.objs);
        }else{
            carrot.server.get_doc("block",carrot.langs.lang_setting,(data)=>{
                carrot.chat_block.objs=data["chat"];
                act_done(data["chat"]);
            });
        }
    }

    add(){
        carrot.chat_block.frm_add_or_edit("").set_title("Add Key Block").show();
    }

    frm_add_or_edit(val){
        var frm=new Carrot_Form("frm_key_block",carrot);
        frm.set_icon("fa-solid fa-user-shield");
        frm.create_field("key_block").set_label("Key").set_val(val).set_type("text");
        frm.off_btn_done();
        var btn=frm.create_btn();
        btn.set_icon("fa-solid fa-square-plus");
        btn.set_label("Done");
        btn.set_act("carrot.chat_block.act_done_frm()");
        return frm;
    }

    act_done_frm(){
        var key_block=$("#key_block").val();
        carrot.chat_block.objs.push(key_block);
        carrot.set_doc("block",carrot.langs.lang_setting,{chat:carrot.chat_block.objs});
        $('#box').modal('hide');
        carrot.chat_block.load_list_by_data(carrot.chat_block.objs);
    }
    
    box_item(val,index){
        var box=new Carrot_List_Item(carrot);
        box.set_icon_font("fa-solid fa-shield-halved");
        box.set_class_icon_col("col-2");
        box.set_class_body("col-10");
        box.set_class("col-3 mb-2");
        box.set_title(val);
        box.set_tip(val);
        if(carrot.mode_site=="dev") 
            box.set_act_click("carrot.chat_block.delete_item('"+index+"');");
        else
            box.set_act_click("carrot.msg('"+val+"');");
        return box;
    }

    delete_item(index){
        Swal.fire({
            title: 'Are you sure?',
            text: "Delete Key Block ("+carrot.chat_block.objs[index]+") ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed){
                carrot.chat_block.objs.splice(index,1);
                carrot.set_doc("block",carrot.langs.lang_setting,{chat:carrot.chat_block.objs});
                Swal.close();
                setTimeout(()=>{
                    carrot.chat_block.load_list_by_data(carrot.chat_block.objs);
                },500);
            }
        })
    }

    check_event(){
        carrot.check_event();
    }

    change_lang(key_change){
        carrot.langs.lang_setting=key_change;
        carrot.chat_block.objs=null;
        carrot.chat_block.list();
    }
 
    delete_all_data(){
        carrot.chat_block.objs=null;
        carrot.msg("Delete all data!","success");
    }
}

carrot.chat_block=new Chat_Block();
if(carrot.call_show_on_load_pagejs) carrot.chat_block.show();