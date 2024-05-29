class Carrot_Btn{
    icon;
    onclick=null;
    label=null;
    s_lang="";
    s_class="input-group-text btn-ms";
    constructor(){
        this.icon="fa-solid fa-box";
    }

    set_icon(s_icon_font){
        this.icon=s_icon_font;
    }

    set_onclick(s_func){
        this.onclick=s_func;
        return this;
    }

    set_act(s_act){
        this.set_onclick(s_act);
        return this;
    }

    set_label(s_label){
        this.label=s_label;
    }

    set_lang(lang_key){
        this.s_lang=' class="lang" lang_key="'+lang_key+'" ';
    }

    set_class(css){
        this.s_class=css;
    }

    html(){
        var html='';
        html+='<div class="input-group-append">';
            html+='<span class="'+this.s_class+'" role="button" onclick="'+this.onclick+'">';
            html+='<i class="'+this.icon+'"></i>';
            if(this.label!=null) html+=" <l "+this.s_lang+"> "+this.label+"</l>";
            html+='</span>';
        html+='</div>';
        return html;
    }
}

class Carrot_Field{
    name;
    label;
    type;
    placeholder;
    value;
    tip=null;
    list_class=Array();
    list_btn=Array();
    options=Array();
    is_field_main=false;
    is_dev=false;
    type_file='';
    emp_address=null;
    
    constructor(name,label,type='input',placeholder='Enter data here'){
        this.name=name;
        this.label=label;
        this.type=type;
        this.placeholder=placeholder;
    }

    set_type(type){
        this.type=type;
        return this;
    }

    set_label(label){
        this.label=label;
        return this;
    }

    set_title(label){
        return this.set_label(label);
    }

    add_class(s_class){
        this.list_class.push(s_class);
        return this;
    } 

    set_tip(tip){
        this.tip=tip;
        return this;
    }

    set_placeholder(p){
        this.placeholder=p;
        return this;
    }

    val(val){this.set_val(val);return this;}
    set_val(val){this.value=val;return this;}
    set_value(val){this.value=val;return this;}

    set_option(arr_options){
        this.options=arr_options;
        return this;
    }

    set_main(){
        this.is_field_main=true;
        return this;
    }

    set_dev(){
        this.is_dev=true;
        return this;
    }

    is_dev(){
        return this.set_dev();
    }

    set_type_file(s_type){
        this.type_file=s_type;
        return this;
    }

    add_option(key,val){
        var obj_option=new Object();
        obj_option["key"]=key;
        obj_option["val"]=val;
        this.options.push(obj_option);
        return this;
    }

    add_btn(btn){
        this.list_btn.push(btn);
        return this;
    }

    add_btn_download_ytb(){
        var btn_download_ytb=new Carrot_Btn();
        btn_download_ytb.set_icon("fa-solid fa-file-arrow-down");
        btn_download_ytb.set_onclick("goto_ytb_download_mp3($('#"+this.name+"').val())");
        this.add_btn(btn_download_ytb);
        return this;
    }

    add_btn_search_ytb(){
        var btn_search_ytb=new Carrot_Btn();
        btn_search_ytb.set_icon("fa-brands fa-youtube");
        btn_search_ytb.set_onclick("search_web($('#"+this.name+"').val(),'youtube')");
        this.add_btn(btn_search_ytb);
        return this;
    }

    add_btn_search_google(){
        var btn_search_gg=new Carrot_Btn();
        btn_search_gg.set_icon("fa-brands fa-google");
        btn_search_gg.set_onclick("search_web($('#"+this.name+"').val(),'google')");
        this.add_btn(btn_search_gg);
        return this;
    }

    add_btn_toLower(){
        var btn_toLower=new Carrot_Btn();
        btn_toLower.set_icon("fa-solid fa-text-height");
        btn_toLower.set_onclick("toLowerCase_tag('"+this.name+"')");
        this.add_btn(btn_toLower);
        return this;
    }

    htm_btn_extension(){
        var html='';
        for(var i=0;i<this.list_btn.length;i++){
            html+=this.list_btn[i].html();
        }
        return html;
    }

