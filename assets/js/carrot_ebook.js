class Carrot_Ebook_File{

    //Meta Info
    title='Undefined';
    lang='en';
    description='';
    author='';
    type='';

    container_xml='';
    content_opf='';

    toc_ncx='';
    chapters=Array();
    data_img_cover=null;

    constructor(){
        this.container_xml+='<?xml version="1.0" encoding="UTF-8"?>';
        this.container_xml+='<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">';
            this.container_xml+='<rootfiles>';
                this.container_xml+='<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>';
            this.container_xml+='</rootfiles>';
        this.container_xml+='</container>';
    }

    set_title(title){
        this.title=title;
        return this;
    }

    set_name(name){
        return this.set_title(name);
    }

    set_lang(lang){
        this.lang=lang;
        return this;
    }

    set_author(name){
        this.author=name;
        return this;
    }

    set_description(description){
        this.description=description;
        return this;
    }

    set_type(type){
        this.type=type;
        return this;
    }

    add_chapter(s_chapter_title,s_chapter_content){
        this.chapters.push({title:s_chapter_title,content:s_chapter_content});
        return this;
    }

    set_data_image_cover(data){
        this.data_img_cover=data;
        return this;
    }

    set_cover(data){
        return this.set_data_image_cover(data);
    }

    download(){
        var zip=new JSZip();
        var ebook_file=this;

        this.toc_ncx+='<?xml version="1.0" encoding="UTF-8"?>';
        this.toc_ncx+='<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">';
        this.toc_ncx+='<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">';

            this.toc_ncx+='<head>';
                this.toc_ncx+='<meta name="dtb:uid" content="urn:uuid:7a8a677c-ed6b-4ea1-a2dd-d46f4c886a73"/>';
                this.toc_ncx+='<meta name="dtb:depth" content="1"/>';
                this.toc_ncx+='<meta name="dtb:totalPageCount" content="0"/>';
                this.toc_ncx+='<meta name="dtb:maxPageNumber" content="0"/>';
            this.toc_ncx+='</head>';

            this.toc_ncx+='<docTitle>';
                this.toc_ncx+='<text>'+ebook_file.title+'</text>';
            this.toc_ncx+='</docTitle>';

            this.toc_ncx+='<navMap>';
                
                if(this.data_img_cover!=null){
                    this.toc_ncx+='<navPoint id="navPoint-0" playOrder="0">';
                    this.toc_ncx+='<navLabel><text>Cover</text></navLabel>';
                    this.toc_ncx+='<content src="Text/cover.xhtml"/>';
                    this.toc_ncx+='</navPoint>';
                }

                for(var i=0;i<this.chapters.length;i++){
                    this.toc_ncx+='<navPoint id="navPoint-'+(i+1)+'" playOrder="'+(i+1)+'">';
                    this.toc_ncx+='<navLabel><text>'+this.chapters[i].title+'</text></navLabel>';
                    this.toc_ncx+='<content src="Text/chapter_'+i+'.xhtml"/>';
                    this.toc_ncx+='</navPoint>';
                }
            this.toc_ncx+='</navMap>';

        this.toc_ncx+='</ncx>';

        this.content_opf+='<?xml version="1.0" encoding="utf-8"?>';
        this.content_opf+='<package version="2.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">';

            this.content_opf+='<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">';
                this.content_opf+='<dc:identifier opf:scheme="UUID" id="BookId">urn:uuid:7a8a677c-ed6b-4ea1-a2dd-d46f4c886a73</dc:identifier>';
                this.content_opf+='<dc:language>'+this.lang+'</dc:language>';
                this.content_opf+='<dc:title>'+this.title+'</dc:title>';
                if(this.description!='') this.content_opf+='<dc:description>'+this.description+'</dc:description>';
                if(this.author!='') this.content_opf+='<dc:creator opf:role="aut">'+this.author+'</dc:creator>';
                if(this.type!='') this.content_opf+='<dc:type>'+this.type+'</dc:type>';
                this.content_opf+='<meta name="Carrot Ebook version" content="1.9.30"/>';
                this.content_opf+='<dc:date opf:event="modification" xmlns:opf="http://www.idpf.org/2007/opf">2023-07-16</dc:date>';
                if(this.data_img_cover!=null) this.content_opf+='<meta name="cover" content="cover" />';
            this.content_opf+='</metadata>';

            this.content_opf+='<manifest>';
                if(this.data_img_cover!=null){
                    this.content_opf+='<item id="cover" href="images/cover.jpeg" media-type="image/jpeg"/>';
                    this.content_opf+='<item id="coverxml" href="Text/cover.xhtml" media-type="application/xhtml+xml"/>';
                }
                this.content_opf+='<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>';
                for(var i=0;i<this.chapters.length;i++){
                    this.content_opf+='<item id="chapter_'+i+'" href="Text/chapter_'+i+'.xhtml" media-type="application/xhtml+xml"/>';
                };
            this.content_opf+='</manifest>';

            this.content_opf+='<spine toc="ncx">';
                if(this.data_img_cover!=null)this.content_opf+='<itemref idref="coverxml"/>';
                for(var i=0;i<this.chapters.length;i++){
                    this.content_opf+='<itemref idref="chapter_'+i+'"/>';
                };
            this.content_opf+='</spine>';

        this.content_opf+='</package>';

        
        zip.file("mimetype","application/epub+zip");
        zip.file("META-INF/container.xml",this.container_xml);
        zip.file("OEBPS/toc.ncx",this.toc_ncx);
        zip.file("OEBPS/content.opf",this.content_opf);

        for(var i=0;i<this.chapters.length;i++){
            var xhtml='';
            xhtml+='<?xml version="1.0" encoding="utf-8"?>';
            xhtml+='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
            xhtml+='<html xmlns="http://www.w3.org/1999/xhtml">';
            xhtml+='<head><title>Chapter '+(i+1)+'</title></head>';
            xhtml+='<body>';
                xhtml+='<h2>'+this.chapters[i].title+'</h2>';
                xhtml+=this.chapters[i].content;
            xhtml+='</body>';
            xhtml+='</html>';
            zip.file("OEBPS/Text/chapter_"+i+".xhtml",xhtml);
        };

        if(this.data_img_cover!=null){
            var xhtml_cover='';
            xhtml_cover+='<?xml version="1.0" encoding="utf-8"?>';
            xhtml_cover+='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
            xhtml_cover+='<html xmlns="http://www.w3.org/1999/xhtml">';
                xhtml_cover+='<head>';
                    xhtml_cover+='<title>Cover Image</title>';
                    xhtml_cover+='<meta content="http://www.w3.org/1999/xhtml; charset=utf-8" http-equiv="Content-Type"/>';
                xhtml_cover+='</head>';
                xhtml_cover+='<body>';
                xhtml_cover+='<div class="body">';
                    xhtml_cover+='<img alt="cover" style="max-width: 100%;max-height: 100%;height: auto;width: auto;" src="../images/cover.jpeg"/>';
                xhtml_cover+='</div>';
                xhtml_cover+='</body>';
            xhtml_cover+='</html>';
            zip.file("OEBPS/Text/cover.xhtml",xhtml_cover);
            zip.file("OEBPS/images/cover.jpeg",this.data_img_cover);
        }

        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content,ebook_file.title+".epub");
        });
    }
}

