class FootBall{

    objs=null;
    playing_position=["tiền đạo","tiền vệ","hậu vệ","thủ môn"];
    index_player_position=-1;

    constructor(){

    }

    show(){
        var id=carrot.get_param_url("id");
        if(id!=undefined)
            carrot.football.get_info(id);
        else
            carrot.football.list();
    }

    list(){
        carrot.football.index_player_position=-1;
        carrot.loading("Get and load all player");
        if(carrot.check_ver_cur("football")==false){
            carrot.update_new_ver_cur("football",true);
            carrot.data.clear("football");
            carrot.football.get_list_data_from_server();
        }else{
            carrot.data.list("football").then((players)=>{
                carrot.football.objs=players;
                carrot.football.load_list_by_data(players);
            }).catch(()=>{
                carrot.football.get_list_data_from_server();
            });
        }
    }

    get_list_data_from_db(act_done,act_fail=null){
        carrot.data.list("football").then((players)=>{
            act_done(players);
        }).catch(()=>{
            if(act_fail!=null) act_fail();
        });
    }

    get_list_data_from_server(){
        var q=new Carrot_Query("football");
        q.set_limit(50);
        q.get_data((players)=>{
            carrot.football.objs=players;
            $(players).each(function(index,p){
                p["index"]=index;
                carrot.data.add("football",p);
            });
            carrot.football.load_list_by_data(players);
        });
    }

    show_by_category(index){
        carrot.football.index_player_position=index;
        carrot.loading("Show list by category ("+carrot.football.playing_position[index]+")");
        var q=new Carrot_Query("football");
        q.add_where("playing_position",index);
        q.get_data((players)=>{
            carrot.football.load_list_by_data(players);
        });
    }

    load_list_by_data(players){
        carrot.hide_loading();
        carrot.change_title_page("Football","?page=football","football");
        var html=this.menu();
        html+='<div id="all_player" class="row m-0"></div>';
        carrot.show(html);
        $(players).each(function(index,player){
            player["index"]=index;
            $("#all_player").append(carrot.football.box_item(player).html());
        });
        carrot.check_event();
    }

    box_item(data){
        carrot.data.load_image(data.id_doc,data.icon,"football_icon_"+data.id_doc);
        var box=new Carrot_List_Item(carrot);
        var index_pos=parseInt(data.playing_position);
        box.set_tip(carrot.football.playing_position[index_pos]);
        box.set_id(data.id_doc);
        box.set_icon(carrot.get_url()+"/images/128.png");
        box.set_id_icon("football_icon_"+data.id_doc);
        box.set_name(data.name);
        box.set_db_collection("football");
        box.set_obj_js("football");
        box.set_class_icon_col("col-3");
        box.set_class_body("col-9");
        box.set_act_click("carrot.football.get_info('"+data.id_doc+"');");
        var html_body='';
        html_body+=carrot.football.star('<i class="fa-solid fa-arrows-to-circle"></i> Force',parseInt(data.ball_force));
        html_body+=carrot.football.star('<i class="fa-solid fa-person-running"></i> Control',parseInt(data.ball_control));
        html_body+=carrot.football.star('<i class="fa-solid fa-shoe-prints"></i> Cutting',parseInt(data.ball_cutting));
        box.set_body(html_body);
        return box;
    }

    star(attr_title,num_star){
        var html_body='';
        html_body+='<ul class="row">';
            html_body+='<span class="col-4 ratfac">'+attr_title+'</span>';
            html_body+='<li class="col-8 ratfac">';
                for(var i=1;i<=10;i++){
                    if(i<=num_star)
                        html_body+='<i class="bi text-warning fa-solid fa-star"></i>';
                    else
                        html_body+='<i class="bi fa-solid fa-star"></i>';
                }
            html_body+='</li>';
        html_body+='</ul>';
        return html_body;
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
        html+='<div class="col-12">';
            html+='<div class="btn-group mr-2 btn-sm" role="group" aria-label="First group">';
                html+='<button onclick="carrot.football.add();" class="btn btn-sm dev btn-success"><i class="fa-solid fa-square-plus"></i> Add new players</button>';
                html+=carrot.tool.btn_export("football");
                html+='<button onclick="carrot.football.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+='<div class="btn-group" role="group">';
                    html+='<button class="btn btn-secondary dropdown-toggle btn-sm" type="button" id="btn_list_player_category" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-rectangle-list"></i> Category</button>';
                    html+='<div class="dropdown-menu" aria-labelledby="btn_list_player_category" id="list_player_category">';
                    var css_active='';
                    $(carrot.football.playing_position).each((index,p)=>{
                        if(carrot.football.index_player_position==index) css_active="btn-success";
                        else css_active="btn-secondary";
                        html+='<button role="button" onclick="carrot.football.show_by_category(\''+index+'\')" class="dropdown-item btn '+css_active+'"><i class="fa-solid fa-person-walking"></i> '+p+'</button>';
                    });
                    html+='</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    delete_all_data(){
        carrot.msg("Delete all data cache success!!");
    }

