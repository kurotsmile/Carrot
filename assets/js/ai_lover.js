class Ai_Lover{
    key_block;
    chat;
    carrot;
    
    constructor(carrot) {
        this.carrot=carrot;
        this.chat=new AI_Chat(this.carrot);
        this.key_block=new AI_Key_Block(this.carrot);
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