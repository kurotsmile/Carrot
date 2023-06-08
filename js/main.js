function change_title_page(s_title,s_url){
    document.title =s_title;
    window.history.pushState(s_title, 'Title', s_url);
}

function show_box_add(func,list_store=null,list_lang=null){
    $("#all_app").hide();
    $("#box_add_app").show();
    $("#all-field").html("");
    
    if(func=="add_app"){
        $("#box_add_icon").attr("class","fa-solid fa-mobile");
        $("#all-field").append(add_field("icon","Icon App"));
        $("#all-field").append(add_field("type","Type App",1,"select",Array("app","game")));
        $.each(list_store,function(index,data_link_store){
            var field_data=data_link_store;
            $("#all-field").append(add_field(field_data.key,"Link Store ("+field_data.name+")"));
        });

        $.each(list_lang,function(index,data_lang){
            var obj=data_lang;
            $("#all-field").append(add_field("name_"+obj.key,"Name("+obj.name+")"));
            $("#all-field").append(add_field("describe_"+obj.key,"Describe("+obj.name+")","","textarea"));
        });
    }

    if(func=="add_lang"){
        $("#box_add_icon").attr("class","fa-solid fa-globe");
        $("#all-field").append(add_field("key","Key lang"));
        $("#all-field").append(add_field("name","Name Lang"));
        $("#all-field").append(add_field("icon","Icon Lang"));
    }

    if(func=="add_link_store"){
        $("#box_add_icon").attr("class","fa-solid fa-store");
        $("#all-field").append(add_field("key","Key id Store"));
        $("#all-field").append(add_field("name","Name Store"));
        $("#all-field").append(add_field("icon","Icon Font"));
        $("#all-field").append(add_field("img","Iamge Store"));
    }
    
    var frm_box=$("#frm_add_app");
    $(frm_box).attr("type",func);
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

function show_app_info(data,list_link_store,lang){
    var html="<div id='info-app'>";
    document.title = data.name_en;
    $("#box_app_info").html("");
    if(data.name_en!=null) html+="<div class='info-app-title'><div class='btn' onclick=\"$('#box_app_info').hide(); $('#all_app').show()\"><i class=\"fa-solid fa-backward\"></i></div>"+data["name_"+lang]+"</div>";
    if(data.icon!=null) html+="<img id='icon_app' src=\""+data.icon+"\"/>";

    $.each(list_link_store,function(index,data_link){
        var key_link=data_link.key;
        if(data[key_link]!=null){
            var link_store_app=data[key_link];
            if(data[key_link]!="") html+="<a href='"+link_store_app+"' class='link_store' target=\"_blank\"><img src='"+data_link.img+"'/></a>";
        }
    });
    
    html+="<div>";

    $("#box_app_info").append(html);
    $.each(data, function(key,val) {
        $("#box_app_info").append("<div><b>"+key+"</b> : "+val+"</div>");
    });
}

async function show_list_contact(querySnapshot){
    $("#main_contain").html("");
    var html_main_contain="";
    html_main_contain+='<div class="row m-0">';
    querySnapshot.forEach((doc) => {
        var data_app=doc.data();
        html_main_contain+="<div class='box_app col-md-4 mb-3' id=\""+doc.id+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                var url_avatar='';
                if(data_app.avatar!=null) url_avatar=data_app.avatar;
                if(url_avatar=="") url_avatar="images/avatar_default.png";
                html_main_contain+='<div class="img-cover pe-0 col-3"><img class="rounded" src="'+url_avatar+'" alt="'+data_app.name+'"></div>';
                    html_main_contain+='<div class="det mt-2 col-9">';
                        html_main_contain+="<h5 class='mb-0 fs-6'>"+data_app.name+"</h5>";
                        html_main_contain+='<ul class="row">';
                        html_main_contain+='<li class="col-8 ratfac">';
                            html_main_contain+='<i class="bi text-warning fa-solid fa-heart"></i>';
                            html_main_contain+='<i class="bi text-warning fa-solid fa-heart"></i>';
                            html_main_contain+='<i class="bi text-warning fa-solid fa-heart"></i>';
                            html_main_contain+='<i class="bi text-danger fa-solid fa-heart"></i>';
                            html_main_contain+='<i class="bi fa-solid fa-heart"></i>';
                        html_main_contain+='</li>';
                        if(data_app.sex=="0")
                            html_main_contain+='<li class="col-4"><span class="text-success float-end"><i class="fa-solid fa-mars"></i></span></li>';
                        else
                            html_main_contain+='<li class="col-4"><span class="text-success float-end"><i class="fa-solid fa-venus"></i></span></li>';
                        html_main_contain+='</ul>';

                        html_main_contain+='<ul class="row">';
                        if(data_app.phone!="") html_main_contain+='<li class="col-12 fs-8"><i class="fa-solid fa-phone"></i> '+data_app.phone+'</li>';
                        if(data_app.email!="") html_main_contain+='<li class="col-12 fs-8"><i class="fa-solid fa-envelope"></i> '+data_app.email+'</li>';
                        if(data_app.address!=""){
                            var user_address=data_app.address;
                            if(user_address.name!="") html_main_contain+='<li class="col-12 fs-8"><i class="fa-solid fa-location-dot"></i> '+user_address.name+'</li>';
                        }
                        html_main_contain+='</ul>';

                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
        
    });
    html_main_contain+="</div>";
    $("#main_contain").html(html_main_contain);
}

async function show_list_icon(querySnapshot){
    $("#main_contain").html("");
    var html_main_contain="";
    html_main_contain+='<div class="row m-0">';
    querySnapshot.forEach((doc) => {
        var data_icon=doc.data();
        html_main_contain+="<div class='col-md-3 mb-3' id=\""+doc.id+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                html_main_contain+='<div class="img-cover pe-0 col-3"><img class="rounded" src="'+data_icon.icon+'" alt="'+doc.id+'"></div>';
                    html_main_contain+='<div class="det mt-2 col-9">';
                        html_main_contain+="<h5 class='mb-0 fs-6'>"+doc.id+"</h5>";
                        html_main_contain+="<span class='fs-8' style='color:"+data_icon.color+"'>"+data_icon.color+"</span>";
                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
    });
    html_main_contain+="</div>";
    $("#main_contain").html(html_main_contain);
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

async function show_list_app(querySnapshot,list_store,lang){
    var html_main_contain="";
    html_main_contain+='<div class="row m-0">';
    querySnapshot.forEach((doc) => {
        var data_app=doc.data();
        var key_name="name_"+lang;
        html_main_contain+="<div class='box_app col-md-4 mb-3' id=\""+doc.id+"\">";
            html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
                html_main_contain+='<div class="row">';
                if(data_app.icon!=null) html_main_contain+='<div class="img-cover pe-0 col-3"><img class="rounded" src="'+data_app.icon+'" alt=""></div>';
                    html_main_contain+='<div class="det mt-2 col-9">';
                        html_main_contain+="<h5 class='mb-0 fs-6'>"+data_app[key_name]+"</h5>";
                        html_main_contain+="<span class='fs-8'>"+data_app.name_en+"</span>";

                        html_main_contain+='<ul class="row">';
                            html_main_contain+='<li class="col-8 ratfac">';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html_main_contain+='<i class="bi fa-solid fa-star"></i>';
                            html_main_contain+='</li>';
                            if(data_app.type=="app")
                                html_main_contain+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-mobile"></i></span></li>';
                            else
                                html_main_contain+='<li class="col-4"><span class="text-secondary float-end"><i class="fa-solid fa-gamepad"></i></span></li>';
                        html_main_contain+='</ul>';

                        if(list_store!=null){
                            var html_store_link="";
                            $(list_store).each(function(index,store){
                                if(data_app[store.key]!=null){
                                    var link_store_app=data_app[store.key];
                                    html_store_link+="<a class='link_app' title=\""+store.name+"\" target=\"_blank\" href=\""+link_store_app+"\"><i class=\""+store.icon+"\"></i></a>";
                                }
                            });
                            if(html_store_link!="") html_main_contain+="<div class='row'><div class='col-12'>"+html_store_link+"</div></div>";
                        }
                        html_main_contain+="<div class='row'>";
                        html_main_contain+="<div class='col-6 btn dev btn_app_edit' app_id='"+doc.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</div>";
                        html_main_contain+="<div class='col-6 btn dev btn_app_del' app_id='"+doc.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</div>";
                        html_main_contain+="</div>";

                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
        
    });
    html_main_contain+="</div>";
    $("#main_contain").html(html_main_contain);
}