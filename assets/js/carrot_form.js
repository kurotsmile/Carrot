class Carrot_Field{
    name;
    label;
    type;
    placeholder;
    value;
    tip=null;
    list_class=Array();

    constructor(name,label,type='input',placeholder='Enter data here'){
        this.name=name;
        this.label=label;
        this.type=type;
        this.placeholder=placeholder;
    }

    set_type(type){
        this.type=type;
    }

    set_label(label){
        this.label=label;
    }

    add_class(s_class){
        this.list_class.push(s_class);
    }

    set_tip(tip){
        this.tip=tip;
    }

    val(val){this.set_val(val)}
    set_val(val){this.value=val;}

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
                html+='<style>.editor {border-radius: 6px;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);font-family:  monospace;font-size: 14px;font-weight: 400;height: 340px;letter-spacing: normal;line-height: 20px;padding: 10px;tab-size: 4;}</style>';
                html+='<div id="'+this.name+'" type="'+this.type+'" class="editor '+s_class+' cr_field"></div>';
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
            html+='<textarea class="content" name="'+this.name+'"></textarea>';
            html+='<script>$(document).ready(function(){$(".content").richText();});</script>';
            html+='</div>';
        }
        else{
            html+='<input type="'+this.type+'" class="form-control '+s_class+' cr_field" id="'+this.name+'" placeholder="'+this.placeholder+'">';
        }

        if(this.tip!=null) html+='<small id="emailHelp" class="form-text text-muted">'+this.tip+'</small>';
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

    is_editor_code=false;

    constructor(name,carrot){
        this.name=name;
        this.carrot=carrot;
    }

    set_db(s_collection,s_document){
        this.set_collection(s_collection);
        this.set_document(s_document);
    }

    set_collection(s_collection){
        this.db_collection=s_collection;
    }

    set_document(s_document){
        this.db_document=s_document;
    }

    set_title(title){
        this.title=title;
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
    }
    
    html(){
        var html='';
        html+='<div class="col-md-12">';
        html+='<form id="'+this.name+'" class="shadow-md p-4 rounded bg-white">';
        if(this.title=="") this.title=this.name;
        html+='<h4 class="fs-6 fw-bolder mb-3">'+this.title+'</h4>';
        for(var i=0;i<this.list_field.length;i++){
            if(this.list_field[i].type=="code") this.is_editor_code=true;
            html+=this.list_field[i].html();
        }

        html+='<div class="form-group">';
            html+='<div id="btn_'+this.name+'_done" class="btn btn-primary"><i class="fa-sharp fa-solid fa-circle-check"></i> Done</div>';
        html+='</div>';

        html+='</form>';
        html+='</div>';
        return html;
    }

    act_done(){
        this.carrot.body.html(this.html());
        
        var frm=this;
        var carrot=this.carrot;

        if(this.is_editor_code){
            var code_editor=this.carrot.create_editor_code();

            function sel_code_type(emp){
                var type_code=$(emp).val();
                var lis_lang_code=hljs.listLanguages();
                carrot.log("Select Code type:"+type_code);
                $(".editor").removeClass("language-undefined");
                for(var i=0;i<lis_lang_code.length;i++) $(".editor").removeClass("language-"+lis_lang_code[i]);
                $(".editor").addClass("language-"+type_code);
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

        $("#btn_"+this.name+"_done").click(function(){
            var obj_frm=Object();
            $(".cr_field").each(function(){
                var id_emp=$(this).attr("id");
                var type_emp=$(this).attr("type");
                var val_emp='';
                if(type_emp=="code") val_emp=code_editor.toString();
                else val_emp=$(this).val();
                obj_frm[id_emp]=val_emp;
            });

            carrot.set_doc(frm.db_collection,frm.db_document,obj_frm);
            $.MessageBox("Add code success!");
        });
    }
}