class Home{
    show(){
        carrot.change_title_page("Home","?page=home","home");
        var html='<div id="main_contain" class="section-container p-1 p-xl-2">';
            html+='<div id="all_app_contain" class="row"><div class="col-12 text-center"><i class="fa-solid fa-spinner fa-3x fa-spin"></i></div></div>';
            html+='<div class="row">';
                html+='<div class="col-12"><h4 class="fs-6 fw-bolder my-3 mt-2 mb-4"><i class="fa-solid fa-store fs-6 me-2"></i> <l class="lang" key_lang="other_store">Other Store</l></h4></div>';
                html+='<div class="col-12"><div class="row" id="all_store_contain"><div class="col-12 text-center"><i class="fa-solid fa-spinner fa-3x fa-spin"></i></div></div></div>';
            html+='</div>';
        html+='</div>';

        html+=carrot.music.list_for_home();
        html+=carrot.code.list_for_home();
        html+=carrot.icon.list_for_home();
        html+=carrot.user.list_for_home();
        html+=carrot.audio.list_for_home();
        html+=carrot.radio.list_for_home();
        html+=carrot.bible.list_for_home();
        html+=carrot.ebook.list_for_home();

        carrot.show(html);

        carrot.music.check_event();
        carrot.code.check_event();
        carrot.icon.check_event();
        carrot.user.check_event();
        carrot.audio.check_event();
        carrot.radio.check_event();
        carrot.bible.check_event();
        carrot.ebook.check_event();


        if(carrot.appp==null)
            carrot.load_js_page("app","Appp","carrot.appp.show_for_home()");
        else
            carrot.appp.show_for_home();
        carrot.check_event();
    }
}
carrot.home=new Home();
if(carrot.call_show_on_load_pagejs) carrot.home.show();