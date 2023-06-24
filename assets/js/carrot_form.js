class Carrot_Field{
    name;
    label;
    type;
    placeholder;
    value;
    tip=null;
    list_class=Array();
    options=Array();

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

    add_option(key,val){
        var obj_option=new Object();
        obj_option["key"]=key;
        obj_option["val"]=val;
        this.options.push(obj_option);
        return this;
    }

    html(){
        var html='';
        var s_class='';
        for(var i=0;i<this.list_class.length;i++) s_class+=' '+this.list_class[i]+' ';
        html+='<div class="form-group">';
        html+='<label class="form-label fw-bolder fs-8" for="'+this.name+'">'+this.label+'</label>';
        if(this.type=="code"){
            var s_lang_type='javascript';
            html+='<div class="form-group">';
                html+='<label for="'+this.name+'_type">'+this.label+' Type Language</label>';
                html+='<select id="'+this.name+'_type" type="select" class="form-control '+s_class+' cr_field cr_field_code_type">';
                var lis_lang_code=hljs.listLanguages();
                for(var i=0;i<lis_lang_code.length;i++){
                    if(s_lang_type==lis_lang_code[i])
                        html+='<option value="'+lis_lang_code[i]+'" selected="selected">'+lis_lang_code[i]+'</option>';
                    else
                        html+='<option value="'+lis_lang_code[i]+'">'+lis_lang_code[i]+'</option>';
                } 
                html+='</select>';
            html+='</div>';

            html+='<div class="form-group">';
                html+='<label for="'+this.name+'">'+this.label+' Editor</label>';
                html+='<style>.editor {overflow-wrap: break-word;word-wrap: break-word;border-radius: 6px;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);font-family:  monospace;font-size: 14px;font-weight: 400;height: 340px;letter-spacing: normal;line-height: 20px;padding: 10px;tab-size: 4;}</style>';
                html+='<pre><code id="'+this.name+'" type="'+this.type+'" contenteditable="true" class="editor '+s_class+' hljs cr_field">'+this.value+'</code></pre>';
            html+='</div>';

            html+='<div class="form-group">';
                html+='<label for="'+this.name+'_theme">'+this.label+' Theme</label>';
                html+='<select id="'+this.name+'_theme" type="select" class="form-control '+s_class+' cr_field cr_field_code_theme">';
                    html+='<option value="default.min.css">Default</option>';
                    html+='<option value="agate.min.css">Agate</option>';
                    html+='<option value="androidstudio.min.css">Androidstudio</option>';
                    html+='<option value="arta.min.css">Arta</option>';
                    html+='<option value="ascetic.min.css">Ascetic</option>';
                    html+='<option value="dark.min.css">Dark</option>';
                    html+='<option value="devibeans.min.css">Devibeans</option>';
                    html+='<option value="docco.min.css">Docco</option>';
                    html+='<option value="far.min.css">Far</option>';
                    html+='<option value="felipec.min.css">Felipec</option>';
                    html+='<option value="foundation.min.css">Foundation</option>';
                html+='</select>';
            html+='</div>';
        }
        else if(this.type=="editor"){
            html+='<div class="page-wrapper box-content">';
            html+='<link rel="stylesheet" href="assets/plugins/richtex/richtext.min.css">';
            html+='<script type="text/javascript" src="assets/plugins/richtex/jquery.richtext.js"></script>';
            html+='<textarea class="content" name="'+this.name+'">'+this.value+'</textarea>';
            html+='<script>$(document).ready(function(){$(".content").richText();});</script>';
            html+='</div>';
        }
        else if(this.type=='select'){
            html+='<select id="'+this.name+'" type="select" class="cr_field form-select">';
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
            var obj_icon=JSON.parse(localStorage.getItem("obj_icon"));
            var list_obj=Array();
            var id_icon_cur=this.value;
            $.each(obj_icon,function(key,val){list_obj.push(JSON.parse(val));});
            $(list_obj).each(function(index,icon_obj){
                if(icon_obj.icon!=""){
                    if(icon_obj.id==id_icon_cur)
                        html+='<img class="rounded float-left m-2 frm_icon_field btn-info" style="width:48px;" role="button" icon-id="'+icon_obj.id+'" src="'+icon_obj.icon+'"/>';
                    else
                        html+='<img class="rounded float-left m-2 frm_icon_field" style="width:48px;" role="button" icon-id="'+icon_obj.id+'" src="'+icon_obj.icon+'"/>';
                }
            });
            html+='</div>';
        }
        else if(this.type=='textarea'){
            html+='<textarea class="form-control cr_field" id="'+this.name+'" placeholder="'+this.placeholder+'" rows="3">'+this.value+'</textarea>';
        }
        else if(this.type=='id'){
            html+='<p id="'+this.name+'" type="id" class="cr_field" value="'+this.value+'">'+this.value+'</p>';
        }
        else{
            html+='<input type="'+this.type+'" value="'+this.value+'" class="form-control '+s_class+' cr_field" id="'+this.name+'" placeholder="'+this.placeholder+'">';
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
    is_editor_code=false;
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

    set_icon_font(s_icon){
        this.icon_font=s_icon;
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
            if(this.list_field[i].type=="code") this.is_editor_code=true;
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

        if(this.is_editor_code){

            function sel_code_type(emp){
                var type_code=$(emp).val();
                var lis_lang_code=hljs.listLanguages();
                carrot.log("Select Code type:"+type_code);
                $(".editor").removeClass("language-undefined");
                for(var i=0;i<lis_lang_code.length;i++) $(".editor").removeClass("language-"+lis_lang_code[i]);
                $(".editor").addClass("language-"+type_code);
                /*
                var txt=$(".editor").html();
                $(".editor").html(txt.replaceAll("<br>", "\n"));
                hljs.highlightAll();
                */
            }
    
            $(".cr_field_code_type").change(function(){
                sel_code_type(this);
            });
    
            $(document).ready(function() {
                sel_code_type($(".cr_field_code_type"));
            });
        
            $(".cr_field_code_theme").change(function(){
                var val_theme=$(this).val();
                $("#code_theme").attr("href","assets/plugins/highlight/styles/"+val_theme);
            });
        }

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
                else val_emp=$(this).val();

                obj_frm[id_emp]=val_emp;
            });

            carrot.set_doc(frm.db_collection,obj_frm[frm.db_document],obj_frm);
            carrot.msg(frm.msg_done);
            $('#box').modal('toggle'); 
        });

        $("#btn_"+this.name+"_close,.box_close").click(function(){
            $('#box').modal('toggle'); 
        });
    }
}