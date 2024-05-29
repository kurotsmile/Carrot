class Carrot_File{
    carrot;
    icon="fa-solid fa-laptop-file";
    id_page="file";
    obj_files=null;
    emp_msg_field_file=null;

    constructor(carrot){
        this.carrot=carrot;
        var btn_list=carrot.menu.create("file").set_label("File").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){
            carrot.file.list();
        });
    }

    save_obj_files(){
        localStorage.setItem("obj_files",JSON.stringify(this.obj_files));
    }

    delete_obj_files(){
        localStorage.removeItem("obj_files");
        this.obj_files=null;
        this.carrot.delete_ver_cur(this.id_page);
    }

    get_list_file_from_server(){
        carrot.loading("Get data file from server");
        this.carrot.db.collection(this.id_page).orderBy("timeCreated", "desc").limit(100).get().then((querySnapshot) => {
            var obj_data=Object();
            querySnapshot.forEach((doc) => {
                var item_data=doc.data();
                item_data["id"]=doc.id;
                obj_data[doc.id]=JSON.stringify(item_data);
            });
            this.act_get_done_list_server(obj_data,this.carrot);
        }).catch((error) => {
            this.carrot.log_error(error);
        });
    }

    act_get_done_list_server(files,carrot){
        carrot.file.obj_files=files;
        carrot.file.save_obj_files();
        carrot.file.show_list_from_data(files,carrot);
    }

    show(){
        carrot.file.list();
    }

    list(){
        if(this.obj_files!=null){
            this.show_list_from_data(this.obj_files,this.carrot);
        }else{
            this.get_list_file_from_server();
        }
    }

    show_list_from_data(files,carrot){
        carrot.hide_loading();
        carrot.change_title_page(this.id_page,"?p="+this.id_page,this.id_page);
        var html='';
        var list_file=carrot.obj_to_array(files);
        html+='<div class="row">';
        $(list_file).each(function(index,f){
            var item_file=new Carrot_List_Item(carrot);

            if(f.type_emp=="image/*")
                item_file.set_icon_font("fa-solid fa-file-image");
            else if(f.type_emp=="audio/*")
                item_file.set_icon_font("fa-solid fa-file-audio");
            else
                item_file.set_icon_font("fa-solid fa-file");

            item_file.set_id(f.id);
            item_file.set_db("file");
            item_file.set_index(index);
            item_file.set_name(f.name);
            item_file.set_class_body("mt-2 col-11");
            var html_body='';
            html_body+='<div class="col-10">';
                html_body+='<div class="d-block text-info"><i class="fa-solid fa-bezier-curve"></i> <small class="fs-9">'+f.fullPath+'</small></div>';
                html_body+='<div class="d-block"><i class="fa-solid fa-server"></i> <small>'+carrot.file.formatSizeUnits(f.size)+'</small></div>';
                html_body+='<div class="d-block"><i class="fa-solid fa-calendar-days"></i> <small>'+f.timeCreated+'</small></div>';
            html_body+='</div>';

            html_body+='<div class="col-2">';
            html_body+='<button role="button" class="btn btn-sm btn-danger" fullPath="'+f.fullPath+'" onclick="delete_file(this)"><i class="fa-solid fa-trash"></i></button>';
            html_body+='</div>';
            item_file.set_body(html_body);
            html+=item_file.html();
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
        this.carrot.db.collection("file").where("type_emp","==",type_file).orderBy("timeCreated","desc").limit(50).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                var files=new Object();
                querySnapshot.forEach((doc) => {
                    var data_file=doc.data();
                    data_file["id"]=doc.id;
                    files[doc.id]=JSON.stringify(data_file);
                });
                this.done_msg_list_select(files,this.carrot);
            }else{
                this.done_msg_list_select(null,this.carrot);
            }
        }).catch((error) => {
            console.log(error);
            this.carrot.msg(error.message,"error");
        });
    }

    done_msg_list_select(data,carrot){
        var html='';
        var list_file=this.carrot.obj_to_array(data);
        $(list_file).each(function(index,file){
            if(file.type_emp=="image/*")
                html+="<img role='button' file_url='"+file.url+"' file_type='"+file.type_emp+"' file_path='"+file.fullPath+"' onclick='carrot.file.select_file_for_msg(this)' style='width:50px' class='rounded m-1' src='"+file.url+"'/>";
            else if(file.type_emp=="audio/*")
                html+='<div role="button" file_url="'+file.url+'" file_type="'+file.type_emp+'" file_path="'+file.fullPath+'" onclick="carrot.file.select_file_for_msg(this)" class="btn btn-sm bg-secondary text-white rounded fs-9 m-1"><i class="fa-solid fa-file-audio"></i><br/>'+file.name+'</div>';
            else
                html+="<img role='button' file_url='"+file.url+"' file_type='"+file.type_emp+"' file_path='"+file.fullPath+"' onclick='carrot.file.select_file_for_msg(this)' style='width:50px' class='rounded m-1' src='"+file.url+"'/>";
        });
        
        Swal.fire({
            title: 'Select File',
            html:html,
            showCancelButton: false
        });
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
        html+='<div class="d-block text-break">';
            html+='<div class="card-body d-flex flex-column align-items-start">';
                html+='<div class="row">';
                    if (type_file == "image/*") {
                        html += '<div class="col-4">';
                        html += '<img class="rounded card-img-left flex-auto d-none d-md-block" src="'+url_file+'"/>';
                        html += '</div>';
                        html += '<div class="col-6">';
                        html += '<a href="'+url_file+'" target="_blank" class="text-break fs-9"><i class="fa-solid fa-image"></i>'+url_file+'</a>';
                        html += '</div>';
                        html += '<div class="col-2">';
                        html += '<span fullPath="'+path_file+'" onclick="delete_file(this);return false;" role="button" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></span>';
                        html += '</div>';
                    } else if (type_file == "audio/*") {
                        html += '<div class="col-10">';
                        html += '<audio syle="width:100%" controls muted><source src="'+url_file+'" type="audio/mpeg">Your browser does not support the audio element.</audio>';
                        html += '<a href="'+url_file+'" target="_blank" class="text-break fs-9 d-block"><i class="fa-solid fa-file-audio"></i>'+url_file+'</a>';
                        html += '</div>';
                        html += '<div class="col-2">';
                        html += '<span fullPath="'+path_file+'" onclick="delete_file(this);return false;" role="button" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></span>';
                        html += '</div>';
                    } else {
                        html += '<div class="col-12">';
                        html += '<b>'+type_file+'</b>:<a href="'+url_file+'" target="_blank" class="text-break fs-9"><i class="fa-solid fa-file"></i>'+url_file+'</a>';
                        html += '</div>';
                    }
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
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
}