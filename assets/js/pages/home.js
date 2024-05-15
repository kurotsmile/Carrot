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

        if(carrot.song!=null) html+=carrot.song.list_for_home();
        if(carrot.coder!=null) html+=carrot.coder.list_for_home();
        if(carrot.ico!=null) html+=carrot.ico.list_for_home();
        html+=carrot.user.list_for_home();
        if(carrot.audio!=null) html+=carrot.audio.list_for_home();
        if(carrot.radio!=null) html+=carrot.radio.list_for_home();
        if(carrot.bible!=null) html+=carrot.bible.list_for_home();
        html+=carrot.ebook.list_for_home();
        if(carrot.football!=null) html+=carrot.football.list_for_home();
        if(carrot.midi!=null) html+=carrot.midi.list_for_home();
        if(carrot.chat!=null) html+=carrot.chat.list_for_home();

        carrot.show(html);

        carrot.user.check_event();
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