    html(){
        var html='';
        var s_class='';
        var s_class_dev='';
        for(var i=0;i<this.list_class.length;i++) s_class+=' '+this.list_class[i]+' ';
        if(this.is_dev) s_class_dev="dev";
        html+='<div class="form-group '+s_class_dev+'">';

        if(this.type!='line'&&this.type!='msg'){
            html+='<label class="form-label fw-bolder fs-8" for="'+this.name+'">';
            if(this.is_field_main) html+='<span class="text-info"><i class="fa-solid fa-key"></i></span> ';
            html+=this.label;
            html+='</label>';
        }

        if(this.tip!=null) html+='<small id="'+this.name+'_tip" class="form-text text-muted d-block text-break">'+this.tip+'</small>';
        
        if(this.type=="code"){
            html+='<div class="form-group">';
                html+='<label for="'+this.name+'">'+this.label+' Editor</label>';
                html+='<style>.editor {overflow-wrap: break-word;word-wrap: break-word;border-radius: 6px;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);font-family:  monospace;font-size: 14px;font-weight: 400;height: 340px;letter-spacing: normal;line-height: 20px;padding: 10px;tab-size: 4;}</style>';
                html+='<pre><code id="'+this.name+'" type="'+this.type+'" contenteditable="true" class="editor '+s_class+' hljs cr_field">'+this.value+'</code></pre>';
            html+='</div>';
        }
        else if(this.type=="editor"){
            html+='<div class="page-wrapper box-content">';
            html+='<link rel="stylesheet" href="assets/plugins/richtex/richtext.min.css">';
            html+='<script type="text/javascript" src="assets/plugins/richtex/jquery.richtext.js"></script>';
            html+='<textarea id="'+this.name+'" class="content cr_field" name="'+this.name+'" type="editor">'+this.value+'</textarea>';
            html+='<script>$(document).ready(function(){$(".content").richText();});</script>';
            html+='</div>';
        }
        else if(this.type=='select'){
            html+='<div class="input-group mb-3">';
            html+='<select id="'+this.name+'" type="select" class="cr_field form-select form-select-sm">';
            for(var i=0;i<this.options.length;i++){
                var item_option=this.options[i];
                if(item_option.key==this.value)
                    html+='<option value="'+item_option.key+'" selected>'+item_option.val+'</option>';
                else
                    html+='<option value="'+item_option.key+'">'+item_option.val+'</option>';
            }
            html+='</select>';
            html+=this.htm_btn_extension();
            html+='</div>';
        }
        else if(this.type=='color'){
            carrot.field_color=this.name;
            if(this.value.length>=9) this.value=this.value.substring(0,7);
            html+='<input type="color" class="form-control form-control-color cr_field m-0"  id="'+this.name+'" value="'+this.value+'" title="Choose your color"></input>';
        }
        else if(this.type=='slider'||this.type=='range'){
            html+='<input type="range" min="1" max="4" value="'+this.value+'" class="form-range cr_field" id="'+this.name+'"></input>'
        }
        else if(this.type=='icon'){
            carrot.field_icon=this.name;
            var url_icon=carrot.url()+'/images/64.png';
            html+='<div class="input-group mb-3" id="field_icon_'+this.name+'_preview">';
                html+='<img id="'+this.name+'" type="icon" onclick="carrot.js(\'ico\',\'ico\',\'carrot.ico.msg_list_select()\')" data-emp-id="'+this.name+'" data-category-key="all" value="'+this.value+'" class="btn btn-sm rounded btn-info cr_field m-1" style="width:64px;" role="button" src="'+url_icon+'"/>';
                html+='<span id="'+this.name+'_val">'+this.value+'</span>';
            html+='</div>';
        }
        else if(this.type=='textarea'){
            html+='<textarea class="form-control m-0 cr_field" id="'+this.name+'" placeholder="'+this.placeholder+'" rows="3">'+this.value+'</textarea>';
            if(this.htm_btn_extension()!=""){
                html+='<div class="input-group mb-3 mt-2">';
                html+=this.htm_btn_extension();
                html+='</div>';
            }
        }
        else if(this.type=='id'){
            html+='<p id="'+this.name+'" type="id" class="cr_field fs-9 text-info" value="'+this.value+'">'+this.value+'</p>';
        }
        else if(this.type=='file'){
            html+='<div class="input-group mb-3">';
            html+='<input type="file" accept="'+this.type_file+'" class="form-control m-0 '+s_class+' form-control-sm" id="'+this.name+'_file" for-emp="'+this.name+'" placeholder="'+this.placeholder+'">';
                html+='<div class="input-group-prepend dev">';
                    html+='<div role="button" emp_id="'+this.name+'" type_file="'+this.type_file+'" onclick="carrot.file.msg_list_select(this);return false;" class="input-group-text btn-info btn-sm"><i class="fa-regular fa-folder-open"></i>&nbsp</div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="card flex-md-row mb-4 box-shadow h-md-250 cr_field" type="'+this.type+'" id="'+this.name+'" value="'+this.value+'" >';
            html+=carrot.file.box_file_item(this.value,this.value,this.type_file);
            html+='</div>';

            html+='</div>';
        }else if(this.type=="avatar"){
            carrot.field_avatar=this.name+"_img";
            var url_img_avatar="";
            if(this.value==null||this.value==undefined||this.value=="null") url_img_avatar="images/avatar_default.png";
            else url_img_avatar=this.value;
            html+='<div class="input-group mb-3 text-center">';
                html+='<div class="card flex-md-row mb-4 box-shadow h-md-250">';
                html+='<div class="card-body d-flex flex-column align-items-start">';
                html+='<img id="'+this.name+'_img" class="rounded card-img-left flex-auto d-none d-md-block" src="'+url_img_avatar+'"/>';
                html+='<button class="btn btn-sm mt-2 cr_field" id="'+this.name+'" type="'+this.type+'" value="'+this.value+'" emp_img="'+this.name+'_img" onclick="carrot.js(\'avatar\',\'avatar\',\'carrot.avatar.msg_list_select()\');return false;"><i class="fa-solid fa-user-ninja"></i> Change Avatar</button>';
                html+='</div>';
                html+='</div>';
            html+='</div>';
        }else if(this.type=='line'){
            html+='<hr/>';
        }else if(this.type=="address"){
            var data_address=null;
            if(this.value==''||this.value==null){
                data_address={"lat":null,"lot":null,"name":""};
            }else{
                data_address=this.value;
            }
            html+='<div class="input-group mb-3">';
            html+='<input id="'+this.name+'" type="'+this.type+'" address-lat="'+data_address.lat+'" address-lon="'+data_address.lot+'" value="'+data_address.name+'" class="form-control m-0 '+s_class+' cr_field form-control-sm"  placeholder="'+this.placeholder+'">';
            html+='<div class="input-group-append">';
            html+='<span for="'+this.name+'" class="input-group-text btn-ms btn_check_in" role="button"><i class="fa-solid fa-location-crosshairs"></i></span>';
            html+='</div>';
            html+='<small id="'+this.name+'_show" class="form-text text-muted dev w-100"><i class="fa-solid fa-map-pin"></i> lat:'+data_address.lat+' <i class="fa-solid fa-map-pin"></i> lon:'+data_address.lot+'</small>';
            html+='</div>';
        }else if(this.type=="msg"){
            html+='<div id="'+this.name+'" class="'+s_class+'">'+this.value+'</div>';
        }else if(this.type=="user"){
            html+='<div id="'+this.name+'" type="'+this.type+'" class="input-group mb-3 cr_field user_data" value="'+encodeURI(JSON.stringify(this.value))+'">';
            html+=carrot.user.box_item_field_form_user(this.value);
            html+='</div>';
        }else if(this.type=='lang'){
            var frm=this;
            $(carrot.langs.list_lang).each(function(index,lang){
                frm.add_option(lang.key,lang.name);
            });

            html+='<select id="'+this.name+'" type="lang" class="cr_field form-select form-select-sm">';
            for(var i=0;i<this.options.length;i++){
                var item_option=this.options[i];
                if(item_option.key==this.value)
                    html+='<option value="'+item_option.key+'" selected>'+item_option.val+'</option>';
                else
                    html+='<option value="'+item_option.key+'">'+item_option.val+'</option>';
            }
            html+='</select>';
        }
        else{
            if(this.value==undefined) this.value='';
            html+='<div class="input-group mb-3">';
            html+='<input type="'+this.type+'" value="'+this.value+'" class="form-control m-0 '+s_class+' cr_field form-control-sm" id="'+this.name+'" placeholder="'+this.placeholder+'">';
            html+='<div class="input-group-append">';
            html+='<span class="input-group-text btn-ms" role="button" onclick="paste_tag(\'' + this.name + '\')"><i class="fa-solid fa-paste"></i></span>';
            html+='</div>';
            html+=this.htm_btn_extension();
            html+='</div>';
        }
        html+='</div>';
        return html;
    }

