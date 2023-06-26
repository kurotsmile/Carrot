class Ai_Lover{
    key_block;
    chat;
    carrot;
    
    constructor(carrot) {
        this.carrot=carrot;
        this.chat=new AI_Chat(this.carrot);
        this.key_block=new AI_Key_Block(this.carrot);

        carrot.menu.create("character_fashion").set_label("Character fashion").set_icon("fa-solid fa-shirt").set_type("dev");
        var btn_test_pay=carrot.menu.create("test_pay").set_label("Test Play").set_icon("fa-brands fa-paypal").set_type("dev");
        $(btn_test_pay).click(function(){
            carrot.show_pay();
        });
    }
}