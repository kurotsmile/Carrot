class Fashion{

    objs=null;

    show(){
        carrot.server.list("block",(datas)=>{
            console.log(datas);
        });
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
        carrot.server.get_collection("character_fashion",(datas)=>{
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
        html+='<div class="row" id="all_fashion">'+carrot.loading_html()+'</div>';
        carrot.show(html);
        $(datas).each(function(index,fashion){
            fashion["index"]=index;
            $("#all_fashion").append(carrot.fashion.box_item(fashion).html());
        });
    }
}
carrot.fashion=new Fashion();
if(carrot.call_show_on_load_pagejs) carrot.fashion.show();