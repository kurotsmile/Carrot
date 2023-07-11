class Ai_Lover{
    key_block;
    chat;
    carrot;
    
    constructor(carrot) {
        this.carrot=carrot;
        this.chat=new AI_Chat(this.carrot);
        this.key_block=new AI_Key_Block(this.carrot);

        carrot.register_page("character_fashion","carrot.ai.list_character_fashion()","carrot.ai.edit_character_fashion","carrot.ai.reload_characte_fashion");
        carrot.register_page("floor","carrot.ai.list_floor()");

        var btn_list_character_fashion=carrot.menu.create("character_fashion").set_label("Character fashion").set_icon("fa-solid fa-shirt").set_type("dev");
        $(btn_list_character_fashion).click(function(){
            carrot.ai.list_character_fashion();
        });

        var btn_list_floor=carrot.menu.create("list_floor").set_label("List Floor").set_icon("fa-solid fa-house-flood-water").set_type("dev");
        $(btn_list_floor).click(function(){
            carrot.ai.list_floor();
        });

        var btn_test_pay=carrot.menu.create("test_pay").set_label("Test Play").set_icon("fa-brands fa-paypal").set_type("dev");
        $(btn_test_pay).click(function(){
            carrot.show_error_connect_sever();
        });
    }

    html(){
        var html='';
        html+='<div class="d-flex align-items-center justify-content-center vh-100">';
        html+='<div class="text-center row">';
        html+='<div class=" col-md-6">';
        html+='<img src="images/404.png" alt="404" class="img-fluid">';
        html+='</div>';
        html+='<div class=" col-md-6 mt-5">';
        html+='<p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p>';
        html+='<p class="lead">';
        html+='The page you’re looking for doesn’t exist.';
        html+='</p>';
        html+='<a href="index.html" class="btn btn-primary" onClick="carrot.home()">Go Home</a>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        this.carrot.show(html);
    }

    list_character_fashion(){
        this.carrot.get_list_doc("character_fashion",this.done_list_character_fashion);
    }

    done_list_character_fashion(data,carrot){
        carrot.change_title_page("Character Fashion","?p=character_fashion","character_fashion");
        var list_fashion=carrot.obj_to_array(data);
        var html='';
        html+='<div class="row mb-2">';
            html+='<div class="col-12">';
            html+='<button class="btn btn-sm btn-success" onclick="carrot.ai.add_characte_fashion();return false;"><i class="fa-solid fa-square-plus"></i> Add characte fashion</button>';
            html+='</div>';
        html+='</div>';

        html+='<div class="row">';
        $(list_fashion).each(function(index,fashion){
            var item_fashion=new Carrot_List_Item(carrot);
            item_fashion.set_index(index);
            item_fashion.set_id(fashion.id);
            item_fashion.set_icon(fashion.icon);
            item_fashion.set_db("character_fashion");
            item_fashion.set_name(fashion.type);
            item_fashion.set_class_icon("pe-0 col-3");
            item_fashion.set_class_body("mt-2 col-9");
            item_fashion.set_act_edit("carrot.ai.edit_character_fashion");
            var html_body='';
            html_body+='<div class="col-12 fs-8">';
            if(fashion.buy=='0') html_body+='<i class="fa-solid fa-boxes-stacked text-success"></i> Free';
            else html_body+='<i class="fa-solid fa-cart-shopping text-info"></i> Buy';
            html_body+='<div class="d-block text-break"><b><i class="fa-solid fa-tape"></i> Img:</b> <a href="'+fashion.img+'" target="_blank">'+fashion.img+'</a></div>';
            html_body+='</div>';
            item_fashion.set_body(html_body);
            html+=item_fashion.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    edit_character_fashion(data,carrot){
        carrot.ai.frm_add_or_edit_fashion(data).set_title("Edit Fashion").set_msg_done("Update fashion success").show();
    }

    add_characte_fashion(){
        var skin_data=new Object();
        skin_data["id"]="";
        skin_data["img"]="";
        skin_data["icon"]="";
        skin_data["type"]="";
        this.frm_add_or_edit_fashion(skin_data).set_title("Add Fashion").set_msg_done("Add fashion success").show();
    }

    frm_add_or_edit_fashion(data){
        var frm=new Carrot_Form("frm_skin",this.carrot);
        frm.set_icon("fa-solid fa-shirt");
        frm.set_db("character_fashion","id");
        frm.create_field("id").set_label("ID").set_value(data["id"]).set_main();
        frm.create_field("icon").set_label("Icon").set_type("file").set_type_file("image/*").set_value(data["icon"]);
        frm.create_field("img").set_label("Iamge").set_type("file").set_type_file("image/*").set_value(data["img"]);
        frm.create_field("type").set_label("Type").set_value(data["type"]);
        frm.create_field("buy").set_label("Buy Status").add_option("0","Free").add_option("1","Buy").set_type("select").set_value(data["buy"]);
        return frm;
    }

    reload_characte_fashion(carrot){
        carrot.ai.list_character_fashion();
    }

    list_floor(){
        this.carrot.get_list_doc("floor",this.done_list_floor);
    }

    done_list_floor(data,carrot){
        carrot.change_title_page("Floor","?p=floor","floor");
        var list_floor=carrot.obj_to_array(data);
        var html='';

        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
        html+='<button class="btn btn-sm btn-success" onclick="carrot.ai.add_floor();return false;"><i class="fa-solid fa-square-plus"></i> Add Floor</button>';
        html+='</div>';
        html+='</div>';

        html+='<div class="row">';
        $(list_floor).each(function(index,floor){
            var item_floor=new Carrot_List_Item(carrot);
            item_floor.set_id(floor.id);
            item_floor.set_name(floor.id);
            item_floor.set_icon(floor.icon);
            item_floor.set_index(index);
            item_floor.set_class_icon("pe-0 col-3");
            item_floor.set_class_body("mt-2 col-9");
            item_floor.set_db("floor");
            item_floor.set_act_edit("carrot.ai.edit_floor");
            html+=item_floor.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    add_floor(){
        var data_floor_new=new Object();
        data_floor_new["id"]=this.carrot.create_id();
        data_floor_new["icon"]="";
        this.frm_add_or_edit_floor(data_floor_new).set_title("Add Floor").set_msg_done("Add floor success!").show();
    }

    edit_floor(data,carrot){
        carrot.ai.frm_add_or_edit_floor(data).set_title("Edit Floor").set_msg_done("Update floor success!").show();
    }

    frm_add_or_edit_floor(data){
        var frm=new Carrot_Form("frm_floor",this.carrot);
        frm.set_icon("fa-solid fa-seedling");
        frm.set_db("floor","id");
        frm.create_field("id").set_label("ID").set_value(data.id).set_main();
        frm.create_field("icon").set_label("Icon").set_value(data.icon).set_type("file").set_type_file("image/*");
        return frm;
    }
    
    menu(extension_menu='',class_btn='btn-success'){
        var html='';
        html+='<div class="row">';
            html+='<div class="col-6 m-0 btn-toolbar btn-sm" role="toolbar" aria-label="Toolbar with button groups">';
                html+='<div role="group" aria-label="First group"  class="btn-group mr-2 btn-sm">';
                    html+=carrot.langs.list_btn_lang_select(class_btn);
                html+='</div>';
                html+='<div role="group" aria-label="First group"  class="btn-group mr-2 btn-sm">';
                html+=extension_menu;
                html+='</div>';
            html+='</div>';

            html+='<div class="col-6 text-end btn-sm">';
                html+='<div role="group" aria-label="Last group" class="btn-group btn-sm">';
                    var css_active_chat="";
                    var css_active_key_block="";
                    if(this.carrot.id_page=="chat") css_active_chat="active";
                    if(this.carrot.id_page=="block") css_active_key_block="active";
                    html+='<button id="btn_list_key_block" onclick="carrot.ai.chat.list();return false;" type="button" class="btn '+class_btn+' btn-sm '+css_active_chat+'"><i class="fa-brands fa-rocketchat"></i> All Chat</button>';
                    html+='<button id="btn_list_key_block" onclick="carrot.ai.key_block.list_pub();return false;" type="button" class="btn '+class_btn+' btn-sm '+css_active_key_block+'"><i class="fa-solid fa-shield-halved"></i> Key Block</button>';
                html+='</div>';
            html+='</div>';
            
        html+='</div>';
        return html;
    }
}