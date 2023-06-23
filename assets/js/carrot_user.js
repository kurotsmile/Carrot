class Carrot_user{
    carrot;
    obj_login=null;
    obj_phone_book=null;

    constructor(cr){
        this.carrot=cr;
        if(localStorage.getItem("obj_login")!=null) this.obj_login=JSON.parse(localStorage.getItem("obj_login"));
        if (localStorage.getItem("obj_phone_book") != null) this.obj_phone_book=JSON.parse(localStorage.getItem("obj_phone_book"));
    }

    get_all_data_phone_book(){
        this.carrot.log("get_all_data_phone_book from sever");
        this.carrot.db.collection("user-"+this.carrot.lang).where("status_share", "==", "0").limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                this.obj_phone_book=Object();
                querySnapshot.forEach((doc) => {
                    var data_phone=doc.data();
                    data_phone["id"]=doc.id;
                    this.obj_phone_book[doc.id]=JSON.stringify(data_phone);
                });
                this.save_obj_phone_book();
                this.show_all_phone_book_from_list();
                this.carrot.update_new_ver_cur("user",true);
            }
        })
        .catch((error) => {
            this.log(error.message)
            act_done(null,this);
        });
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
        if(this.carrot.get_ver_cur("user")){
            if(this.obj_phone_book==null) 
                this.get_all_data_phone_book();
            else{
                this.carrot.log("Show all data phone book from cache!");
                this.show_all_phone_book_from_list();
            }
        }else{
            this.get_all_data_phone_book();
        }
    }

    box_user_item(data_user,s_class="col-md-4 mb-3"){
        var html="";
        html+="<div class='box_app "+s_class+"' id=\""+data_user.id+"\" key_search=\""+data_user.name+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                var url_avatar='';
                if(data_user.avatar!=null) url_avatar=data_user.avatar;
                if(url_avatar=="") url_avatar="images/avatar_default.png";
                html+='<div class="img-cover pe-0 col-3"><img role="button" class="rounded user-avatar" src="'+url_avatar+'" user-id="'+data_user.id+'"  user-lang="'+data_user.lang+'" alt="'+data_user.name+'"></div>';
                    html+='<div class="det mt-2 col-9">';
                        html+="<h5 class='mb-0 fs-6'>"+data_user.name+"</h5>";
                        html+='<ul class="row">';
                        html+='<li class="col-8 ratfac">';
                            html+='<i class="bi text-warning fa-solid fa-heart"></i>';
                            html+='<i class="bi text-warning fa-solid fa-heart"></i>';
                            html+='<i class="bi text-warning fa-solid fa-heart"></i>';
                            html+='<i class="bi text-danger fa-solid fa-heart"></i>';
                            html+='<i class="bi fa-solid fa-heart"></i>';
                        html+='</li>';
                        if(data_user.sex=="0")
                            html+='<li class="col-4"><span class="text-success float-end"><i class="fa-solid fa-mars"></i></span></li>';
                        else
                            html+='<li class="col-4"><span class="text-success float-end"><i class="fa-solid fa-venus"></i></span></li>';
                        html+='</ul>';

                        html+='<ul class="row">';
                        if(data_user.phone!="") html+='<li class="col-12 fs-8"><i class="fa-solid fa-phone"></i> '+data_user.phone+'</li>';
                        if(data_user.email!="") html+='<li class="col-12 fs-8"><i class="fa-solid fa-envelope"></i> '+data_user.email+'</li>';
                        if(data_user.address!=""){
                            var user_address=data_user.address;
                            if(user_address.name!="") html+='<li class="col-12 fs-8"><i class="fa-solid fa-location-dot"></i> '+user_address.name+'</li>';
                        }
                        html+='</ul>';

                        html+=this.carrot.btn_dev("user-"+data_user.lang,data_user.id);

                    html+="</div>";
                html+="</div>";
            html+="</div>";
        html+="</div>";
        return html;
    }

    show_all_phone_book_from_list(){
        var carrot=this.carrot;
        var list_phone_book=this.carrot.convert_obj_to_list(this.obj_phone_book);
        this.carrot.change_title_page("Address Book", "?p=address_book","address_book");
        $("#main_contain").html("");
        var html="";
        html+='<div class="row m-0">';
        $(list_phone_book).each(function(index,data_u) {
            html+=carrot.user.box_user_item(data_u);
        });
        html+="</div>";
        $("#main_contain").html(html);
        this.carrot.user.check_event();
    }

    check_event(){
        var carrot=this.carrot;
        $(".user-avatar").click(function(){
            var user_id=$(this).attr("user-id");
            var user_lang=$(this).attr("user-lang");
            carrot.get_doc("user-"+user_lang,user_id,carrot.user.show_user_info);
        })
        carrot.check_event();
    }

    show_register(){
        this.show_box_add_or_edit_phone_book(null,this.carrot);
    }

    show_box_add_or_edit_phone_book(data_user,carrot){
        var s_title_box='';
        carrot.user.getLocation_for_address_user();
        if(data_user==null){
            s_title_box=carrot.l("register","Add User");
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
        $(carrot.list_lang).each(function(index,lang){arr_lang.push(lang.key);});

        obj_user["lang"]={'type':'select','label':'Lang','options':arr_lang,defaultValue:data_user["lang"]};
        customer_field_for_db(obj_user,'user-'+data_user["lang"],'id','Add User successfully');
    
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
          this.carrot.log("Geolocation is not supported by this browser.");
        }
    }
      
    showPosition(position) {
        $("input[name*='address_lat']").val(position.coords.latitude);
        $("input[name*='address_log']").val(position.coords.longitude);
    }

    show_user_info(data_user,carrot){
        if(data_user==null){$.MessageBox("This user no longer exists");return false;}
        var url_avatar='';
        if(data_user.avatar!=null) url_avatar=data_user.avatar;
        if(url_avatar=="") url_avatar="images/avatar_default.png";
        carrot.change_title_page(data_user.name,"?p=address_book&id="+data_user.id);
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3 text-center">';
                        html+='<img class="w-100" src="'+url_avatar+'" alt="'+data_user.name+'">';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data_user.name+'</h4>';
                        html+=carrot.btn_dev("user-"+data_user.lang,data_user.id);

                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>3.9 <i class="fa-sharp fa-solid fa-eye"></i></b>';
                                html+='<p>11.6k <l class="lang"  key_lang="count_view">Reviews</l></p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>Email <i class="fa-solid fa-envelopes-bulk"></i></b>';
                                html+='<p class="lang" key_lang="email">'+data_user.email+'</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                if(data_user.sex=="0"){
                                    html+='<b><l class="lang" key_lang="gender">Sex</l> <i class="fa-solid fa-mars"></i></b>';
                                    html+='<p class="lang" key_lang="boy">'+data_user.sex+'</p>';
                                }
                                else{
                                    html+='<b><l class="lang" key_lang="sex">Sex</l> <i class="fa-solid fa-venus"></i></b>';
                                    html+='<p class="lang" key_lang="girl">'+data_user.sex+'</p>';
                                }
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>Ads <i class="fa-solid fa-window-restore"></i></b>';
                                html+='<p class="lang" key_lang="contains_ads">Contains Ads</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>Country <i class="fa-solid fa-language"></i></b>';
                                html+='<p>'+data_user.lang+'</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="phone">Phone</l> <i class="fa-solid fa-user"></i></b>';
                                html+='<p>'+data_user.phone+'</p>';
                            html+='</div>';
                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-12 text-center">';
                            html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                            html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success" ><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button>';
                            html+='</div>';
                        html+='</div>';

                    html+='</div>';
                html+="</div>";
    
                html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="describe">Describe yourself</h4>';
                    html+='<p class="fs-8 text-justify">'+data_user.email+'</p>';
                html+='</div>';
    
                html+='<div class="about row p-2 py-3  bg-white mt-4 shadow-sm">';
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="review">Review</h4>';
    
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
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_songs">Related User</h4>';
            var list_user_other= carrot.convert_obj_to_list(carrot.user.obj_phone_book).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            for(var i=0;i<list_user_other.length;i++){
                var u_data=list_user_other[i];
                if(data_user.id!=u_data.id) html+=carrot.user.box_user_item(u_data,'col-md-12 mb-3');
            };
            html+='</div>';
    
        html+="</div>";
        html+="</div>";
        carrot.show(html);
        carrot.user.check_event();
    }

    show_user_info_login(){
        this.show_user_info(this.obj_login,this.carrot);
    }

    async picker_contact_from_pc(){
        var supported = ('contacts' in navigator && 'ContactsManager' in window);
        if(supported){
            const props = ['name', 'email', 'tel', 'address', 'icon'];
            const opts = {multiple: true};
            
            try {
              const contacts = await navigator.contacts.select(props, opts);
              handleResults(contacts);
            } catch (ex) {}
        }
    }

    check_user_login(username,password){
        this.carrot.db.collection("user-"+this.carrot.lang).where("phone", "==", username).where("password", "==", password).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                querySnapshot.forEach((doc) => {
                    var data_login=doc.data();
                    data_login["id"]=doc.id;
                    carrot.user.set_user_login(data_login);
                });
            }else{
                $.MessageBox("Đăng nhập thất bại!");
            }
        })
        .catch((error) => {
            this.log(error.message)
            $.MessageBox("Đăng nhập thất bại!");
        });
    }

    get_user_login_id(){
        if(this.obj_login!=null){
            return this.obj_login["id"];
        }else{
            return "";
        }
        
    }
    
}