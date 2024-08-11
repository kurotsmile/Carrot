//carrot.change_title_page("Pay", "?page=pay","Pay");
var id_product=cr.arg("id");
var title_product=decodeURI(cr.arg("title"));
var description_product=decodeURI(cr.arg("description"));
var price_product=cr.arg("price");
var user_id=cr.arg("user_id");
var user_lang=cr.arg("user_lang");
var user_name=decodeURI(cr.arg("user_name"));
var type_product=cr.arg("type");
var id_order=cr.arg("id_order");

var html='';

var data_pay=new Object();
data_pay["user_id"]=user_id;
data_pay["user_lang"]=user_lang;
data_pay["id_product"]=id_product;
data_pay["id_order"]=id_order;
data_pay["price"]=price_product;
data_pay["type_product"]=type_product;
carrot["in_app_pay"]=data_pay;

html+='<div class="row">';
    html+='<div class="mt-2 col-md-6">';
        html+='<div class="card">';
            html+='<div class="card-header"><i class="fa-solid fa-basket-shopping fa-lg"></i> Pay Product</div>';
            html+='<div class="card-body">';
                html+='<h5 class="card-title text-success">'+title_product+'</h5>';
                html+='<p class="card-text">'+id_product+'</p>';
                html+='<p class="card-text">';
                html+=description_product;
                html+='<span class="fs-3 text-success float-end mt-2">'+price_product+'  <i class="fa-solid fa-dollar-sign"></i></span>';
                html+='</p>';
            html+='</div>';

            html+='<ul class="list-group list-group-flush fs-9  ">';
                html+='<li class="list-group-item pt-1 pb-1"><i class="fa-solid fa-shield-heart"></i> All transaction information is absolutely confidential <i class="float-end fa-solid fa-circle-check text-success"></i></li>';
                html+='<li class="list-group-item pt-1 pb-1"><i class="fa-solid fa-shield-cat"></i> Replace payment on paypal platform <i class="float-end fa-solid fa-circle-check text-success"></i></li>';
                if(user_id!=""){
                    if(user_name=="undefined"){
                        user_name=user_id;
                        html+='<li class="list-group-item pt-1 pb-1"><i class="fa-solid fa-user-shield"></i> '+user_name+'-('+user_lang+') <i class="float-end fa-solid fa-circle-check text-success"></i></li>';
                    }else{
                        html+='<li class="list-group-item pt-1 pb-1"><i class="fa-solid fa-user-shield"></i> '+user_name+' <i class="float-end fa-solid fa-circle-check text-success"></i></li>';
                    }
                }
                html+='<li class="list-group-item pt-1 pb-1"><i class="fa-solid fa-umbrella"></i> Click the buy now button to start ordering and paying for the product. Once you have paid, return to the application or game to start using the service and purchased products.</li>';
            html+='</ul>';

            html+='<div class="card-body">';
                html+='<button onclick="pay_product();return false;" class="card-link btn btn-success"><i class="fa-brands fa-paypal"></i> Buy Now</button>';
            html+='</div>';

        html+='</div>';
    html+='</div>';
html+='</div>';
carrot.show(html);

carrot.check_event();

function pay_product(){
    carrot.show_pay(id_product,title_product,description_product,price_product,pay_in_app_success);
}

function pay_in_app_success(){
    carrot.msg("Successful payment, please return to the application to use the services or products purchased!","success");
}