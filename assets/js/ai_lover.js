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
            $.ajax({
                type: "POST",
                url: "https://api.pinterest.com/v5/pins",
                dataType: "json",
                data:{
                    "title": "Thanh thanh",
                    "link": "https://carrotstore.web.app",
                    "description": "desc.",
                    "dominant_color": "#ff5757",
                    "alt_text": "sample alt text",
                    "board_id": "Carrot Music",
                    "media_source": {
                        "source_type": "image_url",
                        "url": "https://carrotstore.web.app/images/logo.jpg"
                    },
                    "parent_pin_id": null
                },
                headers: {
                    "Authorization":"Bearer pina_AMA2BNIWACYHCAQAGBAIWD6SMHPABCIBQBIQCEEINRIW5V5XJWR5NSNIZIBIKE5O7ILYRWURDD3FAG7TKSTXTLOHLYJUDRAA",
                    "Content-Type":"application/json"
                },
                success: function (result) {
                    alert("Send success!");
                    console.log(result);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                }
            });
        });
    }
}