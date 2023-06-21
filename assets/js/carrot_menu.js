class Menu_Item{
    icon;
    name;
    label=null;
    act_click;
    father="list_menu_main";
    
    constructor(name){
        this.name=name;
        this.set_act(function(){ alert("No set");});
    }

    set_label(label){
        this.label=label;
        return this;
    }

    set_act(act){
        this.act_click=act;
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
        html+='<li id="'+this.name+'" class="border-bottom btn-menu dev">';
        html+='<i class="fa-solid fa-star-of-life fs-6 me-2"></i> '+this.label+'</li>';
        html+='</li>';
        return html;
    }
}

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
            console.log(this.list_menu[i].father+"->"+this.list_menu[i].html());
            $("#"+this.list_menu[i].father).append(this.list_menu[i].html());
        }

        for(var i=0;i<this.list_menu.length;i++){
            var item_m=this.list_menu[i];
            $("#"+item_m.name).click(function(){
                item_m.act_click();
            });
        }
    }
}