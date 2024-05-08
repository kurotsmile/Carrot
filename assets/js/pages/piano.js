class Midi{

    objs=null;

    note_frequency=null;
    footnotes_frequency=null;
    index_note_play=-1;
    intervalID_midi_play=null;
    length_note_midi_play=-1;
    oscillators=[];
    type_view="all";
    
    constructor(){
        $('head').append('<link id="style_obj_midi" href="assets/css/piano_midi.css?'+carrot.get_ver_cur("js")+'" rel="stylesheet" type="text/css"/>');
        this.objs=JSON.parse(localStorage.getItem("objs_midi"));
        this.note_frequency=[65.40639,73.41619,82.40689,87.30706,97.99886,110.0000,123.4708,130.8128,146.8324,164.8138,174.6141,195.9977,220.0000,246.9417,261.6256,293.6648,329.6276,349.2282,391.9954,440.0000,493.8833,523.2511,587.3295,659.2551,698.4565,783.9909,880.0000,987.7666,1046.502,1174.659,1318.510,1396.913,1567.982,1760.000,1975.533,2093.005];
        this.footnotes_frequency=[69.29566,77.78175,92.49861,103.8262,116.5409,138.5913,155.5635,184.9972,207.6523,233.0819,277.1826,311.1270,369.9944,415.3047,466.1638,1108.731,1244.508,1479.978,1661.219,1864.655];
    }

    add(){
        alert("Add midi");
    }

    list(){
        carrot.midi.type_view="all";
        carrot.midi.get_data(carrot.midi.show_list_by_objs);
    }

    get_data(act_done){
        if(carrot.midi.objs!=null){
            act_done(carrot.midi.objs);
        }else{
            carrot.midi.get_data_from_server(act_done);
        }
    }

    get_data_from_server(act_done){
        var q=new Carrot_Query("midi");
        q.set_limit(100);
        q.get_data(act_done);
    }

    show_public(){
        carrot.midi.type_view="public";
        carrot.loading();
        var q=new Carrot_Query("Midi Piano Editor");
        q.add_where("status","public");
        q.get_data((data)=>{
            carrot.hide_loading();
            carrot.midi.objs=data;
            carrot.midi.show_list_by_objs(data);
        });
    }

    show_pending(){
        carrot.midi.type_view="pending";
        carrot.loading();
        var q=new Carrot_Query("Midi Piano Editor");
        q.add_where("status","pending");
        q.get_data((data)=>{
            carrot.hide_loading();
            carrot.midi.objs=data;
            carrot.midi.show_list_by_objs(data);
        });
    }

    show_all(){
        carrot.midi.type_view="all";
        carrot.loading();
        var q=new Carrot_Query("Midi Piano Editor");
        q.get_data((data)=>{
            carrot.hide_loading();
            carrot.midi.objs=data;
            carrot.midi.show_list_by_objs(data);
        });
    }

    show(){
        var id_midi=carrot.get_param_url("id");
        if(id_midi!=undefined)
            carrot.midi.show_midi_by_id(id_midi);
        else
            carrot.midi.show_list();
    }

    show_list(){
        carrot.loading("Get data list midi");
        carrot.change_title_page("List Midi","?page=piano","midi");
        if(carrot.check_ver_cur("midi")==false){
            carrot.midi.Get_list_from_server_and_show();
            carrot.update_new_ver_cur("midi",true);
        }else{
            if(carrot.midi.objs!=null)
                carrot.midi.show_list_by_objs(carrot.midi.objs);
            else
                carrot.midi.Get_list_from_server_and_show();
        }
    }

    Get_list_from_server_and_show(){
        carrot.loading();
        var q=new Carrot_Query("Midi Piano Editor");
        q.get_data((data)=>{
            carrot.midi.objs=data;
            localStorage.setItem("objs_midi",JSON.stringify(carrot.midi.objs));
            carrot.midi.show_list_by_objs(data);
        });
    }

    menu(){
        var html='';
        var s_class='';
        html+='<div class="row mb-2">';
            html+='<div class="col-12">';
                html+='<div class="btn-group mr-2" role="group">';
                    if(this.type_view=='all') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.midi.show_all();"><i class="fa-solid fa-table-list"></i> <l key_lang="view_all" class="lang">All</l></div>';
                    if(this.type_view=='public') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.midi.show_public();"><i class="fa-solid fa-earth-americas"></i> Published</div>';
                    if(this.type_view=='pending') s_class='active'; else s_class='';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.midi.show_pending();"><i class="fa-solid fa-hourglass-end"></i> Awaiting Approval</div>';
                html+='</div>';
            
                html+=' <div class="btn-group" role="group">';
                    if(this.type_view=="stores") s_class='active'; else s_class='';
                    html+=carrot.tool.btn_export("midi");
                    html+='<div class="btn dev btn-sm btn-danger" onclick="carrot.midi.clear_all_data();"><i class="fa-solid fa-dumpster-fire"></i> Delete All data</div>';
                    html+='<div class="btn btn-sm btn-success '+s_class+'" onclick="carrot.midi.add();"><i class="fa-solid fa-circle-plus"></i> Create New Midi</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    show_list_by_objs(midis){
        var html='';
        carrot.hide_loading();
        html+=carrot.midi.menu();
        html+='<div id="all_item" class="row m-0"></div>';
        carrot.show(html);
        $(midis).each(function(index,midi){
            midi["index"]=index;
            $("#all_item").append(carrot.midi.box_item(midi).html());
        });
        carrot.midi.check_event();
    }
    
    show_midi_by_id(id){
        if(this.objs!=null){
            if(this.objs[id]!=null){
                this.info(this.objs[id],carrot);
            }else{
                carrot.get_doc("Midi Piano Editor",id,this.info);
            }
        }else{
            carrot.get_doc("Midi Piano Editor",id,this.info);
        }
    }

    box_item(data){
        var s_icon="";
        var s_color_status="";

        if(data.status=="public"){
            s_icon="fa-solid fa-guitar";
            s_color_status="text-success";
        }else{
            s_icon="fa-brands fa-hashnode";
            s_color_status="text-warning";
        }

        var html_body='';
        html_body+='<li class="col-8 ratfac">';
                html_body+='<div class="fs-9 '+s_color_status+'"><i class="fa-solid fa-dice-d6"></i> status: '+data.status+'</div>';
                html_body+='<div class="fs-9 "><i class="fa-solid fa-gauge-high"></i> Speed: '+data.speed;
                if(data.category!=null) html_body+='  <i class="fa-solid fa-music"></i> Category: '+data.category;
                html_body+='</div>';
            if(data.data_index!=null) html_body+='<div class="fs-9"><i class="fa-solid fa-music"></i> Note: '+data.data_index.length+'</div>';
        html_body+='</li>';

        html_body+='<div class="col-4 text-end">'; 
            html_body+='<span role="button" onclick="carrot.midi.play_mini(\''+data.index+'\')" class="status_music float-end text-success btn-play-music m-1"><i class="fa-sharp fa-solid fa-circle-play fa-2x"></i></span> ';
        html_body+='</div>';

        var item_obj=new Carrot_List_Item(carrot);
        item_obj.set_db("Midi Piano Editor");
        item_obj.set_icon_font(s_icon+" "+s_color_status+" fa-3x midi_icon");
        item_obj.set_id(data.id);
        item_obj.set_title(data.name);
        item_obj.set_class_body("col-10");
        item_obj.set_class_icon_col("col-2");
        item_obj.set_body(html_body);
        item_obj.set_act_edit("carrot.midi.edit");
        item_obj.set_act_click("carrot.midi.show_midi_by_id('"+data.id+"')");
        return item_obj;
    }

    play_mini(index){
        var midi_data=carrot.midi.objs[index];
        var frm_play=new Carrot_Form("frm_play",carrot);
        var midi_body=frm_play.create_field("midi");
        var html='<div class="row">';
        html+='<div class="col-1 text-center">&nbsp</div>';
        html+='<div class="col-10 text-center">';
            html+=carrot.midi.box_midi(midi_data);
        html+='</div>';
        html+='<div class="col-1 text-center">&nbsp</div>';
        html+='</div>';
        midi_body.set_type("msg").set_value(html);
        frm_play.set_title(midi_data.name)
        frm_play.off_btn_done();
        frm_play.show();
    }

    edit(data,carrot){
        var frm=new Carrot_Form('add_code',carrot);
        frm.set_title("Edit Midi");
        frm.set_db("Midi Piano Editor","id");
        frm.set_type("edit");

        frm.create_field("id").set_label("Id").set_val(data.id).set_main();
        frm.create_field("name").set_label("Name").set_val(data.name);
        var status=frm.create_field("status").set_label("Status").set_type("select");
        status.add_option("pending","Pending");
        status.add_option("public","public");
        status.set_val(data.status);
        
        frm.set_msg_done("Edit Midi success!");
        frm.show();
    }

    info(data,carrot){
        var s_icon="";
        carrot.change_title_page(data.name,"?page=piano&id="+data.id,"Midi");
        var box_info=new Carrot_Info(data.id_doc);
        box_info.set_name(data.name);
        box_info.set_db("midi");
        box_info.set_obj_js("midi");
        
        if(data.status=="public")
            s_icon="fa-solid fa-guitar";
        else
            s_icon="fa-brands fa-hashnode";
           
        box_info.set_icon_font(s_icon);
        box_info.add_attrs("fa-solid fa-file-code",'<l class="lang" key_lang="file">File</l>',data.name+".midi");
        if(data.category!="") box_info.add_attrs("fa-solid fa-boxes-packing",'<l class="lang" key_lang="category">Category</l>',data.category);
        if(data.speed!="") box_info.add_attrs("fa-solid fa-gauge-high",'<l class="lang" key_lang="speed">Speed</l>',data.speed);
        if(data.user_id!=null){
            box_info.add_attrs("fa-solid fa-user-nurse",'<l class="lang" key_lang="author">Author</l>',data.user_id);
        }
        box_info.set_protocol_url("midi://show/"+data.id);
        box_info.add_contain(carrot.midi.box_midi(data));

        carrot.show(box_info.html());
        carrot.midi.check_event();
    }

    box_midi(data){
        var midi_notes=JSON.parse(data.data_index);
        var type_notes=JSON.parse(data.data_type);
        carrot.midi.length_note_midi_play=midi_notes[0].length;
        var html='';
        html+='<div class="about row p-2 py-3 bg-white mt-4 shadow-sm">';
        html+='<div class="col-12">';
            html+='<div class="row mb-2">';
                html+='<div class="col-4">';
                    html+='<i role="button" onclick="carrot.midi.playMidi()" class="fa-sharp fa-solid fa-circle-play fa-3x text-success mt-2 mr-2"></i>';
                html+='</div>';
                html+='<div class="col-4">';
                    html+='<i class="fa-solid fa-dice-one"></i> : '+midi_notes[0].length+"</br>";
                    html+='<i class="fa-solid fa-grip-lines"></i> : '+midi_notes.length+"</br>";
                    html+='<i class="fa-solid fa-music"></i> : '+(midi_notes[0].length*midi_notes.length);
                html+='</div>';
                html+='<div class="col-4">';
                    html+='<i class="fa-solid fa-2x fa-volume-high"></i>';
                html+='</div>';
            html+='</div>';
            html+='<div class="row">';
                html+='<div id="midi" class="text-break">';
                for(var i=0;i<midi_notes.length;i++){
                    var notes=midi_notes[i];
                    var types=type_notes[i];
                    html+='<div class="midi_line">';
                    for(var y=0;y<notes.length;y++){
                        if(notes[y]==-1)
                        html+='<div class="midi_note none midi_note_'+y+'" note_index="'+notes[y]+'" note_type="'+types[y]+'" onclick="carrot.midi.playNote('+notes[y]+',0)"><i class="fa-brands fa-ethereum"></i></div>';
                        else
                        html+='<div class="midi_note midi_note_'+y+'" note_index="'+notes[y]+'" note_type="'+types[y]+'"  onclick="carrot.midi.playNote('+notes[y]+','+types[y]+')">'+notes[y]+'</div>';
                    }
                    html+='</div>';
                }
                html+='</div>';
            html+='</div>';
        html+='</div>';
        html+='</div>';
        return html;
    }

    check_event(){
        $(".midi_icon").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.midi.show_midi_by_id(obj_id);
        });
        carrot.tool.list_other_and_footer("midi");
        carrot.check_event();
    }

    check_pay(id){
        if(localStorage.getItem("buy_midi_"+id)!=null)
            return true;
        else
            return false;
    }

    playNote(index_note,type_note) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        var frequency = 0;
        if(type_note==0)
            frequency = carrot.midi.note_frequency[index_note];
        else
            frequency = carrot.midi.footnotes_frequency[index_note];
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(function() {
          oscillator.stop();
        }, 300);
    }

    playNoteArray(frequencies) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

         this.oscillators.push(...frequencies.map(function(frequency) {
            const oscillator = audioContext.createOscillator();
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.connect(audioContext.destination);
            oscillator.start();
            setTimeout(function() {
                oscillator.stop();
            }, 300);
            return oscillator;
        }));
    }

    playMidi(){
        this.oscillators=[];
        carrot.midi.index_note_play=-1;
        this.intervalID_midi_play = setInterval(function() {
            carrot.midi.index_note_play++;
            var array_note=Array();
            $(".midi_note_"+carrot.midi.index_note_play).each(function(index,emp_note){
                var index_note=$(emp_note).attr("note_index");
                var type_note=$(emp_note).attr("note_type");
                if(index_note!=-1){
                    if(type_note==0)
                        array_note.push(carrot.midi.note_frequency[index_note]);
                    else
                        array_note.push(carrot.midi.footnotes_frequency[index_note]);
                }
                $(emp_note).addClass("play");
                $(emp_note).hide(2000);
            });

            if(array_note.length>0){
                carrot.midi.playNoteArray(array_note);
            }
            
            if(carrot.midi.index_note_play>=carrot.midi.length_note_midi_play) carrot.midi.stopMidi();
        }, 150);
    }

    stopMidi(){
        clearInterval(carrot.midi.intervalID_midi_play);
        this.index_note_play=-1;
        $(".midi_note").show();
        $(".midi_note").removeClass("play");
        this.oscillators.forEach(function(oscillator) {
            oscillator.stop();
        });
        this.oscillators.length = 0;
    }

    clear_all_data(){
        carrot.midi.objs=null;
        carrot.msg("Delete all data","Delete all data midi success!","success");
    }
}

var midi=new Midi();
carrot.midi=midi;
if(carrot.call_show_on_load_pagejs) carrot.midi.show();