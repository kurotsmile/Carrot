class Carrot_user{
    carrot;
    obj_login=null;
    obj_phone_book=null;

    phone_book_info_cur=null;
    icon="fa-solid fa-address-book";

    constructor(carrot){
        this.carrot=carrot;
        if(localStorage.getItem("obj_login")!=null) this.obj_login=JSON.parse(localStorage.getItem("obj_login"));
        if (localStorage.getItem("obj_phone_book") != null) this.obj_phone_book=JSON.parse(localStorage.getItem("obj_phone_book"));

        carrot.register_page("phone_book","carrot.user.list()","carrot.user.edit","carrot.user.show_user_info","carrot.user.reload");
        var btn_list=carrot.menu.create("phone_book").set_label("Phone book").set_lang("phone_book").set_icon(this.icon).set_type("main");
        $(btn_list).click(function(){carrot.user.list();});
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
        this.carrot.delete_ver_cur("user");
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

    list(){
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
        var url_avatar='';
        if(data_user.avatar!=null) url_avatar=data_user.avatar;
        if(url_avatar=="") url_avatar="images/avatar_default.png";

        var item_user=new Carrot_List_Item(this.carrot);
        item_user.set_id(data_user.id);
        item_user.set_name(data_user.name);
        item_user.set_class(s_class);
        item_user.set_class_icon("col-4");
        item_user.set_class_body("col-8");
        item_user.set_icon(url_avatar);
        item_user.set_db("user-"+data_user.lang);
        item_user.set_obj_js("user");
        var html='';
        html+='<div class="col-10">';
            html+='<div class="row">';
                if(data_user.phone!=""&&data_user.phone!=undefined) html+='<div class="col-12 fs-8 text-break"><i class="fa-solid fa-phone"></i> '+data_user.phone+'</div>';
                if(data_user.email!=""&&data_user.email!=undefined) html+='<div class="col-12 fs-8 text-break"><i class="fa-solid fa-envelope"></i> '+data_user.email+'</div>';
                if(data_user.address!=""&&data_user.address!=undefined){
                    var user_address=data_user.address;
                    if(user_address.name!="") html+='<li class="col-12 fs-8 text-break"><i class="fa-solid fa-location-dot"></i> '+user_address.name+'</li>';
                }
            html+='</div>';
            html+='<div class="row">';
                html+='<div class="col-12 ratfac">';
                html+='<i class="bi text-warning fa-solid fa-heart"></i>';
                html+='<i class="bi text-warning fa-solid fa-heart"></i>';
                html+='<i class="bi text-warning fa-solid fa-heart"></i>';
                html+='<i class="bi text-danger fa-solid fa-heart"></i>';
                html+='<i class="bi fa-solid fa-heart"></i>';
                html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="col-2">';
            if(data_user.sex=="0")
                html+='<span class="text-success float-end"><i class="fa-solid fa-mars"></i></span>';
            else
                html+='<span class="text-success float-end"><i class="fa-solid fa-venus"></i></span>';
        html+='</div>';

        item_user.set_body(html);
        return item_user.html();
    }

    show_all_phone_book_from_list(){
        var carrot=this.carrot;
        var list_phone_book=this.carrot.convert_obj_to_list(this.obj_phone_book);
        this.carrot.change_title_page("Phone Book", "?p=phone_book","phone_book");
        $("#main_contain").html("");
        var html="";
        html+='<div class="row m-0">';
        $(list_phone_book).each(function(index,data_u) {
            html+=carrot.user.box_user_item(data_u);
        });
        html+="</div>";
        this.carrot.show(html);
        this.carrot.user.check_event();
    }

    check_event(){
        var carrot=this.carrot;
        if(this.obj_phone_book!=null){
            $(".user-avatar").click(function(){
                var user_id=$(this).attr("user-id");
                var user_lang=$(this).attr("user-lang");
                carrot.get_doc("user-"+user_lang,user_id,carrot.user.show_user_info);
            })
    
            $("#btn_download").click(function(){
                carrot.user.download_vcard();
            });
        }

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
        $(carrot.langs.list_lang).each(function(index,lang){arr_lang.push(lang.key);});

        obj_user["lang"]={'type':'select','label':'Lang','options':arr_lang,defaultValue:data_user["lang"]};
        customer_field_for_db(obj_user,'user-'+data_user["lang"],'id','Add User successfully');
    
        $.MessageBox({
            title: s_title_box,
            input: obj_user,
            top: "auto",
            buttonFail: "Cancel"
        }).done(carrot.act_done_add_or_edit);
    }

    add(){
        var data_user_new=new Object();
        data_user_new["name"]="";
        data_user_new["avatar"]="";
        data_user_new["password"]="";
        data_user_new["phone"]="";
        data_user_new["sex"]="";
        data_user_new["status_share"]="";
        data_user_new["email"]="";
        data_user_new["address"]="";
        data_user_new["lang"]=this.carrot.lang;
        this.frm_add_or_edit(data_user_new).set_msg_done("Register User Success!").show();
    }

    edit(data,carrot){
        carrot.user.frm_add_or_edit(data).set_msg_done("Update user success!").show();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_user",this.carrot);
        frm.set_icon(this.icon);
        frm.create_field("name").set_label("Full Name").set_value(data.name);
        frm.create_field("avatar").set_label("Avatar").set_value(data.avatar).set_type("file").set_type_file("image/*");
        frm.create_field("phone").set_label("Phone").set_value(data.phone);
        return frm;
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
        carrot.user.phone_book_info_cur=data_user;
        if(data_user.avatar!=null) url_avatar=data_user.avatar;
        if(url_avatar=="") url_avatar="images/avatar_default.png";
        carrot.change_title_page(data_user.name,"?p=phone_book&id="+data_user.id);
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3 text-center">';
                        html+='<img id="imageid" class="w-100" src="'+url_avatar+'" alt="'+data_user.name+'">';
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
                            html+='<button id="register_protocol_url" type="button"  class="btn d-inline btn-success" ><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </button> ';
                            html+='<button id="btn_download" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download Vcard</l> </button> ';
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

    download_vcard() {
        var carrot=this.carrot;
        var filename=carrot.user.phone_book_info_cur.name+".vcf";
        var element = document.createElement('a');
        var text='';
        var arr_name=this.phone_book_info_cur.name.split(' ');
        var Prefix="";
        if(this.phone_book_info_cur.sex=="0") Prefix="Mr"; else Prefix="Ms";
        console.log(arr_name);
        text+="BEGIN:VCARD\n";
        text+="VERSION:3.0";
        text+="FN;CHARSET=UTF-8:"+carrot.user.phone_book_info_cur.name+"\n";

        if(arr_name.length>1){
            var lastname = arr_name[0];
            var firstname = arr_name[1];
            text+="N;CHARSET=UTF-8:"+firstname+"; "+lastname+"; ;"+Prefix+";"+firstname+"\n";
            text+="NICKNAME;CHARSET=UTF-8:"+firstname+" "+lastname+"\n";
        }else{
            text+="N;CHARSET=UTF-8:"+firstname+";;;"+Prefix+";\n";
            text+="NICKNAME;CHARSET=UTF-8:"+carrot.user.phone_book_info_cur.name+"\n";  
        }

        if(this.phone_book_info_cur.email!=""){
            text+="EMAIL;CHARSET=UTF-8;type=HOME,INTERNET:"+this.phone_book_info_cur.email+"\n";
            text+="EMAIL;CHARSET=UTF-8;type=WORK,INTERNET:"+this.phone_book_info_cur.email+"\n";
        }

        if(this.phone_book_info_cur.phone!=""){
            text+="TEL;TYPE=HOME,VOICE:"+this.phone_book_info_cur.phone+"\n";
        }

        if(this.phone_book_info_cur.address!=""){
            var address=this.phone_book_info_cur.address;
            if(address.name!=""){
                text+="LABEL;CHARSET=UTF-8;TYPE=HOME:Home\n";
                text+="ADR;CHARSET=UTF-8;TYPE=HOME:;;"+address.name+";530000;Vietnam\n";
                text+="LABEL;CHARSET=UTF-8;TYPE=WORK:Company Address\n";
                text+="ADR;CHARSET=UTF-8;TYPE=WORK:;;"+address.name+";530000;Vietnam\n";
            }
        }

        text+="TITLE;CHARSET=UTF-8:Carrot Store\n";
        text+="ROLE;CHARSET=UTF-8:user\n";
        text+="ORG;CHARSET=UTF-8:Carrot\n";
        text+="URL;type=WORK;CHARSET=UTF-8:"+window.location+"\n";
        text+="X-SOCIALPROFILE;TYPE=facebook:https://www.facebook.com/kurotsmile\n";
        text+="X-SOCIALPROFILE;TYPE=web:https://carrotstore.web.app\n";
        text+="REV:"+new Date().toJSON()+"\n";
        text+="END:VCARD\n";
        

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        carrot.msg("Download Success!");
    }  

    list_for_home(){
        var html='';
        if(this.obj_phone_book!=null){
            var list_user=this.carrot.obj_to_array(this.obj_phone_book);
            list_user=list_user.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);

            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+this.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_user">Other User</l>';
            html+='<span role="button" onclick="carrot.user.list()" class="btn float-end btn-sm btn-secondary"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div id="other_user" class="row m-0">';
            for(var i=0;i<12;i++){
                var user=list_user[i];
                html+=this.box_user_item(user);
            }
            html+='</div>';
        }
        return html;
    }

    reload(carrot){
        carrot.user.delete_obj_phone_book();
        carrot.user.list();
    }
}