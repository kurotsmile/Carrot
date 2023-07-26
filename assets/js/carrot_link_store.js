class Carrot_Link_Store{
    carrot;
    icon="fa-solid fa-store";
    icon_share="fa-solid fa-share-nodes";
    list_link_store=null;
    list_link_share=null;

    constructor(carrot){
        this.carrot=carrot;
        this.load_obj_link_store();

        carrot.register_page("link_store","carrot.link_store.list()","carrot.link_store.edit");
        carrot.register_page("link_share","carrot.link_store.list_share()","carrot.link_store.edit_share");

        carrot.menu.create("add_link_store").set_label("Add Link Store").set_icon(this.icon).set_type("add").set_act("carrot.link_store.add()");
        carrot.menu.create("list_link_store").set_label("List Store").set_icon(this.icon).set_type("dev").set_act("carrot.link_store.list()");

        carrot.menu.create("add_link_share").set_label("Add Link Share").set_icon(this.icon_share).set_type("add").set_act("carrot.link_store.add_share()");
        carrot.menu.create("list_link_share").set_label("List Link Share").set_icon(this.icon_share).set_type("dev").set_act("carrot.link_store.list_share()");
    }

    load_obj_link_store(){
        if(localStorage.getItem("link_store")!=null) this.list_link_store=JSON.parse(localStorage.getItem("link_store"));
    }

    load_obj_link_share(){
        if(localStorage.getItem("link_share")!=null) this.list_link_store=JSON.parse(localStorage.getItem("link_share"));
    }

    save_list_link_store(){
        localStorage.setItem("link_store", JSON.stringify(this.list_link_store));
    }

    save_list_link_share(){
        localStorage.setItem("link_share", JSON.stringify(this.list_link_share));
    }

    get_all_data_link_store(act_done=null) {
        var carrot=this.carrot;
        var link_store=this;
        carrot.load_bar();
        carrot.log("get_all_data_link_store From sever");
        carrot.db.collection("link_store").get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                link_store.list_link_store=Array();
                querySnapshot.forEach((doc) => {
                    var data_link_store=doc.data();
                    data_link_store["id"]=doc.id;
                    link_store.list_link_store.push(data_link_store);
                });
                link_store.save_list_link_store();
                carrot.update_new_ver_cur("link_store",true);
                if(act_done!=null) act_done(carrot);
            }
        }).catch((error) => {
            carrot.log(error.message)
        });
    };

    list(){
        if(list_link_store==null){
            this.get_all_data_link_store(this.list_show);
        }
        else{
            this.carrot.log("Load data linkstore from cache");
            this.list_show(this.carrot);
        }
    }

    list_show(carrot){
        carrot.change_title_page("All Store","?p=link_store","link_store");
        carrot.show(carrot.link_store.get_list_box_html(this.list_link_store));
        carrot.check_event();
    }

    get_list_box_html(list_link_store){
        var html = '';
        html = '<div class="row">';
        $(list_link_store).each(function (index, store) {
            var item_store = new Carrot_List_Item(carrot);
            item_store.set_db("link_store");
            item_store.set_id(store.key);
            item_store.set_icon(store.img);
            item_store.set_name("<i class='" + store.icon + "'></i> " + store.name);
            item_store.set_class("col-md-2 mb-2 col-sm-3");
            item_store.set_class_icon("col-md-12 mb-3 col-12 text-center");
            item_store.set_tip(store.key);
            item_store.set_body("<div class='col-12 mb-2 mt-2'><a target='_blank' href='" + store.link + "' class='btn btn-sm btn-success'><i class='fa-brands fa-instalod'></i> <l class='lang' key_lang='visit'>Go to</l></a></div>");
            html += item_store.html();
        });
        html += '</div>';
        return html;
    }

    add(){
        var data_new=new Object();
        data_new["icon"]="";
        data_new["img"]="";
        data_new["key"]="";
        data_new["name"]="";
        data_new["link"]="";
        this.frm_add_or_edit(data_new).set_title("Add Store").show();
    }

    edit(data,carrot){
        carrot.link_store.frm_add_or_edit(data).set_title("Update Store").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_link_store",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("link_store","key");
        frm.create_field("key").set_label("Key").set_val(data["key"]);
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon (Font)").set_val(data["icon"]);
        frm.create_field("img").set_label("Image (Url)").set_val(data["img"]).set_type("file").set_type_file("image/*");
        frm.create_field("link").set_label("Link All App").set_val(data["link"]);
        return frm;
    }

    list_for_home(){
        var html='';
        if(this.list_link_store!=null){
            var list_store=this.list_link_store;
            list_store=list_store.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4"><i class="fa-solid fa-store fs-6 me-2"></i> <l class="lang" key_lang="other_store">Other Store</l></h4>';
            html+='<div id="other_store" class="row m-0">';
            html+=this.get_list_box_html(list_store);
            html+="</div>";
        }
        return html;
    }

    add_share(){
        var new_data=new Object();
        new_data["name"]="";
        this.frm_add_or_edit_link_share(new_data).set_title("Add Link Share").show();
    }

    edit_share(data,carrot){
        carrot.link_store.frm_add_or_edit_link_share(data).set_title("Update Link Share").show();
    }

    frm_add_or_edit_link_share(data){
        var frm=new Carrot_Form("frm_share",this.carrot);
        frm.set_icon(this.icon_share);
        frm.create_field("name").set_label("Name share").set_value(data.name);
        frm.create_field("icon").set_label("Icon share(image png )").set_value(data.icon).set_type("file").set_type_file("image/*");
        frm.create_field("font").set_label("Font icon").set_value(data.font);
        frm.create_field("web").set_label("Web Link share").set_value(data.web);
        frm.create_field("android").set_label("Android Link share").set_value(data.android);
        frm.create_field("window").set_label("Window link share").set_value(data.window);
        return frm;
    }

    get_data_share(){
        this.carrot.db.collection("share").get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.list_link_share=Array();
                querySnapshot.forEach((doc) => {
                    var data_link_share=doc.data();
                    data_link_share["id"]=doc.id;
                    this.list_link_share.push(data_link_share);
                });
                this.save_list_link_share();
                this.carrot.update_new_ver_cur("link_share",true);
                this.show_list_share_from_data(this.list_link_share,this.carrot);
            }
        }).catch((error) => {
            carrot.log(error.message)
        });
    }

    show_list_share_from_data(data,carrot){
        carrot.change_title_page("List Share","?p=link_share","link_share");
        var html='';
        html+='<div class="row">';
        $(data).each(function(index,share){
            var item_share=new Carrot_List_Item(carrot);
            var html_body='';
            item_share.set_db_collection("share");
            item_share.set_id(share.id);
            item_share.set_index(index);
            item_share.set_obj_js("link_store");
            item_share.set_name(share.name);
            item_share.set_tip(share.id);
            item_share.set_icon_font("fa-solid "+share.font);
            item_share.set_class_body("col-md-10 fs-9");
            item_share.set_class_icon("col-md-2");
            item_share.set_act_edit("carrot.link_store.edit_share");

            html_body+='<ul>';
                html_body+='<li><i class="fa-brands fa-android"></i> <b>android</b>:'+share.android+'</li>';
                html_body+='<li><i class="fa-brands fa-edge"></i> <b>web</b>:'+share.web+'</li>';
                html_body+='<li><i class="fa-brands fa-windows"></i> <b>window</b>:'+share.window+'</li>';
            html_body+='</ul>';

            item_share.set_body(html_body);
            html+=item_share.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    list_share(){
        if(this.list_link_share==null)
            this.get_data_share();
        else
            this.show_list_share_from_data(this.list_link_share,this.carrot);
    }
}