    check_event(){
        if(this.type=="icon"){
            if(this.value!="") carrot.js("ico","ico","carrot.ico.load_msg_field_preview()");
        }
    }

}

class Carrot_Form{
    title;
    name;
    list_field=Array();
    list_btn=Array();
    carrot;
    db_collection;
    db_document;
    type;

    is_field_db_doc=false;
    is_btn_done=true;

    msg_done="Add or Edit success!";
    icon_font="fa-solid fa-window-restore";
    s_act_func_done=null;

    constructor(name,carrot){
        this.name=name;
        this.carrot=carrot;
        this.type="add";
    }

    set_db(s_collection,s_document){
        this.set_collection(s_collection);
        this.set_document(s_document);
        return this;
    }

    set_collection(s_collection){
        this.db_collection=s_collection;
        return this;
    }

    set_document(s_document){
        this.db_document=s_document;
        return this;
    }

    set_title(title){
        this.title=title;
        return this;
    }

    set_type(s_type){
        this.type=s_type;
        return this;
    }

    create_field(name){
        var field=new Carrot_Field(name,name);
        this.add_field(field);
        return field;
    }

    create_field(name,label){
        var field=new Carrot_Field(name,label);
        this.add_field(field);
        return field;
    }

    create_btn(){
        var btn=new Carrot_Btn();
        btn.set_class("btn btn-primary");
        this.add_btn(btn);
        return btn;
    }

