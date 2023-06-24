class Carrot_Langs{
    carrot;
    icon="fa-sharp fa-solid fa-language";

    constructor(carrot){
        this.carrot=carrot;
        carrot.menu.create("lang_setting").set_label("Lang").set_type("setting");
        var btn_add=carrot.menu.create("add_lang").set_label("Add Lang").set_icon(this.icon).set_type("add");
        var btn_list=carrot.menu.create("list_lang").set_label("List Lang").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){carrot.langs.list();});
    }

    list(){
        var html='';
        $(this.carrot.list_lang).each(function(index,lang){
            var item_lang=new Carrot_List_Item(this.carrot);
            item_lang.set_icon(lang.icon);
            item_lang.set_label(lang.name);
            html+=item_lang.html();
        });
        this.carrot.show(html);
    }
}