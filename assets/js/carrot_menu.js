class Menu_Item extends HTMLLIElement{
    icon="fa-solid fa-star-of-life";
    name;
    label=null;
    father="list_menu_main";
    mode="pub";
    key_lang=null;
    constructor(name){
        super();
        this.className="border-bottom btn-menu "+this.mode;
        this.name=name;
        this.setAttribute("id",name);
        this.id=name;
        this.innerHTML=this.html();
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
        if(type=='main'){
            this.father="list_menu_main";
            this.mode="pub border-bottom btn-menu";
        }
        else if(type=="dev"){
            this.father="list_menu_dev";
            this.mode="dev border-bottom btn-menu";
        }
        else if(type=="add"){
            this.father="list_menu_add";
            this.mode="dropdown-item btn";
        }
        else if(type=="setting"){
            this.father="list_menu_setting";
            this.mode="dropdown-item btn";
        }
        else this.father=type;

        this.className=this.mode;
        this.innerHTML=this.html();
        return this;
    }

    set_act(event){
        this.set_act_click(event);
        return this;
    }

    set_act_click(event){
        $(this).click(function(){eval(event);});
        return this;
    }

    set_lang(key){
        this.key_lang=key;
        this.innerHTML=this.html();
        return this;
    }

    html(){
        if(this.label==null) this.label=this.name;
        var html='';
        html='<i class="'+this.icon+' fs-6 me-2"></i>';
        if(this.key_lang!=""&&this.key_lang!=null) html+='<l class="lang" key_lang="'+this.key_lang+'">';
        html+=this.label;
        if(this.key_lang!=""&&this.key_lang!=null) html+='</l>';
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

    create(name){
        return this.create_menu(name);
    }

    show(){
        for(var i=0;i<this.list_menu.length;i++){
            $("#"+this.list_menu[i].father).append(this.list_menu[i]);
        }
    }
}