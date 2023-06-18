class Carrot_Code{
    carrot;
    constructor(cr){
        this.carrot=cr;
    }

    show_add_or_edit_code(data_code){
        var s_title_box='';
        var s_msg_done='';
        if(data_code==null){
            s_title_box="<b>Add Code</b>";
            s_msg_done="Add Code Successfully!";
        }
        else{
            s_title_box="<b>Update Code</b>";
            s_msg_done="Update Code Successfully!";
        }

        var obj_code = Object();
        obj_code["tip_icon"] = { type: "caption", message: "Thông tin cơ bản" };
        if(data_code==null){
            data_code=Object();
            data_code["id"]=this.carrot.uniq();
            data_code["avatar"]='';
            data_code["title"]='';
            data_code["describe_en"]='';
            data_code["code"]='';
            data_code["type"]='javascript';
        }

        var arr_type=Array();
        arr_type.push("javascript");
        arr_type.push("html");
        arr_type.push("c#");
        arr_type.push("css");
        arr_type.push("xml");

        obj_code["id"]={'type':'caption',message:"ID:"+data_code["id"]};
        obj_code["title"]={'type':'input','defaultValue':data_code["title"], 'label':'Title'};
        obj_code["describe_en"]={'type':'input','defaultValue':data_code["describe_en"], 'label':'Describe'};
        obj_code["code"]={'type':'textarea','defaultValue':data_code["code"], 'label':'Code','rows':15};
        obj_code["type"]={'type':'select','label':'Genre','options':arr_type,defaultValue:data_code["type"],};

        customer_field_for_db(obj_code,'code','title','',s_msg_done);
    
        $.MessageBox({
            message: s_title_box,
            input: obj_code,
            top: "auto",
            buttonFail: "Cancel"
        }).done(this.carrot.act_done_add_or_edit);
    }

    show_list_code(){
        this.carrot.get_list_doc("code",this.act_done_list);
    }

    act_done_list(codes,carrot){
        var html='';
        var list_code=carrot.convert_obj_to_list(codes);
        $(list_code).each(function(index,code){
            html+=carrot.code.box_item_code(code);
        });
        carrot.show(html);
        carrot.code.check_event();
    }

    box_item_code(data_code,s_class='col-md-4 mb-3'){
        var html="<div class='box_app "+s_class+"' id=\""+data_code.id+"\"  key_search=\""+data_code.title+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                    html+='<div role="button" class="code_icon img-cover pe-0 col-2 text-center d-fex"><i class="fa-brands fa-square-js fa-3x mt-2"></i></div>';
                    html+='<div class="det mt-2 col-10">';
                        html+="<h5 class='mb-0 fs-6'>"+data_code.title+"</h5>";
                        
                        html+='<ul class="row">';
                            html+='<li class="col-8 ratfac">';
                            html+="<span class='fs-8'>"+data_code.type+"</span><br/>";
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi fa-solid fa-circle"></i>';
                            html+='</li>';

                        html+='</ul>';
        
                        html+="<div class='row' style='margin-top:6 px;'>";
                        html+="<div class='col-6'><div class='btn dev btn_app_edit btn-warning btn-sm' app_id='"+data_code.id+"'><i class=\"fa-solid fa-pen-to-square\"></i> Edit</div></div>";
                        html+="<div class='col-6'><div class='btn dev btn_app_del btn-danger btn-sm' app_id='"+data_code.id+"'><i class=\"fa-solid fa-trash\"></i> Delete</div></div>";
                        html+="</div>";
    
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        html+="</div>"; 
        return html;
    }

    check_event(){
        var carrot=this.carrot;
        $(".code_icon").click(function(){
            alert("sdsd");
            carrot.code.show_info_code(null);
        });
    }

    show_info_code(data_code){
        this.carrot.show("ádasd");
    }
}