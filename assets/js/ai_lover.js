class Ai_Lover{
    key_block;
    chat;
    carrot;
    
    constructor(carrot) {
        this.carrot=carrot;
        this.chat=new AI_Chat(this.carrot);
        this.key_block=new AI_Key_Block(this.carrot);

        carrot.menu.create("character_fashion").set_label("Character fashion").set_icon("fa-solid fa-shirt").set_type("dev");
    }
}