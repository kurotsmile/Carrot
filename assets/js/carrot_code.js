class Carrot_Code{
    carrot;
    constructor(cr){
        this.carrot=cr;
    }

    show_add_or_edit_code(data_code){
        var frm=new Carrot_Form('add_code',this.carrot);
        frm.set_title("Add code");
        frm.create_field("title","Title");
        frm.set_db("code","code-"+this.carrot.uniq());
        var code_code=frm.create_field("code","Code");
        code_code.set_type("code");
        code_code.set_tip("Hãy đóng góp những mã nguồn thật hay để chia sẻ những kiến thức bổ ích đến với các lập trình viên khác!")
        frm.act_done();
    }

    show_list_code(){
        this.carrot.get_list_doc("code",this.act_done_list);
    }

    act_done_list(codes,carrot){
        var html='';
        var list_code=carrot.convert_obj_to_list(codes);

        html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4"><button id="btn-add-code" class="btn btn-dark btn-sm"><i class="fa-solid fa-square-plus"></i> Add Code</button>  <a class="float-end" href=""><small class="fs-8">View All</small></a></h4>';
        html+='<div class="row m-0">';
        $(list_code).each(function(index,code){
            html+=carrot.code.box_item_code(code);
        });
        html+='</div>';
        carrot.show(html);
        carrot.code.check_event();
    }

    box_item_code(data_code,s_class='col-md-4 mb-3'){
        var html="<div class='box_app "+s_class+"' id=\""+data_code.id+"\" key_search=\""+data_code.title+"\">";
            html+='<div class="app-cover p-2 shadow-md bg-white">';
                html+='<div class="row">';
                    html+='<div role="button" class="code_icon img-cover pe-0 col-2 text-center d-fex"><i class="fa-brands fa-square-js fa-3x mt-2"></i></div>';
                    html+='<div class="det mt-2 col-10">';
                        html+="<h5 class='mb-0 fs-6'>"+data_code.title+"</h5>";
                        
                        html+='<ul class="row">';
                            html+='<li class="col-8 ratfac">';
                            html+="<span class='fs-8'>"+data_code.code_type+"</span><br/>";
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi text-warning fa-solid fa-circle"></i>';
                                html+='<i class="bi fa-solid fa-circle"></i>';
                            html+='</li>';

                        html+='</ul>';
                        html+=this.carrot.btn_dev("code",data_code.id);
    
                    html+="</div>";
                html+="</div>";
            html+="</div>";
        html+="</div>"; 
        return html;
    }

    check_event(){
        var carrot=this.carrot;
        $(".code_icon").click(function(){
            carrot.code.show_info_code("sdsd");
        });

        $("#btn-add-code").click(function(){
            carrot.code.show_add_or_edit_code(null);
        });

        this.carrot.check_event();
    }

    show_info_code(data_code){
        this.carrot.show("ádasd");
    }
}