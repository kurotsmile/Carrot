function close_all_box(){
    $(".box_add").hide();
    $("#all_app").show();
}

function copy_tag(name_tag) {
    var $temp = $("<input>");$("body").append($temp);
    var s_copy=$("#" + name_tag).val();
    s_copy=s_copy.replace("{ten_user}", "");
    $temp.val(s_copy).select();
    document.execCommand("copy");$temp.remove();
}

function paste_tag(name_tag) {
    navigator.clipboard.readText().then(text => {$("#"+name_tag).val(text.trim());});
}

function add_field(name,label,val=""){
    var html_filed="<div class='frm-line item_field'>";
    html_filed+="<label for=\""+name+"\">"+label+"</label>";
    html_filed+="<div class='btn del' onclick=\"$(this).parent().remove()\"><i class='fa-solid fa-delete-left'></i></div>";
    html_filed+="<div class='btn' onclick=\"paste_tag('"+name+"')\"><i class='fa-solid fa-paste'></i></div>";
    html_filed+="<div class='btn' onclick=\"copy_tag('"+name+"')\"><i class='fa-solid fa-copy'></i></div>";
    html_filed+="<input type=\"text\" id=\""+name+"\" name=\""+name+"\" value=\""+val+"\" class=\"inp\"/>";
    html_filed+="</div>";
    return html_filed;
}

function show_box_msg(title){
    $("#box_msg").show();
    $("#box_msg_title").html(title);
    $("#box_msg_body").html("");
    return $("#box_msg_body");
}

function close_box_msg(){
    $("#box_msg").hide();
}

function show_app_info(data){
    var html="<div id='info-app'>";
    $("#box_app_info").html("");
    if(data.name_en!=null) html+="<div class='info-app-title'><div class='btn' onclick=\"$('#box_app_info').hide(); $('#all_app').show()\"><i class=\"fa-solid fa-backward\"></i></div>"+data.name_en+"</div>";
    if(data.icon!=null) html+="<img id='icon_app' src=\""+data.icon+"\"/>";
    html+="<div>";
    $("#box_app_info").append(html);
    $.each(data, function(key,val) {
        $("#box_app_info").append("<div><b>"+key+"</b> : "+val+"</div>");
    });
}