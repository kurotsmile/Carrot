class Carrot_Rate{
    carrot;
    data_obj=null;
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
        if (data_user_login != null) {
            if (data_user_login.avatar != null)
                html += '<img src="' + data_user_login.avatar + '"/>';
            else
                html += '<img src="images/avatar_default.png"/>';

            html += data_user_login.name;
        } else {
            html += '<img src="images/avatar_default.png"/>';
            html += "Incognito";
        }
        html += '</div>';

        html += '<div class="col-md-10 align-items-center col-10 rcolm">';
        html += '<div class="form-group">';
        html += '<label for="rate_star">Rate Star</label>';
        html += '</div>';

        html += '<div id="rate_star" value="0" class="form-group mt-3 mb-3">';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="1" value_txt="' + carrot.l("rate_star_1", "Badvery bad") + '" id="rate_star_1"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="2" value_txt="' + carrot.l("rate_star_2", "Bad") + '" id="rate_star_2"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="3" value_txt="' + carrot.l("rate_star_3", "Normal") + '" id="rate_star_3"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="4" value_txt="' + carrot.l("rate_star_4", "Good") + '" id="rate_star_4"></i>';
        html += '<i role="button" class="fa-regular fa-star fa-2xl rate_star" value="5" value_txt="' + carrot.l("rate_star_5", "Very good") + '" id="rate_star_5"></i>';
        html += '</div>';

        html += '<div id="star_val_show" class="form-group text-primary"></div>';

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

    box_comment_item(comment){
        var html='';
        var date_comment=new Date(comment.date);
        html+='<div class="row m-0 reviewrow p-3 px-0 border-bottom">';
            html+='<div class="col-md-12 align-items-center col-9 rcolm">';
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

            html+='<h3 class="fs-6 fw-semi mt-2">' + comment.user.name + '<small class="float-end fw-normal"> '+date_comment.toLocaleDateString()+ ' </small></h3>';
            html+='<div class="review-text">' + comment.comment + '</div>';
            html+='<button onclick="carrot.rate.delete_comment(this);return false;" class="float-end btn btn-sm btn-danger m-1"><i class="fa-solid fa-trash-can"></i></button>';
            html+='<button onclick="carrot.rate.delete_comment(this);return false;" class="float-end btn btn-sm btn-warning m-1"><i class="fa-solid fa-pen-to-square"></i></button>';
            html+='</div>';
            
            html+='<div class="col-md-2"></div>';
        html+='</div>';
        return html;
    }

    check_event(){
        var carrot=this.carrot;
        $(".rate_star").on("mouseover",function(){
            var val=$(this).attr("value");
            var val_txt=$(this).attr("value_txt");
            $(".rate_star").removeClass("text-primary");
            $(".rate_star").removeClass("text-warning");
            $("#star_val_show").html(val_txt).show();
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
            $("#star_val_show").hide();
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
            var addCommentRef =carrot.db.collection("app").doc(carrot.rate.data_obj.id);
            addCommentRef.update({
                rates: firebase.firestore.FieldValue.arrayUnion(data_comment)
            });
            carrot.rate.data_obj.rates.push(data_comment);
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

            $("#all_comment").append(carrot.rate.box_comment_item(data_comment));
            $("#user_comment").hide();
            carrot.msg("Thank you for your comments!","success",6000);
        });
    }

    delete_comment(emp){
        $(emp).parent().parent().remove();
    }
}