class Carrot_Ebook{
    carrot;
    obj_ebooks=null;
    obj_ebook_cur=null;
    obj_categorys=null;

    index_chapter_edit=0;
    is_change_status=false;

    icon='fa-solid fa-book';

    type_category_show='all';
    type_list_show='list_ebook';
    type_content_show='view';

    data_img_cover=null;

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("ebook","carrot.ebook.list()","carrot.ebook.edit","carrot.ebook.show_ebook_by_id","carrot.ebook.reload");
        carrot.register_page("ebook_category","carrot.ebook.list_category()","carrot.ebook.edit_category","carrot.ebook.show_category","carrot.ebook.reload_category");
        
        carrot.menu.create("ebook_list").set_label("Ebook").set_lang("ebook").set_icon(this.icon).set_type("main").set_act("carrot.ebook.list()");
        carrot.menu.create("add_ebook").set_label("Add Ebook").set_icon(this.icon).set_type("add").set_act("carrot.ebook.add()");

        if(localStorage.getItem("obj_ebooks")!=null) this.obj_ebooks=JSON.parse(localStorage.getItem("obj_ebooks"));
        if(localStorage.getItem("obj_categorys")!=null) this.obj_categorys=JSON.parse(localStorage.getItem("obj_categorys"));
    }

    save_obj(){
        localStorage.setItem("obj_ebooks",JSON.stringify(this.obj_ebooks));
    }

    save_category(){
        localStorage.setItem("obj_categorys",JSON.stringify(this.obj_categorys));
    }

    delete_obj(){
        this.obj_ebooks=null;
        localStorage.removeItem("obj_ebooks");
        this.carrot.delete_ver_cur("ebook");
    }

    delete_category_obj(){
        this.obj_categorys=null;
        localStorage.removeItem("obj_categorys");
    }

    list(){
       this.type_list_show="list_ebook";
       if(this.carrot.check_ver_cur("ebook")){
            if(this.obj_ebooks==null){
                this.get_list_ebook();
            }else{
                this.carrot.log("Get list ebook from cache and show","success");
                this.show_list_ebook_by_data(this.obj_ebooks,this.carrot);
            }
        }else{
            this.get_list_ebook();
        }
    }

    menu(){
        var html='';
        html+='<div class="row">';
            html+='<div class="col-8">';
                html+='<button onclick="carrot.ebook.add();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-marker"></i> Write a book</button>';
                html+='<button onclick="carrot.ebook.add_category();return false;" class="btn btn-success dev btn-sm m-1"><i class="fa-solid fa-square-plus"></i> Add Category</button>';

                html+='<button onclick="carrot.ebook.list();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-swatchbook"></i> list Ebook</button>';
                html+='<button onclick="carrot.ebook.list_category();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-hurricane"></i> list Category</button>';
                html+='<button onclick="carrot.ebook.delete_all_data();return false;" class="btn btn-danger dev btn-sm m-1"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';

                html+='<div class="btn-group" role="group">';
                html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_ebook_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> <l class="lang" key_lang="genre">Category</l> ('+carrot.ebook.type_category_show+')</button>';
                html+='<div class="dropdown-menu" aria-labelledby="btn_list_ebook_category" id="list_ebook_category"></div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="col-4">';
                html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="End group">';
                html+=this.carrot.langs.list_btn_lang_select('btn-success');
                html+='</div>';
            html+='</div>';
            
        html+='</div>';
        return html;
    }

    get_list_ebook(){
        Swal.showLoading();
        this.carrot.log("Get list ebook from sever and show","warning");
        this.carrot.db.collection("ebook").where("lang","==",this.carrot.langs.lang_setting).limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.obj_ebooks=Object();
                querySnapshot.forEach((doc) => {
                    var data_ebook=doc.data();
                    data_ebook["id"]=doc.id;
                    if(data_ebook["contents"]!=null) delete data_ebook.contents;
                    this.obj_ebooks[doc.id]=JSON.stringify(data_ebook);
                });
                this.carrot.update_new_ver_cur("ebook",true);
                this.save_obj();
                this.show_list_ebook_by_data(this.obj_ebooks,carrot);
                Swal.close();
            }else{
                this.show_404();
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
            Swal.close();
        });
    }

    show_list_ebook_by_data(datas,carrot){
        var list_ebook=carrot.obj_to_array(datas);
        carrot.change_title_page("Ebook","?p=ebook","ebook");
        var html='';
        html+=carrot.ebook.menu();
        
        html+='<div class="row mt-2">';
        $(list_ebook).each(function(index,ebook){
            ebook.index=index;
            html+=carrot.ebook.box_ebook_item(ebook);
        });
        html+='</div>';

        carrot.show(html);
        carrot.check_event();
        if(this.carrot.ebook.obj_categorys==null) carrot.ebook.get_data_category();
        carrot.ebook.check_event();

        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            carrot.langs.lang_setting=key_change;
            carrot.ebook.get_list_ebook();
        });
    }

    check_event(){
        var carrot=this.carrot;
        $(".ebook_icon").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.get_doc("ebook",obj_id,carrot.ebook.show);
        });
        this.update_data_for_list_dropdown_category_ebook();
    }

    box_ebook_item(ebook,s_class='col-md-4 mb-3'){
        var item_ebook=new Carrot_List_Item(carrot);
        var url_cover_ebook_img='';
        if(ebook.icon!=null){
            if(ebook.icon!='') url_cover_ebook_img=ebook.icon;  
        }

        item_ebook.set_index(ebook.index);
        item_ebook.set_db("ebook");
        item_ebook.set_id(ebook.id);
        item_ebook.set_title(ebook.title);
        item_ebook.set_tip(ebook.category);
        if(url_cover_ebook_img!='')
            item_ebook.set_icon(url_cover_ebook_img);
        else
            item_ebook.set_icon_font(carrot.ebook.icon+" ebook_icon");

        var html_body='';
        if(ebook.author!=null) html_body+='<div class="d-block"><i class="fa-solid fa-user"></i> '+ebook.author+'</div>';
        if(ebook.date!=null) html_body+='<div class="d-block"><i class="fa-solid fa-calendar-days"></i> '+ebook.date+'</div>';
        item_ebook.set_body(html_body);
        item_ebook.set_class(s_class); 
        item_ebook.set_class_icon("col-md-2");
        item_ebook.set_class_body("col-md-10");
        return item_ebook.html();
    }

    add(){
        var new_data=new Object();
        new_data["id"]="ebook"+this.carrot.create_id();
        new_data["icon"]="";
        new_data["title"]="";
        new_data["describe"]="";
        new_data["category"]="";
        new_data["date"]=$.datepicker.formatDate('yy-mm-dd', new Date());
        new_data["lang"]=this.carrot.lang;
        new_data["status"]="draft";
        new_data["author"]="";
        new_data["user"]=this.carrot.user.get_user_login();
        this.frm_add_or_edit(new_data).set_title("Add Ebook").set_msg_done("Add ebook success!!!").set_type("add").show();
    }

    edit(data,carrot){
        carrot.ebook.frm_add_or_edit(data).set_title("Update Ebook").set_msg_done("Update ebook success!!!").set_type("update").show();
    }

    edit_info_book_cur(){
        this.carrot.get_doc("ebook",this.obj_ebook_cur.id,this.carrot.ebook.edit);
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_ebook",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("ebook","id");
        frm.create_field("id").set_label("ID Ebook").set_val(data["id"]).set_type("id").set_tip('<i class="fa-solid fa-book-open-reader"></i> First you need to fill in the necessary information of the book you are about to write, The content in the chapter you can add later');
        frm.create_field("icon").set_label("Icon (File image 740 x 1186)").set_val(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("title").set_label("Title Ebook").set_val(data["title"]);
        var field_cat=frm.create_field("category").set_label(this.carrot.l("genre","category")).set_val(data["category"]).set_type("select");
        var list_category=this.carrot.obj_to_array(this.obj_categorys);
        $(list_category).each(function(index,cat){
            field_cat.add_option(cat.name,cat.name);
        });
        frm.create_field("describe").set_label("Describe Ebook").set_val(data["describe"]).set_type("editor");
        frm.create_field("date").set_label("Public Date").set_val(data["date"]).set_type("date");
        frm.create_field("lang").set_label("Lang eBook").set_val(data["lang"]).set_type("lang");
        var field_status=frm.create_field("status").set_label("Status").set_value(data.status).set_type("select");
        field_status.add_option("draft","Draft");
        field_status.add_option("publish","Publish");
        frm.create_field("author").set_label("Author").set_val(data["author"]);
        frm.create_field("user").set_label("Public User").set_val(data["user"]).set_type("user");
        return frm;
    }

    add_category(){
        var new_data=new Object();
        new_data["name"]="";
        new_data["icon"]="";
        new_data["image"]="";
        $(this.carrot.langs.list_lang).each(function(index,lang){
            new_data["name_"+lang.key]="";
        });
        this.frm_add_or_edit_category(new_data).set_title("Add Category").set_msg_done("Add Category Success!").set_type("add").show();
    }

    edit_category(data,carrot){
        carrot.ebook.frm_add_or_edit_category(data).set_title("Update Category").set_msg_done("Update Category Success").set_type("update").show();
    }

    frm_add_or_edit_category(data){
        var frm=new Carrot_Form("frm_ebook_category",this.carrot);
        frm.set_icon("fa-solid fa-hurricane");
        frm.set_db("ebook_category","name");
        frm.create_field("name").set_label("Name Category").set_val(data["name"]).set_main();
        frm.create_field("icon").set_label("Icon Category (Font)").set_val(data["icon"]);
        frm.create_field("image").set_label("Cover Ebook Category Image (300x300)").set_val(data["image"]).set_type("file").set_type_file("image/*");
        $(this.carrot.langs.list_lang).each(function(index,lang){
            frm.create_field("name_"+lang.key).set_label("Name "+lang.name+" ("+lang.key+") <img style='width:20px;' src='"+lang.icon+"'>").set_val(data["name_"+lang.key]);
        });
        return frm;
    }

    get_data_category(){
        Swal.showLoading();
        this.carrot.log("Get list ebook category from server","warning");
        this.carrot.db.collection("ebook_category").get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.obj_categorys=Object();
                querySnapshot.forEach((doc) => {
                    var data_category=doc.data();
                    data_category["id"]=doc.id;
                    this.obj_categorys[doc.id]=JSON.stringify(data_category);
                });
                this.carrot.update_new_ver_cur("ebook_category",true);
                this.save_category();
                if(this.type_list_show=="list_ebook"){
                    this.update_data_for_list_dropdown_category_ebook();
                }
                else{
                    this.show_list_category(this.obj_categorys,carrot);
                }
                Swal.close();
            }else{
                this.carrot.msg("None List ebook!","alert");
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
            Swal.close();
        });
    }

    update_data_for_list_dropdown_category_ebook(){
        $("#list_ebook_category").html("");
        var list_cat=this.carrot.obj_to_array(this.carrot.ebook.obj_categorys);
        var html_cat='';
        var css_active='';
        $(list_cat).each(function(index,cat){
            cat.index=index;
            if(cat.name==carrot.ebook.type_category_show) css_active="btn-success";
            else css_active="btn-secondary";
            html_cat+='<button role="button" onclick="carrot.ebook.show_list_ebook_by_category(\''+cat.name+'\')" class="dropdown-item btn '+css_active+'"><i class="'+cat.icon+'"></i> '+cat.name+'</button>';
        });
        $("#list_ebook_category").html(html_cat);
    }

    list_category(){
        this.type_list_show="list_category";
        if(this.obj_categorys==null){
            this.get_data_category();
        }else{
            this.show_list_category(this.obj_categorys,this.carrot);
        }
    }

    show_list_category(datas,carrot){
        carrot.change_title_page("EBook Category","?p=ebook_category","ebook_category");
        var list_category=carrot.obj_to_array(datas);
        var html='';
        html+=carrot.ebook.menu();

        html+='<div class="row">';
        $(list_category).each(function(index,cat){
            var item_cat=new Carrot_List_Item(carrot);
            item_cat.set_title(cat.name);
            item_cat.set_db("ebook_category",cat.name);
            item_cat.set_tip(cat.id);
            item_cat.set_act_edit("carrot.ebook.edit_category");
            item_cat.set_obj_js("ebook");
            item_cat.set_id(cat.name);
            item_cat.set_icon_font(cat.icon+" icon_cat_ebook");
            item_cat.set_class_icon("col-2");
            item_cat.set_class_body("col-10");
            item_cat.set_index(index);
            html+=item_cat.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();

        $(".icon_cat_ebook").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.ebook.show_list_ebook_by_category(obj_id);
        });

        carrot.ebook.update_data_for_list_dropdown_category_ebook();
    }

    show_list_ebook_by_category(key_category){
        Swal.showLoading();
        this.carrot.db.collection("ebook").where("lang","==",this.carrot.langs.lang_setting).where("category","==",key_category).limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.obj_ebooks=Object();
                querySnapshot.forEach((doc) => {
                    var data_ebook=doc.data();
                    data_ebook["id"]=doc.id;
                    this.obj_ebooks[doc.id]=JSON.stringify(data_ebook);
                });
                this.show_list_ebook_by_data(this.obj_ebooks,carrot);
                Swal.close();
            }else{
                this.show_404();
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
            Swal.close();
        });
    }

    show_404(){
        var list_btn=Array();
        this.carrot.msg("None List ebook!","alert");

        var btn_write_ebook=new Carrot_Btn();
        btn_write_ebook.set_icon("fa-solid fa-marker");
        btn_write_ebook.set_class("btn btn-success m-2");
        btn_write_ebook.set_onclick("carrot.ebook.add();return false;");
        btn_write_ebook.set_label("Write Book");

        var btn_category_ebook=new Carrot_Btn();
        btn_category_ebook.set_icon("fa-solid fa-hurricane");
        btn_category_ebook.set_class("btn btn-success m-2");
        btn_category_ebook.set_onclick("carrot.ebook.list_category();return false;");
        btn_category_ebook.set_label("List Category Book");

        list_btn.push(btn_write_ebook);
        list_btn.push(btn_category_ebook);
        this.carrot.show_404(list_btn);
    }

    show_ebook_by_id(id_ebook,carrot){
        carrot.get_doc("ebook",id_ebook,carrot.ebook.show);
    }

    show(data,carrot){
        carrot.change_title_page(data.title,"?p=ebook&id="+data.id,"ebook");
        carrot.ebook.obj_ebook_cur=data;
        carrot.ebook.index_chapter_edit=0;
        if(data.contents==null){
            data.contents=Array();
            data.contents.push({title:'',content:''});
            carrot.ebook.obj_ebook_cur.contents=data.contents;
        }
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-2 p-3 text-center">';
                        if(data.icon==null||data.icon==undefined||data.icon=='undefined'||data.icon=="")
                            html+='<i class="fa-solid fa-book fa-4x"></i>';
                        else
                            html+='<img class="rounded" src="'+data.icon+'"/>';
                    html+='</div>';
                    html+='<div class="col-md-10 p-3 text-center">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data.title+'</h4>';
                        html+=carrot.btn_dev("ebook",data.id);
                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="genre">Category</l> <i class="fa-solid fa-hurricane"></i></b>';
                                html+='<p>'+data.category+'</p>';
                            html+='</div>';

                            html+='<div class="col-md-4 col-6 text-center">';
                            html+='<b><l class="lang" key_lang="total_chapters">Total Chapters</l> <i class="fa-solid fa-file-powerpoint"></i></b>';
                            html+='<p>'+data.contents.length+' Chapters</p>';
                            html+='</div>';

                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="file">File</l> <i class="fa-solid fa-file-arrow-down"></i></b>';
                                html+='<p>'+data.title+'.epub</p>';
                            html+='</div>';

                            if(data.user!=null){
                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="posted_by">Posted By</l> <i class="fa-solid fa-user-nurse"></i></b>';
                                    html+='<p>'+data.user.name+'</p>';
                                html+='</div>';
                            }

                            if(data.author!=null){
                                html+='<div class="col-md-4 col-6 text-center">';
                                    html+='<b><l class="lang" key_lang="author">Author</l> <i class="fa-solid fa-user"></i></b>';
                                    html+='<p>'+data.author+'</p>';
                                html+='</div>';
                            }

                            html+='<div class="col-md-4 col-6 text-center">';
                            html+='<b><l class="lang" key_lang="country">Country</l> <i class="fa-solid fa-language"></i></b>';
                            html+='<p>'+data.lang+'</p>';
                            html+='</div>';

                        html+='</div>';

                        html+='<div class="row pt-2">';
                            html+='<div class="col-12">';
                            html+='<button id="btn_share" role="button" type="button" class="btn d-inline btn-success m-1"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button>';
                            if(carrot.user.get_user_login_role()=="admin"||carrot.user.get_user_login_id()==data.user.id){
                                html+='<button id="btn_download" onclick="carrot.ebook.download()" class="btn d-inline btn-success m-1"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l> </button>';
                            }else{
                                if(carrot.ebook.check_pay(data.id))
                                    html+='<button id="btn_download" onclick="carrot.ebook.download()" class="btn d-inline btn-success m-1"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l> </button>';
                                else
                                    html+='<button id="btn_download" onclick="carrot.ebook.pay()" class="btn d-inline btn-info m-1"><i class="fa-brands fa-paypal"></i> <l class="lang" key_lang="download">Download</l> </button>';
                            }

                            html+='<button id="btn_ebook_menu" onclick="carrot.ebook.table_of_contents()" class="btn d-inline btn-success m-1"><i class="fa-brands fa-elementor"></i> <l class="lang" key_lang="table_of_contents">Table of contents</l> </button>';
                            if(data.user.id==carrot.user.get_user_login_id()) html+='<button role="button" onclick="carrot.ebook.edit_info_book_cur()" type="button" class="btn d-inline btn-warning m-1"><i class="fa-solid fa-pen-to-square"></i> <l class="lang" key_lang="edit_info">Edit Info</l> </button>';
                            if(carrot.user.get_user_login_role()=="admin"||carrot.user.get_user_login_id()==data.user.id){
                                html+='<button id="btn_editor_mode" role="button" onclick="carrot.ebook.change_mode_editor_content()" type="button" class="btn d-inline btn-info m-1"><i class="fa-solid fa-pen-ruler"></i> <l class="lang" key_lang="edit_content">Edit Content</l> </button>';
                            }
                            html+='</div>';
                        html+='</div>';

                    html+="</div>";
                html+="</div>";

                if(data.describe!=null){
                    html+='<div id="about-ebook" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5"><l class="lang" key_lang="describe">Describe</l> <i role="button" onclick="$(\'#about-ebook\').hide();" class="btn fa-solid fa-circle-xmark float-end"></i></h4>';
                    html+='<p class="fs-8 text-justify">'+data["describe"]+'</p>';
                    html+='</div>';
                }

                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm" id="body_content_book">';
                    if(data.user.id==carrot.user.get_user_login_id()){
                        carrot.ebook.type_content_show="edit";
                        html+=carrot.ebook.show_body_editor(data);
                    }else{
                        carrot.ebook.type_content_show="view";
                        html+=carrot.ebook.show_body_view(data);
                    }
                html+='</div>';

                html+=carrot.rate.box_comment(data);
                html+=carrot.link_store.box_qrdoce();

            html+="</div>";

            html+='<div class="col-md-4 ps-4 ps-lg-3" id="box_related_ebooks">';
                html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_ebooks">Related EBook</h4>';
                var list_ebook_other=carrot.convert_obj_to_list(carrot.ebook.obj_ebooks).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
                var count_ebook=0;
                for(var i=0;i<list_ebook_other.length;i++){
                    var ebook=list_ebook_other[i];
                    if(data.id!=ebook.id){
                        html+=carrot.ebook.box_ebook_item(ebook,'col-md-12 mb-3');
                        count_ebook++;
                        if(count_ebook>12)break;
                    }
                };
            html+="</div>";
        html+="</div>";
        html+="</div>";
        html+=carrot.ebook.list_for_home();
        carrot.show(html);
        carrot.check_event();
        carrot.ebook.check_event();

        $('.richText-editor,#chapter_title').change(function(){
            carrot.ebook.is_change_status=true;
        });
        carrot.ebook.check_mode_editor_content();
        carrot.ebook.reader_cover_image_data();
        if(carrot.ebook.obj_ebooks==null) carrot.ebook.get_list_related_ebooks();
    }

    get_list_related_ebooks(){
        this.carrot.db.collection("ebook").where("lang","==",this.carrot.langs.lang_setting).where("category","==",this.carrot.ebook.obj_ebook_cur.category).limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                querySnapshot.forEach((doc) => {
                    var data_ebook=doc.data();
                    data_ebook["id"]=doc.id;
                    if(data_ebook["contents"]!=null) delete data_ebook.contents;
                    $("#box_related_ebooks").append(carrot.ebook.box_ebook_item(data_ebook,'col-md-12 mb-3'));
                }); 
                carrot.ebook.check_event(); 
            }
        });
    }

    change_mode_editor_content(){
        if(this.type_content_show=="view"){
            this.type_content_show="editor";
        }  
        else{
            this.type_content_show="view";
        }

        if(this.type_content_show=="view")
            $("#body_content_book").html(this.show_body_view(this.obj_ebook_cur));
        else
            $("#body_content_book").html(this.show_body_editor(this.obj_ebook_cur));

        this.check_mode_editor_content();
    }

    check_mode_editor_content(){
        if($("#btn_editor_mode").length>0){
            if(this.type_content_show=="view"){
                $("#btn_editor_mode").html('<i class="fa-solid fa-pen-ruler"></i> <l class="lang" key_lang="edit_content">Edit Content</l> ');
            }  
            else{
                $("#btn_editor_mode").html('<i class="fa-solid fa-eye"></i> <l class="lang" key_lang="view_content">View Content</l> ');
            }
        }
    }

    show_body_editor(data){
        var html='';
        html+='<h4 class="fw-semi fs-5 lang" key_lang="content_editor">Content Editor</h4>';
        html+='<link rel="stylesheet" href="assets/plugins/richtex/richtext.min.css">';
        html+='<script type="text/javascript" src="assets/plugins/richtex/jquery.richtext.js"></script>';
        html+='<small>Với chương trình tạo ebook bạn có thể dễ dàng viết sách, tiểu thuyết và tải xuống với định dạng ebook đọc tiếp trên các thiết bị di động</small>';
        html+='<form class="fs-6 text-justify">';
            html+='<div class="form-group">';
                html+='<label for="chapter_title">Chapter Title</label>';
                html+='<div class="input-group mb-3">';
                    html+='<input type="email" class="form-control m-0 form-control-sm" id="chapter_title" value="'+data.contents[carrot.ebook.index_chapter_edit].title+'" aria-describedby="ChapterTitle" placeholder="Enter Chapter Title">';
                    html+='<div class="input-group-append dev">';
                    html+='<span class="input-group-text btn-ms" role="button" onclick="paste_tag(\'chapter_title\')"><i class="fa-solid fa-paste"></i></span>';
                    html+='</div>';
                html+='</div>';
                html+='<small id="emailHelp" class="form-text text-muted">Nhập tiêu đề cho chương</small>';
            html+='</div>';

            html+='<div class="form-group mt-2">';
            html+='<label for="chapter_select">Select Chaper Edit</label>';
                html+='<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">';
                    html+='<div class="btn-group m-2 d-inline" role="group" aria-label="First group" id="list_chapter_content">';
                    var s_class='';
                    for(var i=0;i<data.contents.length;i++){
                        if(carrot.ebook.index_chapter_edit==i) s_class="active";
                        else s_class='';
                        html+='<button type="button" data-index="'+i+'" onclick="carrot.ebook.select_chapter_for_content_edit(this)" class="btn btn-secondary btn-sm '+s_class+' btn_chapter">'+(i+1)+'</button>';
                    }
                    html+='</div>';

                    html+='<div class="btn-group m-2" role="group" aria-label="Third group">';
                    html+='<button onclick="carrot.ebook.add_chapter_to_content()"  type="button" class="btn btn-secondary btn-sm"><i class="fa-solid fa-plus"></i></button>';
                    html+='</div>';
                html+='</div>';
            html+='</div>';

        html+='</form>';
        html+='<p class="fs-6 text-justify">';
        html+='<textarea class="form-control" id="book_content" rows="10">'+data.contents[carrot.ebook.index_chapter_edit].content+'</textarea>';
        html+='</p>';
        html+='<script>$(document).ready(function(){$("#book_content").richText();});</script>';
        html+='<p>';
        html+='<button onclick="carrot.ebook.save_chapter_to_content();" class="btn btn-success m-2" role="button"><i class="fa-solid fa-floppy-disk"></i> '+carrot.l("done","Done")+'</button>';
        html+='</p>';
        return html;
    }

    show_body_view(data){
        var html='';
        html+='<h4 class="fw-semi fs-5 lang" key_lang="content">Content</h4>';
        html+=this.nav_chapter(data);
        html+='<div class="fs-6 text-justify mt-2 mb-2">';
        html+='<h6 id="chapter_title">'+data.contents[carrot.ebook.index_chapter_edit].title+'</h6>';
        html+='<div id="chapter_body"  class="text-dark">'+data.contents[carrot.ebook.index_chapter_edit].content+'</div>';
        html+='</div>';
        html+=this.nav_chapter(data);
        return html;
    }

    nav_chapter(data){
        var html='';
        html+='<nav aria-label="Page navigation nav-ebook mt-1 mb-1">';
            html+='<ul class="pagination pagination-sm flex-wrap">';
            html+='<li class="page-item" onclick="carrot.ebook.prev_read_chapter_content()" type="button">';
                html+='<a class="page-link text-secondary" href="#" aria-label="Previous"><i class="fa-solid fa-backward-step"></i> Prev</a>';
            html+='</li>';
            var s_class='';
            for(var i=0;i<data.contents.length;i++){
                if(carrot.ebook.index_chapter_edit==i) s_class="active";
                else s_class='';
                html+='<li type="button" data-index="'+i+'" onclick="carrot.ebook.select_chapter_for_content_edit(this)" class="page-item '+s_class+' btn_chapter fs-9 nav_item_chapter_'+i+'"><span class="page-link text-secondary bg-white" tabindex="'+i+'">'+(i+1)+'</span></li>';
            }

            html+='<li class="page-item" onclick="carrot.ebook.next_read_chapter_content()" type="button">';
                html+='<a class="page-link text-secondary" href="#" aria-label="Next"><i class="fa-solid fa-forward-step"></i> Next</a>';
            html+='</li>';
            html+='</ul>';
        html+='</nav>';
        return html;
    }

    table_of_contents(){
        var html='';
        html+='<div class="d-block">';
        $(this.obj_ebook_cur.contents).each(function(index,chapter){
            html+='<div role="button" data-index="'+index+'" onclick="carrot.ebook.select_chapter_for_content_edit(this)"  class="text-justify btn d-block btn-success btn-sm m-1">'+chapter.title+'</div>';
        });
        html+='</div>';
        Swal.fire({
            title:carrot.l("table_of_contents","Table of contents"),
            html:html
        });
    }

    add_chapter_to_content(){
        if(this.is_change_status==true){
            this.carrot.msg("The old chapter has not been saved, please save it before creating a new chapter","alert");
            return;
        }
        var count_chapter=0;
        var contents=null;
        if(this.obj_ebook_cur.contents!=null){
            contents=this.obj_ebook_cur.contents;
            count_chapter=this.obj_ebook_cur.contents.length;
            this.obj_ebook_cur.contents.push({title:'',content:''});
        }
        count_chapter++;
        this.index_chapter_edit=(count_chapter-1);
        $('.richText-editor').html('');
        $("#chapter_title").val(carrot.l("chapter","Chapter")+" "+count_chapter);
        $(".btn_chapter").removeClass("active");
        var html='<button type="button"  data-index="'+(count_chapter-1)+'" onclick="carrot.ebook.select_chapter_for_content_edit(this)" class="btn btn-secondary active btn-sm btn_chapter nav_item_chapter_'+(count_chapter-1)+'">'+count_chapter+'</button>';
        $("#list_chapter_content").append(html);
    }

    save_chapter_to_content(){
        var chap_data=new Object();
        chap_data["title"]=$("#chapter_title").val();
        chap_data["content"]=$("#book_content").val();
        var contents=this.obj_ebook_cur.contents;
        contents[this.index_chapter_edit]=chap_data;
        this.obj_ebook_cur.contents=contents;
        this.is_change_status=false;
        var washingtonRef = this.carrot.db.collection("ebook").doc(this.obj_ebook_cur.id);
        washingtonRef.update({contents:contents});
        this.carrot.msg("Save book success");
    }

    select_chapter_for_content_edit(emp){
        var emp_index=$(emp).data("index");
        this.index_chapter_edit=emp_index;
        this.select_index_chapter_content(emp_index);
    }

    select_index_chapter_content(index){
        var data_chapter=this.obj_ebook_cur.contents[index];
        if(this.type_content_show=="view"){
            $("#chapter_title").html(data_chapter.title);
            $('#chapter_body').html(data_chapter.content);
        }else{
            $("#chapter_title").val(data_chapter.title);
            $('.richText-editor').html(data_chapter.content);
        }
        $(".btn_chapter").removeClass("active");
        $(".nav_item_chapter_"+index).addClass("active");
        Swal.close();
    }

    prev_read_chapter_content(){
        this.index_chapter_edit--;
        if(this.index_chapter_edit<=0) this.index_chapter_edit=this.obj_ebook_cur.contents.length-1;
        this.select_index_chapter_content(this.index_chapter_edit);
    }

    next_read_chapter_content(){
        this.index_chapter_edit++;
        if(this.index_chapter_edit>=this.obj_ebook_cur.contents.length) this.index_chapter_edit=0;
        this.select_index_chapter_content(this.index_chapter_edit);
    }
 
    reload(carrot){
        carrot.ebook.delete_obj();
        carrot.ebook.list();
    }

    reload_category(carrot){
        carrot.ebook.delete_category_obj();
        carrot.ebook.list_category();
    }

    delete_all_data(){
        this.delete_obj();
        this.delete_category_obj();
        this.carrot.msg("Delete all data success!");
    }

    pay(){
        carrot.show_pay("ebook","Download ebook ("+carrot.ebook.obj_ebook_cur.title+")","Get file epub thi ebook from Carrot Ebook","1.99",carrot.ebook.pay_success);
    }

    pay_success(){
        $("#btn_download").removeClass("btn-info").addClass("btn-success").html('<i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l>');
        localStorage.setItem("buy_ebook_"+carrot.ebook.obj_ebook_cur.id,"1");
        carrot.ebook.download();
    }

    reader_cover_image_data(){
        var carrot=this.carrot;
        if(carrot.ebook.obj_ebook_cur!=null){
            if(carrot.ebook.obj_ebook_cur.icon!=null){
                carrot.file.get_base64data_file(carrot.ebook.obj_ebook_cur.icon).then((data)=>{
                    carrot.icon.resizeImage(data, 740, 1186).then((result) => {
                        carrot.ebook.data_img_cover=carrot.icon.makeblob(result);
                    });
                });
            }
        }
    }

    download(){
        var ebook_file=new Carrot_Ebook_File();
        ebook_file.set_title(this.obj_ebook_cur.title);
        ebook_file.set_lang(this.obj_ebook_cur.lang);
        if(this.obj_ebook_cur.author!=null) ebook_file.set_author(this.obj_ebook_cur.author);
        if(this.obj_ebook_cur.category!=null) ebook_file.set_type(this.obj_ebook_cur.category);
        if(this.data_img_cover!=null) ebook_file.set_data_image_cover(this.data_img_cover);
        $(this.obj_ebook_cur.contents).each(function(index,content){
            ebook_file.add_chapter(content.title,content.content);
        });
        ebook_file.download();
    }

    check_pay(id_ebook){
        if(localStorage.getItem("buy_ebook_"+id_ebook)!=null)
            return true;
        else
            return false;
    }

    list_for_home(){
        var html='';
        if(this.obj_ebooks!=null){
            var list_ebook=this.carrot.obj_to_array(this.obj_ebooks);
            list_ebook= list_ebook.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);

            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="ebook">Ebook</l>';
            html+='<span role="button" onclick="carrot.ebook.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div id="other_code" class="row m-0">';
            $(list_ebook).each(function (index,b){
                if(index<12){
                    html+=carrot.ebook.box_ebook_item(b);
                }else{
                    return false;
                }
            });
            html+='</div>';
        }
        return html;
    }
}