    add_field(field){
        this.list_field.push(field);
        return this;
    }

    add_btn(btn){
        this.list_btn.push(btn);
        return this;
    }

    set_msg(s_msg){
        this.msg_done=s_msg;
        return this;
    }

    set_msg_done(s_msg){
        this.msg_done=s_msg;
        return this;
    }

    set_act_done(s_func_done){
        this.s_act_func_done=s_func_done;
        return this;
    }

    set_icon(s_icon){
        this.icon_font=s_icon;
        return this;
    }

    set_icon_font(s_icon){
        this.icon_font=s_icon;
        return this;
    }

    on_db_doc(){
        this.is_field_db_doc=true;
        return this;
    }

    off_btn_done(){
        this.is_btn_done=false;
    }
    
    html(){
        var html='';
        if(this.title=="") this.title=this.name;

        html+='<div class="modal-header">';
        html+='<h5 class="modal-title"><i class="'+this.icon_font+'"></i> '+this.title+'</h5>';
        html+='<button type="button" class="close box_close" data-dismiss="modal" aria-label="Close"><i class="fa-solid fa-circle-xmark"></i></button>';
        html+='</div>';

        html+='<form id="'+this.name+'" class="modal-body">';
        for(var i=0;i<this.list_field.length;i++){
            if(this.list_field[i].name==this.db_document) this.list_field[i].set_main();
            html+=this.list_field[i].html();
        }
        html+='</form>';

        html+='<div class="modal-footer">';
            for(var i=0;i<this.list_btn.length;i++) html+=this.list_btn[i].html();
            if(this.is_btn_done) html+='<button id="btn_'+this.name+'_done" type="button" class="btn btn-primary"><i class="fa-sharp fa-solid fa-circle-check"></i> Done</button>';
            html+='<button id="btn_'+this.name+'_close" type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa-solid fa-circle-xmark"></i> Close</button>';
        html+='</div>';
        return html;
    }

    check_event(){
        for(var i=0;i<this.list_field.length;i++){
            this.list_field[i].check_event();
        }
    }

