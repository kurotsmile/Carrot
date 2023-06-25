function copy_tag(name_tag) {
    var $temp = $("<input>");$("body").append($temp);
    var s_copy=$("#" + name_tag).val();
    $temp.val(s_copy).select();
    document.execCommand("copy");$temp.remove();
}

function copy_txt_tag(name_tag) {
    var $temp = $("<input>");$("body").append($temp);
    var s_copy=$("#" + name_tag).html();
    $("#"+name_tag).addClass("text-primary");
    $temp.val(s_copy).select();
    document.execCommand("copy");$temp.remove();
}

function tr(name_tag,lang_change) {
    var s_txt=$("#" + name_tag).html();
    $("#"+name_tag).addClass("text-primary");
    if(lang_change=='zh') lang_change='zh-CN';
    var left  = ($(window).width()/2)-(900/2);
    top   = ($(window).height()/2)-(600/2);
    window.open("https://translate.google.com/?sl=en&tl="+lang_change+"&text="+s_txt,"Carrot_Translate","width=900, height=600, top="+top+", left="+left);
}

function tr_inp(name_tag,lang_tag,lang_change) {
    var s_txt=$("#" + name_tag).val();
    $("#"+name_tag).addClass("text-primary");
    if(lang_change=='zh') lang_change='zh-CN';
    if(lang_tag=='zh') lang_tag='zh-CN';
    var left  = ($(window).width()/2)-(900/2);
    top   = ($(window).height()/2)-(600/2);
    window.open("https://translate.google.com/?sl="+lang_tag+"&tl="+lang_change+"&text="+s_txt,"Carrot_Translate","width=900, height=600, top="+top+", left="+left);
}

function paste_tag(name_tag) {
    navigator.clipboard.readText().then(text => {$("#"+name_tag).val(text.trim());});
}

function customer_field_for_db(data,collection,key_name_doc,smg_success){
    data["act_msg_success"]={'defaultValue':smg_success,'customClass':'d-none'};
    data["db_collection"]={'defaultValue':collection,'customClass':'d-none'};
    data["db_doc"]={'defaultValue':key_name_doc,'customClass':'d-none'};
}

var carrot=new Carrot_Site();
$(document).ready(function () {
    $("#logo_carrot").on("contextmenu", function () { carrot.act_mode_dev(); return false; });
    $("#btn_download_json").click(function () {carrot.download_json();});
    $("#btn_recognition").click(function(){carrot.start_recognition();});
    $("#btn_import_json_url").click(function () {
        var url_json = prompt("Enter url json", "Enter url");
        if (url_json != null) {
            $.ajax(url_json, {
                success: function (data) {
                    carrot.import_json_by_data(data);
                }
            });
        };
    });
    $("#btn_acc_login_info").click(function(){carrot.user.show_user_info_login();})
    $(".btn-menu").click(function () {
        $(".btn-menu").removeClass("active");
        $(".btn-menu i").removeClass("fa-bounce");
        $(this).addClass("active");
        $(this).find("i").addClass("fa-bounce");
        var id_fun = $(this).attr("id");

        if(id_fun=="btn_mode_host") carrot.change_host_connection();
        if(id_fun=="btn_model_site") carrot.change_mode_site();
        if(id_fun=='btn_version_data') carrot.show_edit_version_data_version();
        if(id_fun=='btn_download_json_doc') carrot.download_json_doc();
        if(id_fun=='btn_import_json_doc') carrot.show_import_json_box(null);
        if(id_fun=='btn_import_json_file') carrot.show_import_json_file();
    });

    $("#btn_login").click(function () {
        $.MessageBox({
            message: "<b><i class='fa-solid fa-key'></i> "+carrot.l('login')+"</b>",
            input: {
                usernames: {type: "text",label: carrot.l("phone"),title: "Enter Your Phone"},
                password: {type: "password",label:carrot.l("password"),title: "Type password here"},
                dummy_caption: {type: "caption",message: carrot.l("login_tip")}
            },
            top: "auto",
            buttonFail:carrot.l("cancel"),
            buttonDone  : {login:{text:carrot.l('login'),keyCode: 12},register:{text:carrot.l("register"),keyCode: 13}},
        }).done(function(data,button) {
            var username=data.usernames;
            var password=data.password;
            if(button=='login') carrot.user.check_user_login(username,password);
            if(button=='register') carrot.user.show_register();
        });
    });
    $("#btn_logout").click(function(){carrot.user.user_logout();});

    var lang_page=carrot.get_param_url("lang");
    if(lang_page!=null){
        if(lang_page!=carrot.lang){
            carrot.lang_url=lang_page;
            carrot.change_lang(lang_page);
            carrot.get_all_data_lang_web();
            carrot.check_show_by_id_page();
        }
    }
    carrot.check_version_data();
});
