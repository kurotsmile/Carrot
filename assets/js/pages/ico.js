class Carrot_Ico{
    objs=null;
    obj_icon_category=[];
    cur_show_icon_category="all";
    type_show="list_icon";
    obj_icon_info_cur=null;

    orderBy_at="date_create";
    orderBy_type="ASCENDING";
    
    show(){
        var id_icon=carrot.get_param_url("id");
        if(id_icon!=undefined)
            carrot.ico.get_info(id_icon);
        else
            carrot.ico.list();
    }

    list(){
        carrot.loading("Get all data icon and show");
        carrot.change_title_page("Icon -"+carrot.ico.cur_show_icon_category, "?page=ico","icon");
        carrot.ico.get_data(carrot.ico.load_list_icon);
    }

    show_list_icon(){
        carrot.ico.cur_show_icon_category="all";
        carrot.data.clear("icons");
        carrot.ico.list();
    }

    show_list_icon_by_sort(sort_at,sort_type){
        carrot.data.clear("icons");
        carrot.loading("Get all data icon by order ("+sort_at+" -> "+sort_type+")");
        carrot.ico.orderBy_at=sort_at;
        carrot.ico.orderBy_type=sort_type;
        setTimeout(()=>{
            carrot.ico.get_data(carrot.ico.load_list_icon);
        },500);
    }

    get_data(act_done){
        if(carrot.check_ver_cur("icon")==false){
            carrot.update_new_ver_cur("icon",true);
            carrot.ico.get_data_from_server(act_done);
        }else{
            carrot.ico.get_data_from_db(act_done,()=>{
                carrot.ico.get_data_from_server(act_done);
            });
        }
    }

    get_data_cat(act_done){
        carrot.data.list("icon_category").then((cats)=>{
            carrot.ico.obj_icon_category=cats;
            act_done(cats);
        }).catch(()=>{
            var q=new Carrot_Query("icon_category");
            q.get_data((cats)=>{
                carrot.ico.obj_icon_category=cats;
                $(cats).each(function(index,cat){
                    carrot.data.add("icon_category",cat);
                });
                act_done(cats);
            });
        });
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("icon");
        if(carrot.ico.cur_show_icon_category!="all") q.add_where("category",carrot.ico.cur_show_icon_category);
        q.set_limit(54);
        q.set_order(carrot.ico.orderBy_at,carrot.ico.orderBy_type);
        q.get_data((icons)=>{
            carrot.ico.objs=icons;
            $(icons).each(function(index,icon){
                carrot.data.add("icons",icon);
            })
            act_done(icons);
        });
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("icons").then((icons)=>{
            carrot.ico.objs=icons;
            act_done(icons);
        }).catch(act_fail);
    }

    load_list_icon(icons){
        carrot.ico.type_show="list";
        carrot.hide_loading();
        var  html=carrot.ico.menu();
        html+='<div id="all_icon" class="row m-0"></div>';
        carrot.show(html);
        $(icons).each(function(index,data){
            data["index"]=index;
            $("#all_icon").append(carrot.ico.box_item(data).html());
        });
        carrot.ico.check_event();
    }

    check_event(){
        if(carrot.ico.obj_icon_category.length<=1) carrot.ico.get_all_data_category();
        else carrot.ico.show_data_to_dropdown_category_icon();
        if(carrot.ico.obj_icon_info_cur!=null) carrot.tool.list_other_and_footer("ico",'category',carrot.ico.obj_icon_info_cur.category,'col-md-6 mb-2 col-sm-6 ','col-md-2 mb-2 col-sm-3');
        carrot.tool.box_app_tip('Quick eye');
        carrot.check_event();
    }

    box_item(data_icon,s_class="col-md-2 mb-2 col-sm-3"){
        if(data_icon["name"]==null) data_icon["name"]=data_icon.id_doc;
        var item_icon=new Carrot_List_Item(carrot);
        carrot.data.load_image(data_icon.id_doc,data_icon.icon,"icon_ico_"+data_icon.index);
        item_icon.set_db("icon");
        item_icon.set_obj_js("ico");
        item_icon.set_id(data_icon.id_doc);
        item_icon.set_id_icon("icon_ico_"+data_icon.index);
        item_icon.set_class(s_class);
        item_icon.set_class_icon("col-md-12 mb-3 col-12 text-center icon_info");
        item_icon.set_icon("images/64.png");
        item_icon.set_name(data_icon.name);
        item_icon.set_body("<span class='fs-8' style='color:"+data_icon.color+"'>"+data_icon.color+"</span>");
        item_icon.set_act_click("carrot.ico.get_info('"+data_icon.id_doc+"');");
        return item_icon;
    }

    get_info(id){
        carrot.loading("Get data info "+id);
        carrot.ico.get_data_info(id,carrot.ico.info);
    }

    get_data_info(id_icon,act_done){
        setTimeout(() => {
            carrot.data.get("icons",id_icon,act_done,()=>{
                carrot.server.get("icon",id_icon,act_done);
            });
         }, 500);
    }

    info(data){
        carrot.hide_loading();
        carrot.ico.type_show="info";
        carrot.ico.obj_icon_info_cur=data;
        carrot.change_title_page(data.id_doc,"?page=ico&id="+data.id_doc,"ico");
        carrot.data.load_image(data.id_doc,data.icon,"icon_info_ico");
        var html='';
        html+=carrot.ico.menu();
        var box=new Carrot_Info(data.id_doc);
        box.set_db("icon");
        box.set_obj_js("ico");
        box.set_title(data.name);
        box.set_icon_image("images/64.png");
        box.set_icon_col_class("col-1");
        box.set_icon_id("icon_info_ico");
        box.add_attrs("fa-solid fa-guitar",'<l class="lang" key_lang="genre">Category</l>',data.category);
        box.add_attrs("fa-solid fa-file",'<l class="lang" key_lang="file">File</l>',data.name+".zip");
        box.add_attrs("fa-solid fa-palette",'Color',data.color);
        box.add_attrs("fa-regular fa-calendar-check",'Date create',data.date_create);

        box.add_btn("btn_download","fa-solid fa-file-arrow-down","Download","carrot.ico.act_download()");
        box.add_btn("btn_pay","fa-brands fa-paypal","Download","carrot.ico.pay()");

        var html_previewImage="";
        html_previewImage+='<div id="previewImage" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html_previewImage+='<h4 class="fw-semi fs-5 lang" key_lang="describe">Editor</h4>';
            html_previewImage+='<p class="fs-8 text-justify">All Size Icon</p>';
            html_previewImage+='<div class="col-3 text-center">64x64<br/><img src="'+data.icon+'" style="width:64px;"/></div>';
            html_previewImage+='<div class="col-3 text-center">32x32<br/><img src="'+data.icon+'" style="width:32px;"/></div>';
            html_previewImage+='<div class="col-3 text-center">24x24<br/><img src="'+data.icon+'" style="width:24px;"/></div>';
            html_previewImage+='<div class="col-3 text-center">16x16<br/><img src="'+data.icon+'" style="width:16px;"/></div>';
        html_previewImage+='</div>';

        html_previewImage+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html_previewImage+='<h4 class="fw-semi fs-5 lang" key_lang="describe_folder">Directory structure and extended functions</h4>';
            html_previewImage+='<div class="treeview w-20 border">';
            html_previewImage+='<h6 class="pt-3 pl-3">Folders</h6>';
            html_previewImage+='<hr>';
            html_previewImage+='<ul class="mb-1 pl-3 pb-2">';
                html_previewImage+='<li><i class="fa-solid fa-file-zipper"></i> '+data.name+'.zip</li>';
                html_previewImage+='<li>&nbsp;<i class="fa-solid fa-folder"></i> png</li>';
                html_previewImage+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 64.png</li>';
                html_previewImage+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 32.png</li>';
                html_previewImage+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 24.png</li>';
                html_previewImage+='<li>&nbsp;&nbsp;<i class="fa-solid fa-caret-right"></i> <i class="fa-solid fa-file"></i> 16.png</li>';
            html_previewImage+='</ul>';
            html_previewImage+='</div>';
        html_previewImage+='</div>';
        
        box.add_contain(html_previewImage);

        $(carrot.ico.objs).each(function(index,icon_data){
            if(index>=12) return false;
            icon_data["index"]=(index+200);
            var box_item_icon=carrot.ico.box_item(icon_data);
            box_item_icon.set_class('col-md-6 mb-3 col-6');
            box.add_related(box_item_icon.html());
        });

        box.add_footer(carrot.ico.list_for_home());

        html+=box.html();
        carrot.show(html);

        $("#btn_download").removeClass("d-inline");
        $("#btn_pay").removeClass("d-inline");

        if(carrot.ico.check_pay(data.id_doc)){
            $("#btn_download").show();
            $("#btn_pay").hide();
        }else{
            $("#btn_download").hide();
            $("#btn_pay").show();
        }

        carrot.check_event();

        carrot.file.get_base64data_file(data.icon).then((data_img)=>{
            carrot.tool.resizeImage(data_img, 64, 64).then((result) => {
                carrot.ico.data_icon_64=carrot.tool.makeblob(result);
            });
            carrot.tool.resizeImage(data_img, 32, 32).then((result) => {
                carrot.ico.data_icon_32=carrot.tool.makeblob(result);
            });
            carrot.tool.resizeImage(data_img, 24, 24).then((result) => {
                carrot.ico.data_icon_24=carrot.tool.makeblob(result);
            });
            carrot.tool.resizeImage(data_img, 16, 16).then((result) => {
                carrot.ico.data_icon_16=carrot.tool.makeblob(result);
            });
        });

        carrot.ico.check_event();
    }

    pay(){
        carrot.show_pay("icon","Download Icon ("+carrot.ico.obj_icon_info_cur.name+")","Get file icon","1.99",carrot.ico.pay_success);
    }

    pay_success(carrot){
        $("#btn_download").show();
        $("#btn_pay").hide();
        localStorage.setItem("buy_icon_"+carrot.ico.obj_icon_info_cur.id_doc,"1");
        carrot.ico.act_download();
    }

    check_pay(id_icon){
        if(localStorage.getItem("buy_icon_"+id_icon)!=null)
            return true;
        else
            return false;
    }

    act_download(){
        var name_icon=carrot.ico.obj_icon_info_cur.name;
        const zip = new JSZip();
        zip.file(name_icon+"/png/64.png",carrot.ico.data_icon_64);
        zip.file(name_icon+"/png/32.png",carrot.ico.data_icon_32);
        zip.file(name_icon+"/png/24.png",carrot.ico.data_icon_24);
        zip.file(name_icon+"/png/16.png",carrot.ico.data_icon_16);
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, name_icon+".zip");
        });
    }

    menu_sort(s_func='show_list_icon_by_sort'){
        var html='';
        var style_date_create_desc='btn-secondary';
        var style_date_create_asc='btn-secondary';
        var style_name_desc='btn-secondary';
        var style_name_asc='btn-secondary';

        html+='<div class="btn-group" role="group" aria-label="Basic menu sort">';

            if(carrot.ico.orderBy_at=="date_create"&&carrot.ico.orderBy_type=="DESCENDING") style_date_create_desc='btn-success';
            if(carrot.ico.orderBy_at=="date_create"&&carrot.ico.orderBy_type=="ASCENDING") style_date_create_asc='btn-success';
            if(carrot.ico.orderBy_at=="name"&&carrot.ico.orderBy_type=="DESCENDING") style_name_desc='btn-success';
            if(carrot.ico.orderBy_at=="name"&&carrot.ico.orderBy_type=="ASCENDING") style_name_asc='btn-success';

            html+='<button onClick="carrot.ico.'+s_func+'(\'date_create\',\'DESCENDING\');" type="button" class="btn '+style_date_create_desc+' btn-sm"><i class="fa-solid fa-arrow-up-short-wide"></i> Date</button>';
            html+='<button onClick="carrot.ico.'+s_func+'(\'date_create\',\'ASCENDING\');" type="button" class="btn  '+style_date_create_asc+' btn-sm"><i class="fa-solid fa-arrow-down-short-wide"></i> Date</button>';
            html+='<button onClick="carrot.ico.'+s_func+'(\'name\',\'DESCENDING\');" type="button" class="btn '+style_name_desc+' btn-sm"><i class="fa-solid fa-arrow-up-a-z"></i> Key</button>';
            html+='<button onClick="carrot.ico.'+s_func+'(\'name\',\'ASCENDING\');" type="button" class="btn '+style_name_asc+'  btn-sm"><i class="fa-solid fa-arrow-down-z-a"></i> Key</button>';
        html+='</div>';
        return html;
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
            html+='<div class="col-8">';
                html+='<div class="btn-group btn-sm" role="group" aria-label="Mider group">';
                    if(carrot.ico.type_show!='list') html+='<button onclick="carrot.ico.list();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-caret-left"></i> <l class="lang" key_lang="back">Back</l></button>';
                    html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_icon_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> Category ('+carrot.ico.cur_show_icon_category+')</button>';
                    html+='<div class="dropdown-menu" aria-labelledby="btn_list_icon_category" id="list_icon_category"></div>';
                html+='</div>';

                html+='<div class="btn-group btn-sm" role="group" aria-label="First group">';
                    html+='<button onclick="carrot.ico.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Icon</button>';
                    html+='<button onclick="carrot.ico.add_category();" class="btn dev btn-sm btn-success"><i class="fa-solid fa-square-plus"></i> Add Category</button>';
                    html+=carrot.tool.btn_export("icon");
                    html+='<button onclick="carrot.ico.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+='</div>';

                if(carrot.ico.type_show=='list') html+=carrot.ico.menu_sort();

            html+='</div>';

            html+='<div class="col-4">';
                html+='<div class="btn-group btn-sm float-end" role="group" aria-label="Last group">';
                    var css_active="";
                    if(carrot.ico.type_show=="list") css_active="active"; else css_active="";
                    html+='<button onclick="carrot.ico.show_list_icon();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-regular fa-rectangle-list"></i> List Icon</button>';
                    if(carrot.ico.type_show=="list_category") css_active="active"; else css_active="";
                    html+='<button onclick="carrot.ico.show_list_category();" class="btn btn-sm btn-success '+css_active+'"><i class="fa-solid fa-rectangle-list"></i> List Category</button>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    add(){
        var data_icon={};
        data_icon["id"]="icon"+carrot.create_id();
        data_icon["name"]="";
        data_icon["icon"]="";
        data_icon["color"]="";
        data_icon["category"]="";
        data_icon["date_create"]=new Date().toISOString();
        carrot.ico.add_or_edit(data_icon).set_title("Add icon").set_msg_done("Add icon success!").show();
    }

    edit(data_icon,carrot){
        carrot.ico.add_or_edit(data_icon).set_title("Update icon").set_msg_done("Update icon success!").show();
    }

    add_or_edit(data){
        var frm=new Carrot_Form("frm_icon",carrot);
        frm.set_db("icon","id");
        frm.set_icon_font("fa-solid fa-face-smile-wink");
        frm.create_field("id").set_label("ID").set_val(data["id"]).set_type("id").set_main();
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon").set_val(data["icon"]).set_type("file").set_type_file("image/*");
        frm.create_field("color").set_label("Color").set_val(data["color"]).set_type("color");
        var category_field=frm.create_field("category").set_label("Category").set_val(data["category"]).set_type("select");
        category_field.add_option("","Unknown");
        $(carrot.ico.obj_icon_category).each(function(index,category){
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
        carrot.ico.add_or_edit_category(data).set_title("Edit Category").set_msg_done("Update Icon Category Success!!!").show();
    }

    add_or_edit_category(data){
        var frm=new Carrot_Form("frm_icon_category",carrot);
        frm.set_db("icon_category","key");
        frm.set_icon_font("fa-solid fa-rectangle-list");
        frm.create_field("key").set_label("Name Key").set_val(data["key"]).set_main();
        frm.create_field("icon").set_label("Icon (Font)").set_val(data["icon"]);
        var field_buy=frm.create_field("buy").set_label("Status Buy").set_val(data["buy"]).set_type("select");
        field_buy.add_option("free","Free");
        field_buy.add_option("buy","buy");
        return frm;
    }

    get_all_data_category(){
        carrot.data.list("icon_category").then((datas)=>{
            carrot.ico.get_all_data_category_done(datas);
        }).catch(()=>{
            carrot.ico.get_all_data_category_from_server();
        });
    }

    get_all_data_category_from_server(){
        var q=new Carrot_Query("icon_category");
        q.get_data((datas)=>{
            $(datas).each(function(index,cat){
                carrot.data.add("icon_category",cat);
            });
            carrot.ico.get_all_data_category_done(datas);
        });
    }

    get_all_data_category_done(icons){
        carrot.ico.obj_icon_category=icons;
        carrot.ico.show_data_to_dropdown_category_icon();
    }

    show_data_to_dropdown_category_icon(){
        var html='';
        var css_active='';
        if(carrot.ico.obj_icon_category.length==0) carrot.ico.obj_icon_category.push({key:"all",icon:"fa-solid fa-rectangle-list"});
        $(carrot.ico.obj_icon_category).each(function(index,cat){
            cat.index=index;
            if(cat.key==carrot.ico.cur_show_icon_category) css_active="btn-success";
            else css_active="btn-secondary";
            html+='<button role="button" onclick="carrot.ico.select_show_category(\''+cat.key+'\')" class="dropdown-item btn '+css_active+'"><i class="'+cat.icon+'"></i> '+cat.key+'</button>';
        });
        $("#list_icon_category").html(html);
    }

    show_list_category(){
        var html='';
        carrot.change_title_page("Icon Catgeory","?page=icon_category","icon_category");
        carrot.ico.type_show="list_category";

        html+=carrot.ico.menu();
        html+='<div class="row">';
        $(carrot.ico.obj_icon_category).each(function(index,category){
            var item_cat_icon=new Carrot_List_Item(carrot);
            item_cat_icon.set_title(category.key);
            item_cat_icon.set_index(index);
            item_cat_icon.set_db("icon_category");
            if(category.icon!=null) item_cat_icon.set_icon_font(category.icon+" icon_catgeory");
            item_cat_icon.set_obj_js("icon");
            item_cat_icon.set_id(category.key);
            item_cat_icon.set_act_edit("carrot.ico.edit_category");
            item_cat_icon.set_class("col-md-4 mb-3");
            item_cat_icon.set_class_icon("col-2");
            item_cat_icon.set_class_body("col-10");
            if(category.buy=="buy") item_cat_icon.set_body('<i class="fa-solid fa-cart-shopping text-success text-end"></i>');
            item_cat_icon.set_act_click("carrot.ico.select_show_category('"+category.id_doc+"')");
            html+=item_cat_icon.html();
        });
        html+='</div>';

        carrot.show(html);
        carrot.ico.check_event();
    }

    select_show_category(key_category){
        carrot.data.clear("icons");
        carrot.ico.cur_show_icon_category=key_category;
        carrot.ico.show();
    }

    list_for_home(){
        var html='';
        if(carrot.ico.objs!=null){
            var list_icon=carrot.random(carrot.ico.objs);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="fa-solid fa-face-grin-wink fs-6 me-2"></i> <l class="lang" key_lang="other_icon">Other Icon</l>';
            html+='<span role="button" onclick="carrot.ico.show_list_icon()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
            html+='<div id="other_icon" class="row m-0">';
            $(list_icon).each(function(index,icon){
                if(index<12){
                    icon["index"]=index;
                    html+=carrot.ico.box_item(icon).html();
                }else{
                    return false;
                }
            });
            html+='</div>';
        }
        return html;
    }

    msg_list_select(){
        carrot.loading("Get list data icon and show");
        carrot.ico.get_data(carrot.ico.load_msg_list_by_data);
    }

    show_msg_list_by_sort(sort_at,sort_type){
        carrot.loading("Get list data icon by order ("+sort_at+" -> "+sort_type+")");
        carrot.data.clear("icons");
        carrot.ico.orderBy_at=sort_at;
        carrot.ico.orderBy_type=sort_type;
        setTimeout(()=>{
            carrot.ico.get_data(carrot.ico.load_msg_list_by_data);
        },500);
    }

    change_category_icon_from(cat_key){
        carrot.data.clear("icons");
        carrot.ico.cur_show_icon_category=cat_key;
        carrot.ico.msg_list_select();
    }

    load_msg_field_preview(){
        $("#"+carrot.field_icon+"_val").html(carrot.loading_html());
        var id_icon=$("#"+carrot.field_icon).attr("value");
        if(id_icon!=""){
            carrot.ico.get_data_info(id_icon,(data)=>{
                carrot.ico.load_icon_for_msg_field(data);    
            });
        }else{
            carrot.ico.load_icon_for_msg_field(null);
        }
    }

    load_icon_for_msg_field(data){
        var html='<button onclick="carrot.js(\'ico\',\'ico\',\'carrot.ico.random_msg_field_icon()\');return false;" class="btn btn-sm btn-light"><i class="fa-solid fa-shuffle"></i> Random</button>';
        if(data!=null){
            $("#"+carrot.field_icon).attr("src",data.icon);
            $("#"+carrot.field_icon).attr("value",data.id_doc);
            $("#"+carrot.field_icon+"_val").html(data.id_doc+'<br/>'+html);
            if(carrot.field_color!=null) $("#"+carrot.field_color).attr("value",data.color);
        }else{
            if(carrot.ico.objs!=null) $("#"+carrot.field_icon+"_val").html(html);
        }
    }

    random_msg_field_icon(){
        if(carrot.ico.objs!=null){
            var icon=carrot.ico.objs[Math.floor(Math.random() * carrot.ico.objs.length)];
            carrot.ico.load_icon_for_msg_field(icon); 
        }else{
            carrot.ico.get_data(carrot.ico.random_msg_field_icon);
        }
    }

    load_msg_list_by_data(icons){
        carrot.hide_loading();
        var html='';
        var color_bg='';
        var id_icon=$("#"+carrot.field_ico).attr("value");

        carrot.ico.get_data_cat((cats)=>{

            html+='<div class="btn-group m-1" role="group" aria-label="Group Category Icon">';
            var style_cat_item='';
            cats.push({key:"all",icon:"fa-solid fa-rectangle-list"});
            $(cats).each(function(index,cat){
                style_cat_item='btn-secondary';
                if(carrot.ico.cur_show_icon_category==cat.key)style_cat_item='btn-info';
                html+='<div onclick="carrot.ico.change_category_icon_from(\''+cat.key+'\')" class="btn btn-sm '+style_cat_item+'"><i class="'+cat.icon+'"></i></div>';
            });
            html+='</div>';

            html+='<div>';
            html+=carrot.ico.menu_sort('show_msg_list_by_sort');
            html+='</div>';

            html+='<div>';
            $(icons).each(function(index,icon){
                icon.index=index;
                if(id_icon==icon.id_doc) color_bg='bg-info'; else color_bg='';
                html+="<img role='button' title='"+icon.name+"' data-id-icon='"+icon.id+"' data-color='"+icon.color+"' file_url='"+icon.icon+"' onclick='carrot.ico.select_icon_for_field(this);return false;' style='width:50px' class='rounded m-1 "+color_bg+"' src='"+icon.icon+"'/>";
            });
            html+='</div>';

            html+='<div>';
            html+=carrot.ico.menu_sort('show_msg_list_by_sort');
            html+='</div>';

            Swal.fire({
                title: 'Select Icon',
                html:html,
                showCancelButton: false
            });

        });
    }

    select_icon_for_field(emp){
        var id_icon=$(emp).attr("data-id-icon");
        carrot.ico.get_data_info(id_icon,carrot.ico.load_icon_for_msg_field);
        Swal.close();
    }

    delete_all_data(){
        carrot.data.clear("icons");
        carrot.data.clear("icon_category");
        carrot.msg("Delete all data success!");
    }
}
carrot.ico=new Carrot_Ico();
if(carrot.call_show_on_load_pagejs) carrot.ico.show();