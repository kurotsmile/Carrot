class Carrot_File{
    icon="fa-solid fa-laptop-file";
    objs=null;
    emp_msg_field_file=null;
    type_show="list";
    type_file_show="all";

    orderBy_at="timeCreated";
    orderBy_type="ASCENDING";

    types=["apk","exe","ipa","dmg","jpg","png","mp3"];
    types_id=[
                "application/vnd.android.package-archive",
                "application/x-msdownload",
                "application/vnd.android.package-archive",
                "application/vnd.android.package-archive",
                "image/jpeg",
                "image/png",
                "audio/mpeg"
            ];
    types_icon=[
                "fa-brands fa-android",
                "fa-brands fa-microsoft",
                "fa-solid fa-file",
                "fa-solid fa-file",
                "fa-solid fa-image",
                "fa-regular fa-image",
                "fa-solid fa-file-audio"
            ];

    constructor(){
        $(carrot.menu.create("file").set_label("File").set_icon(this.icon).set_type("dev")).click(function(){
            carrot.file.list();
        }); 
    }

    get_icon(type){
        var s_icon='fa-solid fa-file';
        $(carrot.file.types_id).each(function(index,f){
            if(type==f){
                s_icon=carrot.file.types_icon[index];
                return false;
            }
        });
        return s_icon;
    }

    show_list_by_order(sort_at,sort_type){
        carrot.loading("Get list data by order ("+sort_at+"->"+sort_type+")");
        carrot.file.objs=null;
        carrot.file.orderBy_at=sort_at;
        carrot.file.orderBy_type=sort_type;
        carrot.file.get_data(carrot.file.load_list_by_data);
    }

    show_list_by_type(index){
        carrot.loading("Show List by type ("+carrot.file.types[index]+")");
        carrot.file.objs=null;
        carrot.file.type_file_show=carrot.file.types_id[index];
        carrot.file.get_data(carrot.file.load_list_by_data);
    }

    menu(){
        var html='';
        html+='<div class="row mb-2">';
            html+='<div class="col-6">';
                var style_date_create_desc='btn-secondary';
                var style_date_create_asc='btn-secondary';
                var style_name_desc='btn-secondary';
                var style_name_asc='btn-secondary';

                html+='<div class="btn-group" role="group" aria-label="Basic menu sort">';

                    if(carrot.file.orderBy_at=="timeCreated"&&carrot.file.orderBy_type=="DESCENDING") style_date_create_desc='btn-success';
                    if(carrot.file.orderBy_at=="timeCreated"&&carrot.file.orderBy_type=="ASCENDING") style_date_create_asc='btn-success';
                    if(carrot.file.orderBy_at=="name"&&carrot.file.orderBy_type=="DESCENDING") style_name_desc='btn-success';
                    if(carrot.file.orderBy_at=="name"&&carrot.file.orderBy_type=="ASCENDING") style_name_asc='btn-success';

                    html+='<button onClick="carrot.file.show_list_by_order(\'timeCreated\',\'DESCENDING\');" type="button" class="btn '+style_date_create_desc+' btn-sm"><i class="fa-solid fa-arrow-up-short-wide"></i> Date</button>';
                    html+='<button onClick="carrot.file.show_list_by_order(\'timeCreated\',\'ASCENDING\');" type="button" class="btn  '+style_date_create_asc+' btn-sm"><i class="fa-solid fa-arrow-down-short-wide"></i> Date</button>';
                    html+='<button onClick="carrot.file.show_list_by_order(\'name\',\'DESCENDING\');" type="button" class="btn '+style_name_desc+' btn-sm"><i class="fa-solid fa-arrow-up-a-z"></i> Key</button>';
                    html+='<button onClick="carrot.file.show_list_by_order(\'name\',\'ASCENDING\');" type="button" class="btn '+style_name_asc+'  btn-sm"><i class="fa-solid fa-arrow-down-z-a"></i> Key</button>';
                html+='</div>';

                html+='<div class="btn-group btn-sm" role="group" aria-label="Mider group">';
                    if(carrot.file.type_show!='list') html+='<button onclick="carrot.file.list();" class="btn btn-sm btn-success"><i class="fa-solid fa-square-caret-left"></i> <l class="lang" key_lang="back">Back</l></button>';
                html+='</div>';

                html+='<div class="btn-group btn-sm" role="group" aria-label="First group">';
                    html+=carrot.tool.btn_export("file","file");
                    html+='<button onclick="carrot.file.delete_all_data();return false;" class="btn btn-danger dev btn-sm"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</button>';
                html+='</div>';
            html+='</div>';

            html+='<div class="col-6">';
                html+='<div class="btn-group btn-sm float-end" role="group" aria-label="Last group">';
                    $(carrot.file.types).each(function(index,t){
                        var css_active="";
                        if(carrot.file.type_file_show==carrot.file.types_id[index]) css_active="active"; else css_active="";
                        html+='<button onclick="carrot.file.show_list_by_type('+index+');" class="btn btn-sm btn-success '+css_active+'"><i class="'+carrot.file.types_icon[index]+'"></i> '+t+'</button>';
                    });
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    show(){
        carrot.file.list();
    }

    list(){
       carrot.loading("Get and show all data file");
       setTimeout(()=>{
            carrot.file.get_data(carrot.file.load_list_by_data);
       },500);
    }

    get_data(act_done){
        if(carrot.file.objs!=null)
            act_done(carrot.file.objs);
        else{
            var q=new Carrot_Query("file");
            if(carrot.file.type_file_show!="all") q.add_where("type",carrot.file.type_file_show);
            q.set_limit(50);
            q.set_order(carrot.file.orderBy_at,carrot.file.orderBy_type);
            q.get_data((data)=>{
                carrot.file.objs=data;
                act_done(data);
            });
        }
    }

    box_item(data){
        var item_file=new Carrot_List_Item(carrot);
        item_file.set_icon_font(carrot.file.get_icon(data.type));
        item_file.set_id(data.id_doc);
        item_file.set_db("file");
        item_file.set_index(data.index);
        item_file.set_obj_js("file");
        item_file.set_name(data.name);
        item_file.set_class_body("mt-2 col-11");
            
            var html_body='';
            html_body+='<div class="col-10 fs-12">';
                html_body+='<div class="d-block text-info"><i class="fa-solid fa-bezier-curve"></i> <small class="fs-9">'+data.fullPath+'</small></div>';
                html_body+='<div class="d-block"><i class="fa-solid fa-server"></i> <small>'+carrot.file.formatSizeUnits(data.size)+'</small></div>';
                html_body+='<div class="d-block"><i class="fa-solid fa-calendar-days"></i> <small>'+data.timeCreated+'</small></div>';
            html_body+='</div>';

            html_body+='<div class="col-2">';
            html_body+='<button role="button" class="btn btn-sm btn-danger" fullPath="'+data.fullPath+'" onclick="delete_file(this)"><i class="fa-solid fa-file-circle-minus"></i></button>';
            html_body+='</div>';
        item_file.set_body(html_body);
        return item_file;
    }

    load_list_by_data(files){
        carrot.hide_loading();
        carrot.change_title("file","?p=file","file");
        var html='';
        html+=carrot.file.menu();
        html+='<div class="row">';
        $(files).each(function(index,f){
            f["index"]=index;
            html+=carrot.file.box_item(f).html();
        });
        html+='</div>';
        carrot.show(html);
        carrot.check_event();
    }

    edit(data,carrot){
        carrot.file.frm_add_or_edit(data,carrot).set_title("Edit File Data Meta").show();
    }

    frm_add_or_edit(data,carrot){
        var frm=new Carrot_Form("frm_file",carrot);
        frm.set_db(carrot.file.id_page,"name");
        frm.set_icon(carrot.file.icon);
        frm.create_field("name").set_label("Name").set_value(data["name"]).set_main();
        frm.create_field("type").set_label("Type").set_value(data["type"]);
        frm.create_field("type_emp").set_label("Type Emp").set_value(data["type_emp"]);
        frm.create_field("url").set_label("Url").set_value(data["url"]);
        frm.create_field("fullPath").set_label("Full Path").set_value(data["fullPath"]);
        frm.create_field("size").set_label("Size").set_value(data["size"]);
        frm.create_field("generation").set_label("Generation").set_value(data["generation"]);
        frm.create_field("timeCreated").set_label("Time Created").set_value(data["timeCreated"]);
        return frm;
    }

    reload(carrot){
        carrot.file.delete_obj_files();
        carrot.file.list();
    }

    formatSizeUnits(bytes){
        if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
        else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
        else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
        else if (bytes > 1)           { bytes = bytes + " bytes"; }
        else if (bytes == 1)          { bytes = bytes + " byte"; }
        else                          { bytes = "0 bytes"; }
        return bytes;
    }

    msg_list_select(emp){
        this.emp_msg_field_file=emp;
        var type_file=$(emp).attr("type_file");
        carrot.loading("Get list data file "+type_file);
        var q=new Carrot_Query("file");
        q.add_where("type_emp",type_file);
        q.set_order("timeCreated","DESCENDING");
        q.set_limit(100);
        q.get_data((data)=>{
            var html="";
            if(type_file=="image/*")
                html+=carrot.file.load_msg_list_file_image(data);
            else if(type_file=="audio/*")
                html+=carrot.file.load_msg_list_file_audio(data);
            else
                html+=carrot.file.load_msg_list_file_other(data);

            Swal.fire({
                title: 'Select File',
                html:html,
                showCancelButton: false
            });
        });
    }

    load_msg_list_file_other(data){
        var html="";
        html+='<table class="table table-striped table-hover">';
        html+='<tbody>';
        $(data).each(function(index,file){
            html+='<tr role="button" file_url="'+file.url+'" file_type="'+file.type_emp+'" file_path="'+file.fullPath+'" onclick="carrot.file.select_file_for_msg(this)">';
                html+='<td><i class="'+carrot.file.get_icon(file.type)+'"></i></td>';
                html+='<td>'+file.fullPath+'</td>';
            html+='<tr>';''
        });
        html+='</tbody>';
        html+='</table>';
        return html;
    }

    load_msg_list_file_audio(data){
        var html="";
        $(data).each(function(index,file){
            html+='<div role="button" file_url="'+file.url+'" file_type="'+file.type_emp+'" file_path="'+file.fullPath+'" onclick="carrot.file.select_file_for_msg(this)" class="btn btn-sm bg-secondary text-white rounded fs-9 m-1"><i class="fa-solid fa-file-audio"></i><br/>'+file.name+'</div>';
        });
        return html;
    }

    load_msg_list_file_image(data){
        var html="";
        $(data).each(function(index,file){
            html+="<img role='button' file_url='"+file.url+"' file_type='"+file.type_emp+"' file_path='"+file.fullPath+"' onclick='carrot.file.select_file_for_msg(this)' style='width:50px' class='rounded m-1' src='"+file.url+"'/>";
        });
        return html;
    }

    select_file_for_msg(emp){
        var file_url=$(emp).attr("file_url");
        var file_path=$(emp).attr("file_path");
        var file_type=$(emp).attr("file_type");
        var emp_id=$(this.emp_msg_field_file).attr("emp_id");
        $("#"+emp_id).attr("value",file_url).html(carrot.file.box_file_item(file_url,file_path,file_type));
        Swal.close();
    }

    box_file_item(url_file,path_file,type_file){
        if(url_file==""||url_file==undefined||url_file=='undefined') return "";
        var html='';
        html+='<div class="d-block w-100 text-break">';
            html+='<div class="card-body w-100 shadow-sm d-flex flex-column align-items-start">';
                html+='<div class="row w-100">';
                    if (type_file == "image/*") {
                        html += '<div class="col-4">';
                        html += '<a href="'+url_file+'" target="_blank" class="text-break fs-9"><img class="rounded card-img-left flex-auto d-none d-md-block" src="'+url_file+'"/></a>';
                        html += '</div>';
                        html += '<div class="col-6">';
                        html += '<input class="form-control fs-9 form-control-sm" value="'+url_file+'">';
                        html += '</div>';
                        html += '<div class="col-2">';
                        html += '<span fullPath="'+path_file+'" onclick="delete_file(this);return false;" role="button" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></span>';
                        html += '</div>';
                    } else if (type_file == "audio/*") {
                        html += '<div class="col-10">';
                        html += '<audio syle="width:100%" controls muted><source src="'+url_file+'" type="audio/mpeg">Your browser does not support the audio element.</audio>';
                        html += '<a href="'+url_file+'" target="_blank" class="text-break fs-9 d-block"><i class="fa-solid fa-file-audio"></i><i class="fa-solid fa-file-audio"></i></a>';
                        html += '<input class="form-control fs-9 form-control-sm" value="'+url_file+'"></input>';
                        html += '</div>';
                        html += '<div class="col-2">';
                        html += '<span fullPath="'+path_file+'" onclick="delete_file(this);return false;" role="button" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></span>';
                        html += '</div>';
                    } else {
                        html += '<div class="col-1"><i class="fa-solid fa-file"></i></div>';
                        html += '<div class="col-10">';
                            html += '<textarea class="w-100 form-control fs-9">'+url_file+'</textarea>';
                        html += '</div>';
                        html += '<div class="col-1">';
                            html+='<span fullPath="'+path_file+'" onclick="delete_file(this);return false;" role="button" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></span>';
                        html+='</div>';
                    }
            html+='</div>';
        html+='</div>';
        return html;
    }

    add_box_file_item_link(id_emp){
        var type_file_emp=$("#"+id_emp+"_file").attr("accept");
        $("#"+id_emp).html(carrot.file.box_file_item("thanh","thanh",type_file_emp));
    }

    get_base64data_file(url_file) {
        var carrot=this.carrot;
        return new Promise((resolve) => {
            var storageRef = carrot.storage.ref();
            var path=url_file.split('/');
            var path_files=path[path.length-1];
            var path_file=path_files.split('?');
            path_file=path_file[0];
            path_file=path_file.replaceAll("%2F","/");
            path_file=path_file.replaceAll("%20"," ");
            storageRef.child(path_file).getDownloadURL().then((url) => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    var blob = xhr.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob); 
                    reader.onloadend = function(){
                        resolve(reader.result);
                    }
                };
                xhr.open('GET', url);
                xhr.send();
            }).catch((error) => {
                console.log(error);
            });
        })
    }

    delete_all_data(){
        carrot.file.objs=null;
        carrot.msg("Delete All data Cache success!");
    }
}