class FootBall{

    playing_position=["tiền đạo","tiền vệ","hậu vệ","thủ môn"];
    index_player_position=-1;

    show(){
        carrot.football.index_player_position=-1;
        carrot.loading("Get and load all player");
        var q=new Carrot_Query("football");
        q.get_data((players)=>{
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
        var box=new Carrot_List_Item(carrot);
        var index_pos=parseInt(data.playing_position);
        box.set_tip(carrot.football.playing_position[index_pos]);
        box.set_id(data.id_doc);
        box.set_icon(data.icon);
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
        data_player["playing_position"]="1";
        data_player["date_create"]=new Date().toISOString();
        carrot.football.add_or_edit(data_player).set_title("Add new football players").set_msg_done("Add icon success!").show();
    }

    edit(data_icon,carrot){
        carrot.football.add_or_edit(data_icon).set_title("Update icon").set_msg_done("Update icon success!").show();
    }

    add_or_edit(data){
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
        frm.create_field("date_create").set_label("Date Create").set_val(data["date_create"]);
        return frm;
    }

    field_select_star(field){
        for(var i=1;i<=10;i++) field.add_option(i,i+" Point");
    }

    get_info(id){
        carrot.loading("Get data "+id);
        carrot.server.get_doc("football",id,(data)=>{
            carrot.football.info(data);
        });
    }

    info(data){
        carrot.change_title_page(data.name,"?page=football&id="+data.id_doc,"football");
        carrot.hide_loading();
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_title(data.name);
        box_info.set_icon_image(data.icon);

        box_info.add_attrs("fa-solid fa-arrows-to-circle","Force",data.ball_force);
        box_info.add_attrs("fa-solid fa-person-running","Control",data.ball_control);
        box_info.add_attrs("fa-solid fa-shoe-prints","Cutting",data.ball_cutting);

        box_info.add_contain(carrot.rate.box_qr());
        carrot.show(box_info.html());
    }
}
carrot.football=new FootBall();
if(carrot.call_show_on_load_pagejs) carrot.football.show();

