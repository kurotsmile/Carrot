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

function goto_ytb_download_mp3(url){
    if(url==""){ carrot.msg("Url not null!","error");return false;}
    var url_ytb=url.replace("youtube.com","youtubepp.com");
    window.open(url_ytb, "_blank");
}

function search_web(s_search,site='youtube'){
    var url_web='';
    if(site=='youtube') url_web="https://www.youtube.com/results?search_query="+s_search;
    if(site=='google') url_web="https://www.google.com/search?q="+s_search;
    window.open(url_web, "_blank");
}

function toLowerCase_tag(name_tag){
    var s_txt=$("#" + name_tag).val();
    s_txt=s_txt.toLowerCase();
    $("#" + name_tag).val(s_txt);
}

function delete_file(emp){
    Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure you want to delete the file '"+$(emp).attr("fullPath")+"' ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) carrot.del_file(emp);
    });
}

function customer_field_for_db(data,collection,key_name_doc,smg_success){
    data["act_msg_success"]={'defaultValue':smg_success,'customClass':'d-none'};
    data["db_collection"]={'defaultValue':collection,'customClass':'d-none'};
    data["db_doc"]={'defaultValue':key_name_doc,'customClass':'d-none'};
}

var carrot=new Carrot_Site();
$(document).ready(function () {
    $("#load_bar").css("width","0%");
    $("#head").hide();
    $("#head_nav").hide();
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
