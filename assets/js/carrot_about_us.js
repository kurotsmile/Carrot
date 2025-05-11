class Carrot_About_Us{

    constructor(){
        var btn_page=carrot.menu.create("about_us","About us").set_icon("fa-solid fa-heart").set_lang("about_us");
        $(btn_page).click(function(){carrot.about_us.show_page();});
    }

    show_page(){
        carrot.change_title_page("About Us", "?page=about_us","about_us");
        $(carrot.body).load(carrot.get_url()+"about_us/" + carrot.lang+".html?ver="+carrot.get_ver_cur("page"),function(){
            $(carrot.body).append(carrot.about_us.box_contact());
        });
        carrot.check_event();
    }

    box_contact(){
        var html='';
        html+='<div class="service px-4 py-5 pt-3">';
                html+='<div class="titie-row row mb-3">';
                    html+='<h2 class="fw-bolder">Contact</h2>';
                    html+='<p>If you have further questions or require more information about our Privacy Policy, please contact with me through addresses</p>';
                html+='</div>';

                html+='<div class="contact-row m-0 mt-5 row">';
                    html+='<div class="col-lg-4 col-md-6 mb-4">';
                        html+='<div class="shadow-md row p-4 m-0 rounded bg-white">';
                        html+='<div class="col-md-3 text-center align-self-center">';
                            html+='<i class="fa-solid fa-phone-volume fs-1"></i>';
                        html+='</div>';

                        html+='<div class="col-md-9">';
                        html+='<h6 class="fs-7 fw-bolder">Phone number</h6>';
                        html+='<ul>';
                        html+='<li>+84 097 8651 577</li>';
                        html+='<li>+91 889 2287 978</li>';
                        html+='</ul>';
                    html+='</div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="col-lg-4 col-md-6 mb-4">';
                html+='<div class="shadow-md row p-4 m-0 rounded bg-white">';
                    html+='<div class="col-md-3 text-center align-self-center">';
                        html+='<i class="fa-sharp fa-solid fa-envelopes-bulk fs-1"></i>';
                    html+='</div>';

                html+='<div class="col-md-9">'
                    html+='<h6 class="fs-7 fw-bolder">E-mail box</h6>';
                    html+='<ul>';
                        html+='<li>tranthienthanh93@gmail.com</li>';
                        html+='<li>tranrot93@gmail.com</li>';
                    html+='</ul>';
                html+='</div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="col-lg-4 col-md-6 mb-4">';
            html+='<div class="shadow-md row p-4 m-0  rounded bg-white">';
            html+='<div class="col-md-3 text-center align-self-center">';
            html+='<i class="fa-solid fa-map fs-1"></i>';
            html+='</div>';

               html+='<div class="col-md-9">';
               html+='<h6 class="fs-7 fw-bolder">Address</h6>';
               html+='<ul>';
               html+='<li>End of hamlet 5, Duong Son, Huong Toan, Huong Tra, TT Hue, Vietnam</li>';
               html+='</ul>';

               html+='</div>';
            html+='</div>';
        html+='</div>';
        html+='</div>';

        html+='<div id="contact" class="contact-row m-0 row">';
            html+='<div class="col-md-6">';
                html+='<div class="shadow-md p-4 rounded bg-white">';
                html+='<h4 class="fs-6 fw-bolder mb-3">Comments</h4>';
                html+='<div>';
                    html+='<div class="mb-3">';
                        html+='<label for="exampleFormControlInput1" class="form-label fw-bolder fs-8">Your e-mail</label>';
                        html+='<input type="email" class="form-control" id="contact_us_mail" placeholder="Enter Email Address">';
                    html+='</div>';

                    html+='<div class="mb-3">';
                        html+='<label for="exampleFormControlInput1" class="form-label fw-bolder fs-8">Mailbox title</label>';
                        html+='<input type="email" class="form-control" id="contact_us_subject" placeholder="Enter Subject">';
                    html+='</div>';

                    html+='<div class="mb-3">';
                        html+='<label for="exampleFormControlTextarea1" class="form-label fw-bolder fs-8">Content</label>';
                        html+='<textarea class="form-control" placeholder="Enter Message" id="contact_us_content" rows="3"></textarea>';
                    html+='</div>';

                    html+='<div class="mb-3">';
                        html+='<button class="form-control btn btn-success bg-success text-white" onclick="carrot.about_us.contact_done();return false;"><i class="fa-solid fa-paper-plane"></i> Done</button>';
                    html+='</div>';

                html+='</div>';
                html+='</div>';
            html+='</div>';

            html+='<div class="col-md-6">';
                html+='<div class="shadow-md p-4 rounded bg-white">';
                    html+='<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9097.414285908948!2d107.52464417996707!3d16.526525218812548!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141a71c8ea9125d%3A0x98d4603894583159!2zVGjhu4t0IENow7MgVGhp4buHbiBUdXnhur9uIOG7nyBodeG6vyBtdWEgYsOhbiBjaMOzIHRo4buLdA!5e0!3m2!1spt-PT!2s!4v1686244019774!5m2!1spt-PT!2s" style="width:100%" height="340" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
                html+='</div>';
                html+='</div>';
                html+='</div>';
            html+='</div>';
        html+='</div>';
        return html;
    }

    contact_done(){
        var is_error=false;
        var contact_us_mail=$("#contact_us_mail").val();
        var contact_us_subject=$("#contact_us_subject").val();
        var contact_us_content=$("#contact_us_content").val();
        
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_us_mail)==false){
            is_error=true;
            carrot.msg("Email is formatted wrong and cannot be blank!","alert");
        }

        if(contact_us_subject.trim()==""&&is_error==false){
            is_error=true;
            carrot.msg("subject cannot be empty!","alert");
        }

        if(contact_us_content.trim()==""&&is_error==false){
            is_error=true;
            carrot.msg("Content cannot be empty!","alert");
        }

        if(is_error==false){
            var obj_contact={};
            obj_contact["mail"]=contact_us_mail;
            obj_contact["subject"]=contact_us_subject;
            obj_contact["content"]=contact_us_content;
            carrot.loading();
            carrot.server.add_doc("about_us",carrot.server.convertToFirestoreData(obj_contact),(data)=>{
                carrot.msg("Send successs!","success");
                $("#contact_us_mail").val('');
                $("#contact_us_subject").val('');
                $("#contact_us_content").val('');
            });
        }
    }
}