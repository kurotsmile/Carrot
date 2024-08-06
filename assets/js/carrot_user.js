class Carrot_user{

    objs=null;
    obj_login=null;

    phone_book_info_cur=null;
    icon="fa-solid fa-address-book";
    type_show='list';

    orderBy_type='DESCENDING';
    orderBy_at='name';

    constructor(){
        var btn_list=carrot.menu.create("phone_book").set_label("Phone book").set_lang("phone_book").set_icon(this.icon).set_type("main");
        $(btn_list).click(function(){carrot.user.list();});
    
        if(localStorage.getItem("obj_login")!=null){
           this.obj_login=JSON.parse(localStorage.getItem("obj_login"));
        }
    }

    show(){
        var id=carrot.get_param_url("id");
        if(id!=undefined){
            var lang=carrot.get_param_url("user_lang");
            setTimeout(()=>{
            carrot.user.get_info(id,lang,carrot.user.info);
            },500);
        }
        else{
            carrot.user.list();
        }
    }

    get_list_orderBy(orderBy_at,orderBy_type){
        carrot.data.clear("user");
        carrot.loading("Get list data by order ("+orderBy_at+" -> "+orderBy_type+")");
        carrot.user.orderBy_at=orderBy_at;
        carrot.user.orderBy_type=orderBy_type;
        carrot.user.get_data(carrot.user.load_list_by_data);
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
                html+='<div class="col-8">';

                    if(carrot.user.type_show=='info'){
                        html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="One group">';
                            html+='<button onclick="carrot.user.list();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-caret-left"></i> <l class="lang" key_lang="back">Back</l></button>';
                        html+='</div>';
                    }

                    html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="Last group">';
                        var s_active="active";
                        if(carrot.user.orderBy_at=="date_create"&&carrot.user.orderBy_type=="DESCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.user.get_list_orderBy(\'date_create\',\'DESCENDING\');return false;"><i class="fa-solid fa-arrow-up-9-1"></i> Date</button>';
                        if(carrot.user.orderBy_at=="date_create"&&carrot.user.orderBy_type=="ASCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.user.get_list_orderBy(\'date_create\',\'ASCENDING\');return false;"><i class="fa-solid fa-arrow-down-1-9"></i> Date</button>';
                        
                        if(carrot.user.orderBy_at=="name"&&carrot.user.orderBy_type=="DESCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.user.get_list_orderBy(\'name\',\'DESCENDING\');return false;"><i class="fa-solid fa-arrow-up-a-z"></i> Name</button>';
                        if(carrot.user.orderBy_at=="name"&&carrot.user.orderBy_type=="ASCENDING") s_active="active";
                        else s_active="";
                        html+='<button id="btn-add-code" class="btn btn-success btn-sm '+s_active+'" onclick="carrot.user.get_list_orderBy(\'name\',\'ASCENDING\');return false;"><i class="fa-solid fa-arrow-down-z-a"></i> Name</button>';
                    html+='</div>';

                    html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                        html+='<button onclick="carrot.user.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add</button>';
                        html+=carrot.tool.btn_export("user-"+carrot.langs.lang_setting);
                        html+='<button onclick="carrot.user.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                    html+='</div>';
                html+='</div>';

                html+='<div class="col-4">';
                    html+='<div class="btn-group mr-2 btn-sm float-end" role="group" aria-label="End group">';
                    html+=carrot.langs.list_btn_lang_select('btn-success','carrot.user.change_lang');
                    html+='</div>';
                html+='</div>'

        html+='</div>';
     
        return html;
    }

    get_data(act_done){
        if(carrot.check_ver_cur("user")==false){
            carrot.update_new_ver_cur("user",true);
            carrot.user.get_data_from_server(act_done);
        }else{
            carrot.user.get_data_from_db(act_done,()=>{
                carrot.user.get_data_from_server(act_done);
            });
        }
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("user-"+carrot.langs.lang_setting);
        q.add_select("id");
        q.add_select("name");
        q.add_select("sex");
        q.add_select("address");
        q.add_select("avatar");
        q.add_select("phone");
        q.add_select("status_share");
        q.add_select("type");
        q.add_select("lang");
        q.add_select("email");
        q.add_select("role");
        //q.add_where("phone","","NOT_EQUAL");
        q.add_where("status_share","0");
        q.set_limit(52);
        q.set_order(carrot.user.orderBy_at,carrot.user.orderBy_type);
        q.get_data((data)=>{
            carrot.user.objs=data;
            $(data).each(function(index,u){
                carrot.data.add("user",u);
            });
            act_done(data);
        });
    }

    get_data_from_db(act_done,act_fail){
        carrot.data.list("user").then((data)=>{
            carrot.user.objs=data;
            act_done(data);
        }).catch(act_fail);
    }

    login_user_google(){
        var provider_google = new firebase.auth.GoogleAuthProvider();
        provider_google.addScope('https://www.googleapis.com/auth/contacts.readonly');
        carrot.firebase.auth().languageCode = carrot.lang;
        carrot.firebase.auth().signInWithPopup(provider_google).then((result) => {
            var user = result.user;
            carrot.user.login_success(user);
        }).catch((error) => {
            carrot.msg(error.message,"error");
        });
    }

    login_user_twitter(){
        var provider_twitter = new firebase.auth.TwitterAuthProvider();
        carrot.firebase.auth().languageCode = carrot.lang;
        carrot.firebase.auth().signInWithPopup(provider_twitter).then((result) => {
            var user = result.user;
            carrot.user.login_success(user);
        }).catch((error) => {
            carrot.msg(error.message,"error");
        });
    }

    login_user_apple(){
        var provider_apple = new firebase.auth.OAuthProvider('apple.com');
        provider_apple.addScope('email');
        provider_apple.addScope('name');
        carrot.firebase.auth().signInWithPopup(provider_apple).then((result) => {
            var user = result.user;
            carrot.user.login_success(user);
        }).catch((error) => {
            carrot.msg(error.message,"error");
        });
    }

    login_user_github(){
        var provider_github = new firebase.auth.GoogleAuthProvider();
        provider_github.addScope('repo');
        carrot.firebase.auth().signInWithPopup(provider_github).then((result) => {
            var user = result.user;
            carrot.user.login_success(user);
        }).catch((error) => {
            carrot.msg(error.message,"error");
        });
    }

    login_success(data_user){
        var user=data_user.multiFactor.user;
        var data_user_login=new Object();
        data_user_login.email=user.email;
        data_user_login.name=user.displayName;
        data_user_login.phone=user.phoneNumber;
        let url_avatar = user.photoURL;
        url_avatar = url_avatar.replace("s96-c", "s512-c");
        data_user_login.avatar=url_avatar;
        data_user_login.id=user.uid;
        data_user_login.id_doc=data_user_login.id;
        data_user_login.sex="0";
        data_user_login.lang=carrot.lang;
        carrot.user.obj_login=data_user_login;
        carrot.set_doc_merge("user-"+carrot.lang,user.uid,data_user_login,carrot.user.done_login_success);
        Swal.close();
    }

    done_login_success(carrot){
        carrot.get_doc("user-"+carrot.lang,carrot.user.obj_login.id,carrot.user.get_user_data_login_from_server);
    }

    get_user_data_login_from_server(data,carrot){
        carrot.user.set_user_login(data);
    }

    login(){
        var html='';
        html+='<form class="row">';
            html+='<div class="col-6 fs-9 text-justify">';
                html+='<div class="form-group">';
                    html+='<label for="login_user"><i class="fa-solid fa-phone"></i> '+carrot.l("phone","Phone")+'</label>';
                    html+='<input  class="form-control form-control-sm mt-1"" id="login_user" aria-describedby="emailHelp" placeholder="Enter Your Phone">';
                html+='</div>';

                html+='<div class="form-group">';
                    html+='<label for="login_password"><i class="fa-solid fa-lock"></i> '+carrot.l("password","Password")+'</label>';
                    html+='<input type="password" class="form-control form-control-sm mt-1" id="login_password" placeholder="Password">';
                html+='</div>';

                html+='<div class="form-group">';
                    html+='<small class="fs-9">'+carrot.l("login_tip")+'</small>';
                html+='</div>';

                html+='<div class="form-group mt-2 text-center">';
                    html+='<div id="btn_user_login" role="button" class="btn btn-success m-1 btn-sm"><i class="fa-solid fa-key"></i> '+carrot.l("login","Login")+'</div>';
                    html+='<div onclick="Swal.close();return false;" role="button" class="btn m-1 btn-sm"><i class="fa-solid fa-circle-xmark"></i> '+carrot.l("cancel","Cancel")+'</div>';
                html+='</div>';
            html+='</div>';
            
            html+='<div class="col-6 fs-9">';
                html+='<button onclick="carrot.user.login_user_google();return false;" class="btn btn-info fs-9 m-2 d-block btn-sm"><i class="fa-brands fa-google"></i> login with google account</button>';
                html+='<button onclick="carrot.user.login_user_twitter();return false;" class="btn btn-info fs-9 m-2 d-block btn-sm"><i class="fa-brands fa-twitter"></i> login with twitter account</button>';
                html+='<button onclick="carrot.user.login_user_apple();return false;" class="btn btn-info fs-9 m-2 d-block btn-sm"><i class="fa-brands fa-apple"></i> login with Apple account</button>';
                html+='<button onclick="carrot.user.login_user_github();return false;" class="btn btn-info fs-9 m-2 d-block btn-sm"><i class="fa-brands fa-square-github"></i> login with Github account</button>';
                html+='<button onclick="carrot.user.show_register();Swal.close();return false;" class="btn btn-success fs-9 m-2 d-block btn-lg"><i class="fa-solid fa-user-plus"></i> '+carrot.l("register","Register")+'</button>';
            html+='</div>';

        html+='</form>';
        Swal.fire({
            title: carrot.l("login","Login"),
            html:html,
            showConfirmButton: false
        });

        $("#btn_user_login").click(function(){
            var login_user=$("#login_user").val();
            var login_password=$("#login_password").val();
            carrot.user.check_user_login(login_user,login_password);
        });

    }

    check_login(){
        var provider_google = new firebase.auth.GoogleAuthProvider();
        provider_google.addScope('https://www.googleapis.com/auth/contacts.readonly');
        carrot.firebase.auth().currentUser.linkWithPopup(provider_google).then((result) => {
            var credential = result.credential;
            var user = result.user;
            console.log(user);
            console.log(credential);
          }).catch((error) => {
            console.log(error);
          });
    }

    set_user_login(data_user){
        carrot.user.obj_login=data_user;
        if(carrot.user.obj_login.rates!=null) delete carrot.user.obj_login.rates;
        if(carrot.user.obj_login.backup_contact!=null) delete carrot.user.obj_login.backup_contact;
        localStorage.setItem("obj_login",JSON.stringify(carrot.user.obj_login));
        carrot.user.show_info_user_login_in_header();
    }

    user_logout(){
        carrot.firebase.auth().signOut().then(function() {
            carrot.user.obj_login=null;
            localStorage.removeItem("obj_login");
            carrot.user.show_info_user_login_in_header();
        }, function(error) {
            console.error('Sign Out Error', error);
        });
    }

    show_info_user_login_in_header(){
        if(carrot.user.obj_login==null){
            $("#btn_acc_info").hide();
            $("#btn_login").show();
            $("#menu_account").hide();
        }else{
            $("#menu_account").removeAttr("style");
            $("#btn_acc_info").show();
            $("#btn_login").hide();
            $("#acc_info_name").html(carrot.user.obj_login.name);
            if(carrot.user.obj_login.avatar!=null&&carrot.user.obj_login.avatar!="") $("#acc_info_avatar").attr("src",carrot.user.obj_login.avatar);
        }
        carrot.rate.check_status_user_login();
        $(".user_data").each(function(index,emp){
            $(emp).attr("value",encodeURI(JSON.stringify(carrot.user.get_user_login())));
            $(emp).html(carrot.user.box_item_field_form_user(carrot.user.get_user_login()));
        });
    }

    box_item_field_form_user(data_user){
        var html='';
        if(data_user==null){
            html+='<div role="button" onclick="carrot.user.login();" class="btn btn-sm btn-info"><i class="fa-solid fa-user"></i> '+carrot.l("login","Login")+'</div>';
        }else{
            var name_user_field='Incognito';
            var url_avatar_user_field='images/avatar_default.png';
            var id_user_field="";

            if(data_user.name!=null) name_user_field=data_user.name;
            if(data_user.avatar!= null) url_avatar_user_field=data_user.avatar;
            if(data_user.id!=null) id_user_field=data_user.id;

            html+='<div class="row">';
                html+='<div class="col-2">';
                    html+='<img role="button" emp_img="avatar_user_field" id="avatar_user_field" onclick="carrot.avatar.msg_list_select(this);return false" src="'+url_avatar_user_field+'"/>';
                html+='</div>';

                html+='<div class="col-10">';
                    html+='<span class="d-block" id="name_user_field">'+name_user_field+'</span>';
                    if(id_user_field!="") html+='<span class="d-block fs-9" id="id_user_field">'+id_user_field+'</span>';
                    if(carrot.user.obj_login!=null){
                        if(id_user_field==carrot.user.obj_login.id){
                            html+='<span role="button" onclick="carrot.user.user_logout();return false;" class="btn btn-sm btn-danger"><i class="fa-solid fa-right-from-bracket"></i> '+carrot.l("logout","Logout")+'</span>';
                        }else{
                            html+='<span role="button" onclick="carrot.user.change_field_user_to_info_user_login();return false;" class="btn btn-sm btn-info"><i class="fa-solid fa-rotate"></i> Change to logged in user </span>';
                        }
                    }
                html+='</div>';

            html+='</div>';
        }
        return html;
    }

    change_field_user_to_info_user_login(){
        $(".user_data").each(function(index,emp){
            $(emp).attr("value",encodeURI(JSON.stringify(carrot.user.get_user_login())));
            $(emp).html(carrot.user.box_item_field_form_user(carrot.user.get_user_login()));
        });
    }

    list(){
        carrot.loading("Get all data list and show");
        carrot.user.get_data(carrot.user.load_list_by_data);
    }

    box_item(data_user){
        var id_img="";
        if(data_user.avatar!=null&&data_user.avatar!=""){
            id_img=carrot.tool.getIdFileFromURL(data_user.avatar);
            carrot.data.img(id_img,data_user.avatar,id_img);
        }
        var item_user=new Carrot_List_Item(carrot);
        item_user.set_db("user-"+data_user.lang);
        item_user.set_id(data_user.id_doc);
        item_user.set_name(data_user.name);
        item_user.set_class("col-md-3 mb-3");
        item_user.set_class_icon("col-4 user-avatar "+id_img);
        item_user.set_class_body("col-8");
        item_user.set_icon(carrot.url()+"/images/avatar_default.png");
        item_user.set_id_icon(id_img);
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
                html+='<i class="bi text-success fa-solid fa-heart fa-beat fs-9 mr-1"></i> ';
                html+='<i class="bi text-success fa-solid fa-heart fa-beat fs-9 mr-1" style="--fa-animation-duration: 0.5s;"></i> ';
                html+='<i class="bi text-success fa-solid fa-heart fa-beat fa-fade fs-9 mr-1"></i> ';
                html+='<i class="bi text-danger fa-solid fa-heart fa-beat fa-fade fs-9 mr-1" style="--fa-animation-duration: 0.5s;"></i> ';
                html+='<i class="bi fa-solid fa-heart fa-beat fs-9"></i>';
                html+='</div>';
            html+='</div>';
        html+='</div>';

        html+='<div class="col-2">';
            if(data_user.sex=="0")
                html+='<span class="text-success float-end"><i class="fa-solid fa-mars"></i></span>';
            else
                html+='<span class="text-success float-end"><i class="fa-solid fa-venus"></i></span>';
        html+='</div>';

        item_user.set_act_click("carrot.user.show_info_by_id('"+data_user.id_doc+"','"+data_user.lang+"')");
        item_user.set_body(html);
        return item_user;
    }

    load_list_by_data(data){
        carrot.user.type_show="list";
        carrot.hide_loading();
        carrot.change_title("Phone Book", "?p=phone_book","phone_book");
        var html="";
        html+=carrot.user.menu();
        html+='<div class="row m-0">';
        $(data).each(function(index,data_u) {
            data_u["index"]=index;
            html+=carrot.user.box_item(data_u).html();
        });
        html+="</div>";
        carrot.show(html);
        carrot.user.check_event();
    }

    check_event(){
        if(carrot.user.phone_book_info_cur!=null){
            carrot.tool.list_other_and_footer("user","sex",carrot.user.phone_book_info_cur.sex);
        }
        carrot.tool.box_app_tip('Contact store');
        carrot.check_event();
    }

    change_lang(key_change){
        carrot.langs.lang_setting=key_change;
        carrot.loading("Get list data by ("+key_change+")");
        carrot.data.clear("user");
        setTimeout(()=>{
            carrot.user.get_data_from_server(carrot.user.load_list_by_data);
        },500);
    }

    show_register(){
        carrot.user.add();
    }

    add(){
        var data_user_new=new Object();
        data_user_new["id"]=carrot.create_id();
        data_user_new["name"]="";
        data_user_new["avatar"]="";
        data_user_new["password"]="";
        data_user_new["phone"]="";
        data_user_new["sex"]="";
        data_user_new["status_share"]="";
        data_user_new["email"]="";
        data_user_new["address"]="";
        data_user_new["role"]="";
        data_user_new["type"]="";
        data_user_new["lang"]=carrot.lang;
        carrot.user.frm_add_or_edit(data_user_new).set_title(carrot.l("register","Register User")).set_msg_done("Register User Success!").set_type("add").show();
        carrot.check_event();
    }
    
    edit(data,carrot){
        carrot.user.frm_add_or_edit(data).set_title("Edit User").set_msg_done("Update user success!").set_type("update").show();
        carrot.check_event();
    }

    frm_add_or_edit(data){
        var frm=new Carrot_Form("frm_user",carrot);
        frm.set_db("user-"+carrot.lang,"id");
        frm.set_icon(carrot.user.icon);
        frm.create_field("id").set_label("ID").set_value(data.id_doc).set_main().set_type("id");
        frm.create_field("name").set_label("Full Name").set_value(data.name);
        frm.create_field("avatar").set_label("Avatar").set_value(data.avatar).set_type("avatar").set_type_file("image/*");
        frm.create_field("password").set_label("password").set_value(data.password);
        frm.create_field("phone").set_label(carrot.l("phone","Phone")).set_value(data.phone);
        frm.create_field("email").set_label("Email").set_value(data.email);
        var field_sex=frm.create_field("sex").set_label(carrot.l("gender","Gender")).set_value(data.sex).set_type("select");
        field_sex.add_option("0",carrot.l("boy","Boy"));
        field_sex.add_option("1",carrot.l("girl","Girl"));
        frm.create_field("address").set_label("Address").set_value(data.address).set_type("address");
        var field_share=frm.create_field("status_share").set_label("Share Status").set_value(data.status_share).set_type("select");
        field_share.add_option("0","Share");
        field_share.add_option("1","No share");
        var field_type=frm.create_field("type").set_label("Type").set_value(data.type).set_dev().set_type("select");
        field_type.add_option("free","Free");
        field_type.add_option("basic","Basic");
        field_type.add_option("pro","Pro");
        field_type.add_option("gold","Gold");
        field_type.add_option("sapphire","Sapphire");
        var field_role=frm.create_field("role").set_label("Role").set_val(data.role).set_dev().set_type("select");
        field_role.add_option("user","basic user");
        field_role.add_option("admin","Administrators");
        var field_lang=frm.create_field("lang").set_label(carrot.l("country","Country")).set_value(data.lang).set_type("select");
        $(carrot.langs.list_lang).each(function(index,lang){
            lang.index=index;
            field_lang.add_option(lang.key,lang.name);
        });
        frm.set_act_done("carrot.user.after_done_update_user()");
        return frm;
    }

    after_done_update_user(){
        carrot.get_doc("user-"+carrot.user.obj_login.lang,carrot.user.obj_login.id,carrot.user.get_user_data_login_from_server);
    }

    show_info_by_id(id,lang){
        carrot.user.get_info(id,lang,carrot.user.info);
    }

    get_info(id,lang,act_done){
        carrot.loading("Get and show info user("+id+" - "+lang+")");
        carrot.data.get_doc("user_info",id,(data)=>{
            act_done(data);
            },()=>{
            carrot.server.get("user-"+lang,id,(data)=>{
                carrot.data.add("user_info",data);
                act_done(data);
            });
        });
    }
    
    info(data_user){
        carrot.hide_loading();
        carrot.change_title(data_user.name,"?p=phone_book&id="+data_user.id_doc+"&user_lang="+data_user.lang,"phone_book");
        carrot.user.type_show="info";
        carrot.user.phone_book_info_cur=data_user;
       
        var id_img="";
        if(data_user.avatar!=""){
            id_img=carrot.tool.getIdFileFromURL(data_user.avatar);
            carrot.data.img(id_img,data_user.avatar,id_img);
        }

        var html='';
        var box_info=new Carrot_Info(data_user.id_doc);
        box_info.set_name(data_user.name);
        box_info.set_icon_image(carrot.url()+"/images/avatar_default.png");
        box_info.set_icon_id(id_img);
        box_info.set_db("user-"+data_user.lang);
        box_info.set_obj_js("user");
        if(data_user.sex=="0")
            box_info.add_attrs("fa-solid fa-mars",'<l class="lang" key_lang="gender">Sex</l>','<l class="lang" key_lang="boy">Boy</l>');
        else
            box_info.add_attrs("fa-solid fa-venus",'<l class="lang" key_lang="gender">Sex</l>','<l class="girl" key_lang="girl">Boy</l>');

        if(data_user.phone!=null&&data_user.phone!="") box_info.add_attrs("fa-solid fa-user",'<l class="lang" key_lang="phone">Phone</l>',data_user.phone);
        if(data_user.role!=null) box_info.add_attrs("fa-solid fa-hurricane",'<l class="lang" key_lang="role">Role</l>',data_user.role);
        if(data_user.type!=null) box_info.add_attrs("fa-solid fa-hat-cowboy",'<l class="lang" key_lang="type">Type</l>',data_user.type);
        if(data_user.email!=null&&data_user.email!="") box_info.add_attrs("fa-solid fa-paper-plane",'<l class="lang" key_lang="send_mail">Send Mail</l>','<a href="mailto:'+data_user.email+'" type="button">'+data_user.email+'</a>');
        box_info.add_attrs("fa-solid fa-calendar-days",'<l class="lang" key_lang="date">Date Public</l>',data_user.date_create);
        box_info.add_attrs("fa-solid fa-language",'<l class="lang" key_lang="country">Country</l>',data_user.lang);
        box_info.set_protocol_url("contactstore://show/"+data_user.id_doc+"/"+data_user.lang);

        if(carrot.user.obj_login!=null){
            if(data_user.id_doc==carrot.user.obj_login.id){
                box_info.add_btn("btn_edit_info","fa-solid fa-user-pen",'<l class="lang" key_lang="edit_info">Edit Info</l>',"carrot.user.show_edit_user_info_login()");
            }
        }
        box_info.add_btn("btn_download","fa-solid fa-id-card-clip","Download Vcard (.vcf)","carrot.user.download_vcard()");

        if(data_user.address!=null){
            var user_address=data_user.address;
            if(user_address.lat!=null&&user_address.lat!=""){
                var html_addreess='';
                if(user_address.name!="")html_addreess+='<small class="fw-semi fs-8">'+user_address.name+'</small>';
                if(user_address.lot!=null) html_addreess+='<iframe src="https://maps.google.com/maps?q='+user_address.lat+','+user_address.lot+'&hl='+carrot.lang+'&z=14&amp;output=embed" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
                box_info.add_body('<l class="fw-semi fs-5 lang" key_lang="address">Address</l>',html_addreess);
            }
        }
        
        var html_backup='';
        if(data_user.backup_contact!=null){
            html_backup+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html_backup+='<h4 class="fw-semi fs-5"><i class="fa-solid fa-address-book"></i> Contact backup list</h4>';
            html_backup+='<small class="fw-semi fs-8">Contact backup list by account</small>';
            html_backup+='<table class="table table-striped table-hover">';
            html_backup+='<tbody>';
                $(data_user.backup_contact).each(function(index,contact){
                    contact.index=index;
                    html_backup+='<tr>';
                    html_backup+='<td><i class="fa-solid fa-database"></i> '+contact.date+'</td>';
                    html_backup+='<td><i class="fa-solid fa-blender-phone"></i> '+contact.length+' contact</td>';
                    html_backup+='</tr>';
                });
            html_backup+='</tbody>';
            html_backup+='</table>';
            html_backup+='</div>';
        }
        box_info.add_contain(html_backup);

        box_info.add_contain(carrot.tool.box_comment(data_user));

        html+=carrot.user.menu();
        html+=box_info.html();

        carrot.show(html);
        carrot.user.check_event();
    }

    show_info_mini(id,lang){
        carrot.user.get_info(id,lang,carrot.user.info_mini_box);
    }

    info_mini_box(data){

        var id_img="";
        if(data.avatar!=null&&data.avatar!=""){
            id_img=carrot.tool.getIdFileFromURL(data.avatar);
            carrot.data.img(id_img,data.avatar,id_img);
        }

        delete(data.password);
        delete(data.avatar);
        var html='';
        html+='<img class="m-2 '+id_img+'" src="'+carrot.url()+'/images/avatar_default.png">';
        html+='<table class="table table-striped">';
        html+='<tbody>';
 
        $.each(data,function(key,val){
            html+='<tr>';
                html+='<th scope="row"><i class="fa-solid fa-lemon"></i> '+key+'</th>';
                html+='<td>'+val+'</td>';
            html+='</tr>';
        });
        
        html+='</tbody>';
        html+='</table>';

        html+='<button class="btn btn-sm btn-success m-2" onclick="carrot.user.show_info_by_id(\''+data.id_doc+'\',\''+data.lang+'\');swal.clickConfirm();"><i class="fa-solid fa-clipboard-user"></i> '+carrot.l("visit","Visit")+'</button>';
        html+='<button class="btn btn-sm m-2" onclick="swal.clickConfirm();"><i class="fa-solid fa-circle-xmark"></i> '+carrot.l("cancel","Cancel")+'</button>';
        
        Swal.fire({
            title: data.name,
            html:html,
            showCancelButton: false,
            showConfirmButton: false 
        });
        carrot.check_event();
    }

    show_user_info_login(){
        carrot.user.info(carrot.user.obj_login);
    }

    show_edit_user_info_login(){
        carrot.loading("Get data curent login user");
        carrot.get_doc("user-"+carrot.user.obj_login.lang,carrot.user.obj_login.id,carrot.user.edit);
    }

    check_user_login(username,password){
        Swal.showLoading();
        carrot.db.collection("user-"+carrot.lang).where("phone", "==", username).where("password", "==", password).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                Swal.close();
                querySnapshot.forEach((doc) => {
                    var data_login=doc.data();
                    data_login["id"]=doc.id;
                    carrot.user.set_user_login(data_login);
                });
            }else{
                carrot.msg("Đăng nhập thất bại!","error");
            }
        })
        .catch((error) => {
            console.log(error.message);
            carrot.msg("Đăng nhập thất bại!","error");
        });
    }

    get_user_login_id(){
        if(carrot.user.obj_login!=null){
            return carrot.user.obj_login["id"];
        }else{
            return "";
        }
    }

    get_user_login_role(){
        if(carrot.user.obj_login!=null){
            return carrot.user.obj_login.role;
        }else{
            return "";
        }
    }

    get_user_login(){
        if(carrot.user.obj_login!=null){
            var obj_user=new Object();
            obj_user.id=carrot.user.obj_login.id;
            obj_user.name=carrot.user.obj_login.name;
            obj_user.avatar=carrot.user.obj_login.avatar;
            obj_user.lang=carrot.user.obj_login.lang;
            return obj_user;
        }else{
            return null;
        }
    }

    get_user_cur_info_comment(){
        var data_info={
            name:carrot.user.obj_login.name,
            id:carrot.user.obj_login.id,
            avatar:carrot.user.obj_login.avatar,
            lang:carrot.user.obj_login.lang
        }
        return data_info;
    }

    download_vcard() {
        var filename=carrot.user.phone_book_info_cur.name+".vcf";
        var element = document.createElement('a');
        var text='';
        var arr_name=carrot.user.phone_book_info_cur.name.split(' ');
        var Prefix="";

        var img_url=carrot.user.phone_book_info_cur.avatar;
        if(img_url=="") img_url=carrot.url()+"/images/avatar_default.png";
        carrot.file.get_base64data_file(img_url).then((data_img)=>{
            carrot.tool.resizeImage(data_img, 300, 300).then((result) => {
                if(carrot.user.phone_book_info_cur.sex=="0") Prefix="Mr"; else Prefix="Ms";

                text+="BEGIN:VCARD\n";
                text+="VERSION:3.0";
                text+="FN;CHARSET=UTF-8:"+carrot.user.phone_book_info_cur.name+"\n";
                text+="PHOTO;ENCODING=b;TYPE=JPEG:"+result.replace('data:image/png;base64,','')+"\n";
        
                if(arr_name.length>1){
                    var lastname = arr_name[0];
                    var firstname = arr_name[1];
                    text+="N;CHARSET=UTF-8:"+firstname+"; "+lastname+"; ;"+Prefix+";"+firstname+"\n";
                    text+="NICKNAME;CHARSET=UTF-8:"+firstname+" "+lastname+"\n";
                }else{
                    text+="N;CHARSET=UTF-8:"+firstname+";;;"+Prefix+";\n";
                    text+="NICKNAME;CHARSET=UTF-8:"+carrot.user.phone_book_info_cur.name+"\n";  
                }
        
                if(carrot.user.phone_book_info_cur.email!=""){
                    text+="EMAIL;CHARSET=UTF-8;type=HOME,INTERNET:"+carrot.user.phone_book_info_cur.email+"\n";
                    text+="EMAIL;CHARSET=UTF-8;type=WORK,INTERNET:"+carrot.user.phone_book_info_cur.email+"\n";
                }
        
                if(carrot.user.phone_book_info_cur.phone!=""){
                    text+="TEL;TYPE=HOME,VOICE:"+carrot.user.phone_book_info_cur.phone+"\n";
                }
        
                if(carrot.user.phone_book_info_cur.address!=""){
                    var address=carrot.user.phone_book_info_cur.address;
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
            });
        });
    }  

    list_for_home(){
        var html='';
        if(carrot.user.objs!=null){
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="'+carrot.user.icon+' fs-6 me-2"></i> <l class="lang" key_lang="other_user">Other User</l>';
            html+='<span role="button" onclick="carrot.user.list()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span>';
            html+='</h4>';

            html+='<div id="other_user" class="row m-0">';
            $(carrot.random(carrot.user.objs)).each(function(index,user){
                if(index>=12) return false;
                html+=carrot.user.box_item(user).html();
            });
            html+='</div>';
        }
        return html;
    }

    change_type_user(id_product_service){
        carrot.user.obj_login.type=id_product_service;
        carrot.update_doc("user-"+carrot.user.obj_login.lang,carrot.user.obj_login.id_doc,carrot.user.obj_login);
    }

    delete_all_data(){
        carrot.data.clear("user");
        carrot.data.clear("user_info");
        carrot.user.objs=null;
        carrot.msg("Delete all data user success!","success");
    }
}