class Code{
    show(){
        carrot.loading("Get all data code");
        carrot.coder.get_data_from_db()
        carrot.coder.get_data(carrot.coder.load_list_by_data);
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.coder.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add Code</button>';
                html+=carrot.tool.btn_export("code");
                html+='<button onclick="carrot.coder.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    get_data(act_done){
        carrot.coder.get_data_from_db(act_done,()=>{
            carrot.coder.get_data_from_server(act_done);
        })
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("code").then((codes)=>{
            act_done(codes);
        }).catch(()=>{
            act_fail();
        });
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("code");
        q.add_select("title");
        q.add_select("code_type");
        q.set_limit(50);
        q.get_data((codes)=>{
            act_done(codes);
        });
    }

    load_list_by_data(codes){
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
        box.set_act_click("alert(1)");
        return box;
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
        new_data["status"]="pending";
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
        var status_code=frm.create_field("status").set_label("status").set_value(data_code["status"]).set_type("date");
        status_code.set_type("select");
        status_code.add_option("pending","pending");
        status_code.add_option("public","public");
        frm.create_field("date").set_label("Date Create").set_value(data_code["date"]).set_type("date");
        frm.create_field("user").set_label("User Create").set_val(data_code["user"]).set_type("user");
        return frm;
    }

    check_event(){
        carrot.check_event();
    }

    delete_all_data(){
        carrot.msg("Delete All Data","Delete All data code successs!","success");
    }
}

carrot.coder=new Code();
if(carrot.call_show_on_load_pagejs) carrot.coder.show();