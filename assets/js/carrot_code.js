class Carrot_Code{
    carrot;
    obj_codes;

    constructor(cr){
        this.carrot=cr;
        this.load_obj_code();
    }

    load_obj_code(){
        if (localStorage.getItem("obj_codes") != null) this.obj_codes=JSON.parse(localStorage.getItem("obj_codes"));
    }

    save_obj_code(){
        localStorage.setItem("obj_codes", JSON.stringify(this.obj_codes));
    }

    delete_obj_code(){
        localStorage.removeItem("obj_codes");
        this.obj_codes=null;
    }

    show_add_new(){
        var new_data=new Object();
        new_data["id"]="code-"+this.carrot.uniq();
        new_data["title"]="";
        new_data["code"]="";
        this.show_add_or_edit_code(new_data);
    }

    show_edit(data,carrot){
        carrot.code.show_add_or_edit_code(data);
    }

    show_add_or_edit_code(data_code){
        var carrot=this.carrot;
        var frm=new Carrot_Form('add_code',carrot);
        frm.set_title("Add code");

        var id_code=frm.create_field("id","ID");
        id_code.set_val(data_code.id);
        id_code.set_type("id");

        var title_code=frm.create_field("title","Title");
        title_code.set_val(data_code.title);
        frm.set_db("code",data_code.id);
        var code_code=frm.create_field("code","Code");
        code_code.set_type("code");
        code_code.set_val(data_code.code);
        code_code.set_tip("Hãy đóng góp những mã nguồn thật hay để chia sẻ những kiến thức bổ ích đến với các lập trình viên khác!")
        frm.show();
    }

    show_list_code(){
        this.carrot.change_title_page("Code","?p=code","Code");
        if(this.carrot.get_ver_cur("code")){
            if(this.obj_codes==null)
                this.carrot.get_list_doc("code",this.act_get_list_code_from_sever);
             else
                this.show_list_from_data();
        }else{
            this.carrot.get_list_doc("code",this.act_get_list_code_from_sever);
        }

    }

    act_get_list_code_from_sever(codes,carrot){
        carrot.code.obj_codes=codes;
        carrot.code.save_obj_code();
        carrot.update_new_ver_cur("code",true);
        carrot.code.show_list_from_data();
    }

    show_list_from_data(){
        var carrot=this.carrot;
        var html='';
        var list_code=carrot.convert_obj_to_list(carrot.code.obj_codes);

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
                    html+='<div role="button" class="code_icon img-cover pe-0 col-2 text-center d-fex db_info" db_collection="code" db_document="'+data_code.id+'"><i class="fa-brands fa-square-js fa-3x mt-2"></i></div>';
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
            var db_collection=$(this).attr("db_collection");
            var db_document=$(this).attr("db_document");
            carrot.get_doc(db_collection,db_document,carrot.code.show_info_code);
        });

        $("#btn-add-code").click(function(){
            carrot.code.show_add_new();
        });

        this.carrot.check_event();
    }

    show_info_code(data,carrot){
        carrot.change_title_page(data.title,"?p=code&id="+data.id);
        var html='<div class="section-container p-2 p-xl-4">';
        html+='<div class="row">';
            html+='<div class="col-md-8 ps-4 ps-lg-3">';
                html+='<div class="row bg-white shadow-sm">';
                    html+='<div class="col-md-4 p-3 text-center">';
                        html+='<br/><i class="fa-sharp fa-solid fa-code fa-5x"></i>';
                    html+='</div>';
                    html+='<div class="col-md-8 p-2">';
                        html+='<h4 class="fw-semi fs-4 mb-3">'+data.title+'</h4>';
                        html+=carrot.btn_dev("code",data.id);
                        
                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>3.9 <i class="fa-sharp fa-solid fa-eye"></i></b>';
                                html+='<p>11.6k <l class="lang"  key_lang="count_view">Reviews</l></p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b>5M+ <i class="fa-solid fa-download"></i></b>';
                                html+='<p class="lang" key_lang="count_download">Downloads</p>';
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
                    html+='<h4 class="fw-semi fs-5 lang" key_lang="code">Code</h4>';
                    html+='<pre><code class="'+data.code_type+'">'+data.code+'</code></pre>';
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
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_songs">Related Code</h4>';
            var list_code_other= carrot.convert_obj_to_list(carrot.code.obj_codes).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
            for(var i=0;i<list_code_other.length;i++){
                var codes=list_code_other[i];
                if(data.id!=codes.id) html+=carrot.code.box_item_code(codes,'col-md-12 mb-3');
            };
            html+='</div>';
    
        html+="</div>";
        html+="</div>";
        carrot.show(html);
        carrot.code.check_event();
        hljs.highlightAll();
    }
}