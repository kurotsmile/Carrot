class Carrot_Product_Attribute{
    icon;
    name;
    type="none";
    bg_color='';
    text_color='';
    constructor(icon,name){
        this.icon=icon;
        this.name=name;
        return this;
    }

    unlimit(){
        this.type="unlimit";
        return this;
    }

    limit(){
        this.type="limit";
        return this;
    }

    none(){
        this.type="none";
        return this;
    }

    active(){
        this.bg_color='bg-success';
        this.text_color='text-white';
        return this;
    }

    unactive(){
        this.bg_color='';
        this.text_color='';
        return this;
    }

    html(){
        var html='';
        html+='<li class="list-group-item pt-1 pb-1 '+this.bg_color+' '+this.text_color+'"><i class="'+this.icon+'"></i> ';
        html+=this.name;
        if(this.type=="unlimit") html+='<i class="float-end fa-solid fa-circle-check text-success '+this.text_color+'"></i>';
        if(this.type=="limit") html+='<i class="float-end fa-solid fa-circle-exclamation text-warning '+this.text_color+'"></i>';
        if(this.type=="none") html+='<i class="float-end fa-solid fa-circle-xmark text-danger '+this.text_color+'"></i>';
        html+='</li>';
        return html;
    }
}

class Carrot_Product{
    carrot;
    id='';
    title='';
    tip='';
    price='0.00 ';
    attributes=Array();
    bg_color='';
    text_color='';
    is_active=false;
    constructor(carrot){
        this.carrot=carrot;
    } 

    set_id(id){
        this.id=id;
    }

    set_title(s_title){
        this.title=s_title;
        return this;
    }

    set_tip(s_tip){
        this.tip=s_tip;
        return this;
    }

    add_attr(obj_attr){
        this.attributes.push(obj_attr);
        return this;
    }

    set_price(s_price){
        this.price=s_price;
        return this;
    }

    active(){
        this.bg_color='bg-success';
        this.text_color='text-white';
        this.is_active=true;
        return this;
    }

