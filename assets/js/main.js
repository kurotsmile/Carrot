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

async function show_list_background(querySnapshot){
    $("#main_contain").html("");
    var html_main_contain="";
    html_main_contain+='<div class="row m-0">';
    querySnapshot.forEach((doc) => {
        var data_app=doc.data();
        html_main_contain+="<div class='col-md-3 mb-3' id=\""+doc.id+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                var url_avatar='';
                if(data_app.icon!=null) url_avatar=data_app.icon;
                if(url_avatar=="") url_avatar="images/avatar_default.png";
                html_main_contain+='<div class="img-cover"><img class="rounded" src="'+url_avatar+'" alt="'+doc.id+'"></div>';
                    html_main_contain+='<div class="det mt-2 col-9">';
                        html_main_contain+="<h5 class='mb-0 fs-6'>"+doc.id+"</h5>";
                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
        
    });
    html_main_contain+="</div>";
    $("#main_contain").html(html_main_contain);
}

function show_box_add_or_edit_wallpaper(data_wallpaper,act_done){
    var s_title_box='';
    if(data_wallpaper==null) s_title_box="<b>Add Wallpaper</b>";
    else s_title_box="<b>Update Wallpaper</b>";

    var obj_wallpaper = Object();
    obj_wallpaper["tip_wallpaper"] = { type: "caption", message: "Thông tin cơ bản" };

    if(data_wallpaper==null){
        data_wallpaper=Object();
        data_wallpaper["name"]='';
        data_wallpaper["icon"]='';
    }else{
        if(data_wallpaper["name"]=="") data_wallpaper["name"]=data_wallpaper["id"];
    }
    obj_wallpaper["name"]={'type':'input','defaultValue':data_wallpaper["name"], 'label':'Name'};
    obj_wallpaper["icon"]={'type':'input','defaultValue':data_wallpaper["icon"], 'label':'Icon (url)'};

    customer_field_for_db(obj_wallpaper,'background','name','show_all_wallpaper','Add wallpaper successfully');

    $.MessageBox({
        message: s_title_box,
        input: obj_wallpaper,
        top: "auto",
        buttonFail: "Cancel"
    }).done(act_done);
}

function customer_field_for_db(data,collection,key_name_doc,name_fuc_callback,smg_success){
    data["act_msg_success"]={'defaultValue':smg_success,'customClass':'d-none'};
    data["db_collection"]={'defaultValue':collection,'customClass':'d-none'};
    data["db_doc"]={'defaultValue':key_name_doc,'customClass':'d-none'};
    data["act_name_before"]={'defaultValue':name_fuc_callback,'customClass':'d-none'};
}

function show_box_add_or_edit_lang(data_lang,act_done){
    var s_title_box='';
    if(data_lang==null) s_title_box="<b>Add Lang</b>";
    else s_title_box="<b>Update Lang</b>";

    var obj_lang=Object();
    obj_lang["tip_lang"] = { type: "caption", message: "Thông tin cơ bản" };

    if(data_lang==null){
        data_lang=Object();
        data_lang["key"]=''
        data_lang["name"]='';
        data_lang["icon"]='';
    }else{
        if(data_lang["key"]=="") data_lang["key"]=data_lang["id"];
    }
    obj_lang["key"]={'type':'input','defaultValue':data_lang["key"], 'label':'Key'};
    obj_lang["name"]={'type':'input','defaultValue':data_lang["name"], 'label':'Name'};
    obj_lang["icon"]={'type':'input','defaultValue':data_lang["icon"], 'label':'Icon (url)'};

    customer_field_for_db(obj_lang,'lang','key','','Add lang successfully');

    $.MessageBox({
        message: s_title_box,
        input: obj_lang,
        top: "auto",
        buttonFail: "Cancel"
    }).done(act_done);
}