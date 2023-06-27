class Carrot_Btn{
    icon;
    onclick=null;
    constructor(){
        this.icon="fa-solid fa-box";
    }

    set_icon(s_icon_font){
        this.icon=s_icon_font;
    }

    set_onclick(s_func){
        this.onclick=s_func;
    }

    html(){
        var html='';
        html+='<div class="input-group-append">';
        html+='<span class="input-group-text btn-ms" role="button" onclick="'+this.onclick+'">';
        html+='<i class="'+this.icon+'"></i>';
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
        btn_download_ytb.set_icon("fa-brands fa-youtube");
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
        for(var i=0;i<this.list_class.length;i++) s_class+=' '+this.list_class[i]+' ';
        html+='<div class="form-group">';
        html+='<label class="form-label fw-bolder fs-8" for="'+this.name+'">';
        if(this.is_field_main) html+='<span class="text-info"><i class="fa-solid fa-key"></i></span> ';
        html+=this.label;
        html+='</label>';
        
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
            html+='<select id="'+this.name+'" type="select" class="cr_field form-select form-select-sm">';
            for(var i=0;i<this.options.length;i++){
                var item_option=this.options[i];
                if(item_option.key==this.value)
                    html+='<option value="'+item_option.key+'" selected>'+item_option.val+'</option>';
                else
                    html+='<option value="'+item_option.key+'">'+item_option.val+'</option>';
            }
            html+='</select>';
        }
        else if(this.type=='color'){
            html+='<div id="'+this.name+'" class="form-control cr_field" value_color="'+this.value+'" type="color"></div>';
        }
        else if(this.type=='slider'||this.type=='range'){
            html+='<input type="range" min="1" max="4" value="'+this.value+'" class="form-range cr_field" id="'+this.name+'"></input>'
        }
        else if(this.type=='icon'){
            html+='<div id="'+this.name+'" class="form-control cr_field" type="icon" value="'+this.value+'">';
            html+='<div id="'+this.name+'_show_val"  class="d-block text-info">'+this.value+'</div>';
            if(localStorage.getItem("obj_icon")){
                var obj_icon=JSON.parse(localStorage.getItem("obj_icon"));
                var list_obj=Array();
                var id_icon_cur=this.value;
                $.each(obj_icon,function(key,val){list_obj.push(JSON.parse(val));});
                list_obj=list_obj.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
                $(list_obj).each(function(index,icon_obj){
                    if(index>=24) return false;
                    if(icon_obj.icon!=""){
                        if(icon_obj.id==id_icon_cur)
                            html+='<img class="rounded float-left m-2 frm_icon_field btn-info" style="width:36px;" role="button" icon-id="'+icon_obj.id+'" src="'+icon_obj.icon+'"/>';
                        else
                            html+='<img class="rounded float-left m-2 frm_icon_field" style="width:36px;" role="button" icon-id="'+icon_obj.id+'" src="'+icon_obj.icon+'"/>';
                    }
                });
                html+='</div>';
            }
        }
        else if(this.type=='textarea'){
            html+='<textarea class="form-control cr_field" id="'+this.name+'" placeholder="'+this.placeholder+'" rows="3">'+this.value+'</textarea>';
        }
        else if(this.type=='id'){
            html+='<p id="'+this.name+'" type="id" class="cr_field" value="'+this.value+'">'+this.value+'</p>';
        }
        else{
            html+='<div class="input-group mb-3">';
            html+='<input type="'+this.type+'" value="'+this.value+'" class="form-control '+s_class+' cr_field form-control-sm" id="'+this.name+'" placeholder="'+this.placeholder+'">';
            html+='<div class="input-group-append">';
            html+='<span class="input-group-text btn-ms" role="button" onclick="paste_tag(\''+this.name+'\')"><i class="fa-solid fa-paste"></i></span>';
            html+='</div>';
            html+=this.htm_btn_extension();
            html+='</div>';
        }

        if(this.tip!=null) html+='<small id="'+this.name+'_tip" class="form-text text-muted">'+this.tip+'</small>';
        html+='</div>';
        return html;
    }
}

class Carrot_Form{
    title;
    name;
    list_field=Array();
    carrot;
    db_collection;
    db_document;
    type;
    is_field_db_doc=false;
    msg_done="Add or Edit success!";
    icon_font="fa-solid fa-window-restore";

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

    add_field(field){
        this.list_field.push(field);
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
        html+='<button id="btn_'+this.name+'_done" type="button" class="btn btn-primary"><i class="fa-sharp fa-solid fa-circle-check"></i> Done</button>';
        html+='<button id="btn_'+this.name+'_close" type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa-solid fa-circle-xmark"></i> Close</button>';
        html+='</div>';
        return html;
    }

    show(){
        this.carrot.box(this.html());
        
        var frm=this;
        var carrot=this.carrot;

        $(".cr_field").each(function(){
            var id_emp=$(this).attr("id");
            var type_emp=$(this).attr("type");
            if(type_emp=="color"){
                var value_emp=$("#"+id_emp).attr("value_color");
                $("#"+id_emp).colorpicker({color: value_emp,defaultPalette: "web",});
            }
            if(type_emp=="icon"){
                $(".frm_icon_field").click(function(){
                    var id_name_icon=$(this).attr("icon-id");
                    $(".frm_icon_field").removeClass("btn-info");
                    $("#"+id_emp).attr("value",id_name_icon);
                    $("#"+id_emp+"_show_val").html(id_name_icon);
                    $(this).addClass("btn-info");
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
                else if(type_emp=="color") val_emp=$("#"+id_emp).colorpicker("val");
                else if(type_emp=="icon") val_emp=$(this).attr("value");
                else if(type_emp=="id") val_emp=$(this).attr("value");
                else if(type_emp=="editor") val_emp=$(this).val();
                else val_emp=$(this).val();

                obj_frm[id_emp]=val_emp;
            });

            if(frm.is_field_db_doc)
                carrot.set_doc(frm.db_collection,frm.db_document,obj_frm);
            else
                carrot.set_doc(frm.db_collection,obj_frm[frm.db_document],obj_frm);

            carrot.msg(frm.msg_done);
            carrot.call_func_by_id_page(frm.db_collection,"reload")
            $('#box').modal('toggle'); 
        });

        $("#btn_"+this.name+"_close,.box_close").click(function(){
            $('#box').modal('toggle'); 
        });
    }
}