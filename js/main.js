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

function show_app_info(data,list_store,lang,list_app){
    document.title = data.name_en;
    var html='<div class="section-container p-2 p-xl-4">';
    html+='<div class="row">';
        html+='<div class="col-md-8 ps-4 ps-lg-3">';
            html+='<div class="row bg-white shadow-sm">';
                html+='<div class="col-md-4 p-3">';
                    html+='<img class="w-100" src="'+data.icon+'" alt="">';
                html+='</div>';
                html+='<div class="col-md-8 p-2">';
                    html+='<h4 class="fw-semi fs-4 mb-3">'+data["name_"+lang]+'</h4>';
                    html+='<button class="btn btn-primary w-45 fw-semi fs-8 py-2 me-3"> Download </button>';
                    html+='<button class="btn border ps-3 w-45 fw-semi fs-8 py-2 btn-outlie-primary"> Add to Wish List </button>';
                    html+="<button class='btn dev btn_app_edit btn-warning w-45 fw-semi fs-8 py-2 me-3' app_id='"+data.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</button>";
                    html+="<button class='btn dev btn_app_del btn-danger border ps-3 w-45 fw-semi fs-8 py-2' app_id='"+data.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</button>";

                    html+='<div class="row pt-4">';
                        html+='<div class="col-md-4 col-6 text-center">';
                            html+='<b>3.9 <i class="bi bi-star-fill"></i></b>';
                            html+='<p>11.6k Reviews</p>';
                        html+='</div>';
                        html+='<div class="col-md-4 col-6 text-center">';
                            html+='<b>5M+</b>';
                            html+='<p>Downloads</p>';
                        html+='</div>';
                    html+='</div>';

                    html+='<div class="auth pt-4">';
                        html+='<h6 class="text-primary fw-semi mb-0">Zego Global Publishing</h6>';
                        html+='<p class="fs-8">contains Ads</p>';
                    html+='</div>';

                html+='</div>';
            html+="</div>";

            html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                html+='<h4 class="fw-semi fs-5">About this Game</h4>';
                html+='<p class="fs-8 text-justify">'+data["describe_"+lang]+'</p>';
            html+='</div>';

            html+='<div class="about row p-2 py-3  bg-white mt-4 shadow-sm">';
                html+='<h4 class="fw-semi fs-5">Review</h4>';

                html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';
                    html+='<div class="col-md-12 align-items-center col-9 rcolm">';
                        html+='<div class="review">';
                            html+='<li class="col-8 ratfac">';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                            html+='</li>';
                        html+='</div>';

                        html+='<h3 class="fs-6 fw-semi mt-2">Vinoth kumar<small class="float-end fw-normal"> 20 Aug 2022 </small></h3>';
                        html+='<div class="review-text">Great work, keep it up</div>';

                    html+='</div>';
                    html+='<div class="col-md-2"></div>';
                html+='</div>';

                html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';
                    html+='<div class="col-md-12 align-items-center col-9 rcolm">';
                        html+='<div class="review">';
                            html+='<li class="col-8 ratfac">';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                            html+='</li>';
                        html+='</div>';

                        html+='<h3 class="fs-6 fw-semi mt-2">Vinoth kumar<small class="float-end fw-normal"> 20 Aug 2022 </small></h3>';
                        html+='<div class="review-text">Great work, keep it up</div>';

                    html+='</div>';
                    html+='<div class="col-md-2"></div>';
                html+='</div>';

                html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';
                    html+='<div class="col-md-12 align-items-center col-9 rcolm">';
                        html+='<div class="review">';
                            html+='<li class="col-8 ratfac">';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi text-warning fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                                html+='<i class="bi fa-solid fa-star"></i>';
                            html+='</li>';
                        html+='</div>';

                        html+='<h3 class="fs-6 fw-semi mt-2">Vinoth kumar<small class="float-end fw-normal"> 20 Aug 2022 </small></h3>';
                        html+='<div class="review-text">Great work, keep it up</div>';

                    html+='</div>';
                    html+='<div class="col-md-2"></div>';
                html+='</div>';

            html+='</div>';
        html+="</div>";

        html+='<div class="col-md-4">';
        html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3">Related Apps</h4>';
        
            list_app = list_app.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            $(list_app).each(function(intdex,app_item){
                if(data.type==app_item.type&&data.id!=app_item.id) html+=box_app_item(app_item,list_store,lang,'col-md-12 mb-3');
            })
        html+='</div>';

    html+="</div>";
    html+="</div>";
    $("#main_contain").html(html);
    window.scrollTo(0, 0);
}

