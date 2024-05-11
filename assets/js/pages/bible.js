class Bible{

    objs=null;

    show(){
        carrot.show("sdsd");
    }

    get_data(act_done){

    }

    get_data_form_server(act_done){

    }

    get_data_form_db(act_done,act_fail){

    }

    box_item(book){
        var item_book=new Carrot_List_Item(carrot);
        item_book.set_id(book.id);
        item_book.set_class("col-12 mt-1");
        item_book.set_icon_font("fa-solid fa-book bible_icon");
        item_book.set_class_body("col-11");
        item_book.set_name(book.name);
        item_book.set_db("bible");
        item_book.set_act_edit("carrot.bible.edit_book");
        var html_body='';
        html_body+='<div class="col-6">'+book.name+'</div>';
        html_body+='<div class="col-6 dev text-end">';
            html_body+='<i role="button" book_name="'+book.id_doc+'" onclick="carrot.bible.list_chapter(this)" class="fa-solid fa-rectangle-list m-1"></i>';
            html_body+='<i role="button" book_name="'+book.id_doc+'" onclick="carrot.bible.add_chapter_to_book(this)" class="fa-solid fa-folder-plus m-1"></i>';
        html_body+='</div>';
        item_book.set_body(html_body);
        return item_book;
    }

}
carrot.bible=new Bible();
if(carrot.call_show_on_load_pagejs) carrot.bible.show();