    show(){
        var frm=this;
        var carrot=this.carrot;

        this.carrot.box(this.html());
        this.check_event();

        $(".cr_field").each(function(){
            var id_emp=$(this).attr("id");
            var type_emp=$(this).attr("type");

            if(type_emp=="file"){
                $("#"+id_emp+"_file").on("change",function(evt){
                    evt.stopPropagation();
                    evt.preventDefault();
                    var file = evt.target.files[0];
                    var r=carrot.storage.ref();
                    var metadata = {'contentType': file.type};
                    var type_file=file.type
                    var file_name=carrot.create_id()+"_"+file.name;
                    var type_file_emp=$("#"+id_emp+"_file").attr("accept");
                    r.child(frm.db_collection+'/'+type_file+'/'+file_name).put(file, metadata).then(function (snapshot) {
                        var file_storage=snapshot.metadata;
                        var data_file=new Object();
                        var path_file=file_storage.fullPath;
                        data_file["fullPath"]=file_storage.fullPath;
                        data_file["generation"]=file_storage.generation;
                        data_file["name"]=file_storage.name;
                        data_file["size"]=file_storage.size;
                        data_file["timeCreated"]=file_storage.timeCreated;
                        data_file["type"]=type_file;
                        data_file["type_emp"]=type_file_emp;
                        $("#"+id_emp).html('<i class="fa-solid fa-spinner fa-spin"></i>');
                        snapshot.ref.getDownloadURL().then(function (url) {
                            data_file["url"]=url;
                            $("#"+id_emp).attr("value",url).html(carrot.file.box_file_item(url,path_file,type_file_emp));
                            carrot.set_doc("file",file_storage.generation,data_file);
                        });
                    }).catch(function (error) {
                        carrot.log(error);
                    });
                });
            }

            if(type_emp=="address"){
                $(".btn_check_in").click(function(){
                    carrot["emp_address"]=$(this);
                    carrot.display_name_Location=frm.display_name_Location;
                    frm.getLocation_for_address();
                    Swal.showLoading();
                });
            }
        });

        $("#btn_"+this.name+"_done").click(function(){
            var obj_frm=Object();
            $(".cr_field").each(function(){
                var id_emp=$(this).attr("id");
                var type_emp=$(this).attr("type");
                var val_emp='';

                if(type_emp=="code") val_emp=$(this).html();
                else if(type_emp=="color") val_emp=$(this).val();
                else if(type_emp=="icon") val_emp=$(this).attr("value");
                else if(type_emp=="id") val_emp=$(this).attr("value");
                else if(type_emp=="editor") val_emp=$(this).val();
                else if(type_emp=="file") val_emp=$(this).attr("value");
                else if(type_emp=="address"){
                    var lot_address=$("#"+id_emp).attr("address-lon");
                    var lat_address=$("#"+id_emp).attr("address-lat");
                    var name_address=$(this).val();
                    var data_address=new Object();
                    data_address["name"]=name_address;
                    data_address["lot"]=lot_address;
                    data_address["lat"]=lat_address;
                    val_emp=data_address;
                }
                else if(type_emp=='user'){
                    var obj_user=$(this).attr("value");
                    obj_user=decodeURI(obj_user);
                    obj_user=JSON.parse(obj_user);
                    val_emp=obj_user;
                }
                else if(type_emp=="lang") val_emp=$(this).val();
                else if(type_emp=="avatar") val_emp=$(this).attr("value");
                else val_emp=$(this).val();

                obj_frm[id_emp]=val_emp;
            });

            if(frm.type=="add"){
                if(frm.is_field_db_doc)
                    carrot.set_doc(frm.db_collection,frm.db_document,obj_frm);
                else
                    carrot.set_doc(frm.db_collection,obj_frm[frm.db_document],obj_frm);
            }else{
                if(frm.is_field_db_doc)
                    carrot.update_doc(frm.db_collection,frm.db_document,obj_frm);
                else
                    carrot.update_doc(frm.db_collection,obj_frm[frm.db_document],obj_frm);
            }

            carrot.msg(frm.msg_done);
            if(frm.s_act_func_done!=null) eval(frm.s_act_func_done);
            $('#box').modal('hide');
        });

        $("#btn_"+this.name+"_close,.box_close").click(function(){
            $('#box').modal('hide'); 
        });
        carrot.check_mode_site();
    }

    getLocation_for_address(){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
          carrot.msg("Geolocation is not supported by this browser.","error");
        }
    }
      
    showPosition(position) {
        var emp_address=$(carrot.emp_address).attr("for");
        var emp_inp=$("#"+emp_address);
        $("#"+emp_address+"_show").html('<i class="fa-solid fa-map-pin"></i> '+position.coords.latitude+' , <i class="fa-solid fa-map-pin"></i> '+position.coords.longitude);
        emp_inp.attr("address-lat",position.coords.latitude);
        emp_inp.attr("address-lon",position.coords.longitude);
        carrot.msg("Geolocation success!"); 
        carrot.display_name_Location(position.coords.latitude,position.coords.longitude);
    }

    display_name_Location(latitude,longitude){
        var request = new XMLHttpRequest();
        var method = 'GET';
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&key='+carrot.config.key_api_google_location;
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
            if (request.readyState == 4 && request.status == 200) {
                var data = JSON.parse(request.responseText);
                var address = data.results[0];
                if(address!=null){
                    var emp_address = $(carrot.emp_address).attr("for");
                    $("#"+emp_address).val(address.formatted_address);
                }else{
                    carrot.msg("Unable to locate!","error");
                }
            }
        };
        request.send();
    };
}