class Carrot_Code{
    carrot;

    obj_codes=null;
    info_code_cur=null;

    icon="fa-solid fa-code";
    id_page="code";
    type="all";
    
    constructor(carrot){
        this.carrot=carrot;
        this.load_obj_code();

        carrot.register_page(this.id_page,"carrot.code.show_list_code()","carrot.code.edit","carrot.code.show","carrot.code.reload");
        var btn_add=carrot.menu.create("add_code").set_label("Add Code").set_icon(this.icon).set_type("add");
        $(btn_add).click(function(){carrot.code.add();});
        var btn_list=carrot.menu.create("list_code").set_label("Code").set_icon(this.icon).set_type("main").set_lang("code");
        $(btn_list).click(function(){carrot.code.show_list_code();});
    }

    load_obj_code(){
        if (localStorage.getItem("obj_codes") != null) this.obj_codes=JSON.parse(localStorage.getItem("obj_codes"));
    }

    save_obj(){
        localStorage.setItem("obj_codes", JSON.stringify(this.obj_codes));
    }

    delete_obj_code(){
        localStorage.removeItem("obj_codes");
        this.obj_codes=null;
        this.carrot.delete_ver_cur(this.id_page);
    }

    add(){
        var new_data=new Object();
        new_data["id"]="code"+this.carrot.uniq();
        new_data["title"]="";
        new_data["describe"]="";
        new_data["code"]="";
        new_data["code_type"]="javascript";
        new_data["code_theme"]="default.min.css";
        new_data["date"]=$.datepicker.formatDate('yy-mm-dd', new Date());
        new_data["user"]=this.carrot.user.get_user_login();
        this.show_add_or_edit_code(new_data).set_title("Add code").set_msg_done("Add code success!").show();
        this.reload_code_editor_field();
    }

    edit(data,carrot){
        carrot.code.show_add_or_edit_code(data).set_title("Edit code").set_msg_done("Edit code success!").show();
        carrot.code.reload_code_editor_field();
    }

    show_add_or_edit_code(data_code){
        var carrot=this.carrot;
        var frm=new Carrot_Form('add_code',carrot);
        frm.set_icon(this.icon);
        frm.set_db("code","id");
        frm.create_field("id").set_label("ID").set_val(data_code.id).set_type("id").set_main();

        frm.create_field("title").set_label("Title").set_val(data_code.title);
        frm.create_field("describe").set_label("Describe").set_val(data_code.describe).set_type("textarea").set_type("editor");
        var code_type=frm.create_field("code_type").set_label("Code Type").set_value(data_code["code_type"]).set_type("select");
        var lis_lang_code=hljs.listLanguages();
        for(var i=0;i<lis_lang_code.length;i++) code_type.add_option(lis_lang_code[i],lis_lang_code[i]);
        var code_code=frm.create_field("code","Code");
        code_code.set_type("code");
        code_code.set_val(data_code.code);
        code_code.set_tip("Hãy đóng góp những mã nguồn thật hay để chia sẻ những kiến thức bổ ích đến với các lập trình viên khác!");
        var code_theme=frm.create_field("code_theme").set_label("Code Theme").set_value(data_code["code_theme"]).set_type("select");
        code_theme.add_option("default.min.css","Default");
        code_theme.add_option("agate.min.css","Agate");
        code_theme.add_option("androidstudio.min.css","Androidstudio");
        code_theme.add_option("arta.min.css","Arta");
        code_theme.add_option("dark.min.css","Dark");
        code_theme.add_option("devibeans.min.css","Devibeans");
        code_theme.add_option("docco.min.css","Docco");
        code_theme.add_option("far.min.css","Far");
        code_theme.add_option("felipec.min.css","Felipec");
        code_theme.add_option("foundation.min.css","Foundation");
        frm.create_field("date").set_label("Date Create").set_value(data_code["date"]).set_type("date");
        frm.create_field("user").set_label("User Create").set_val(data_code["user"]).set_type("user");
        return frm;
    }

    reload_code_editor_field(){
        var code=this;

        code.sel_code_type($("#code_type"));

        $("#code_type").change(function(){
            code.sel_code_type(this);
        });

        $("#code_theme").change(function(){
            var val_theme=$(this).val();
            $("#editor_code_theme").attr("href","assets/plugins/highlight/styles/"+val_theme);
        });
    }

    sel_code_type(emp){
        var type_code=$(emp).val();
        var lis_lang_code=hljs.listLanguages();
        carrot.log("Select Code type:"+type_code,"null");
        $(".editor").removeClass("language-undefined");
        for(var i=0;i<lis_lang_code.length;i++) $(".editor").removeClass("language-"+lis_lang_code[i]);
        $(".editor").addClass("language-"+type_code);
    }

