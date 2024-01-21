class Carrot_Icon{
    carrot;
    obj_icon=null;
    obj_icon_category=null;
    obj_icon_info_cur=null;

    icon="fa-solid fa-face-smile";
    emp_msg_field=null;
    id_page="icon";

    type_show="list_icon";
    orderBy_at="date_create";
    orderBy_type="desc";
    category_key="all";

    data_icon_64=null;
    data_icon_32=null;
    data_icon_24=null;
    data_icon_16=null;

    cur_show_icon_category='all';

    constructor(carrot){
        this.carrot=carrot;
        this.load_obj_icon();
        this.load_obj_icon_category();

        carrot.register_page("icon","carrot.icon.list()","carrot.icon.edit","carrot.icon.get_info","carrot.icon.reload");
        carrot.register_page("icon_category","carrot.icon.list_category()","carrot.icon.edit_category");
        var btn_add=carrot.menu.create("add_icon").set_label("Add Icon").set_type("add").set_icon(this.icon);
        $(btn_add).click(function(){carrot.icon.add();});
        var btn_list=carrot.menu.create("list_icon").set_label("Icon").set_type("main").set_lang("icon").set_icon(this.icon);
        $(btn_list).click(function(){carrot.icon.list();});
        var btn_add_icon_category=carrot.menu.create("add_icon_category").set_label("Add Icon Category").set_type("add").set_icon("fa-solid fa-rectangle-list");
        $(btn_add_icon_category).click(function(){carrot.icon.add_category();});
    }

    load_obj_icon(){
        if (localStorage.getItem("obj_icon") != null) this.obj_icon=JSON.parse(localStorage.getItem("obj_icon"));
    }

    load_obj_icon_category(){
        if (localStorage.getItem("obj_icon_category") != null) this.obj_icon_category=JSON.parse(localStorage.getItem("obj_icon_category"));
    }

    save_obj_icon(){
        localStorage.setItem("obj_icon", JSON.stringify(this.obj_icon));
    }

    save_obj_icon_category(){
        localStorage.setItem("obj_icon_category", JSON.stringify(this.obj_icon_category));
    }

    delete_obj_icon(){
        localStorage.removeItem("obj_icon");
        this.obj_icon=null;
    }
    
    delete_obj_icon_category(){
        localStorage.removeItem("obj_icon_category");
        this.obj_icon_category=null;
    }

    list(){
        if(this.carrot.check_ver_cur("icon")==false){
            this.carrot.log("Get list icon from sever and show");
            this.carrot.get_list_doc("icon",this.act_done_get_data_list_icon);
        }else{
            if(this.obj_icon==null){
                this.carrot.log("Get list icon from sever and show");
                this.carrot.get_list_doc("icon",this.act_done_get_data_list_icon);
            }
            else{
                this.carrot.log("Show all data icon from cache!");
                this.show_all_icon_from_list_icon();
            }
        }
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.icon.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Icon</button>';
                html+='<button onclick="carrot.icon.add_category();" class="btn dev btn-sm btn-success"><i class="fa-solid fa-square-plus"></i> Add Category</button>';
                html+='<button onclick="carrot.icon.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+='<div class="btn-group" role="group">';
                    html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_icon_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> Category ('+carrot.icon.cur_show_icon_category+')</button>';
                    html+='<div class="dropdown-menu" aria-labelledby="btn_list_ebook_category" id="list_icon_category">';
                        var list_category=this.carrot.obj_to_array(this.obj_icon_category);
                        var css_active='';
                        list_category.push({key:"all",icon:"fa-solid fa-rectangle-list"});
                        $(list_category).each(function(index,cat){
                            if(cat.key==carrot.icon.cur_show_icon_category) css_active="btn-success";
                            else css_active="btn-secondary";
                            html+='<button role="button" onclick="carrot.icon.select_show_category(\''+cat.key+'\')" class="dropdown-item btn '+css_active+'"><i class="'+cat.icon+'"></i> '+cat.key+'</button>';
                        });
                    html+='</div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="Last group">';
                var css_active="";
                if(this.type_show=="list_icon") css_active="active"; else css_active="";
                html+='<button onclick="carrot.icon.list();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-regular fa-rectangle-list"></i> List Icon</button>';
                if(this.type_show=="list_category") css_active="active"; else css_active="";
                html+='<button onclick="carrot.icon.list_category();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-solid fa-rectangle-list"></i> List Category</button>';
            html+='</div>';

        html+='</div>';
        html+='</div>';
        return html;
    }

    get_category(){
        this.carrot.get_list_doc("icon_category",this.done_get_category);
        this.carrot.update_new_ver_cur("icon_category");
    }

    set_img_icon_url_by_id(s_id_icon,emp_id){
        this.carrot.db.collection("icon").doc(s_id_icon).get().then((doc) => {
            if (doc.exists) {
                var data_obj = doc.data();
                $("#"+emp_id).attr("src",data_obj.icon);
                return data_obj.icon;
            }
        });
    }

    done_get_category(datas,carrot){
        carrot.icon.obj_icon_category=datas;
        carrot.icon.save_obj_icon_category();
        if(carrot.icon.type_show=="list_category"){
            carrot.icon.show_list_category();
        }else if(carrot.icon.type_show=='list_msg'){
            carrot.icon.show_data_to_form_list_msg_category_icon();
        }
        else{
            carrot.icon.show_data_to_dropdown_category_icon();
        }
    }

    show_data_to_form_list_msg_category_icon(){
        var html='';
        var list_cat_icon=carrot.obj_to_array(carrot.icon.obj_icon_category);
        var emp_id=$(carrot.icon.emp_msg_field).attr("id");
        $(list_cat_icon).each(function(index,cat){
            cat.index=index;
            html+='<div onclick="carrot.icon.msg_list_select(this);return false;" data-emp-id="'+emp_id+'" data-category-key="'+cat.key+'" class="btn btn-sm btn-secondary rounded text-white m-1"><i class="'+cat.icon+'"></i> '+cat.key+'</div>';
        });
        $("#"+emp_id).parent().append(html);
    }

    show_data_to_dropdown_category_icon(){
        var html='';
        var list_category=this.carrot.obj_to_array(this.obj_icon_category);
        var css_active='';
        list_category.push({key:"all",icon:"fa-solid fa-rectangle-list"});
        $(list_category).each(function(index,cat){
            cat.index=index;
            if(cat.key==carrot.icon.cur_show_icon_category) css_active="btn-success";
            else css_active="btn-secondary";
            html+='<button role="button" onclick="carrot.icon.select_show_category(\''+cat.key+'\')" class="dropdown-item btn '+css_active+'"><i class="'+cat.icon+'"></i> '+cat.key+'</button>';
        });
        $("#list_icon_category").html(html);
    }

    done_get_data_icon(querySnapshot){
        if(querySnapshot.docs.length>0){
            this.obj_icon=Object();
            querySnapshot.forEach((doc) => {
                var data_icon=doc.data();
                data_icon["id"]=doc.id;
                this.obj_icon[doc.id]=JSON.stringify(data_icon);
            });
            this.save_obj_icon();
            this.show_all_icon_from_list_icon();
            Swal.close();
        }else{
            this.carrot.msg("None List Icon!","alert");
        }
    }

    select_show_category(key_category){
        carrot.icon.cur_show_icon_category=key_category;
        Swal.showLoading();
        this.carrot.log("Get list Icon by category from sever","warning");
        if(key_category=="all"){
            carrot.db.collection("icon").limit(200).get().then((querySnapshot) => {
                carrot.icon.done_get_data_icon(querySnapshot);
            }).catch((error) => {
                console.log(error);
                carrot.msg(error.message,"error");
                Swal.close();
            });
        }else{
            this.carrot.db.collection("icon").where("category","==",key_category).limit(200).get().then((querySnapshot) => {
                carrot.icon.done_get_data_icon(querySnapshot);
            }).catch((error) => {
                console.log(error);
                this.carrot.msg(error.message,"error");
                Swal.close();
            });
        }
    }

    list_category(){
        if(this.carrot.check_ver_cur("icon_category")){
            if(this.obj_icon_category==null){
                this.get_category();
            }else{
                this.show_list_category();
            }
        }else{
            this.get_category();
        }
    }

    show_list_category(){
        var html='';
        var carrot=this.carrot;
        var list_category=this.carrot.obj_to_array(this.obj_icon_category);
        carrot.change_title_page("Icon Catgeory","?p=icon_category","icon_category");
        carrot.icon.type_show="list_category";

        html+=carrot.icon.menu();
        html+='<div class="row">';
        $(list_category).each(function(index,category){
            var item_cat_icon=new Carrot_List_Item(carrot);
            item_cat_icon.set_title(category.key);
            item_cat_icon.set_index(index);
            item_cat_icon.set_db("icon_category");
            if(category.icon!=null) item_cat_icon.set_icon_font(category.icon+" icon_catgeory");
            item_cat_icon.set_obj_js("icon");
            item_cat_icon.set_id(category.key);
            item_cat_icon.set_act_edit("carrot.icon.edit_category");
            item_cat_icon.set_class("col-md-4 mb-3");
            item_cat_icon.set_class_icon("col-2");
            item_cat_icon.set_class_body("col-10");
            if(category.buy=="buy") item_cat_icon.set_body('<i class="fa-solid fa-cart-shopping text-success text-end"></i>');
            html+=item_cat_icon.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();

        $(".icon_catgeory").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.icon.select_show_category(obj_id);
        });
    }

    act_done_get_data_list_icon(ions,carrot){
        carrot.icon.obj_icon=ions;
        carrot.icon.save_obj_icon();
        carrot.icon.show_all_icon_from_list_icon();
        carrot.update_new_ver_cur("icon",true);
    }

    show_all_icon_from_list_icon(){
        var carrot=this.carrot;
        carrot.change_title_page("Icon", "?p=icon","icon");
        var list_icon=carrot.convert_obj_to_list(this.obj_icon);
        var html="";
        carrot.icon.type_show="list_icon";
        if(carrot.icon.obj_icon_category==null) carrot.icon.get_category();
        else carrot.icon.show_data_to_dropdown_category_icon();
        html+=carrot.icon.menu();

        html+='<div class="row m-0">';
        $(list_icon).each(function(index,data_icon) {
            html+=carrot.icon.box_icon_item(data_icon);
        });
        html+="</div>";
        carrot.show(html);
        this.carrot.check_event();
        this.check_event();
    }

    check_event(){
        var carrot=this.carrot;
        $(".icon_info").click(function(){
            var id_icon=$(this).attr("obj_id");
            carrot.icon.get_info(id_icon,carrot);
        });
    }

    box_icon_item(data_icon,s_class="col-md-2 mb-2 col-sm-3"){
        if(data_icon["name"]==null) data_icon["name"]=data_icon.id;
        var s_url_icon="";
        if(data_icon.icon!=null) s_url_icon=data_icon.icon;
        if(s_url_icon=="") s_url_icon="images/64.png";
        var item_icon=new Carrot_List_Item(carrot);
        item_icon.set_db("icon");
        item_icon.set_id(data_icon.id);
        item_icon.set_class(s_class);
        item_icon.set_class_icon("col-md-12 mb-3 col-12 text-center icon_info");
        item_icon.set_icon(s_url_icon);
        item_icon.set_name(data_icon.name);
        item_icon.set_body("<span class='fs-8' style='color:"+data_icon.color+"'>"+data_icon.color+"</span>");
        return item_icon.html();
    }

    add(){
        var data_icon=new Object();
        data_icon["id"]="icon"+this.carrot.create_id();
        data_icon["name"]="";
        data_icon["icon"]="";
        data_icon["color"]="";
        data_icon["category"]="";
        data_icon["date_create"]=new Date().toISOString();
        this.add_or_edit(data_icon).set_title("Add icon").set_msg_done("Add icon success!").show();
    }

    edit(data_icon,carrot){
        carrot.icon.add_or_edit(data_icon).set_title("Update icon").set_msg_done("Update icon success!").show();
    }

    add_or_edit(data){
        var frm=new Carrot_Form("frm_icon",this.carrot);
        frm.set_db("icon","id");
        frm.set_icon_font(this.icon);
        frm.create_field("id").set_label("ID").set_val(data["id"]).set_type("id").set_main();
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon").set_val(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("color").set_label("Color").set_val(data["color"]).set_type("color");
        var category_field=frm.create_field("category").set_label("Category").set_val(data["category"]).set_type("select");
        category_field.add_option("","Unknown");
        var list_category=this.carrot.obj_to_array(this.obj_icon_category);
        $(list_category).each(function(index,category){
            category_field.add_option(category.key,category.key);
        });
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        return frm;
    }

    add_category(){
        var data_new=new Object();
        data_new["key"]="";
        data_new["icon"]="";
        data_new["buy"]="free";
        this.add_or_edit_category(data_new).set_title("Add Category").set_msg_done("Add Icon Category Success!!!").show();
    }

    edit_category(data,carrot){
        carrot.icon.add_or_edit_category(data).set_title("Edit Category").set_msg_done("Update Icon Category Success!!!").show();
    }

    add_or_edit_category(data){
        var frm=new Carrot_Form("frm_icon_category",this.carrot);
        frm.set_db("icon_category","key");
        frm.set_icon_font("fa-solid fa-rectangle-list");
        frm.create_field("key").set_label("Name Key").set_val(data["key"]).set_main();
        frm.create_field("icon").set_label("Icon (Font)").set_val(data["icon"]);
        var field_buy=frm.create_field("buy").set_label("Status Buy").set_val(data["buy"]).set_type("select");
        field_buy.add_option("free","Free");
        field_buy.add_option("buy","buy");
        return frm;
    }

    list_for_home(){
        var html='';
        if(this.obj_icon!=null){
            var list_icon=this.carrot.obj_to_array(this.obj_icon);
            list_icon= list_icon.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_icon">Other Icon</l>';
            html+='<span role="button" onclick="carrot.icon.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
            html+='<div id="other_code" class="row m-0">';
            $(list_icon).each(function(index,icon){
                if(index<12){
                    icon["index"]=index;
                    html+=carrot.icon.box_icon_item(icon);
                }else{
                    return false;
                }
            });
            html+='</div>';
        }
        return html;
    }

    get_info(id,carrot){
        carrot.get_doc("icon",id,carrot.icon.info);
    }

    info(data,carrot){
        carrot.change_title_page("icon","?p=icon&id="+data.id,carrot.icon.id_page);
        carrot.icon.obj_icon_info_cur=data;
        if(carrot.icon.obj_icon_category==null) carrot.icon.get_category();
        else carrot.icon.show_data_to_dropdown_category_icon();
        var html='';
        html+=carrot.icon.menu();
        html+='<div class="section-container p-2 p-xl-4 pt-0">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3 text-center">';
                        html+='<img src="'+data.icon+'"/>';
                    html+='</div>';

                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data.name+'</h4>';
                        html+=carrot.btn_dev("song",data.id);
                        html+='<div class="row pt-4">';

                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="genre">Category</l> <i class="fa-solid fa-guitar"></i></b>';
                                if(data.category==null||data.category==undefined||data.category=="") data.category="Unknown";
                                html+='<p>'+data.category+'</p>';
                            html+='</div>';

                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="file">File</l> <i class="fa-solid fa-file"></i></b>';
                                html+='<p>'+data.name+'.zip</p>';
                            html+='</div>';

                        html+='</div>';

                        html+='<div class="row pt-4">';
                        html+='<div class="col-12 text-center">';
                            html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                            html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success" ><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button> ';
                            if(data.mp3!=""){
                                if(carrot.icon.check_pay(data.name))
                                    html+='<button id="btn_download" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                                else
                                    html+='<button id="btn_download" type="button" class="btn d-inline btn-info"><i class="fa-brands fa-paypal"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                            }
                                
                            html+='</div>';
                        html+='</div>';

                    html+='</div>';

                html+='</div>';  

                html+='<div id="previewImage" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="describe">Editor</h4>';
                    html+='<p class="fs-8 text-justify">All Size Icon</p>';
                    html+='<div class="col-3 text-center">64x64<br/><img src="'+data.icon+'" style="width:64px;"/></div>';
                    html+='<div class="col-3 text-center">32x32<br/><img src="'+data.icon+'" style="width:32px;"/></div>';
                    html+='<div class="col-3 text-center">24x24<br/><img src="'+data.icon+'" style="width:24px;"/></div>';
                    html+='<div class="col-3 text-center">16x16<br/><img src="'+data.icon+'" style="width:16px;"/></div>';
                html+='</div>';

                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                html+='<h4 class="fw-semi fs-5 lang" key_lang="describe_folder">Directory structure and extended functions</h4>';

                html+='<div class="treeview w-20 border">';
                    html+='<h6 class="pt-3 pl-3">Folders</h6>';
                    html+='<hr>';
                    html+='<ul class="mb-1 pl-3 pb-2">';
                        html+='<li><i class="fa-solid fa-file-zipper"></i> '+data.name+'.zip</li>';
                        html+='<li>&nbsp;<i class="fa-solid fa-folder"></i> png</li>';
                        html+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 64.png</li>';
                        html+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 32.png</li>';
                        html+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 24.png</li>';
                        html+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 16.png</li>';
                    html+='</ul>';
                html+='</div>';
                
            html+='</div>';

            html+=carrot.link_store.box_qrdoce();

            html+='</div>';

            html+='<div class="col-md-4">';
                html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_icon">Related Icon</h4>';
                html+='<div class="row">';
                var list_icon=carrot.convert_obj_to_list(carrot.icon.obj_icon).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
                var count_icon=0;
                for(var i=0;i<list_icon.length;i++){
                    var icon=list_icon[i];
                    if(data.id!=icon.id){
                        html+=carrot.icon.box_icon_item(icon,"col-md-6 mb-2 col-sm-6");
                        count_icon++;
                        if(count_icon>=12)break;
                    }
                };
                html+='</div>';
            html+='</div>';

        html+='</div>';
        html+='</div>';

        html+=carrot.icon.list_for_home();

        carrot.show(html);
        carrot.check_event();
        carrot.icon.check_event();
        carrot.icon.reader_icon_data();

        $("#btn_download").unbind('click');
        $("#btn_download").click(function(){
            if(carrot.icon.check_pay(carrot.icon.obj_icon_info_cur.name))
                carrot.icon.act_download();
            else
                carrot.show_pay("icon","Download Icon ("+carrot.icon.obj_icon_info_cur.name+")","Get file icon","1.99",carrot.icon.pay_success);
        });
    }

    check_pay(id_icon){
        if(localStorage.getItem("buy_icon_"+id_icon)!=null)
            return true;
        else
            return false;
    }

    pay_success(carrot){
        $("#btn_download").removeClass("btn-info").addClass("btn-success").html('<i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l>');
        localStorage.setItem("buy_icon_"+carrot.icon.obj_icon_info_cur.name,"1");
        this.act_download();
    }

    act_download(){
        var carrot=this.carrot;
        var name_icon=carrot.icon.obj_icon_info_cur.name;
        const zip = new JSZip();
        zip.file(name_icon+"/png/64.png",carrot.icon.data_icon_64);
        zip.file(name_icon+"/png/32.png",carrot.icon.data_icon_32);
        zip.file(name_icon+"/png/24.png",carrot.icon.data_icon_24);
        zip.file(name_icon+"/png/16.png",carrot.icon.data_icon_16);
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, name_icon+".zip");
        });
    }

    resizeImage(base64Str, maxWidth = 400, maxHeight = 350) {
        return new Promise((resolve) => {
          let img = new Image()
          img.src = base64Str
          img.onload = () => {
            let canvas = document.createElement('canvas')
            const MAX_WIDTH = maxWidth
            const MAX_HEIGHT = maxHeight
            let width = img.width
            let height = img.height
      
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height
                height = MAX_HEIGHT
              }
            }
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL())
          }
        })
    }

    reader_icon_data(){
        var carrot=this.carrot;
        carrot.file.get_base64data_file(carrot.icon.obj_icon_info_cur.icon).then((data)=>{

            carrot.icon.resizeImage(data, 64, 64).then((result) => {
                carrot.icon.data_icon_64=carrot.icon.makeblob(result);
            });

            carrot.icon.resizeImage(data, 32, 32).then((result) => {
                carrot.icon.data_icon_32=carrot.icon.makeblob(result);
            });

            carrot.icon.resizeImage(data, 24, 24).then((result) => {
                carrot.icon.data_icon_24=carrot.icon.makeblob(result);
            });

            carrot.icon.resizeImage(data, 16, 16).then((result) => {
                carrot.icon.data_icon_16=carrot.icon.makeblob(result);
            });

        });
    }

    makeblob(dataURL) {
        const BASE64_MARKER = ';base64,';
        const parts = dataURL.split(BASE64_MARKER);
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
    
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
    
        return new Blob([uInt8Array], { type: contentType });
    }

    reload(carrot){
        carrot.icon.delete_obj_icon();
        carrot.icon.list();
    }

    delete_all_data(){
        this.delete_obj_icon();
        this.delete_obj_icon_category();
        this.carrot.msg("Delete all data success!");
    }

    msg_list_select(emp){
        this.emp_msg_field=emp;
        this.category_key=$(emp).data("category-key");
        if(this.category_key=="all"){
            if(this.obj_icon==null){
                this.carrot.db.collection("icon").limit(28).get().then((querySnapshot) => {
                    if(querySnapshot.docs.length>0){
                        this.obj_icon=new Object();
                        querySnapshot.forEach((doc) => {
                            var data_icon=doc.data();
                            data_icon["id"]=doc.id;
                            this.obj_icon[doc.id]=JSON.stringify(data_icon);
                        });
                        this.save_obj_icon();
                        this.done_msg_list_select(this.obj_icon,this.carrot);
                    }else{
                        this.done_msg_list_select(null,this.carrot);
                    }
                }).catch((error) => {
                    console.log(error);
                    this.carrot.msg(error.message,"error");
                });
            }else{
                this.done_msg_list_select(this.obj_icon,this.carrot);
            }
        }else{
            this.carrot.db.collection("icon").where("category","==",this.category_key).orderBy(this.orderBy_at,this.orderBy_type).limit(28).get().then((querySnapshot) => {
                if(querySnapshot.docs.length>0){
                    this.obj_icon=new Object();
                    querySnapshot.forEach((doc) => {
                        var data_icon=doc.data();
                        data_icon["id"]=doc.id;
                        this.obj_icon[doc.id]=JSON.stringify(data_icon);
                    });
                    this.save_obj_icon();
                    this.done_msg_list_select(this.obj_icon,this.carrot);
                }else{
                    this.done_msg_list_select(null,this.carrot);
                }
            }).catch((error) => {
                console.log(error);
                this.carrot.msg(error.message,"error");
            });
        }

        if(this.obj_icon_category==null){
            this.type_show="list_msg";
            this.get_category();
        }
    }

    done_msg_list_select(data,carrot){
        var html='';
        var list_icon=carrot.obj_to_array(data);
        var color_bg='';
        var emp_id=$(carrot.icon.emp_msg_field).data("emp-id");
        var id_icon=$("#"+emp_id).attr("value");

        var style_date_create_desc='btn-secondary';
        var style_date_create_asc='btn-secondary';
        var style_name_desc='btn-secondary';
        var style_name_asc='btn-secondary';

        html+='<div class="btn-group d-block mt-3 mb-3" role="group" aria-label="Basic example">';
            if(this.orderBy_at=="date_create"&&this.orderBy_type=="desc") style_date_create_desc='btn-success';
            if(this.orderBy_at=="date_create"&&this.orderBy_type=="asc") style_date_create_asc='btn-success';
            if(this.orderBy_at=="name"&&this.orderBy_type=="desc") style_name_desc='btn-success';
            if(this.orderBy_at=="name"&&this.orderBy_type=="asc") style_name_asc='btn-success';

            html+='<button onClick="carrot.icon.change_box_list_icon_by_order(\'date_create\',\'desc\');" type="button" class="btn '+style_date_create_desc+' btn-sm"><i class="fa-solid fa-arrow-up-short-wide"></i> Date</button>';
            html+='<button onClick="carrot.icon.change_box_list_icon_by_order(\'date_create\',\'asc\');" type="button" class="btn  '+style_date_create_asc+' btn-sm"><i class="fa-solid fa-arrow-down-short-wide"></i> Date</button>';
            html+='<button onClick="carrot.icon.change_box_list_icon_by_order(\'name\',\'desc\');" type="button" class="btn '+style_name_desc+' btn-sm"><i class="fa-solid fa-arrow-up-short-wide"></i> Key</button>';
            html+='<button onClick="carrot.icon.change_box_list_icon_by_order(\'name\',\'asc\');" type="button" class="btn '+style_name_asc+'  btn-sm"><i class="fa-solid fa-arrow-down-short-wide"></i> Key</button>';
        html+='</div>';

        $(list_icon).each(function(index,icon){
            icon.index=index;
            if(id_icon==icon.id) color_bg='bg-info'; else color_bg='';
            html+="<img role='button' title='"+icon.name+"' data-id-icon='"+icon.id+"' data-color='"+icon.color+"' file_url='"+icon.icon+"' onclick='carrot.icon.select_icon_for_msg(this);return false;' style='width:50px' class='rounded m-1 "+color_bg+"' src='"+icon.icon+"'/>";
            if(index>19) return false;
        });

        Swal.fire({
            title: 'Select Icon',
            html:html,
            showCancelButton: false
        });
    }

    change_box_list_icon_by_order(orderBy_at,orderBy_type){
        this.orderBy_at=orderBy_at;
        this.orderBy_type=orderBy_type;

        this.carrot.db.collection("icon").where("category","==",this.category_key).orderBy(this.orderBy_at,this.orderBy_type).limit(28).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.obj_icon=new Object();
                querySnapshot.forEach((doc) => {
                    var data_icon=doc.data();
                    data_icon["id"]=doc.id;
                    this.obj_icon[doc.id]=JSON.stringify(data_icon);
                });
                this.save_obj_icon();
                this.done_msg_list_select(this.obj_icon,this.carrot);
            }else{
                this.done_msg_list_select(null,this.carrot);
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
        });
    }

    select_icon_for_msg(emp){
        var file_url=$(emp).attr("file_url");
        var id_icon=$(emp).data("id-icon");
        var color_icon=$(emp).data("color");
        var emp_id=$(carrot.icon.emp_msg_field).data("emp-id");
        $("#"+emp_id).attr("value",id_icon).attr("src",file_url);
        if($('#color').length) $("#color").val(color_icon);
        Swal.close();
    }

    msg_list_select_random(){
        this.load_obj_icon();
        var arr_ico=this.carrot.obj_to_array(this.obj_icon);
        var index_ico_rand=Math.floor(Math.random() * arr_ico.length);
        var obj_ico_sel=arr_ico[index_ico_rand];
        $("#icon").attr("value",obj_ico_sel.id).attr("src",obj_ico_sel.icon);
        if($('#color').length) $("#color").val(obj_ico_sel.color);
    }
}