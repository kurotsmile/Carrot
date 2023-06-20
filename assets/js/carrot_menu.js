class Menu_Item{
    icon;
    name;
    label=null;
    act_click;
    
    constructor(name){
        this.name=name;
        this.set_act(function(){ alert("Thanh");});
    }

    set_label(label){
        this.label=label;
    }

    set_act(act){
        this.act_click=act;
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
    emp_menu;
    carrot;
    list_menu;
    
    constructor(carrot){
        this.carrot=carrot;
        this.emp_menu=$("#list_menu");
        this.list_menu=Array();
    }

    create_menu(name){
        var menu=new Menu_Item(name);
        this.list_menu.push(menu);
        return menu;
    }

    show(){
        var html='';
        for(var i=0;i<this.list_menu.length;i++){
            html+=this.list_menu[i].html();
        }
        $(this.emp_menu).append(html);

        for(var i=0;i<this.list_menu.length;i++){
            var item_m=this.list_menu[i];
            $("#"+item_m.name).click(function(){
                item_m.act_click();
            });
        }
    }
}