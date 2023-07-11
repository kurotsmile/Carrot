class Carrot_Pay{
    carrot;
    icon="fa-solid fa-bag-shopping";

    constructor(carrot){
        this.carrot=carrot;

        carrot.register_page("order","carrot.pay.list_order()");

        var btn_list_order=carrot.menu.create_menu("list_order").set_label("List Oreder").set_icon(this.icon).set_type("dev");
        $(btn_list_order).click(function(){
            carrot.pay.list_order();
        });
    }

    list_order(){
        this.carrot.get_list_doc("order",this.act_done_list_order);
    }

    act_done_list_order(data,carrot){
        carrot.change_title_page("Order","?p=order","order");
        var list_order=carrot.obj_to_array(data);
        var html='';

        html+='<div class="row">';
        $(list_order).each(function(index,order){
            var payer=order.payer;
            var item_order=new Carrot_List_Item(carrot);
            item_order.set_index(index);
            item_order.set_id(order.id);
            item_order.set_db("order");
            item_order.set_icon_font("fa-brands fa-product-hunt");
            item_order.set_name(payer.name.given_name);
            item_order.set_tip(payer.name.surname);
            item_order.set_class_icon("pe-0 col-3");
            item_order.set_class_body("mt-2 col-9");

            var html_body='';
            html_body+='<div class="col-12 text-success">';
            html_body+='status:'+order.status;
            html_body+='</div>';
            item_order.set_body(html_body);
            html+=item_order.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    list_product(){
        
    }
}