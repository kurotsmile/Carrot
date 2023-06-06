function close_all_box(){
    $(".box_add").hide();
    $("#all_app").show();
}

function objectifyForm(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
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

function add_field(name,label,val="",type="text",array_label=null){
    var html_filed="<div class='frm-line item_field'>";
    html_filed+="<label for=\""+name+"\">"+label+"</label>";
    html_filed+="<div class='btn del' onclick=\"$(this).parent().remove()\"><i class='fa-solid fa-delete-left'></i></div>";

    if(type=="text"){
        html_filed+="<div class='btn' onclick=\"paste_tag('"+name+"')\"><i class='fa-solid fa-paste'></i></div>";
        html_filed+="<div class='btn' onclick=\"copy_tag('"+name+"')\"><i class='fa-solid fa-copy'></i></div>";
    }

    if(type=="select"){
        html_filed+="<select name=\""+name+"\" id=\""+name+"\" class=\"inp\">";
        for (let i = 0; i < array_label.length; i++) {
            html_filed+="<option value=\""+array_label[i]+"\">"+array_label[i]+"</option> ";
        }
        html_filed+="</select>";
    }
    else if(type=="textarea"){
        html_filed+="<textarea class='inp'>";
        html_filed+=val;
        html_filed+="</textarea>";
    }else{
        html_filed+="<input type=\""+type+"\" id=\""+name+"\" name=\""+name+"\" value=\""+val+"\" class=\"inp\"/>";
    }
    html_filed+="</div>";
    return html_filed;
}

function add_field_to_box_msg(name,label,val="",type="text",array_label=null,active=false){
    var s_array_label= JSON.stringify(array_label);
    var class_active="";
    if(active) class_active="active";
    $("#box_msg_body").append("<div class=\"item_msg item_field "+class_active+"\" item_name=\""+name+"\" item_key=\""+name+"\" item_type=\""+type+"\" item_val=\""+val+"\" item_array_label='"+s_array_label+"'>"+label+"</div>");
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

function show_app_info(data,lang){
    var html="<div id='info-app'>";
    $("#box_app_info").html("");
    if(data.name_en!=null) html+="<div class='info-app-title'><div class='btn' onclick=\"$('#box_app_info').hide(); $('#all_app').show()\"><i class=\"fa-solid fa-backward\"></i></div>"+data["name_"+lang]+"</div>";
    if(data.icon!=null) html+="<img id='icon_app' src=\""+data.icon+"\"/>";
    html+="<div>";
    $("#box_app_info").append(html);
    $.each(data, function(key,val) {
        $("#box_app_info").append("<div><b>"+key+"</b> : "+val+"</div>");
    });
}

async function show_list_contact(querySnapshot){
    $("#all_app").html("");
    querySnapshot.forEach((doc) => {
        var data_doc=doc.data();
        if(data_doc.avatar!=null){
            if(data_doc.avatar.trim()!=""){
                var tip_app="";
                if(data_doc.phone!=null) if(data_doc.phone.trim()!="") tip_app=data_doc.phone;
                if(data_doc.email!=null&&tip_app=="") if(data_doc.email.trim()!="") tip_app=data_doc.email;
                var htm_item_app="<div class='box_app' id=\""+doc.id+"\">";
                htm_item_app+="<figure><img class='icon_app' app_id='"+doc.id+"' src=\""+data_doc.avatar+"\"/></figure>";
                htm_item_app+="<b class='name_app'>"+data_doc.name+"</b>";
                if(tip_app!="") htm_item_app+="<b class='tip_app'>"+tip_app+"</b>";
                htm_item_app+="<div>";
            }
        }
        $("#all_app").append(htm_item_app);
    });
}