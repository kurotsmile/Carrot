class Carrot_File{
    carrot;
    icon="fa-solid fa-laptop-file";
    id_page="file";
    obj_files=null;

    constructor(carrot){
        this.carrot=carrot;
        carrot.register_page(this.id_page,"carrot.file.list()","carrot.file.edit","carrot.file.show","carrot.file.reload");
        var btn_list=carrot.menu.create("file").set_label("File").set_icon(this.icon).set_type("dev");
        $(btn_list).click(function(){
            carrot.file.list();
        });
    }

    save_obj_files(){
        localStorage.setItem("obj_files",JSON.stringify(this.obj_files));
    }

    get_list_file_from_server(){
        this.carrot.get_list_doc(this.id_page,this.act_get_done_list_server);
    }

    act_get_done_list_server(files,carrot){
        carrot.file.obj_files=files;
        carrot.file.save_obj_files();
        carrot.file.show_list_from_data(files,carrot);
    }

    list(){
        if(this.obj_files!=null){
            this.show_list_from_data(this.obj_files,this.carrot);
        }else{
            this.get_list_file_from_server();
        }
    }

    show_list_from_data(files,carrot){
        carrot.change_title_page(this.id_page,"?p="+this.id_page,this.id_page);
        var html='';
        var list_file=carrot.obj_to_array(files);
        html+='<div class="row">';
        $(list_file).each(function(index,f){
            var item_file=new Carrot_List_Item(this.carrot);
            item_file.set_icon_font("fa-solid fa-file");
            item_file.set_index(index);
            item_file.set_name(f.name);
            item_file.set_class_body("mt-2 col-11");
            var html_body=''
            html_body+='<div class="d-block"><i class="fa-solid fa-bezier-curve"></i> <small class="fs-9">'+f.fullPath+'</small></div>';
            html_body+='<div class="d-block"><i class="fa-solid fa-server"></i> <small>'+f.size+'</small></div>';
            html_body+='<div class="d-block"><i class="fa-solid fa-calendar-days"></i> <small>'+f.timeCreated+'</small></div>';
            item_file.set_body(html_body);
            html+=item_file.html();
        });
        html+='</div>';
        this.carrot.show(html);
    }
}