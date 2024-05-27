class Carrot_Privacy_Policy{

    constructor(){
        var btn_page=carrot.menu.create("privacy_policy","Privacy Policy").set_icon("fa-solid fa-heart").set_lang("privacy_policy").set_icon("fa-sharp fa-solid fa-building-shield");
        $(btn_page).click(function(){carrot.privacy_policy.show();});
    }

    show(){
        carrot.change_title_page("Privacy Policy", "?p=privacy_policy","privacy_policy");
        $(carrot.body).load(carrot.get_url()+"privacy_policy/" + carrot.lang+".html?ver="+carrot.get_ver_cur("page"));
        carrot.check_event();
    }
}