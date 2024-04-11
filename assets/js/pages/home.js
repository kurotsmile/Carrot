class Home{
    show(){
        var html='<div id="main_contain" class="section-container p-1 p-xl-2">';
        html+='<div id="all_app_contain" class="row"></div>';
        html+='</div>';
        carrot.show(html);
        if(carrot.appp==null)
            carrot.load_js_page("app","Appp","carrot.appp.show_for_home()");
        else
            carrot.appp.show_for_home();
        carrot.loading();
    }
}
carrot.home=new Home();
if(carrot.call_show_on_load_pagejs) carrot.home.show();