class Carrot_About_Us{
    carrot;
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("about_us","carrot.about_us.show_page()","");
        var btn_page=carrot.menu.create("about_us","About us").set_icon("fa-solid fa-heart").set_lang("about_us");
        $(btn_page).click(function(){carrot.about_us.show_page();});
    }

    show_page(){
        this.carrot.change_title_page("About Us", "?p=about_us","about_us");
        $(this.carrot.body).load(this.carrot.get_url()+"about_us/" + this.carrot.lang+".html?ver="+this.carrot.get_ver_cur("page"));
    }
}