    show_list_code(){
        this.carrot.change_title_page("Code","?p="+this.id_page,this.id_page);
        if(this.carrot.check_ver_cur("code")){
            if(this.obj_codes==null){
                this.carrot.log("Get data code from sever");
                this.carrot.get_list_doc("code",this.act_get_list_code_from_sever);
            }  
            else{
                this.carrot.log("Load data code from cache");
                this.show_list_from_data(this.obj_codes,this.carrot);
            }  
        }else{
            this.carrot.log("Get data code from sever");
            this.carrot.get_list_doc("code",this.act_get_list_code_from_sever);
        }
    }

    list_code_by_type(type){
        this.type=type;
        var carrot=this.carrot;
        if(type!="all"){
            Swal.showLoading();
            this.carrot.db.collection("code").where("code_type", "==",this.type).limit(200).get().then((querySnapshot) => {
                if(querySnapshot.docs.length>0){
                    var codes=Object();
                    querySnapshot.forEach((doc) => {
                        var data_code=doc.data();
                        data_code["id"]=doc.id;
                        codes[doc.id]=JSON.stringify(data_code);
                    });
                    Swal.close();
                    this.show_list_from_data(codes,carrot);
                }else{
                    Swal.close();
                }
            }).catch((error) => {
                Swal.close();
                console.log(error);
                this.carrot.msg(error.message,"error");
            });
        }else{
            this.carrot.get_list_doc("code",this.act_get_list_code_from_sever);
        }
    }

    act_get_list_code_from_sever(codes,carrot){
        carrot.code.obj_codes=codes;
        carrot.code.save_obj();
        carrot.update_new_ver_cur("code",true);
        carrot.code.show_list_from_data(codes,carrot);
    }

    show_list_from_data(codes,carrot){
        var html='';
        var list_code=carrot.obj_to_array(codes);
        var lis_lang_code=hljs.listLanguages();
        lis_lang_code.push("all");

        html+='<div class="row mb-2">';
            html+='<div class="col-12 btn-group btn-sm" role="group" aria-label="Menu Lang Code">';
                html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                    html+='<button id="btn-add-code" class="btn btn-secondary btn-sm" onclick="carrot.code.add();return false;"><i class="fa-solid fa-square-plus"></i> Add Code</button>';

                    html+='<div class="btn-group" role="group">';
                        html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_type_code" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> Select source code type ('+carrot.code.type+')</button>';
                    html+='<div class="dropdown-menu" aria-labelledby="btn_list_type_code">';
                        for(var i=0;i<lis_lang_code.length;i++){
                            var css_active='';
                            if(lis_lang_code[i]==carrot.code.type) css_active="btn-success";
                            else css_active="btn-secondary";
                            html+='<button onclick="carrot.code.list_code_by_type(\''+lis_lang_code[i]+'\')" role="button" class="btn  btn-sm m-1 '+css_active+'"><i class="fa-brands fa-codepen"></i> '+lis_lang_code[i]+'</button>';
                        }
                    html+='</div>';
                    html+='</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="row m-0">';
        $(list_code).each(function(index,code){
            code["idnex"]=index;
            html+=carrot.code.box_item_code(code);
        });
        html+='</div>';
        carrot.show(html);
        carrot.code.check_event();
    }

    box_item_code(data_code,s_class='col-md-4 mb-3'){
        var html="<div class='box_app "+s_class+"' id=\""+data_code.id+"\" key_search=\""+data_code.title+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                    html+='<div role="button" class="code_icon img-cover pe-0 col-2 text-center d-fex db_info" db_collection="code" db_document="'+data_code.id+'"><i class="'+this.get_icon_by_type(data_code.code_type)+' fa-3x mt-2"></i></div>';
                    html+='<div class="det mt-2 col-10">';
                        html+="<h5 class='mb-0 fs-6'>"+data_code.title+"</h5>";
                        
                        html+='<ul class="row">';
                            html+='<li class="col-8 ratfac">';
                            html+="<span class='fs-8'>"+data_code.code_type+"</span><br/>";
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi fa-solid fa-circle"></i>';
                            html+='</li>';

                        html+='</ul>';
                        html+=this.carrot.btn_dev("code",data_code.id);
    
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        html+="</div>"; 
        return html;
    }

    check_event(){
        var carrot=this.carrot;
        $(".code_icon").click(function(){
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            carrot.get_doc(db_collection,db_document,carrot.code.show_info_code);
        });

        $("#btn_download").click(function(){
            if(carrot.code.check_pay(carrot.code.info_code_cur.title))
                carrot.code.act_download(carrot);
            else
                carrot.show_pay("code","Download Code ("+carrot.code.info_code_cur.title+")","Download the source code file to use","2.00",carrot.code.pay_success);
        });

        this.carrot.check_event();
    }

