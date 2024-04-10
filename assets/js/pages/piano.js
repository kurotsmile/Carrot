class Midi{

    objs=null;

    note_frequency=null;
    footnotes_frequency=null;
    index_note_play=-1;
    intervalID_midi_play=null;
    length_note_midi_play=-1;
    oscillators=[];

    constructor(){
        $('head').append('<link id="style_obj_midi" href="assets/css/piano_midi.css?'+carrot.get_ver_cur("js")+'" rel="stylesheet" type="text/css"/>');
        this.objs=JSON.parse(localStorage.getItem("objs_midi"));
        this.note_frequency=[65.40639,73.41619,82.40689,87.30706,97.99886,110.0000,123.4708,130.8128,146.8324,164.8138,174.6141,195.9977,220.0000,246.9417,261.6256,293.6648,329.6276,349.2282,391.9954,440.0000,493.8833,523.2511,587.3295,659.2551,698.4565,783.9909,880.0000,987.7666,1046.502,1174.659,1318.510,1396.913,1567.982,1760.000,1975.533,2093.005];
        this.footnotes_frequency=[69.29566,77.78175,92.49861,103.8262,116.5409,138.5913,155.5635,184.9972,207.6523,233.0819,277.1826,311.1270,369.9944,415.3047,466.1638,1108.731,1244.508,1479.978,1661.219,1864.655];
    }

    show(){
        var id_midi=carrot.get_param_url("id");
        if(id_midi!=undefined)
            this.show_midi_by_id(id_midi);
        else
            this.show_list();
    }

    show_list(){
        carrot.show_loading_page();
        carrot.change_title_page("List Midi","?page=piano","midi");

        if(this.objs!=null)
            this.show_list_by_objs(this.objs);
        else
            this.Get_list_from_server_and_show();
    }

    Get_list_from_server_and_show(){
        carrot.db.collection("Midi Piano Editor").limit(200).get().then((querySnapshot) => {
            if(querySnapshot.docs.length>0){
                carrot.midi.objs=Object();
                querySnapshot.forEach((doc) => {
                    var data=doc.data();
                    data["id"]=doc.id;
                    carrot.midi.objs[doc.id]=data;
                }); 

                localStorage.setItem("objs_midi",JSON.stringify(carrot.midi.objs));
                carrot.midi.show_list_by_objs(carrot.midi.objs);
            }
        });
    }

    show_list_by_objs(midis){
        midis=carrot.convert_obj_to_list_array(midis);
        carrot.show('<div id="all_item" class="row m-0"></div>');
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
        var  data_index=data.data_index;
        var s_icon="";
        var s_color_status="";
        var html="";

        if(data.status=="public"){
            s_icon="fa-solid fa-guitar";
            s_color_status="text-success";
        }else{
            s_icon="fa-brands fa-hashnode";
            s_color_status="text-warning";
        }

        html+='<div class="fs-9 '+s_color_status+'"><i class="fa-solid fa-dice-d6"></i> status: '+data.status+'</div>';
        html+='<div class="fs-9 "><i class="fa-solid fa-gauge-high"></i> Speed: '+data.speed;
        if(data.category!=null) html+='  <i class="fa-solid fa-music"></i> Category: '+data.category;
        html+='</div>';
        html+='<div class="fs-9"><i class="fa-solid fa-music"></i> Note: '+data_index.length+'</div>';
        
        var item_obj=new Carrot_List_Item(carrot);
        item_obj.set_db("Midi Piano Editor");
        item_obj.set_icon_font(s_icon+" "+s_color_status+" fa-3x midi_icon");
        item_obj.set_id(data.id);
        item_obj.set_title(data.name);
        item_obj.set_class_body("col-10");
        item_obj.set_class_icon_col("col-2");
        item_obj.set_body(html);
        item_obj.set_act_edit("carrot.midi.edit");
        return item_obj;
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
        carrot.change_title_page(data.name,"?page=piano&id="+data.id,"Midi");
        var html='<div class="section-container p-2 p-xl-4">';
            html+='<div class="row">';
                html+='<div class="col-md-8 ps-4 ps-lg-3">';
                    html+='<div class="row bg-white shadow-sm">';

                        html+='<div class="col-md-4 p-3 text-center">';
                            html+='<i class="fa-solid fa-guitar fa-5x"></i><br/>';
                        html+='</div>';

                        html+='<div class="col-md-8 p-2">';
                            html+='<h4 class="fw-semi fs-4 mb-3">'+data.name+'</h4>';
                        html+='</div>';

                        html+='<div class="row pt-4">';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="file">File</l> <i class="fa-solid fa-file-code"></i></b>';
                                html+='<p id="filename_code">'+data.name+'.midi</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="category">Category</l> <i class="fa-solid fa-boxes-packing"></i></b>';
                                html+='<p>'+data.category+'</p>';
                            html+='</div>';
                            html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="speed">Interface</l> <i class="fa-solid fa-brush"></i></b>';
                                html+='<p>'+data.speed+'</p>';
                            html+='</div>';
                            if(data.user_id!=null){
                                html+='<div class="col-md-4 col-6 text-center">';
                                html+='<b><l class="lang" key_lang="author">Author</l> <i class="fa-solid fa-user-nurse"></i></b>';
                                html+='<p>'+data.user_id+'</p>';
                                html+='</div>';
                            }
                        html+='</div>';

                        html+='<div class="row pt-4 pb-4">';
                            html+='<div class="col-12 text-center">';
                            html+='<button id="btn_share" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-share-nodes"></i> <l class="lang" key_lang="share">Share</l> </button> ';
                            html+='<a id="register_protocol_url" href="midi://show/'+data.id+'" type="button"  class="btn d-inline btn-success" ><i class="fa-solid fa-rocket"></i> <l class="lang" key_lang="open_with">Open with..</l> </a> ';
                            if(carrot.midi.check_pay(data.id))
                                html+='<button id="btn_download" type="button" class="btn d-inline btn-success"><i class="fa-solid fa-download"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                            else
                                html+='<button id="btn_download" type="button" class="btn d-inline btn-info"><i class="fa-brands fa-paypal"></i> <l class="lang" key_lang="download">Download</l> </button> ';
                            html+='</div>';
                        html+='</div>';

                    html+='</div>';

                    var midi_notes=JSON.parse(data.data_index);
                    var type_notes=JSON.parse(data.data_type);
                    carrot.midi.length_note_midi_play=midi_notes[0].length;
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

                html+='</div>';

                html+='<div class="col-md-4">';
                html+='<h4 class="fs-6 fw-bolder my-3 mt-2 mb-3 lang"  key_lang="related_midi">Related Midi</h4>';
                var list_midi_other= carrot.convert_obj_to_list_array(carrot.midi.objs).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
                for(var i=0;i<list_midi_other.length;i++){
                    if(i>=10) break;
                    if(data.id!=list_midi_other[i].id) html+=carrot.midi.box_item(list_midi_other[i]).set_class('col-md-12 mb-3').html();
                };
                html+='</div>';

            html+='</div>';
        html+='</div>';
        carrot.show(html);
        carrot.midi.check_event();
    }

    check_event(){
        $(".midi_icon").click(function(){
            var obj_id=$(this).attr("obj_id");
            carrot.midi.show_midi_by_id(obj_id);
        });
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
}

var midi=new Midi();
carrot.midi=midi;
midi.show();