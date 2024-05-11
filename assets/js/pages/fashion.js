class Fashion{

    objs=null;

    show(){
        carrot.fashion.list();
    }

    list(){
        carrot.loading("Get all data fashion");
        carrot.change_title("All Fashion","?p=fashion","fashion");
        carrot.fashion.get_data(carrot.fashion.load_list_by_data);
    }

    get_data(act_done){
        carrot.fashion.get_data_from_server((datas)=>{
            act_done(datas);
        },()=>{
            carrot.msg("No list Fashion","error");
        });
    }

    get_data_from_server(act_done,act_fail){
        var q=new Carrot_Query("character_fashion");
        q.get_data((datas)=>{
            console.log(datas);
            carrot.fashion.objs=datas;
            act_done(datas);
        },act_fail);
    }

    box_item(data){
        var item_obj=new Carrot_List_Item(carrot);
        item_obj.set_title(data.id);
        return item_obj;
    }

    load_list_by_data(datas){
        carrot.hide_loading();
        var html='';
        html+='<div class="row" id="all_fashion"></div>';
        carrot.show(html);
        $(datas).each(function(index,fashion){
            fashion["index"]=index;
            $("#all_fashion").append(carrot.fashion.box_item(fashion).html());
        });
        carrot.check_event();
    }
}
carrot.fashion=new Fashion();
if(carrot.call_show_on_load_pagejs) carrot.fashion.show();