function box_app_item(data_app,list_store,lang,s_class){
    var key_name="name_"+lang;
    var html_main_contain="<div class='box_app "+s_class+"' id=\""+data_app.id+"\">";
        html_main_contain+='<div class="app-cover p-2 shadow-md bg-white">';
            html_main_contain+='<div class="row">';
            if(data_app.icon!=null) html_main_contain+='<div role="button" class="img-cover pe-0 col-3 app_icon" app_id="'+data_app.id+'"><img class="rounded" src="'+data_app.icon+'" alt=""></div>';
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

                    html_main_contain+="<div class='row' style='margin-top:6px;'>";
                    html_main_contain+="<div class='col-6'><div class='btn dev btn_app_edit btn-warning btn-sm' app_id='"+data_app.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</div></div>";
                    html_main_contain+="<div class='col-6'><div class='btn dev btn_app_del btn-danger btn-sm' app_id='"+data_app.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</div></div>";
                    html_main_contain+="</div>";

                html_main_contain+="</div>";
            html_main_contain+="</div>";
        html_main_contain+="</div>";
    html_main_contain+="</div>";
    return html_main_contain;
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

async function show_list_app(querySnapshot,list_store,lang,list_app){
    var html_main_contain="";
    html_main_contain+='<div id="all_app" class="row m-0">';
    querySnapshot.forEach((doc) => {
        var data_app=doc.data();
        data_app["id"]=doc.id;
        list_app.push(data_app);
        html_main_contain+=box_app_item(data_app,list_store,lang,'col-md-4 mb-3');
    });
    html_main_contain+="</div>";
    $("#main_contain").html(html_main_contain);
}

function show_box_add_or_edit_app(list_lang,list_store,data_app,act_done){
    var s_title_box='';
    if(data_app==null) s_title_box="<b>Add Application</b>";
    else s_title_box="<b>Update Application</b>";
    var obj_app = Object();
    obj_app["tip_app"] = { type: "caption", message: "Thông tin cơ bản" };

    var obj_input_icon = Object();
    obj_input_icon["type"] = "input";
    obj_input_icon["label"] = "Icon App";
    if(data_app!=null&&data_app["icon"]!="") obj_input_icon["defaultValue"]=data_app["icon"];
    obj_app["icon"] = obj_input_icon;

    var obj_input_type = Object();
    obj_input_type["type"] = "select";
    obj_input_type["label"] = "Type App";
    obj_input_type["options"] = { "app": "app", "game": "game" };
    if(data_app!=null&&data_app["icon"]!="") 
        obj_input_type["defaultValue"]=data_app["type"];
    else
        obj_input_type["defaultValue"] = "app";
    obj_app["type"] = obj_input_type;

    obj_app["tip_name"] = { type: "caption", message: "Tên và mô tả" };

    $.each(list_lang, function (index, data_lang) {
        var obj_input_name = Object();
        obj_input_name["type"] = "input";
        obj_input_name["label"] = "Name - " + data_lang.name;
        if(data_app!=null&&data_app["name_" + data_lang.key]!="") obj_input_name["defaultValue"]=data_app["name_" + data_lang.key];
        obj_app["name_" + data_lang.key] = obj_input_name;

        var obj_input_describe = Object();
        obj_input_describe["type"] = "textarea";
        obj_input_describe["label"] = "Describe - " + data_lang.name;
        if(data_app!=null&&data_app["describe_" + data_lang.key]!="") obj_input_describe["defaultValue"]=data_app["describe_" + data_lang.key];
        obj_app["describe_" + data_lang.key] = obj_input_describe;

    });

    obj_app["tip_link"] = { type: "caption", message: "Các Liên kết tới các store khác" };

    $.each(list_store, function (index, data_store) {
        var obj_input_link_store = Object();
        obj_input_link_store["type"] = "input";
        obj_input_link_store["label"] = "Link Store - (" + data_store.name + ") - " + data_store.key;
        if(data_app!=null&&data_app[data_store.key]!="") obj_input_link_store["defaultValue"]=data_app[data_store.key];
        obj_app[data_store.key] = obj_input_link_store;
    });

    $.MessageBox({
        message: s_title_box,
        input: obj_app,
        top: "auto",
        buttonFail: "Cancel"
    }).done(act_done);
}