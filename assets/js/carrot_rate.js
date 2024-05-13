class Carrot_Rate{
    carrot;
    data_obj=null;
    data_rank_obj=null;

    constructor(carrot){
        this.carrot=carrot;
    }

    box_comment(data){
        this.data_obj=data;
        var carrot=this.carrot;
        var html='';
        html += '<div id="all_comment" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
        html += '<h4 class="fw-semi fs-5 lang" key_lang="review">Review</h4>';

        html += '<div id="user_comment" class="row m-0 reviewrow p-3 px-0 border-bottom">';
        html += '<div class="col-md-2 align-items-center col-2 rcolm fs-8">';
            var data_user_login = carrot.user.obj_login;
            var name_user_rate='Incognito';
            var url_avatar_user_rate='images/avatar_default.png';
            if (data_user_login != null) {
                if (data_user_login.avatar != null) url_avatar_user_rate=data_user_login.avatar;
                name_user_rate=data_user_login.name;
            }
            html += '<img role="button" emp_img="avatar_user_rate" id="avatar_user_rate" onclick="carrot.avatar.msg_list_select(this);return false" src="'+url_avatar_user_rate+'"/>';
            html += '<span class="d-block bg-secondary text-white text-center pt-1 pb-1" id="name_user_rate">'+name_user_rate+'</span>';
        html += '</div>';

        html += '<div class="col-md-10 align-items-center col-10 rcolm">';
        html += '<div class="form-group">';
        html += '<label for="rate_star">Rate Star</label>';
        html += '</div>';

        html += '<div id="rate_star" value="0" class="form-group mt-3 mb-3">';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="1" data-toggle="tooltip" title="'+carrot.l("rate_star_1", "Badvery bad")+'" value_txt="'+carrot.l("rate_star_1", "Badvery bad")+'" id="rate_star_1"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="2" data-toggle="tooltip" title="'+carrot.l("rate_star_2", "Bad")+'" value_txt="'+carrot.l("rate_star_2", "Bad")+'" id="rate_star_2"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="3" data-toggle="tooltip" title="'+carrot.l("rate_star_3", "Normal")+'" value_txt="'+carrot.l("rate_star_3", "Normal")+'" id="rate_star_3"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="4" data-toggle="tooltip" title="'+carrot.l("rate_star_4", "Good")+'" value_txt="'+carrot.l("rate_star_4", "Good")+'" id="rate_star_4"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="5" data-toggle="tooltip" title="'+carrot.l("rate_star_5", "Very good")+'" value_txt="'+carrot.l("rate_star_5", "Very good")+'" id="rate_star_5"></i>';
        html += '</div>';

        html += '<div class="form-group">';
        html += '<label for="rate_comment">You Comment</label>';
        html += '<textarea class="form-control" id="rate_comment" rows="3"></textarea>';
        html += '</div>';
        html += '<button class="btn btn-success" id="btn_done_comment"><i class="fa-solid fa-square-check"></i> <l class="lang" key_lang="done">Done</l></button>';
        html += '</div>';

        html += '</div>';

        if (data.rates != null) {
            var list_rate = data.rates;
            $(list_rate).each(function (index, comment) {
                comment["index"] = index;
                html += carrot.rate.box_comment_item(comment);
            });
        } else {
            data.rates = Array();
        }

        html += '</div>';
        return html;
    }

    box_rank(data){
        if (data.rank!=null) {
            var html='';
            html+='<div id="all_comment" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html+='<h4 class="fw-semi fs-5"><i class="fa-solid fa-ranking-star"></i> <l class="lang" key_lang="player_rankings">Player rankings</l></h4>';
            html+='<table class="table table-responsive table-striped table-hover">';
            html+='<tbody>';
                var list_rank= data.rank;
                $(list_rank).each(function (index,rank) {
                    rank["index"] = index;
                    html+=carrot.rate.box_rank_item(rank);
                });
            html+='</tbody>';
            html+='</table>';
            html+='</div>';
            return html;
        } else {
            data.rank = Array();
            return "";
        }
    }

    box_report(data){
        if (data.reports!=null) {
            var html='';
            carrot.rate.data_obj=data;
            html+='<div id="all_report" class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html+='<h4 class="fw-semi fs-5">';
                html+='<i class="fa-solid fa-bug"></i> <l class="lang" key_lang="report">Report</l>';
                html+='<span role="button" onclick="carrot.rate.delete_all_report();" class="dev btn btn-danger float-end"><i class="fa-solid fa-trash-can"></i> Delete All</span>';
            html+='</h4>';
            html+='<table class="table table-responsive table-striped table-hover">';
            html+='<tbody>';
                var list_report= data.reports;
                $(list_report).each(function (index,report) {
                    report["index"] = index;
                    html+=carrot.rate.box_report_item(report);
                });
            html+='</tbody>';
            html+='</table>';
            html+='</div>';
            return html;
        } else {
            data.reports = Array();
            return "";
        }
    }

    delete_all_report(){
        var id_obj_report=carrot.rate.data_obj.id;
        var collection_obj_report=carrot.rate.data_obj.collection;
        var reportRef = carrot.db.collection(collection_obj_report).doc(id_obj_report);
        reportRef.update({
            reports: firebase.firestore.FieldValue.delete()
        });
        carrot.msg("Delete All Report Success!");
        $("#all_report").remove();
    }

    check_status_user_login(){
        var data_user_login = carrot.user.obj_login;
        var name_user_rate='Incognito';
        var url_avatar_user_rate='images/avatar_default.png';
        if (data_user_login != null) {
            if (data_user_login.avatar != null) url_avatar_user_rate=data_user_login.avatar;
            name_user_rate=data_user_login.name;
        }
        $("#avatar_user_rate").attr("src",url_avatar_user_rate);
        $("#name_user_rate").html(name_user_rate);
    }

    box_comment_item(comment){
        var html='';
        var date_comment=new Date(comment.date);
        html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';

            html+='<div class="col-md-1 align-items-center col-1 rcolm">';
                var url_avatar_user_field='images/avatar_default.png';
                if(comment.user!=null){
                    if(comment.user.avatar!=null) url_avatar_user_field=comment.user.avatar;
                    if(url_avatar_user_field=="") url_avatar_user_field='images/avatar_default.png';
                    html+='<img src="'+url_avatar_user_field+'" class="rounder w-100"/>';
                }else{
                    html+='<i class="fa-solid fa-user fa-2x"></i>';
                }
            html+='</div>';

            html+='<div class="col-md-11 align-items-center col-11 rcolm">';
                html+='<div class="review">';
                    html+='<li class="col-8 ratfac">';
                    for(var i=1;i<=5;i++){
                        if(i<=comment.star)
                            html+='<i class="bi text-warning fa-solid fa-star"></i>';
                        else
                            html+='<i class="bi fa-solid fa-star"></i>';
                    }
                    html+='</li>';
                html+='</div>';

                html+='<h3 class="fs-6 fw-semi mt-2">'+comment.user.name+'<small class="float-end fw-normal"> '+date_comment.toLocaleDateString()+ ' </small></h3>';
                html+='<div class="review-text">'+comment.comment+'</div>';
                
                if(carrot.user.obj_login!=null){
                    if(comment.user.id==carrot.user.obj_login.id){
                        html+='<button onclick="carrot.rate.delete_comment(this);return false;" data-index="'+comment.index+'" class="float-end btn btn-sm btn-danger m-1"><i class="fa-solid fa-trash-can"></i></button>';
                        html+='<button onclick="carrot.rate.delete_comment(this);return false;" data-index="'+comment.index+'"  class="float-end btn btn-sm btn-warning m-1"><i class="fa-solid fa-pen-to-square"></i></button>';
                    }
                }
            html+='</div>';
            
            html+='<div class="col-md-2"></div>';
        html+='</div>';
        return html;
    }

    box_rank_item(rank){
        var html='';
        var date_rank=new Date(rank.date);
        var url_avatar_user_field='images/avatar_default.png';
        var name_user_field="Incognito";
        if(rank.user!=null){
            if(rank.user.avatar!="") url_avatar_user_field=rank.user.avatar;
            name_user_field=rank.user.name;
        }
        
        html+='<tr>';
            html+='<td class="w-20 col-1"><img class="rounder" style="width:24px" src="'+url_avatar_user_field+'"/></td>';
            html+='<td class="w-20 col-2">'+name_user_field+'</td>';
            html+='<td class="w-20 col-4">'+rank.scores+'</td>';
            html+='<td class="w-20 col-1">'+rank.type+'</td>';
            html+='<td class="w-20 col-4">'+date_rank.toLocaleDateString()+'</td>';
        html+='</tr>';
        return html;
    }

    box_report_item(report){
        var html='';
        var date_report=new Date(report.date);
        var url_avatar_user_field='images/avatar_default.png';
        var name_user_field="Incognito";
        if(report.user!=null){
            if(report.user.avatar!=null) url_avatar_user_field=report.user.avatar;
            if(report.user.name!=null) name_user_field=report.user.name;
        }
        html+='<tr>';
            html+='<td class="w-20 col-1"><img class="rounder" style="width:24px" src="'+url_avatar_user_field+'"/></td>';
            html+='<td class="w-20 col-2">'+name_user_field+'</td>';
            html+='<td class="w-20 col-5">'+report.comment+'</td>';
            html+='<td class="w-20 col-4">'+date_report.toLocaleDateString()+'</td>';
        html+='</tr>';
        return html;
    }

    check_event(){
        var carrot=this.carrot;
        $(".rate_star").on("mouseover",function(){
            var val=$(this).attr("value");
            $(".rate_star").removeClass("text-primary");
            $(".rate_star").removeClass("text-warning");
            for(var i=0;i<=val;i++){
                $("#rate_star_"+i).addClass("text-primary");
            }  
        });

        $(".rate_star").on("click",function(){
            var val=$(this).attr("value");
            $("#rate_star").attr("value",val);
            for(var i=0;i<=val;i++){
                $("#rate_star_"+i).addClass("text-warning");
            }  
        });

        $(".rate_star").on("mouseout",function(){
            var val=$("#rate_star").attr("value");
            $(".rate_star").removeClass("text-primary");
            $(".rate_star").removeClass("text-warning");
            for(var i=0;i<=val;i++){
                $("#rate_star_"+i).addClass("text-warning");
            }  
        });

        $("#btn_done_comment").click(function(){
            var val_comment=$("#rate_comment").val();
            var val_star=$("#rate_star").attr("value");

            if(val_comment.trim()==""&&val_comment.length<=3) {
                carrot.msg("Review cannot be empty and is larger than 3 characters!","warning");
                return false;
            }

            var data_comment={
                star:val_star,
                comment:val_comment,
                date:new Date().toISOString(),
                user:carrot.user.get_user_cur_info_comment()
            }
            var addCommentRef =carrot.db.collection(carrot.id_page).doc(carrot.rate.data_obj.id);
            addCommentRef.update({
                rates: firebase.firestore.FieldValue.arrayUnion(data_comment)
            });
            carrot.rate.data_obj.rates.push(data_comment);
            carrot.rate.save_obj();
            $("#all_comment").append(carrot.rate.box_comment_item(data_comment));
            $("#user_comment").hide();
            carrot.msg("Thank you for your comments!","success",6000);
        });
    }

    delete_comment(emp){
        var carrot=this.carrot;
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure to delete this review?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            var index_comment=$(emp).data("index");
            var rates=this.data_obj.rates;
            rates.splice(index_comment, 1);
            this.data_obj.rates=rates;
            console.log(this.data_obj);
            carrot.rate.save_obj();

            var UpdateCommentRef =carrot.db.collection(carrot.id_page).doc(carrot.rate.data_obj.id);
            UpdateCommentRef.update(this.data_obj);
            if (result.isConfirmed) $(emp).parent().parent().remove();
        })
    }

    save_obj(){
        console.log(carrot.app.obj_app[carrot.rate.data_obj.id]);
        if(carrot.id_page=="app"){
            carrot.app.obj_app[carrot.rate.data_obj.id]=JSON.stringify(carrot.rate.data_obj);
            carrot.app.save_obj();
        }

        if(carrot.id_page=="code"){
            carrot.code.obj_codes[carrot.rate.data_obj.id]=JSON.stringify(carrot.rate.data_obj);
            carrot.code.save_obj();
        }

        if(carrot.id_page=="song"){
            carrot.music.obj_songs[carrot.rate.data_obj.id]=JSON.stringify(carrot.rate.data_obj);
            carrot.music.save_obj();
        }

        if(carrot.id_page=="bible"){
            carrot.bible.obj_bibles[carrot.rate.data_obj.id]=JSON.stringify(carrot.rate.data_obj);
            carrot.bible.save_obj();
        }
    }

    box_qr(){
        var html='';
        html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
            html+='<div class="col-md-3 text-center">';
                html+='<div id="qr_cdoe" class="rounded m-1 w-100"></div>';
            html+='</div>';

            html+='<div class="col-md-9">';
                html+='<h4 class="fw-semi fs-5 lang" key_lang="qr_code">QR Code</h4>';
                html+='<small class="m-1 lang" key_lang="qr_code_tip">Use other devices capable of scanning and recognizing qr code barcodes to continue using the current link</small>';
                html+='<div class="fs-9"><i class="fa-solid fa-link"></i> <b>Link</b> : <span id="link_qr" class="text-break">'+window.location.href+'</span></div>';
                html+='<button class="btn btn-success mt-2" onclick="copy_txt_tag(\'link_qr\');carrot.msg("Copied!");"><i class="fa-solid fa-copy"></i> Copy</button>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    box_app_tip(id){
        if($("#app_tip").length>0){
            if(carrot.appp!=null){
                carrot.appp.box_app_tip(id);
            }else{
                carrot.js("app","appp","carrot.appp.box_app_tip('"+id+"')");
            }
        }
    }

    list_other_and_footer(obj_js,field_compare='',field_val='',class_col_other='col-md-12 mb-3 col-12',class_col_footer='col-md-4 mb-3 col-12'){
        if($("#box_related").length>0){
            $("#box_related").html(carrot.loading_html());
            $("#box_footer").html(carrot.loading_html());
            carrot[obj_js].get_data((datas)=>{
                $("#box_related").html("");
                $("#box_footer").html("");
                var list_other=carrot.random(datas);
                var count_item=0;
                $(list_other).each(function(index,data_item){
                    data_item["index"]=count_item;
                    if(field_compare!=''){
                        if(data_item[field_compare]==field_val){
                            count_item++;
                            var box_item=carrot[obj_js].box_item(data_item);
                            box_item.set_class(class_col_other);
                            $("#box_related").append(box_item.html());
                        }
                    }else{
                        count_item++;
                        var box_item=carrot[obj_js].box_item(data_item);
                        box_item.set_class(class_col_other);
                        $("#box_related").append(box_item.html());
                    }
                    if(count_item>=12) return false;
                });

                var list_footer=carrot.random(datas);
                $(list_footer).each(function(index,data_item){
                    count_item++;
                    if(index>=12) return false;
                    data_item["index"]=count_item;
                    var box_item=carrot[obj_js].box_item(data_item);
                    box_item.set_class(class_col_footer);
                    $("#box_footer").append(box_item.html());
                });
                carrot.check_event();
            });
        }
    }

    btn_export(collection,label='Export'){
        var html='';
        html+='<div class="btn btn-sm dev btn-dark" onclick="carrot.export(\''+collection+'\');"><i class=\"fa-solid fa-download\"></i> '+label+'</div>';
        return html;
    }

    id(str) {
        var s_new = str.replace(/[\u00C0-\u1EF9\s]/g, '');
        return s_new.replace(/[^\w\s]/gi, '');
    }
}