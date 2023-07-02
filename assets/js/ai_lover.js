class Ai_Lover{
    key_block;
    chat;
    carrot;
    
    constructor(carrot) {
        this.carrot=carrot;
        this.chat=new AI_Chat(this.carrot);
        this.key_block=new AI_Key_Block(this.carrot);

        var btn_list_character_fashion=carrot.menu.create("character_fashion").set_label("Character fashion").set_icon("fa-solid fa-shirt").set_type("dev");
        $(btn_list_character_fashion).click(function(){
            carrot.ai.list_character_fashion();
        });

        var btn_test_pay=carrot.menu.create("test_pay").set_label("Test Play").set_icon("fa-brands fa-paypal").set_type("dev");
        $(btn_test_pay).click(function(){
            carrot.ai.html();
        });
    }

    html(){
        var html='';
        html+='<div class="d-flex align-items-center justify-content-center vh-100">';
        html+='<div class="text-center row">';
        html+='<div class=" col-md-6">';
        html+='<img src="images/404.png" alt="404" class="img-fluid">';
        html+='</div>';
        html+='<div class=" col-md-6 mt-5">';
        html+='<p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p>';
        html+='<p class="lead">';
        html+='The page you’re looking for doesn’t exist.';
        html+='</p>';
        html+='<a href="index.html" class="btn btn-primary" onClick="carrot.home()">Go Home</a>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        this.carrot.show(html);
    }

    list_character_fashion(){
        this.carrot.get_list_doc("character_fashion",this.done_list_character_fashion);
    }

    done_list_character_fashion(data,carrot){
        console.log(data);
        var list_fashion=carrot.obj_to_array(data);
        var html='';
        html+='<div class="row">';
        $(list_fashion).each(function(index,fashion){
            var item_fashion=new Carrot_List_Item(carrot);
            item_fashion.set_id(fashion.id);
            item_fashion.set_icon(fashion.icon);
            item_fashion.set_db("character_fashion");
            item_fashion.set_name(fashion.type);
            item_fashion.set_class_icon("pe-0 col-3");
            item_fashion.set_class_body("mt-2 col-9");
            var html_body='';
            html_body+='<div class="col-12">';
            if(item_fashion.buy=='0')
                html_body+='<i class="fa-solid fa-box-check"></i> Free';
            else
                html_body+='<i class="fa-solid fa-cart-shopping"></i> Buy';
            html_body+='</div>';
            item_fashion.set_body(html_body);
            html+=item_fashion.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }
    
}