    add(){
        var data_player={};
        data_player["id"]="player"+carrot.create_id();
        data_player["name"]="";
        data_player["icon"]="";
        data_player["ball_force"]="1";
        data_player["ball_control"]="1";
        data_player["ball_cutting"]="1";
        data_player["playing_position"]=carrot.football.index_player_position;
        data_player["buy"]="0";
        data_player["date_create"]=new Date().toISOString();
        carrot.football.add_or_edit(data_player).set_title("Add new football players").set_msg_done("Add icon success!").show();
    }

    edit(data_icon,carrot){
        carrot.football.add_or_edit(data_icon).set_title("Update icon").set_msg_done("Update icon success!").show();
    }

    add_or_edit(data){
        if(data["buy"]==null) data["buy"]="0";
        var frm=new Carrot_Form("frm_player",carrot);
        frm.set_db("football","id");
        frm.set_icon_font("fa-solid fa-futbol");
        frm.create_field("id").set_label("ID").set_val(data["id"]).set_type("id").set_main();
        frm.create_field("name").set_label("Name").set_val(data["name"]);
        frm.create_field("icon").set_label("Icon (200x200)").set_val(data["icon"]).set_type("file").set_type_file("image/*");
        var field_force=frm.create_field("ball_force").set_label("ball_force").set_val(data["ball_force"]).set_type("select");
        carrot.football.field_select_star(field_force);
        var field_control=frm.create_field("ball_control").set_label("ball_control").set_val(data["ball_control"]).set_type("select");
        carrot.football.field_select_star(field_control);
        var field_cutting=frm.create_field("ball_cutting").set_label("ball_cutting").set_val(data["ball_cutting"]).set_type("select");
        carrot.football.field_select_star(field_cutting);
        var field_pos=frm.create_field("playing_position").set_label("playing_position").set_val(data["playing_position"]).set_type("select");
        $(carrot.football.playing_position).each(function(index,p){
            field_pos.add_option(index,p+" - "+index);
        })
        var field_buy=frm.create_field("buy").set_label("Sell status").set_val(data["buy"]).set_type("select");
        field_buy.add_option("0","Free");
        field_buy.add_option("1","Buy");
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        return frm;
    }

    field_select_star(field){
        for(var i=1;i<=10;i++) field.add_option(i,i+" Point");
    }

    get_info(id){
        carrot.loading("Get data "+id);
        carrot.data.get("football",id,(data)=>{
            carrot.football.info(data);
        },()=>{
            carrot.server.get_doc("football",id,(data)=>{
                carrot.data.add("football",data);
                carrot.football.info(data);
            });
        });
    }

    info(data){
        carrot.change_title_page(data.name,"?page=football&id="+data.id_doc,"football");
        carrot.hide_loading();
        carrot.data.img(data.id_doc,data.icon,"football_icon_"+data.id_doc);
        var box_info=new Carrot_Info(data.id_doc);

        box_info.set_db("football");
        box_info.set_obj_js("football");

        box_info.set_title(data.name);
        box_info.set_icon_image(carrot.get_url()+"/images/128.png");
        box_info.set_icon_id("football_icon_"+data.id_doc);
        box_info.set_icon_col_class("col-2");

        var index_pos=parseInt(data.playing_position);
        box_info.add_attrs("fa-solid fa-arrows-to-circle","Force",data.ball_force);
        box_info.add_attrs("fa-solid fa-person-running","Control",data.ball_control);
        box_info.add_attrs("fa-solid fa-shoe-prints","Cutting",data.ball_cutting);
        box_info.add_attrs("fa-solid fa-street-view","Playing position",carrot.football.playing_position[index_pos]);
        box_info.set_protocol_url("tablesoccer://show/"+data.id_doc);
        box_info.add_contain(carrot.rate.box_qr());
        box_info.add_footer(carrot.football.list_for_home());
        carrot.show(box_info.html());
        carrot.football.check_event();
    }

    check_event(){
        if($("#box_related_contain").length>0){
            $("#box_related_contain").html(carrot.loading_html());
            if(carrot.football.objs!=null){
                $("#box_related_contain").html("");
                var list_player=carrot.random(carrot.football.objs);
                $(list_player).each(function(index,player){
                    if(index>=12) return false;
                    player["index"]=index+200;
                    var box_item=carrot.football.box_item(player);
                    box_item.set_class('col-md-12 mb-3 col-12');
                    $("#box_related_contain").append(box_item.html());
                });
            }else{
                $("#box_related_contain").html("chưa có dữ liệu");
            }
        }
        carrot.check_event();
    }

    list_for_home(){
        var html='';
        if(carrot.football.objs!=null){
            var list_player=carrot.random(carrot.football.objs);
            html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-4">';
            html+='<i class="fa-solid fa-futbol"></i> <l class="lang" key_lang="other_player_football">Other Player Football</l>';
            html+='<span role="button" onclick="carrot.football.show()" class="btn float-end btn-sm btn-light"><i class="fa-solid fa-square-caret-right"></i> <l class="lang" key_lang="view_all">View All</l></span></h4>';
            html+='<div id="other_football" class="row m-0">';
            $(list_player).each(function(index,player){
                if(index<12){
                    player["index"]=index+100;
                    html+=carrot.football.box_item(player).html();
                }else{
                    return false;
                }
            });
            html+='</div>';
        }
        return html;
    }
}
carrot.football=new FootBall();
if(carrot.call_show_on_load_pagejs) carrot.football.show();

