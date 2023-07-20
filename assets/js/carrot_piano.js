class Carrot_Piano{
    carrot;
    icon='fa-solid fa-soap';
    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("piano","carrot.piano.list()","carrot.piano.edit");
        carrot.menu.create("piano").set_act("carrot.piano.show();").set_icon(this.icon).set_type("dev");
    }

    add(){
        
    }

    show(){
        alert("Piano Show");
    }

    reload(){

    }
}