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

    customer_field_for_db(obj_lang,'lang','key','Add lang successfully');

    $.MessageBox({
        message: s_title_box,
        input: obj_lang,
        top: "auto",
        buttonFail: "Cancel"
    }).done(act_done);
}
