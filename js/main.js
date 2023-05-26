
class Carrot_form{
    list_field;
    list_btn;
    event_done;
    constructor(name) {
        this.name=name;
        this.list_field=Array();
        this.list_btn=Array();
        this.event_done=null;
    }

    add_field(name_fied){
        this.list_field.push(name_fied);
    }

    add_btn(name_btn){
        this.list_btn.push(name_btn);
    }

    show() {
        var html="<div class='frm'>";
        for (let i = 0; i < this.list_field.length; i++) {
            html +="<div class='frm-line'>";
            html +="<label for='"+this.list_field[i]+"'>"+this.list_field[i]+"</label>";
            html +="<input ";
            html +="id=\""+this.list_field[i] + "\" ";
            html +="value=\""+this.list_field[i] + "\" ";
            html +=" />";
            html +="</div>";
        }

        for (let i = 0; i < this.list_btn.length; i++) {
            html +="<div class='frm-all-btn'>";
            html +="<input type='button' ";
            html +="id=\""+this.list_btn[i] + "\" ";
            html +="value=\""+this.list_btn[i] + "\" ";
            html +="</div>";
        }

        html+='<script>$("#btn_add").click(function(){add_user();});</script>';
        html+="</div>";
        return html;
    }

    set_act_done(event){
        this.event_done=event;
    }
}

function show_all_app(){
    const cr_form=new Carrot_form("add_app");
    cr_form.add_field("name");
    cr_form.add_field("icon");
    cr_form.add_field("desc");
    cr_form.add_btn("btn_add");
    cr_form.set_act_done("act_done_add_app()");
    $("#contain_body").html(cr_form.show());
}

function act_done_add_app(){
    alert(app);
    alert("Done");
}

function show_add_lang(){
    close_all_box();
    $("#box_add_lang").show();
}

function show_add_link_store(){
    close_all_box();
    $("#box_link_store").show();
}

function close_all_box(){
    $(".box_add").hide();
    $("#all_app").show();
}