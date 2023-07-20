class Carrot_Ebook{
    carrot;
    obj_ebooks=null;
    icon='fa-solid fa-book';

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page("ebook","carrot.ebook.list()","carrot.ebook.edit","carrot.ebook.show","carrot.ebook.reload");
        var btn_list=carrot.menu.create("ebook").set_label("Ebook").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){ carrot.ebook.list();});
    }

    save_obj(){
        localStorage.setItem("obj_ebooks",JSON.stringify(this.obj_ebooks));
    }

    delete_obj(){
        this.obj_ebooks=null;
        localStorage.removeItem("obj_ebooks");
    }

    list(){
        if(this.obj_ebooks==null){
            this.get_list_ebook();
        }else{
            this.carrot.log("Get list ebook from cache and show","success");
            this.show_list_ebook_by_data(this.obj_ebooks,this.carrot);
        }
    }

    menu(){
        var html='';
        html+='<div class="row">';
            html+='<div class="col-12">';
            html+='<button onclick="carrot.ebook.write_new();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-marker"></i> Write a book</button>';
            html+='<button onclick="carrot.ebook.add();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-plus"></i> Add book</button>';
            html+='<button onclick="carrot.ebook.list();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-swatchbook"></i> list Ebook</button>';
            html+='<button onclick="carrot.ebook.list();return false;" class="btn btn-success btn-sm m-1"><i class="fa-solid fa-list"></i> list Category</button>';
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
                    this.obj_ebooks[doc.id]=JSON.stringify(data_ebook);
                });
                this.carrot.update_new_ver_cur("ebook",true);
                this.save_obj();
                this.show_list_ebook_by_data(this.obj_ebooks,carrot);
                Swal.close();
            }else{
                var list_btn=Array();
                this.carrot.msg("None List ebook!","alert");

                var btn_write_ebook=new Carrot_Btn();
                btn_write_ebook.set_icon("fa-solid fa-marker");
                btn_write_ebook.set_class("btn btn-success");
                btn_write_ebook.set_onclick("carrot.ebook.add();return false;");
                btn_write_ebook.set_label("Write Book");

                list_btn.push(btn_write_ebook);
                this.carrot.show_404(list_btn);
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
            Swal.close();
        });
    }

    show_list_ebook_by_data(datas,carrot){
        var list_ebook=carrot.obj_to_array(datas);
        this.carrot.change_title_page("Ebook","?p=ebook","ebook");
        var html='';
        html+=carrot.ebook.menu();
        
        html+='<div class="row mt-2">';
        $(list_ebook).each(function(index,ebook){
            var item_ebook=new Carrot_List_Item(carrot);
            item_ebook.set_index(index);
            item_ebook.set_db("ebook");
            item_ebook.set_id(ebook.id);
            item_ebook.set_title(ebook.title);
            item_ebook.set_icon_font(carrot.ebook.icon);
            item_ebook.set_class("col-md-4 mb-3"); 
            item_ebook.set_class_icon("col-md-2");
            item_ebook.set_class_body("col-md-10");
            html+=item_ebook.html();
        });
        html+='</div>';

        this.carrot.show(html);
        this.carrot.check_event();
    }

    write_new(){
        var carrot=this.carrot;
        var html='<div class="section-container p-2 p-xl-4">';
        html+=carrot.ebook.menu();
        html+='<div class="row">';
            html+='<div class="col-12">';
                html+='<link rel="stylesheet" href="assets/plugins/richtex/richtext.min.css">';
                html+='<script type="text/javascript" src="assets/plugins/richtex/jquery.richtext.js"></script>';
                html+='<form>';

                    html+='<div class="form-group">';
                    html+='<label for="book_title">Book Titlte</label>';
                    html+='<input type="text" class="form-control" id="book_title" aria-describedby="book_title" placeholder="Enter Book Title">';
                    html+='<small id="emailHelp" class="form-text text-muted">Enter your title for easy management and search</small>';
                    html+='</div>';

                    html+='<div class="form-group">';
                    html+='<label for="book_content">Contents</label>';
                    html+='<textarea class="form-control" id="book_content" rows="10"></textarea>';
                    html+='</div>';

                    html+='<div class="form-group mt-2">';
                    html+='<div type="submit" id="btn_ebook_done" role="button" class="btn btn-success content"><i class="fa-solid fa-circle-check"></i> '+this.carrot.l("done","Done")+'</div>';
                    html+='</div>';
                    
                html+='</form>';
                html+='<script>$(document).ready(function(){$("#book_content").richText();});</script>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        this.carrot.show(html);
        this.carrot.check_event();

        $("#btn_ebook_done").click(function(){
            var book_title=$("#book_title").val();
            var book_content=$("#book_content").val();
            var data_ebook=new Object();
            data_ebook.id="ebook"+carrot.create_id();
            data_ebook.title=book_title;
            data_ebook.content=book_content;
            data_ebook.lang=carrot.lang;
            carrot.set_doc("ebook",data_ebook.id,data_ebook);
            carrot.ebook.delete_obj();
            carrot.msg("Add ebook success!","success");
            carrot.ebook.list();
        });
    }

    add(){
        var new_data=new Object();
        new_data["id"]="ebook"+this.carrot.create_id();
        new_data["title"]="";
        new_data["date"]=$.datepicker.formatDate('yy-mm-dd', new Date());
        new_data["lang"]=this.carrot.lang;
        new_data["user"]=this.carrot.user.get_user_login();
        this.frm_add_or_edit(new_data).set_title("Add Ebook").set_msg_done("Add ebook success!!!").show();
    }

    edit(data,carrot){
        carrot.ebook.frm_add_or_edit(data).set_title("Update Ebook").set_msg_done("Update ebook success!!!").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_ebook",this.carrot);
        frm.set_icon(this.icon);
        frm.set_db("ebook","id");
        frm.create_field("id").set_label("ID Ebook").set_val(data["id"]).set_type("id");
        frm.create_field("title").set_label("Title Ebook").set_val(data["title"]);
        frm.create_field("date").set_label("Public Date").set_val(data["date"]).set_type("date");
        frm.create_field("lang").set_label("Lang eBook").set_val(data["lang"]).set_type("lang");
        frm.create_field("user").set_label("Public User").set_val(data["user"]).set_type("user");
        return frm;
    }

    reload(carrot){
        carrot.ebook.delete_obj();
        carrot.ebook.list();
    }
}