class Chat_Log{

    objs=null;

    show(){
        carrot.chat_log.list();
    }

    menu(){
        var html_menu='';
        html_menu+='<div class="row">';

        html_menu+='<div class="col-10 btn-sm">';
            html_menu+='<div role="group" aria-label="First group" class="btn-group btn-sm">';
                html_menu+=carrot.tool.btn_export("chat-log","Chat Log");
                html_menu+='<button onclick="carrot.chat_log.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
            html_menu+='</div>';
        html_menu+='</div>';

        html_menu+='<div class="col-2 text-end btn-sm">';
            html_menu+='<div role="group" aria-label="Last group" class="btn-group btn-sm">';
                    html_menu+='<button onclick="carrot.js(\'chat\',\'chat\',\'carrot.chat.list()\');return false;" type="button" class="btn btn-success btn-sm "><i class="fa-brands fa-rocketchat"></i> All Chat</button>';
                    html_menu+='<button onclick="carrot.chat_log.list();return false;" type="button" class="btn btn-success active btn-sm "><i class="fa-solid fa-cat"></i> Log</button>';
                    html_menu+='<button onclick="carrot.js(\'chat_block\',\'chat_block\',\'carrot.chat_block.show()\');return false;" type="button" class="btn  btn-success btn-sm "><i class="fa-solid fa-shield-halved"></i> Key Block</button>';
            html_menu+='</div>';
        html_menu+='</div>';

        html_menu+='</div>';
        return html_menu;
    }

    list(){
        carrot.loading("Get all data log chat");
        carrot.change_title("All Log Chat","?page=chat_log","chat_log");
        carrot.chat_log.get_data(carrot.chat_log.load_list_by_data);
    }

    get_data(act_done){
        if(carrot.chat_log.objs!=null){
            act_done(carrot.chat_log.objs);
        }else{
            var q=new Carrot_Query("chat-log");
            q.get_data((data)=>{
                carrot.chat_log.objs=data;
                act_done(data);
            });
        }
    }

    load_list_by_data(data){
        carrot.hide_loading();
        var html="";
        html+=carrot.chat_log.menu();
        html+='<div class="row" id="all_log"></div>';
        carrot.show(html);

        $(data).each(function(index,log){
            log["index"]=index;
            $("#all_log").append(carrot.chat_log.box_item(log).html());
        });
        carrot.check_event();
    }

    box_item(data){
        var box=new Carrot_List_Item(carrot);
        if(data.pater==null)
            box.set_icon_font("fa-solid fa-shield-cat");
        else
            box.set_icon_font("fa-solid fa-paw");
        box.set_name(data.key);
        if(data.pater_msg==null)
            box.set_tip(data.lang+ " "+data.pater);
        else
            box.set_tip('<i class="fa-solid fa-comment"></i> '+data.pater_msg);

        box.set_class_icon_col("col-2");
        box.set_class_body("col-10");
        box.set_class("col-3 mb-2");
        var html_body='<div class="dev">';
        html_body+='<button type="button" onclick="carrot.chat_log.delete(\''+data.index+'\')" class="btn btn-danger btn-sm m-1"><i class="fa-solid fa-trash-can"></i></button>';
        if(data.pater_msg==null)
            html_body+='<button type="button" onclick="carrot.chat_log.show_father(\''+data.index+'\')" class="btn btn-info btn-sm m-1"><i class="fa-solid fa-feather"></i></button>';
        else
            html_body+='<button type="button" onclick="carrot.chat_log.edit_chat_father(\''+data.index+'\')" class="btn btn-warning btn-sm m-1"><i class="fa-solid fa-pen-to-square"></i></button>';
        html_body+='<button type="button" onclick="carrot.chat_log.add_chat_with_father(\''+data.index+'\')" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-square-plus"></i></button>';
        html_body+='</div>';
        box.set_body(html_body);
        return box;
    }

    show_father(index){
        carrot.loading("Get chat father ("+carrot.chat_log.objs[index].pater+")");
        carrot.server.get("chat-"+carrot.chat_log.objs[index].lang,carrot.chat_log.objs[index].pater,(data)=>{
            carrot.hide_loading();
            carrot.chat_log.objs[index].pater_msg=data.msg;
            carrot.chat_log.load_list_by_data(carrot.chat_log.objs);
        });
    }

    add_chat_with_father(index){
        var data_new=carrot.chat.data_new_chat();
        var id_pater=carrot.chat_log.objs[index].pater;
        //data_new["sex_user"]=father_emp_sex_user;
        //data_new["sex_character"]=father_emp_sex_character;
        data_new["pater"]=id_pater;
        data_new["key"]=carrot.chat_log.objs[index].key;
        carrot.chat.show_add_or_edit_chat(data_new).set_title("Continue the conversation").set_msg_done("Add chat success!").show();
    }

    edit_chat_father(index){
        var id=carrot.chat_log.objs[index].pater;
        var lang=carrot.chat_log.objs[index].lang;
        if(carrot.chat!=null)
            carrot.chat.edit_chat_by_id(id,lang);
        else
            carrot.js("chat","chat","carrot.chat.edit_chat_by_id('"+id+"','"+lang+"')");
    }

    delete(index){
        carrot.chat_log.objs.splice(index,1);
        carrot.chat_log.load_list_by_data(carrot.chat_log.objs);
    }

    delete_all_data(){
        carrot.chat_log.objs=null;
        carrot.msg("Delete all data chat log","success");
    }
    
}
carrot.chat_log=new Chat_Log();
if(carrot.call_show_on_load_pagejs) carrot.chat_log.show();