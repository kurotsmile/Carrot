class Carrot_Privacy_Policy{
    carrot;
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("privacy_policy","carrot.privacy_policy.show_page()","");
        var btn_page=carrot.menu.create("privacy_policy","Privacy Policy").set_icon("fa-solid fa-heart").set_lang("privacy_policy").set_icon("fa-sharp fa-solid fa-building-shield");
        $(btn_page).click(function(){carrot.privacy_policy.show_page();});
    }

    show_page(){
        this.carrot.change_title_page("Privacy Policy", "?p=privacy_policy","privacy_policy");
        $(this.carrot.body).load(this.carrot.get_url()+"privacy_policy/" + this.carrot.lang+".html?ver="+this.carrot.get_ver_cur("page"));
        this.carrot.check_event();
    }
}