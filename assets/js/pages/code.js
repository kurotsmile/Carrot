class Code{

    objs=null;
    icon="fa-solid fa-code";
    info_code_cur=null;
    type="all";
    type_show="list";

    show(){
        var id=carrot.get_param_url("id");
        if(id!=undefined)
            carrot.coder.get_info(id);
        else
            carrot.coder.list();
    }

    list(){
        carrot.change_title_page("All Code",carrot.url()+"?page=code","coder");
        carrot.loading("Get all data code");
        carrot.coder.get_data(carrot.coder.load_list_by_data);
    }

    menu(){
        var lis_lang_code=hljs.listLanguages();
        lis_lang_code.push("all");

        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.coder.add();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-plus"></i> Add Code</button>';
                if(carrot.coder.type_show!='list') html+='<button onclick="carrot.coder.list();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-caret-left"></i> <l class="lang" key_lang="back">Back</l></button>';
                html+=carrot.tool.btn_export("code");
                html+='<button onclick="carrot.coder.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_type_code" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> Select source code type ('+carrot.coder.type+')</button>';
                html+='<div class="dropdown-menu" aria-labelledby="btn_list_type_code">';
                    for(var i=0;i<lis_lang_code.length;i++){
                        var css_active='';
                        if(lis_lang_code[i]==carrot.coder.type) css_active="btn-success";
                        else css_active="btn-secondary";
                        html+='<button onclick="carrot.coder.list_code_by_type(\''+lis_lang_code[i]+'\')" role="button" class="btn  btn-sm m-1 '+css_active+'"><i class="fa-brands fa-codepen"></i> '+lis_lang_code[i]+'</button>';
                    }
                html+='</div>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    list_code_by_type(type){
        carrot.coder.type=type;
        carrot.data.clear("code");
        carrot.coder.get_data_from_server(carrot.coder.load_list_by_data);
    }

    get_data(act_done){
        carrot.coder.get_data_from_db(act_done,()=>{
            carrot.coder.get_data_from_server(act_done);
        })
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("code").then((codes)=>{
            carrot.coder.objs=codes;
            act_done(codes);
        }).catch(()=>{
            act_fail();
        });
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("code");
        q.add_select("title");
        q.add_select("code_type");
        if(carrot.coder.type!="all") q.add_where("code_type",carrot.coder.type);
        q.set_limit(50);
        q.get_data((codes)=>{
            carrot.coder.objs=codes;
            act_done(codes);
        });
    }

    load_list_by_data(codes){
        carrot.coder.type_show="list";
        var html='';
        html+=carrot.coder.menu();
        html+='<div class="row" id="all_code"></div>';
        carrot.show(html);
        carrot.hide_loading();
        $(codes).each(function(index,code){
            carrot.data.add("code",code);
            code["index"]=index;
            $("#all_code").append(carrot.coder.box_item(code).html());
        })
        carrot.coder.check_event();
    }

    get_icon_by_type(code_type){
        if(code_type=="powershell") return "fa-solid fa-terminal";
        else if(code_type=="json") return "fa-solid fa-database";
        else if(code_type=="javascript") return "fa-brands fa-square-js";
        else if(code_type=="vbscript") return "fa-solid fa-cubes";
        else return "fa-solid fa-code";
    }

    box_item(data){
        var box=new Carrot_List_Item(carrot);
        box.set_icon_font(carrot.coder.get_icon_by_type(data.code_type));
        box.set_title(data.title);
        box.set_tip(data.code_type);
        box.set_class_icon_col("col-1");
        box.set_class_body("col-11");
        box.set_act_click("carrot.coder.get_info('"+data.id_doc+"')");
        box.set_id(data.id_doc);
        box.set_db("code");
        box.set_obj_js("coder");
        return box;
    }

    add(){
        var new_data={};
        new_data["id"]="code"+carrot.create_id();
        new_data["title"]="";
        new_data["describe"]="";
        new_data["code"]="";
        new_data["code_type"]="javascript";
        new_data["code_theme"]="default.min.css";
        new_data["date"]=$.datepicker.formatDate('yy-mm-dd', new Date());
        new_data["user"]=carrot.user.get_user_login();
        new_data["status"]="pending";
        carrot.coder.show_add_or_edit_code(new_data).set_title("Add code").set_msg_done("Add code success!").show();
        carrot.coder.reload_code_editor_field();
    }

    edit(data,carrot){
        carrot.coder.show_add_or_edit_code(data).set_title("Edit code").set_msg_done("Edit code success!").show();
        carrot.coder.reload_code_editor_field();
    }

    show_add_or_edit_code(data_code){
        var frm=new Carrot_Form('add_code',carrot);
        frm.set_icon(carrot.coder.icon);
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
        var status_code=frm.create_field("status").set_label("status").set_value(data_code["status"]).set_type("date");
        status_code.set_type("select");
        status_code.add_option("pending","pending");
        status_code.add_option("public","public");
        frm.create_field("date").set_label("Date Create").set_value(data_code["date"]).set_type("date");
        frm.create_field("user").set_label("User Create").set_val(data_code["user"]).set_type("user");
        return frm;
    }

    reload_code_editor_field(){
        carrot.coder.sel_code_type($("#code_type"));

        $("#code_type").change(function(){
            carrot.coder.sel_code_type(this);
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

    get_info(id){
        carrot.loading("Get info code ("+id+")");
        carrot.data.get("code_info",id,(data)=>{
            carrot.coder.info(data);
        },()=>{
            carrot.server.get_doc("code",id,(data)=>{
                carrot.coder.info(data);
            });
        });
    }

    info(data){
        carrot.coder.type_show="info";
        carrot.coder.info_code_cur=data;
        carrot.change_title(data.title,carrot.url()+"?page=code&id="+data.id_doc,"coder");
        carrot.hide_loading();
        var html='';
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_title(data.title);
        box_info.set_icon_font(carrot.coder.get_icon_by_type(data.code_type));
        box_info.set_icon_col_class("col-2");
        box_info.set_db("code");
        box_info.set_obj_js("coder");

        box_info.add_attr("fa-solid fa-file-code",'<l class="lang" key_lang="file">File</l>',data.title+'.'+carrot.coder.get_file_extension_by_type(data.code_type));
        box_info.add_attr("fa-solid fa-boxes-packing",'<l class="lang" key_lang="category">Category</l>',data.code_type);
        box_info.add_attr("fa-solid fa-boxes-packing",'<l class="lang" key_lang="interface">Interface</l>',data.code_theme);
        if(data.user!=null) box_info.add_attr("fa-solid fa-user-nurse",'<l class="lang" key_lang="author">Author</l>',data.user.name);

        box_info.add_btn("btn_download","fa-solid fa-file-arrow-down","Download","carrot.coder.act_download()");
        box_info.add_btn("btn_pay","fa-brands fa-paypal","Download","carrot.coder.pay()");

        box_info.set_protocol_url('code'+data.code_type+'://show/'+data.id);

        if(data.describe!=''&&data.describe!='undefined'&&data.describe!=undefined) box_info.add_body('<h4 class="fw-semi fs-5 lang" key_lang="describe">Describe</h4>','<p class="fs-8 text-justify mb-2">'+data.describe+'</p><br/>');
        if(data.code!=''&&data.code!='undefined'&&data.code!=undefined) box_info.add_body('<h4 class="fw-semi fs-5 lang" key_lang="code">Code</h4>','<pre><code id="code_txt" class="'+data.code_type+'">'+data.code+'</code></pre>');

        html+=carrot.coder.menu();
        html+=box_info.html();
        carrot.show(html);
        carrot.coder.check_event();

        $("#btn_download").removeClass("d-inline");
        $("#btn_pay").removeClass("d-inline");

        if(carrot.coder.check_pay(data.id_doc)){
            $("#btn_download").show();
            $("#btn_pay").hide();
        }else{
            $("#btn_download").hide();
            $("#btn_pay").show();
        }

        $("#editor_code_theme").attr("href","assets/plugins/highlight/styles/"+data.code_theme);
        hljs.highlightAll();
    }

    get_file_extension_by_type(code_type){
        var file_extension="";
        if(code_type=="javascript") file_extension="js";
        else if(code_type=="powershell") file_extension="ps1";
        else if(code_type=="vbscript") file_extension="vbs";
        else file_extension=code_type;
        return file_extension;
    }

    check_event(){
        carrot.check_event();
        if(carrot.coder.info_code_cur!=null) carrot.tool.list_other_and_footer("coder",'code_type',carrot.coder.info_code_cur.code_type);
    }

    check_pay(id_code){
        if(localStorage.getItem("buy_code_"+id_code)!=null)
            return true;
        else
            return false;
    }

    pay(){
        carrot.show_pay("code","Download Code ("+carrot.coder.info_code_cur.title+")","Download the source code file to use","2.00",carrot.coder.pay_success);
    }

    pay_success(carrot){
        $("#btn_download").show();
        $("#btn_pay").hide();
        localStorage.setItem("buy_code_"+carrot.coder.info_code_cur.id_doc,"1");
        carrot.coder.act_download(carrot);
    }

    act_download(carrot){
        var txt_code=$("#code_txt").text();
        var file_code=$("#filename_code").text();
        carrot.coder.download_code(file_code,txt_code);
    }

    download_code(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        carrot.msg("Download Success!","success");
    }

    list_for_home(){
        var html='';
        if(carrot.coder.objs!=null){
            var list_code=carrot.random(carrot.coder.objs);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+carrot.coder.icon+'"></i> <l class="lang" key_lang="other_code">Other Code</l>';
            html+='<span role="button" onclick="carrot.coder.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
            html+='<div id="other_code" class="row m-0">';
            $(list_code).each(function(index,code){
                if(index<12){
                    code["index"]=index;
                    html+=carrot.coder.box_item(code).html();
                }else{
                    return false;
                }
            });
            html+='</div>';
        }
        return html;
    }

    delete_all_data(){
        carrot.data.clear("code");
        carrot.data.clear("code_info");
        carrot.msg("Delete All data code successs!","success");
    }
}

var coder=new Code();
carrot.coder=coder;