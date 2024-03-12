class Carrot_Langs{
    carrot;
    list_lang=Array();
    icon="fa-sharp fa-solid fa-language";
    lang_setting="en";
    lang_setting_db_collection="en";

    lang_web=null;//One obj seve
    obj_lang_web=Object();//List obj save
    arr_lang_setting_db=Array();

    obj_lang_setting_category=null;
    
    constructor(carrot){
        this.carrot=carrot;

        if(localStorage.getItem("lang") == null) this.change_lang("en"); else {
            this.carrot.lang = localStorage.getItem("lang");
            this.lang_setting = localStorage.getItem("lang");
        }
        if(localStorage.getItem("list_lang") != null) this.list_lang=JSON.parse(localStorage.getItem("list_lang"));
        if(localStorage.getItem("lang_web")!=null) this.lang_web=JSON.parse(localStorage.getItem("lang_web"));
        if(localStorage.getItem("obj_lang_web")!=null) this.obj_lang_web=JSON.parse(localStorage.getItem("obj_lang_web"))

        carrot.register_page("lang","carrot.langs.list()","carrot.langs.edit_lang","carrot.langs.reload");
        carrot.register_page("lang_setting","carrot.langs.show_setting_lang_app()","carrot.langs.edit_lang");

        var btn_add=carrot.menu.create("add_lang").set_label("Add Lang").set_icon(this.icon).set_type("add");
        var btn_list=carrot.menu.create("list_lang").set_label("List Lang").set_icon(this.icon).set_type("dev");
        var btn_setting=carrot.menu.create("setting_lang").set_label("Setting Lang").set_icon(this.icon).set_type("setting");
        $(btn_add).click(function(){carrot.langs.add_lang();});
        $(btn_list).click(function(){carrot.langs.list();});
        $(btn_setting).click(function(){carrot.langs.show_setting_lang_by_key(carrot.lang,"lang_app");});

        $("#key_lang").html(carrot.lang);
        $("#btn_change_lang").click(function(){ carrot.langs.show_list_change_lang();});
    }

    save_list_lang(){
        localStorage.setItem("list_lang", JSON.stringify(this.list_lang));
    }

    save_lang_web(){
        localStorage.setItem("lang_web",JSON.stringify(this.lang_web));
    }

    save_obj_lang_web(){
        localStorage.setItem("obj_lang_web",JSON.stringify(this.obj_lang_web));
    }

    save_obj_lang_setting_category(){
        localStorage.setItem("obj_lang_setting_category",JSON.stringify(this.obj_lang_setting_category));
    }

    delete_list_lang(){
        localStorage.removeItem("list_lang");
        this.list_lang=Array();
        this.carrot.delete_ver_cur("lang");
    }

    menu(btn_extension=''){
        var html='';
        html +='<h3>Dịch thuật đa ngôn ngữ <small class="text-info">'+carrot.langs.lang_setting_db_collection+'</small></h3>';
        html+='<div class="row mb-3">';
            html+='<div class="col-12 m-0 btn-toolba" role="toolbar" aria-label="Toolbar with button groups">';
                html+='<div role="group" aria-label="First group"  class="btn-group mr-2">';
                    if(carrot.langs.lang_setting_db_collection=="lang_app")
                        html+='<button onclick="carrot.langs.show_setting_lang_app()" type="button" class="btn btn-info btn-sm"><i class="'+this.icon+'"></i> App Lang</button>';
                    else
                        html+='<button onclick="carrot.langs.show_setting_lang_app()" type="button" class="btn btn-dark btn-sm"><i class="fa-solid fa-list"></i> App Lang</button>';

                    if(carrot.langs.lang_setting_db_collection=="lang_web")
                        html+='<button onclick="carrot.langs.show_setting_lang_web()" type="button" class="btn btn-info btn-sm"><i class="'+this.icon+'"></i> Web Lang</button>';
                    else
                        html+='<button onclick="carrot.langs.show_setting_lang_web()" type="button" class="btn btn-dark btn-sm"><i class="fa-solid fa-list"></i> Web Lang</button>';

                    if(carrot.langs.lang_setting_db_collection=="lang_app_ai_lover")
                        html+='<button onclick="carrot.langs.show_setting_lang_ai()" type="button" class="btn btn-info btn-sm"><i class="'+this.icon+'"></i> Ai Lover</button>';
                    else
                        html+='<button onclick="carrot.langs.show_setting_lang_ai()" type="button" class="btn btn-dark btn-sm"><i class="fa-solid fa-list"></i> Ai Lover</button>';

                    html+='<button onclick="carrot.langs.list_category_setting_lang();" type="button" class="btn btn-dark btn-sm"><i class="fa-solid fa-rectangle-list"></i> Category Lang Setting</button>';
                    html+=btn_extension;
                    html+=carrot.langs.list_btn_lang_select();
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    get_all_data_lang() {
        this.carrot.load_bar();
        this.carrot.log("get_all_data_lang from server","alert");
        this.carrot.db.collection("lang").get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.list_lang=Array(); 
                querySnapshot.forEach((doc) => {
                    var lang_data = doc.data();
                    lang_data["id"]=doc.id;
                    this.list_lang.push(lang_data);
                });
                this.save_list_lang();
                this.carrot.update_new_ver_cur("lang");
            }
        }).catch((error) => {
            this.carrot.log(error.message,"error")
        });
    };

    change_lang(s_key){
        this.carrot.lang=s_key;
        this.lang_setting=s_key;
        localStorage.setItem("lang", s_key);
        $("#key_lang").html(s_key);
    }

    get_data_lang_web(){
        if(this.carrot.check_ver_cur("lang_web")==false){
            this.get_all_data_lang_web();
        }else{
            if(this.obj_lang_web[this.carrot.lang]!=null){
                this.carrot.log("Load lang "+this.carrot.lang+" from cache","success");
                this.lang_web=JSON.parse(this.obj_lang_web[this.carrot.lang]);
                this.save_lang_web();
                this.load_data_lang_web();
            }else{
                this.get_all_data_lang_web();
            }
        }
    }

    get_all_data_lang_web(){
        this.carrot.load_bar();
        this.carrot.log("Get lang "+this.carrot.lang+" from server","alert");
        this.carrot.get_doc("lang_web",this.carrot.lang,this.get_data_lang_web_done);
        this.carrot.update_new_ver_cur("lang_web",true);
    }

    get_data_lang_web_done(data,carrot){
        carrot.langs.lang_web=data;
        carrot.langs.obj_lang_web[carrot.lang]=JSON.stringify(carrot.langs.lang_web);
        carrot.langs.save_lang_web();
        carrot.langs.save_obj_lang_web();
        carrot.langs.load_data_lang_web();
    }

    load_data_lang_web() {
        var langs=this;
        $(".lang").each(function(index,emp){
            var key_lang=$(emp).attr("key_lang");
            if(langs.lang_web!=null){
                if(langs.lang_web[key_lang]!=null) $(emp).html(langs.lang_web[key_lang].trim());
            }
        });
    }

    list_btn_lang_select(class_button='btn-secondary'){
        var html='';
        var langs=this;
        html+='<div class="btn-group" role="group">';
        html+='<button class="btn '+class_button+' dropdown-toggle btn-sm" type="button" id="btn_list_lang_ai" data-bs-toggle="dropdown" aria-expanded="true" >';
        html+='<i class="fa-solid fa-rectangle-list"></i> <l class="lang" key_lang="select_lang">Change country</l> ('+langs.lang_setting+')';
        html+='</button>';
        html+='<div class="dropdown-menu" aria-labelledby="btn_list_lang_ai">';
        $.each(this.list_lang,function(i,lang){
            if(lang.key==langs.lang_setting)
                html+='<button type="button" class="dropdown-item active btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
            else
                html+='<button type="button" class="dropdown-item  btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
        });
        html+='</div>';
        html+='</div>';
        return html;
    }

    list(){
        var carrot=this.carrot;
        var html='';
        carrot.change_title_page("All Lang","?p=lang","lang");
        html+='<div class="row">';
        $(this.carrot.langs.list_lang).each(function(index,lang){
            lang["id"]=lang["key"];
            var item_lang=new Carrot_List_Item(carrot);
            item_lang.set_id(lang.id);
            item_lang.set_db("lang");
            item_lang.set_icon(lang.icon);
            item_lang.set_name(lang.name);
            item_lang.set_tip(lang.key);
            item_lang.set_act_edit("carrot.langs.edit_lang");
            item_lang.set_class("col-md-2 mb-2");
            item_lang.set_class_icon("pe-0 col-3 ");
            item_lang.set_class_body("mt-2 col-9");
            html+=item_lang.html();
        });
        html+='</div>';
        this.carrot.show(html);
        this.carrot.check_event();
    }

    add_lang(){
        var data_lang=new Object();
        data_lang["key"]="";
        data_lang["name"]="";
        data_lang["icon"]="";
        this.frm_add_or_edit_lang(data_lang).set_title("Add Lang").show();
    }

    edit_lang(data,carrot){
        carrot.langs.frm_add_or_edit_lang(data).set_title("Update Lang").show();
    }

    frm_add_or_edit_lang(data_lang){
        var frm=new Carrot_Form("frm_lang",this.carrot);
        frm.set_db("lang","key");
        frm.create_field("key").set_label("Key").set_value(data_lang.key);
        frm.create_field("name").set_label("Name").set_value(data_lang.name);
        frm.create_field("icon").set_label("icon").set_value(data_lang.icon).set_type("file").set_type_file("image/*");
        return frm;
    }

    show_setting_lang_app(){
        this.show_setting_lang_by_key(this.lang_setting,"lang_app");
    }

    show_setting_lang_web(){
        this.show_setting_lang_by_key(this.lang_setting,"lang_web");
    }

    show_setting_lang_ai(){
        this.show_setting_lang_by_key(this.lang_setting,"lang_app_ai_lover");
    }

    show_setting_lang_by_key(s_key_lang_change="",s_collection){    
        var data_obj_lang_tag=new Object();
        var data_obj_lang_change=new Object();
        Swal.showLoading();
        this.lang_setting=s_key_lang_change;
        this.carrot.db.collection(s_collection).doc("en").get().then((doc) => {
            if (doc.exists) {
                data_obj_lang_tag = doc.data();
                data_obj_lang_tag["id"]=doc.id;
                this.carrot.db.collection(s_collection).doc(s_key_lang_change).get().then((doc) => {
                    if (doc.exists) {
                        data_obj_lang_change = doc.data();
                        data_obj_lang_change["id"]=doc.id;
                        this.carrot.langs.lang_setting_db_collection=s_collection;
                        this.carrot.langs.show_setting_lang(data_obj_lang_tag,data_obj_lang_change);
                        Swal.close();
                    }else{
                        data_obj_lang_tag["id"]=this.lang_setting;
                        data_obj_lang_change["id"]=this.lang_setting;
                        this.carrot.langs.lang_setting_db_collection=s_collection;
                        this.carrot.langs.show_setting_lang(data_obj_lang_tag,data_obj_lang_change);
                        Swal.close();
                    }
                }).catch((error) => {
                    this.carrot.log(error.message);
                    Swal.close();
                });
            }else{
                data_obj_lang_tag["id"]=this.lang_setting;
                data_obj_lang_change["id"]=this.lang_setting;
                this.carrot.langs.lang_setting_db_collection=s_collection;
                this.carrot.langs.show_setting_lang(data_obj_lang_tag,data_obj_lang_change);
                Swal.close();
            }
        }).catch((error) => {
            this.carrot.log(error.message);
            Swal.close();
        });
    }

    show_setting_lang(data_lang_tag,data_lang_change){
        var html = '';
        var langs=this;
        this.carrot.change_title_page("Lang Setting","?p="+langs.lang_setting_db_collection,"lang_setting");

        html+=carrot.langs.menu();
        html+='<table class="table table-striped table-hover mt-3" id="table_setting_lang">';
        html+='<thead class="thead-light fs-9">';
        html+='<tr>';
        html+='<th scope="col" class="w-10">Key</th>';
        html+='<th scope="col" class="w-25">Value</th>';
        html+='<th scope="col">New Lang</th>';
        html+='</tr>';
        html+='</thead>';
        html+='<tbody id="body_table_lang_setting" class="fs-9">';
        
        $.each(data_lang_tag, function(key, value){
            var s_val_change='';
            var s_class="";
            if(data_lang_change!=null){
                if(data_lang_change[key]!=null){
                    s_val_change=data_lang_change[key];
                }
            }
            if(s_val_change=='') s_class="bg-danger";
            if(key=='id'&&s_val_change=='') s_val_change=langs.lang_setting;
            html+='<tr class="'+s_class+'">';
            html+='<td scope="col" class="w-10"><b>'+key+'</b></td>';
            html+='<td scope="col" class="w-25">';
                html+='<span id="txt_'+key+'" class="lang_key_setting" data="'+key+'" val="'+value+'" val_change="'+s_val_change+'">'+value+'</span> '
                if(key!='id') html+='<button class="btn btn-outline-secondary btn-sm" type="button" onclick="copy_txt_tag(\'txt_'+key+'\')"><i class="fa-solid fa-copy"></i></button> <button class="btn btn-outline-secondary btn-sm" type="button" onclick="tr(\'txt_'+key+'\',\''+langs.lang_setting+'\')"><i class="fa-solid fa-language"></i></button>';
            html+='</td>';
            html+='<td scope="col">';
                html+='<div class="input-group">';
                    html+='<input id="inp_'+key+'" type="text" value="'+s_val_change+'" class="form-control inp-lang input-sm m-0 p-1 fs-9" data-key="'+key+'"/>';
                    html+='<div class="input-group-append">';
                    if(key!="id") html+='<button class="btn btn-outline-secondary btn-sm" type="button" onclick="paste_tag(\'inp_'+key+'\')"><i class="fa-solid fa-paste"></i> Paste</button>';
                    if(data_lang_change.id=="en"&&key!="id") html+='<button class="btn btn-danger bt-sm" type="button" onclick=" $(this).parent().parent().parent().parent().remove();"><i class="fa-solid fa-trash"></i> Delete</button>';
                    html+='</div>';
                html+='</div>';
            html+='</td>';
            html+='</tr>';
        });
        html+='</tbody>';
        html+='</table>';

        html+='<button id="btn_done_setting_lang" type="button" class="btn btn-primary mr-1 mt-1"><i class="fa-solid fa-square-check"></i> Done</button> ';
        if(data_lang_change.id=="en") html+='<button id="btn_add_field_setting_lang" type="button" class="btn btn-secondary mr-1 mt-1 btn-sm" ><i class="fa-solid fa-add"></i> Add Field</button>';
        if(data_lang_change.id!="en") html+='<button onclick="carrot.langs.automatic_translate_table();return false;" type="button" class="btn btn-secondary mr-1 mt-1 btn-sm" ><i class="fa-solid fa-language"></i> Automatically translated</button>';
        $("#main_contain").html(html);
        if(data_lang_change.id=="en") document.getElementById("btn_add_field_setting_lang").onclick = event => {  this.add_field_for_setting_lang();}
        new DataTable('#table_setting_lang', {responsive: true,pageLength:1000});
        this.check_event();
    }

    check_event(){
        var carrot=this.carrot;
        var langs=this;

        carrot.check_event();

        $(".btn-setting-lang-change").click(function(){
            var key_change=$(this).attr("key_change");
            langs.show_setting_lang_by_key(key_change,langs.lang_setting_db_collection);
        });

        $("#btn_done_setting_lang").click(function(){
            var data_inp_lang=new Object();
            $(".inp-lang").each(function(index,emp){
                var key_lang=$(this).attr("data-key");
                var val_lang=$(this).val();
                data_inp_lang[key_lang]=val_lang;
            });
            carrot.set_doc(langs.lang_setting_db_collection,langs.lang_setting,data_inp_lang);
            $.MessageBox("Cập nhật "+langs.lang_setting_db_collection+" - "+langs.lang_setting+" thành công!")
        });
    }

    add_field_for_setting_lang(){
        $.MessageBox({
            message: "Add Field for Setting language",
            input: {key:{'type':'text','label':'Key New Language'},value:{'type':'text','label':'Value New Language'}},
            top: "auto",
            buttonFail: "Cancel"
        }).done(function(data){
            var html_new_field='<tr>';
            html_new_field+='<td scope="col" class="w-10"><b>'+data.key+'</b></td>';
            html_new_field+='<td scope="col" class="w-25">New key <b class="text-danger">('+data.key+')</b></td>';
            html_new_field+='<td scope="col">';
                html_new_field += '<div class="input-group">';
                    html_new_field+='<input id="inp_'+data.key+'" type="text" value="'+data.value+'" class="form-control inp-lang input-sm m-0" data-key="'+data.key+'"/>';
                    html_new_field+='<div class="input-group-append">';
                        html_new_field+='<button class="btn btn-outline-secondary" type="button" onclick="paste_tag(\'inp_'+data.key+'\')"><i class="fa-solid fa-paste"></i> Paste</button>';
                        html_new_field+='<button class="btn btn-danger" type="button" onclick=" $(this).parent().parent().parent().parent().remove();"><i class="fa-solid fa-trash"></i> Delete</button>';
                    html_new_field += '</div>'; 
                html_new_field += '</div>';   
            html_new_field+='</td>';
            html_new_field+='</tr>';
            $("#body_table_lang_setting").append(html_new_field);
        });
    }

    automatic_translate_table(){
        $(".lang_key_setting").each(function(){
            var emp_val=$(this).attr("val");
            var emp_key=$(this).attr("data");
            var val_change=$(this).attr("val_change");
            if(emp_key!="id"&&val_change=="") carrot.langs.translateData_table_row(emp_val,"#inp_"+emp_key,carrot.langs.lang_setting);
        });
    }

    translateData_table_row(val_tr,emp_tr,targetLanguage) {
        var apiUrl = "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDtrxOBgBfiRLaxKP0p_UzfE2-hsjHNKBw";
        var msgData = {
            q:val_tr,
            target: targetLanguage
        };
        $.when(
            $.post(apiUrl, msgData)
        ).done(function(msgResponse) {
            var msg=msgResponse.data.translations[0].translatedText;
            $(emp_tr).val(msg);
        });
    }

    show_list_change_lang(){
        var carrot=this.carrot;
        var langs=this;
        var userLang = navigator.language || navigator.userLanguage; 
        var n_lang=userLang.split("-")[0];
        var html='';

        $(langs.list_lang).each(function(index,lang){
            var m_activer_color='';
            if(lang.key==carrot.lang)
                m_activer_color='btn-primary';
            else{
                if(langs.obj_lang_web[lang.key]!=null)
                    m_activer_color='btn-secondary';
                else if(n_lang==lang.key) 
                    m_activer_color='btn-info';
                else
                    m_activer_color='btn-dark';
            }
            html+="<div role='button' style='margin:3px;float:left' class='item_lang btn d-inline btn-sm text-left "+m_activer_color+"' key='"+lang.key+"'><img src='"+lang.icon+"' width='20px'/> "+lang.name+"</div>";
        });

        Swal.fire({
            title:carrot.l("select_lang","Select language"),
            html:html,
            showCloseButton: true
        })

        $(".item_lang").click(function(){
            var key_lang = $(this).attr("key");
            if (key_lang != carrot.lang) {
                langs.change_lang(key_lang);
                langs.get_data_lang_web();
                carrot.delete_ver_cur("song");
                carrot.user.delete_obj_phone_book();
                carrot.check_show_by_id_page();
                Swal.close();
            };
        });
    }

    get_val_lang(key,lang_en_default=""){
        if(this.lang_web!=null){
            if (this.lang_web[key] != null) 
                return this.lang_web[key].trim();
            else{
                if(lang_en_default=="")
                    return key;
                else
                    return lang_en_default;
            }  
        }else{
            return lang_en_default;
        }
    }

    reload(carrot){
        carrot.langs.delete_list_lang();
        carrot.langs.get_data_lang_web();
    }

    list_category_setting_lang(){
        carrot.get_doc("setting_web","lang",carrot.langs.done_list_category_setting_lang);
    }

    done_list_category_setting_lang(data,carrot){
        carrot.change_title_page("lang_category","?p=lang_category","langs");
        carrot.langs.arr_lang_setting_db=data.lang_setting;
        var array_setting_lang=data.lang_setting;
        var html='';
        var html_btn_extension='';
        html_btn_extension+='<button onclick="carrot.langs.add_setting_lang()" class="btn btn-sm btn-success"><i class="fa-solid fa-square-plus"></i> Add setting lang</button>';
        html+=carrot.langs.menu(html_btn_extension);
        html+='<div class="row">';
        $(array_setting_lang).each(function(index,langs){
            var item_lang_setting=new Carrot_List_Item(carrot);
            item_lang_setting.set_index(index);
            item_lang_setting.set_id(langs);
            item_lang_setting.set_icon_font(carrot.langs.icon+" icon_lang_setting_db");
            item_lang_setting.set_class_icon("col-md-3 col-3");
            item_lang_setting.set_class_body("col-md-9 col-9");
            item_lang_setting.set_title(langs);
            item_lang_setting.set_tip(langs);
            html+=item_lang_setting.html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();

        $(".icon_lang_setting_db").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.langs.select_db_setting_lang(obj_id);
        });
    }

    add_setting_lang(){
        var frm=new Carrot_Form("frm",carrot);
        frm.set_title("Add setting lang");
        frm.set_icon("fa-solid fa-square-plus");
        frm.create_field("db_lang").set_label("DB lang name(slug_name)").set_tip("The database identifier name field should be prefixed with <span class='bg-success rounded p-1 text-white fs-9'>lang_{name_data}</span> , you should create the database name corresponding to the application name");
        frm.off_btn_done();
        var btn_add_lang_setting=frm.create_btn();
        btn_add_lang_setting.set_icon("fa-add");
        btn_add_lang_setting.set_act("carrot.langs.submit_add_setting_lang()");
        frm.show();
    }

    submit_add_setting_lang(){
        var db_lang=$("#db_lang").val();
        carrot.langs.arr_lang_setting_db.push(db_lang);
        var data_db_lang={lang_setting:carrot.langs.arr_lang_setting_db};
        this.carrot.set_doc_merge("setting_web","lang",data_db_lang);
        this.carrot.msg("Add lang db setting:"+db_lang);
        $('#box').modal('hide'); 
    }

    select_db_setting_lang(s_name_db){
        this.show_setting_lang_by_key(this.lang_setting,s_name_db);
    }
}