    html(){
        var html='';
        var product=this;
        html+='<div class="mt-2 col-md-4">';
        html+='<div class="card '+this.bg_color+' '+this.text_color+'">';
            html+='<div class="card-header"><i class="fa-solid fa-basket-shopping fa-lg"></i> '+this.title+'</div>';
            html+='<div class="card-body">';
                html+='<h5 class="card-title text-success">'+this.title+'</h5>';
                html+='<p class="card-text">'+this.tip+'';
                html+='<span class="fs-3 text-success float-end mt-2">'+this.price+' <i class="fa-solid fa-dollar-sign"></i></span>';
                html+='</p>';
            html+='</div>';

            if(this.attributes.length>0){
                html+='<ul class="list-group list-group-flush fs-9 '+this.bg_color+' '+this.text_color+'">';
                $(this.attributes).each(function(index,attr){
                    if(product.is_active) attr.active();
                    else attr.unactive();
                    html+=attr.html();
                });
                html+='</ul>';
            }

            html+='<div class="card-body">';
            html+='<a data-id-product="'+this.id+'" data-name-product="'+this.title+'" data-tip-product="'+this.tip+'" data-price-product="'+this.price+'" onclick="carrot.pay.buy_product(this);return false;" class="card-link btn btn-success"><i class="fa-brands fa-paypal"></i> Buy Now</a>';
            html+='<a onclick="carrot.show_pay(\''+this.title+'\',\''+this.title+'\',\''+this.tip+'\',\''+this.price+'\',null);return false;" class="card-link btn btn-success"><i class="fa-solid fa-money-bill-wave"></i> Upgared</a>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }
}

class Carrot_Pay{
    carrot;
    icon="fa-solid fa-bag-shopping";
    id_product_temp='';

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("all_product","carrot.pay.list_product()");
        carrot.register_page("order","carrot.pay.list_order()");
        var btn_list_order=carrot.menu.create_menu("list_order").set_label("List Oreder").set_icon(this.icon).set_type("dev");
        $(btn_list_order).click(function(){carrot.pay.list_order();});
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
            item_order.set_class_icon("pe-0 col-md-3");
            item_order.set_class_body("mt-2 col-md-9");
            var purchase_units=order.purchase_units[0];
            var html_body='';
            html_body+='<div class="col-12 fs-9">';
                html_body+='<i class="fa-solid fa-thermometer"></i> status:<small class="text-success">'+order.status+'</small><br/>';
                html_body+='<i class="fa-solid fa-tag"></i> Product name:'+purchase_units.description+'<br/>';
                html_body+='<i class="fa-solid fa-money-bill"></i> Amount:'+purchase_units.amount.value+' '+purchase_units.amount.currency_code+'<br/>';
                html_body+='<i class="fa-solid fa-envelope"></i> Email:'+payer.email_address;
            html_body+='</div>';
            item_order.set_body(html_body);
            html+=item_order.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    list_product(){
        this.carrot.change_title_page("List Prodct","?p=all_product","all_product");
        var list_service=Array();
        var html='';
        //Attributes
        var attr_limit_download_song=new Carrot_Product_Attribute(this.carrot.music.icon,"Limit Download Song").limit();
        var attr_unlimit_download_song=new Carrot_Product_Attribute(this.carrot.music.icon,"Unlimit Download Song").unlimit();

        var attr_limit_download_code=new Carrot_Product_Attribute(this.carrot.code.icon,"Limit Download Code").limit();
        var attr_unlimit_download_code=new Carrot_Product_Attribute(this.carrot.code.icon,"Unlimit Download Code").unlimit();

        var attr_limit_download_icon=new Carrot_Product_Attribute(this.carrot.icon.icon,"Limit Download Icon").limit();
        var attr_unlimit_download_icon=new Carrot_Product_Attribute(this.carrot.icon.icon,"Unlimit Download Icon").unlimit();

        var attr_limit_download_bible=new Carrot_Product_Attribute(this.carrot.bible.icon,"Limit Download Bible").limit();
        var attr_unlimit_download_bible=new Carrot_Product_Attribute(this.carrot.bible.icon,"Unlimit Download Bible").unlimit();
        
        var attr_none_api_music=new Carrot_Product_Attribute("fa-solid fa-compact-disc","No Api Music").none();
        var attr_limit_api_music=new Carrot_Product_Attribute("fa-solid fa-compact-disc","Limit Api Music").limit();
        var attr_unlimit_api_music=new Carrot_Product_Attribute("fa-solid fa-compact-disc","UnLimit Api Music").unlimit();

        var attr_none_api_chat=new Carrot_Product_Attribute(this.carrot.ai.chat.icon,"No Api Music").none();
        var attr_limit_api_chat=new Carrot_Product_Attribute(this.carrot.ai.chat.icon,"Limit Api chat").limit();
        var attr_unlimit_api_chat=new Carrot_Product_Attribute(this.carrot.ai.chat.icon,"UnLimit Api chat").unlimit();

        var attr_none_public_app=new Carrot_Product_Attribute(this.carrot.app.icon,"No Public App").none();
        var attr_dev_public_app=new Carrot_Product_Attribute(this.carrot.app.icon,"Public Your App").unlimit();

        //Product Item
        var free_package=new Carrot_Product(this.carrot);
        free_package.set_id("free");
        free_package.set_title("Free");
        free_package.set_tip("The package uses the system default, you can use the services as a test user. Please upgrade to use unlimited functions");
        free_package.add_attr(attr_limit_download_song);
        free_package.add_attr(attr_limit_download_code);
        free_package.add_attr(attr_limit_download_icon);
        free_package.add_attr(attr_limit_download_bible);
        free_package.add_attr(attr_none_api_music);
        free_package.add_attr(attr_none_api_chat);
        free_package.add_attr(attr_none_public_app);
        list_service.push(free_package);

        var basic_package=new Carrot_Product(this.carrot);
        basic_package.set_id("basic");
        basic_package.set_title("Basic");
        basic_package.set_price("3.99");
        basic_package.set_tip("The service package provides all the basic functions of the system and unlimited downloads");
        basic_package.add_attr(attr_unlimit_download_song);
        basic_package.add_attr(attr_limit_download_code);
        basic_package.add_attr(attr_limit_download_icon);
        basic_package.add_attr(attr_unlimit_download_bible);
        basic_package.add_attr(attr_none_api_music);
        basic_package.add_attr(attr_none_api_chat);
        basic_package.add_attr(attr_none_public_app);
        list_service.push(basic_package);

        var pro_package=new Carrot_Product(this.carrot);
        pro_package.set_id("pro");
        pro_package.set_title("Pro");
        pro_package.set_price("9.99");
        pro_package.set_tip("Full service package and additional premium features to make your experience perfect");
        pro_package.add_attr(attr_unlimit_download_song);
        pro_package.add_attr(attr_unlimit_download_code);
        pro_package.add_attr(attr_unlimit_download_icon);
        pro_package.add_attr(attr_unlimit_download_bible);
        pro_package.add_attr(attr_limit_api_music);
        pro_package.add_attr(attr_limit_api_chat);
        pro_package.add_attr(attr_none_public_app);
        list_service.push(pro_package);

        var gold_package=new Carrot_Product(this.carrot);
        gold_package.set_id("gold");
        gold_package.set_title("Gold");
        gold_package.set_price("16.99");
        gold_package.set_tip("Test package for developers providing basic functions and APIs");
        gold_package.add_attr(attr_unlimit_download_song);
        gold_package.add_attr(attr_unlimit_download_code);
        gold_package.add_attr(attr_unlimit_download_icon);
        gold_package.add_attr(attr_unlimit_download_bible);
        gold_package.add_attr(attr_unlimit_api_music);
        gold_package.add_attr(attr_unlimit_api_chat);
        gold_package.add_attr(attr_none_public_app);
        list_service.push(gold_package);

        var sapphire_package=new Carrot_Product(this.carrot);
        sapphire_package.set_id("sapphire");
        sapphire_package.set_title("Sapphire");
        sapphire_package.set_price("30.99");
        sapphire_package.set_tip("Packs unlimited Api functions and provides useful functions for developers");
        sapphire_package.add_attr(attr_unlimit_download_song);
        sapphire_package.add_attr(attr_unlimit_download_code);
        sapphire_package.add_attr(attr_unlimit_download_icon);
        sapphire_package.add_attr(attr_unlimit_download_bible);
        sapphire_package.add_attr(attr_unlimit_api_music);
        sapphire_package.add_attr(attr_unlimit_api_chat);
        sapphire_package.add_attr(attr_dev_public_app);
        list_service.push(sapphire_package);

        html+='<div class="row">';
        var type_user_login=this.carrot.user.obj_login.type;
        $(list_service).each(function(index,product){
            if(type_user_login==product.id) product.active();
            html+=product.html();
        })
        html+='</div>';
        this.carrot.show(html);
        this.carrot.check_event();
    }

    buy_product(emp){
        var id_product=$(emp).data("id-product");
        var name_product=$(emp).data("name-product");
        var price_product=$(emp).data("price-product");
        var tip_product=$(emp).data("tip-product");
        carrot.pay.id_product_temp=id_product;
        carrot.show_pay(id_product,name_product,tip_product,price_product,carrot.pay.pay_success);
    }

    pay_success(){
        carrot.user.change_type_user(carrot.pay.id_product_temp);
        carrot.pay.list_product();
    }
}