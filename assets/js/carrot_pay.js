class Carrot_Product{
    carrot;
    title='';
    tip='';
    constructor(carrot){
        this.carrot=carrot;
    } 

    set_title(s_title){
        this.title=s_title;
        return this;
    }

    set_tip(s_tip){
        this.tip=s_tip;
        return this;
    }

    html(){
        var html='';
        html+='<div class="mt-2 col-md-4">';
        html+='<div class="card">';
            html+='<div class="card-header"><i class="fa-solid fa-basket-shopping fa-lg"></i> '+this.title+'</div>';
            html+='<div class="card-body">';
                html+='<h5 class="card-title">'+this.title+'</h5>';
                html+='<p class="card-text">'+this.tip+'</p>';
            html+='</div>';
            html+='<ul class="list-group list-group-flush">';
                html+='<li class="list-group-item">Cras justo odio</li>';
                html+='<li class="list-group-item">Dapibus ac facilisis in</li>';
                html+='<li class="list-group-item">Vestibulum at eros</li>';
            html+='</ul>';
            html+='<div class="card-body">';
            html+='<a onclick="carrot.show_pay(\''+this.title+'\',\''+this.title+'\',\''+this.tip+'\',\'5.00\',null);return false;" class="card-link btn btn-success"><i class="fa-brands fa-paypal"></i> Buy Now</a>';
            html+='<a onclick="carrot.show_pay(\''+this.title+'\',\''+this.title+'\',\''+this.tip+'\',\'5.00\',null);return false;" class="card-link btn btn-success"><i class="fa-solid fa-money-bill-wave"></i> Upgared</a>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }
}

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
        var html='';
        var free_package=new Carrot_Product(this.carrot);
        free_package.set_title("Free");
        free_package.set_tip("The package uses the system default, you can use the services as a test user. Please upgrade to use unlimited functions");

        var basic_package=new Carrot_Product(this.carrot);
        basic_package.set_title("Basic");
        basic_package.set_tip("The service package provides all the basic functions of the system and unlimited downloads");

        var pro_package=new Carrot_Product(this.carrot);
        pro_package.set_title("Pro");
        pro_package.set_tip("Full service package and additional premium features to make your experience perfect");

        var gold_package=new Carrot_Product(this.carrot);
        gold_package.set_title("Gold");
        gold_package.set_tip("Test package for developers providing basic functions and APIs");

        var sapphire_package=new Carrot_Product(this.carrot);
        sapphire_package.set_title("Sapphire");
        sapphire_package.set_tip("Packs unlimited Api functions and provides useful functions for developers");

        html+='<div class="row">';
        html+=free_package.html();
        html+=basic_package.html();
        html+=pro_package.html();
        html+=gold_package.html();
        html+=sapphire_package.html();
        html+='</div>';
        this.carrot.show(html);
    }
}