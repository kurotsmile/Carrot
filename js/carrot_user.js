class Carrot_user{
    carrot;
    obj_login=null;
    obj_phone_book=null;

    constructor(cr){
        this.carrot=cr;
        if(localStorage.getItem("obj_login")!=null) this.obj_login=JSON.parse(localStorage.getItem("obj_login"));
        if (localStorage.getItem("obj_phone_book") != null) this.obj_phone_book=JSON.parse(localStorage.getItem("obj_phone_book"));
    }

    save_obj_phone_book(){
        localStorage.setItem("obj_phone_book", JSON.stringify(this.obj_phone_book));
    }

    delete_obj_phone_book(){
        localStorage.removeItem("obj_phone_book");
        this.obj_phone_book=null;
    }

    set_user_login(data_user){
        this.obj_login=data_user;
        localStorage.setItem("obj_login",JSON.stringify(this.obj_login));
        this.show_info_user_login_in_header();
    }

    user_logout(){
        this.obj_login=null;
        localStorage.removeItem("obj_login");
        this.show_info_user_login_in_header();
    }

    show_info_user_login_in_header(){
        if(this.obj_login==null){
            $("#btn_acc_info").hide();
            $("#btn_login").show();
            $("#menu_account").hide();
        }else{
            $("#menu_account").removeAttr("style");
            $("#btn_acc_info").show();
            $("#btn_login").hide();
            $("#acc_info_name").html(this.obj_login.name);
            if(this.obj_login.avatar!=null&&this.obj_login.avatar!="") $("#acc_info_avatar").attr("src",this.obj_login.avatar);
        }
    }

    show_all_phone_book(){
        if(this.obj_phone_book==null) 
            this.get_all_data_phone_book();
        else{
            this.carrot.log("Show all data phone book from cache!");
            this.show_all_phone_book_from_list();
        }
    }

    show_all_phone_book_from_list(){
        var carrot=this.carrot;
        var list_phone_book=this.carrot.convert_obj_to_list(this.obj_phone_book);
        this.carrot.change_title_page("Address Book", "?p=address_book","address_book");
        $("#main_contain").html("");
        var html_main_contain="";
        html_main_contain+='<div class="row m-0">';
        $(list_phone_book).each(function(index,data_app) {
            html_main_contain+="<div class='box_app col-md-4 mb-3' id=\""+data_app.id+"\">";
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

                            html_main_contain+="<div class='row' style='margin-top:6px;'>";
                            html_main_contain+="<div class='col-6'><div class='btn dev btn_app_edit btn-warning btn-sm' app_id='"+data_app.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</div></div>";
                            html_main_contain+="<div class='col-6'><div class='btn dev btn_app_del btn-danger btn-sm' app_id='"+data_app.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</div></div>";
                            html_main_contain+="</div>";
    
                        html_main_contain+="</div>";
                    html_main_contain+="</div>";
                html_main_contain+="</div>";
            html_main_contain+="</div>";
            
        });
        html_main_contain+="</div>";
        $("#main_contain").html(html_main_contain);

        $(".btn_app_edit").click(async function () {
            var id_box_app = $(this).attr("app_id");
            carrot.get_doc("user-"+carrot.lang,id_box_app,carrot.user.show_edit_phone_book_done);
        });

        $(".btn_app_del").click(async function () {
            var id_box_app = $(this).attr("app_id");
            $.MessageBox({
                buttonDone  : "Yes",
                buttonFail  : "No",
                message     : "Bạn có chắc chắng là xóa ứng dụng "+id_box_app+" này không?"
            }).done(function(){
                carrot.act_del_obj("user-"+carrot.lang,id_box_app);
            });
        });

        this.carrot.check_mode_site();
        this.carrot.check_event();
    }

    show_edit_phone_book_done(data_user,carrot){
        if(data_user!=null)
            carrot.user.show_box_add_or_edit_phone_book(data_user);
        else
            $.MessageBox("Danh bạ không còn tồn tại!");
    }

    show_box_add_or_edit_phone_book(data_user){
        var carrot=this.carrot;
        var s_title_box='';
        this.getLocation_for_address_user();
        if(data_user==null){
            s_title_box=this.l("register","Add User");
            data_user=new Object();
            data_user["id"]=carrot.uniq();
            data_user["lang"]=carrot.lang;
        }
        else{
            s_title_box="Update User";
            if(data_user["id"]=="") data_user["id"]=carrot.uniq();
        }

        var obj_user = Object();
        obj_user["tip_app"] = { type: "caption", message: "Register an account to use services and manage your information in the system",customClass:'text-info'};
  
        obj_user["id"]={type:'text',defaultValue:data_user["id"],customClass:'d-none'};
        obj_user["name"]={type:'text','title':'Full Name','label':'Full Name',defaultValue:data_user["name"]};
        obj_user["sex"]={type:'select','title':'Your Sex','label':'Your Sex','options':{ "0": "Boy", "1": "Girl" },defaultValue:data_user["sex"]};
        obj_user["email"]={type:'email','title':'Email','label':'Email',defaultValue:data_user["email"]};
        obj_user["phone"]={type:'number','title':'Address','label':'Phone',defaultValue:data_user["phone"]};

        obj_user["address_name"]={type:'text','title':'Address','label':'Address'};
        obj_user["address_log"]={type:'text','title':'Address longitude','label':'Address'};
        obj_user["address_lat"]={type:'text','title':'Address latitude','label':'Address'};

        var obj_type_share=Object();
        obj_type_share["0"]="Share";
        obj_type_share["1"]="No share";
        obj_user["status_share"]={type:'select','title':'Information sharing status','label':'Information sharing status',options:obj_type_share,defaultValue:data_user["status_share"]};

        var arr_lang=Array();
        $(this.carrot.list_lang).each(function(index,lang){arr_lang.push(lang.key);});

        obj_user["lang"]={'type':'select','label':'Lang','options':arr_lang,defaultValue:data_user["lang"]};
        customer_field_for_db(obj_user,'user-'+data_user["lang"],'id','','Add User successfully');
    
        $.MessageBox({
            title: s_title_box,
            input: obj_user,
            top: "auto",
            buttonFail: "Cancel"
        }).done(carrot.act_done_add_or_edit);
    }
    
    getLocation_for_address_user() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
          this.log("Geolocation is not supported by this browser.");
        }
    }
      
    showPosition(position) {
        $("input[name*='address_lat']").val(position.coords.latitude);
        $("input[name*='address_log']").val(position.coords.longitude);
    }
}