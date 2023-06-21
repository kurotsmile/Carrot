class Menu_Item extends HTMLLIElement{
    icon="fa-solid fa-star-of-life";
    name;
    label=null;
    father="list_menu_main";
    
    constructor(name){
        super();
        this.innerHTML=this.html();
        this.className="border-bottom btn-menu dev";
    }

    set_label(label){
        this.label=label;
        this.innerHTML=this.html();
        return this;
    }

    set_icon(icon){
        this.icon=icon;
        this.innerHTML=this.html();
        return this;
    }

    set_type(type='main'){
        if(type=='main') this.father="list_menu_main";
        else if(type=="dev") this.father="list_menu_dev";
        else if(type=="add") this.father="list_menu_add";
        else this.father=type;
        return this;
    }

    html(){
        if(this.label==null) this.label=this.name;
        var html='';
        html+='<i class="'+this.icon+' fs-6 me-2"></i> '+this.label+'</li>';
        return html;
    }
}
customElements.define("menuitems-li", Menu_Item,{extends: 'li'});

class Carrot_Menu{
    carrot;
    list_menu;
    
    constructor(carrot){
        this.carrot=carrot;
        this.list_menu=Array();
    }

    create_menu(name){
        var menu=new Menu_Item(name);
        this.list_menu.push(menu);
        return menu;
    }

    show(){
        for(var i=0;i<this.list_menu.length;i++){
            $("#"+this.list_menu[i].father).append(this.list_menu[i]);
        }
    }
}