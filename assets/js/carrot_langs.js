class Carrot_Langs{
    carrot;
    list_lang=null;
    icon="fa-sharp fa-solid fa-language";
    lang_setting="en";
    lang_setting_db_collection="";

    lang_web=null;
    obj_lang_web=Object();
    arr_lang_setting_db=Array();

    obj_lang_setting_category=null;
    lang_db=null;
    
    constructor(carrot){
        this.carrot=carrot;

        if(localStorage.getItem("lang") == null) this.change_lang("en"); else {
            this.carrot.lang = localStorage.getItem("lang");
            this.lang_setting = localStorage.getItem("lang");
        }
        if(localStorage.getItem("list_lang") != null) this.list_lang=JSON.parse(localStorage.getItem("list_lang"));
        if(localStorage.getItem("lang_web")!=null) this.lang_web=JSON.parse(localStorage.getItem("lang_web"));
        if(localStorage.getItem("obj_lang_web")!=null) this.obj_lang_web=JSON.parse(localStorage.getItem("obj_lang_web"));

        var btn_add=carrot.menu.create("add_lang").set_label("Add Lang").set_icon(this.icon).set_type("add");
        var btn_list=carrot.menu.create("list_lang").set_label("List Lang").set_icon(this.icon).set_type("dev");
        var btn_setting=carrot.menu.create("setting_lang").set_label("Setting Lang").set_icon(this.icon).set_type("setting");
        $(btn_add).click(function(){carrot.langs.add_lang();});
        $(btn_list).click(function(){carrot.langs.list();});
        $(btn_setting).click(function(){carrot.langs.list_category_setting_lang();});

        $("#key_lang").html(carrot.lang);
    }

    get_list_country(act_done=null){
        carrot.log("get_all_data_lang from server","alert");

        if(carrot.type_server=="firestore"){
            carrot.server.get_collection("lang", (data) => {
                carrot.langs.list_lang = data;
                carrot.langs.save_list_lang();
                if(act_done!=null) act_done(data);
            });
        }else{
            $.getJSON(carrot.config.list_url_data_lang[0],function(data){
                carrot.langs.list_lang = data["all_item"];
                carrot.langs.save_list_lang();
                if(act_done!=null) act_done(data["all_item"]);
            });
        }
    }

    save_list_lang(){
        localStorage.setItem("list_lang", JSON.stringify(carrot.langs.list_lang));
    }

    save_lang_web(){
        localStorage.setItem("lang_web",JSON.stringify(carrot.langs.lang_web));
    }

    save_obj_lang_web(){
        localStorage.setItem("obj_lang_web",JSON.stringify(carrot.langs.obj_lang_web));
    }

    save_obj_lang_setting_category(){
        localStorage.setItem("obj_lang_setting_category",JSON.stringify(carrot.langs.obj_lang_setting_category));
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
                    html+='<button onclick="carrot.langs.list_category_setting_lang();" type="button" class="btn btn-success btn-sm"><i class="fa-solid fa-rectangle-list"></i> Category Lang Setting</button>';
                    html+='<button onclick="carrot.langs.list();" type="button" class="btn btn-info btn-sm"><i class="fa-solid fa-rectangle-list"></i> List Lang</button>';
                    html+=carrot.tool.btn_export("lang_data");
                    html+=carrot.tool.btn_export("setting_web","setting_web (lang,version)");
                    if(carrot.langs.lang_setting_db_collection!="") html+='<button onclick="carrot.langs.export_db_cur();" type="button" class="btn btn-info btn-sm"><i class="fa-solid fa-download"></i> Export ('+carrot.langs.lang_setting_db_collection+')</button>';
                    html+='<button onclick="carrot.langs.add_setting_lang()" class="btn btn-sm btn-success"><i class="fa-solid fa-square-plus"></i> Add setting lang</button>';
                    html+=btn_extension;
                    if(this.lang_setting_db_collection!="") html+=carrot.langs.list_btn_lang_select('btn-success','carrot.langs.change_btn_list_lang');
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    get_all_data_lang() {
        carrot.load_bar();
        carrot.log("get_all_data_lang from server","alert");
        carrot.langs.get_list_country();
        carrot.update_new_ver_cur("lang",true);
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
        carrot.load_bar();
        carrot.log("Get lang "+carrot.lang+" from server","alert");
        if(carrot.type_server=='firestore'){
            var q=new Carrot_Query("lang_data");
            q.add_select(carrot.lang);
            q.add_where("id","lang_web");
            q.get_data(this.get_data_lang_web_done);
        }else{
            $.getJSON(carrot.config.list_lang_web[0],function(data){
                var all_item=data["all_item"];
                carrot.langs.get_data_lang_web_done(all_item);
            });
        }
        carrot.update_new_ver_cur("lang_web",true);
    }

    get_data_lang_web_done(data){
        carrot.langs.lang_web=data[0][carrot.lang];
        carrot.langs.obj_lang_web=carrot.langs.lang_web;
        carrot.langs.save_lang_web();
        carrot.langs.save_obj_lang_web();
        carrot.langs.load_data_lang_web();
    }

    load_data_lang_web() {
        if(carrot.langs.obj_lang_web!=null){
            var obj_lang_item=carrot.langs.obj_lang_web;
            $(".lang").each(function(index,emp){
                var key_lang=$(emp).attr("key_lang");
                if(obj_lang_item[key_lang]!=null){
                    $(emp).html(obj_lang_item[key_lang].trim());
                }
            });
        }
    }

    list_btn_lang_select(class_button='btn-secondary',func_sel=''){
        var html='';
        html+='<div class="btn-group" role="group">';
        html+='<button class="btn '+class_button+' dropdown-toggle btn-sm" type="button" id="btn_list_lang_ai" data-bs-toggle="dropdown" aria-expanded="true" >';
        html+='<i class="fa-solid fa-rectangle-list"></i> <l class="lang" key_lang="select_lang">Change country</l> ('+carrot.langs.lang_setting+')';
        html+='</button>';
        html+='<div class="dropdown-menu" aria-labelledby="btn_list_lang_ai" id="menu_lang_sub">';
        $.each(carrot.langs.list_lang,function(i,lang){
            html+='<button type="button" onClick="'+func_sel+'(\''+lang.key+'\');return false;" class="dropdown-item '+(lang.key===carrot.langs.lang_setting?'active':lang.key==carrot.langs.lang_setting)+' btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
        });
        html+='</div>';
        html+='</div>';

        if(carrot.langs.list_lang==null){
            setTimeout(()=>{
            carrot.langs.get_list_country((data)=>{
                $.each(data,function(i,lang){
                    var html_lang='';
                    html_lang+='<button type="button" onClick="'+func_sel+'(\''+lang.key+'\');return false;" class="dropdown-item '+(lang.key===carrot.langs.lang_setting?'active':lang.key==carrot.langs.lang_setting)+' btn-setting-lang-change" key_change="'+lang.key+'"><img src="'+lang.icon+'" style="width:20px"/>'+lang.name+'</button> ';
                    $("#menu_lang_sub").append(html_lang);
                });
            });
        },500);
        }
        return html;
    }

    list(){
        var html='';
        carrot.change_title_page("All Lang","?p=langs","langs");
        html+=carrot.langs.menu();
        html+='<div class="row">';
        $(carrot.langs.list_lang).each(function(index,lang){
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
      
        if(carrot.langs.list_lang==null){
            carrot.server.list("lang",(data)=>{

            });
        }
        carrot.show(html);
        carrot.check_event();
    }

    show(){
        carrot.langs.list();
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

    show_setting_lang_by_key(s_key_lang_change="",s_db_lang){
        var data_obj_lang_tag=null;
        var data_obj_lang_change=null;
        this.lang_db=new Object();
        this.lang_setting=s_key_lang_change;
        this.lang_setting_db_collection=s_db_lang;
        this.carrot.db.collection("lang_data").doc(s_db_lang).get().then((doc) => {
            if(doc.exists){
                carrot.langs.lang_db=doc.data();
                data_obj_lang_tag=carrot.langs.lang_db["en"];
                data_obj_lang_change=carrot.langs.lang_db[s_key_lang_change];
                if(data_obj_lang_change==null){
                    data_obj_lang_change=new Object();
                    data_obj_lang_change["id"]=s_key_lang_change;
                }
            }else{
                data_obj_lang_tag=new Object();
                data_obj_lang_tag["id"]=s_key_lang_change;
                data_obj_lang_change=new Object();
                data_obj_lang_change["id"]=s_key_lang_change;
            }
            carrot.langs.show_setting_lang(data_obj_lang_tag,data_obj_lang_change);
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

        $("#btn_done_setting_lang").click(function(){
            var lang_country=new Object();
            var data_inp_lang=new Object();
            $(".inp-lang").each(function(index,emp){
                var key_lang=$(this).attr("data-key");
                var val_lang=$(this).val();
                data_inp_lang[key_lang]=val_lang;
            });
            lang_country[langs.lang_setting]=data_inp_lang;
            lang_country["id"]=langs.lang_setting_db_collection;
            carrot.set_doc_merge("lang_data",langs.lang_setting_db_collection,lang_country);
            $.MessageBox("Cập nhật "+langs.lang_setting_db_collection+" - "+langs.lang_setting+" thành công!")
        });
    }

    change_btn_list_lang(key_change){
        carrot.langs.lang_setting=key_change;
        carrot.langs.show_setting_lang_by_key(key_change,carrot.langs.lang_setting_db_collection);
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
        var apiUrl = "https://translation.googleapis.com/language/translate/v2?key="+carrot.config.key_api_google_translate;
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
        if(carrot.langs.list_lang==null){
            carrot.loading();
            var q=new Carrot_Query("lang");
            q.get_data((data)=>{
                carrot.langs.list_lang=data;
                carrot.langs.save_list_lang();
                carrot.hide_loading();
                carrot.langs.load_list_change_lang();
            })
        }else{
            carrot.langs.load_list_change_lang();
        }
    }

    load_list_change_lang(){
        var userLang = navigator.language || navigator.userLanguage; 
        var n_lang=userLang.split("-")[0];
        var html='';
        carrot.hide_loading();
        $(carrot.langs.list_lang).each(function(index,lang){
            var m_activer_color='';
            if(lang.key==carrot.lang)
                m_activer_color='btn-primary';
            else{
                if(carrot.langs.obj_lang_web!=null)
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
        });

        $(".item_lang").click(function(){
            var key_lang = $(this).attr("key");
            if (key_lang != carrot.lang) {
                carrot.langs.change_lang(key_lang);
                carrot.langs.get_data_lang_web();
                carrot.user.clear_all_data();
                carrot.data.clear("apps");
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
        carrot.langs.lang_setting_db_collection="";
        var array_setting_lang=data.lang_setting;
        var html='';
        html+=carrot.langs.menu();
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

    export_db_cur(){
        carrot.act_download_file_json(this.lang_db,carrot.langs.lang_setting_db_collection+".json");
    }
}