    show(id,carrot){
        carrot.get_doc("code",id,carrot.code.show_info_code);
    }

    show_info_code(data,carrot){
        carrot.change_title_page(data.title,"?p="+carrot.code.id_page+"&id="+data.id,carrot.code.id_page);
        carrot.code.info_code_cur=data;
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3 text-center">';
                        html+='<br/><i class="'+carrot.code.get_icon_by_type(data.code_type)+' fa-5x"></i>';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data.title+'</h4>';
                        html+=carrot.btn_dev("code",data.id);
                        
                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="file">File</l> <i class="fa-solid fa-file-code"></i></b>';
                                html+='<p id="filename_code">'+data.title+"."+carrot.code.get_file_extension_by_type(data.code_type)+'</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="category">Category</l> <i class="fa-solid fa-boxes-packing"></i></b>';
                                html+='<p>'+data.code_type+'</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="interface">Interface</l> <i class="fa-solid fa-brush"></i></b>';
                                html+='<p>'+data.code_theme+'</p>';
                            html+='</div>';
                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-12 text-center">';
                            html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                            html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success" ><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button> ';
                            if(carrot.code.check_pay(data.title))
                                html+='<button id="btn_download" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                            else
                                html+='<button id="btn_download" type="button" class="btn d-inline btn-info"><i class="fa-brands fa-paypal"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                            html+='</div>';
                        html+='</div>';

                    html+='</div>';
                html+="</div>";
    
                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    if(data.describe!=''&&data.describe!='undefined'&&data.describe!=undefined){
                        html+='<h4 class="fw-semi fs-5 lang" key_lang="describe">Describe</h4>';
                        html+='<p class="fs-8 text-justify mb-2">'+data.describe+'</p><br/>';
                    }

                    html+='<h4 class="fw-semi fs-5 lang" key_lang="code">Code</h4>';
                    html+='<pre><code id="code_txt" class="'+data.code_type+'">'+data.code+'</code></pre>';
                html+='</div>';
    
                html+=carrot.rate.box_comment(data);   

            html+="</div>";
    
            html+='<div class="col-md-4">';
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_songs">Related Code</h4>';
            var list_code_other= carrot.convert_obj_to_list(carrot.code.obj_codes).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            for(var i=0;i<list_code_other.length;i++){
                var codes=list_code_other[i];
                if(codes.code_type==data.code_type)
                if(data.id!=codes.id) html+=carrot.code.box_item_code(codes,'col-md-12 mb-3');
            };
            html+='</div>';
    
        html+="</div>";
        html+="</div>";
        html+=carrot.code.list_for_home();
        $("#editor_code_theme").attr("href","assets/plugins/highlight/styles/"+data.code_theme);
        carrot.show(html);
        carrot.code.check_event();
        hljs.highlightAll();
    }

    download_code(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.carrot.msg("Download Success!");
    }

    get_file_extension_by_type(code_type){
        var file_extension="";
        if(code_type=="javascript") file_extension="js";
        else if(code_type=="powershell") file_extension="ps1";
        else if(code_type=="vbscript") file_extension="vbs";
        else file_extension=code_type;
        return file_extension;
    }

    get_icon_by_type(code_type){
        if(code_type=="powershell") return "fa-solid fa-terminal";
        else if(code_type=="json") return "fa-solid fa-database";
        else if(code_type=="javascript") return "fa-brands fa-square-js";
        else if(code_type=="vbscript") return "fa-solid fa-cubes";
        else return "fa-solid fa-code";
    }

    act_download(carrot){
        var txt_code=$("#code_txt").text();
        var file_code=$("#filename_code").text();
        carrot.code.download_code(file_code,txt_code);
    }

    reload(carrot){
        carrot.code.delete_obj_code();
        carrot.code.show_list_code();
    }

    list_for_home(){
        var html="";
        if(this.obj_codes!=null){
            var list_code=this.carrot.obj_to_array(this.obj_codes);
            list_code= list_code.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_code">Other Code</l>';
            html+='<span role="button" onclick="carrot.code.show_list_code()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
            html+='<div id="other_code" class="row m-0">';
            for(var i=0;i<12;i++){
                var code=list_code[i];
                html+=this.box_item_code(code);
            }
            html+='</div>';
        }
        return html;
    }

    pay_success(carrot){
        $("#btn_download").removeClass("btn-info").addClass("btn-success").html('<i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l>');
        localStorage.setItem("buy_"+carrot.code.id_page+"_"+carrot.code.info_code_cur.title,"1");
        carrot.code.act_download(carrot);
    }

    check_pay(id_code){
        if(localStorage.getItem("buy_"+carrot.code.id_page+"_"+id_code)!=null)
            return true;
        else
            return false;
    }
}