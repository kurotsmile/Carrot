function copy_tag(name_tag) {
    var $temp = $("<input>");$("body").append($temp);
    var s_copy=$("#" + name_tag).val();
    $temp.val(s_copy).select();
    document.execCommand("copy");$temp.remove();
}

function copy_txt_tag(name_tag) {
    var $temp = $("<input>");$("body").append($temp);
    var s_copy=$("#" + name_tag).html();
    $("#"+name_tag).addClass("text-success");
    $temp.val(s_copy).select();
    document.execCommand("copy");$temp.remove();
}

function tr(name_tag,lang_change) {
    var s_txt=$("#" + name_tag).html();
    $("#"+name_tag).addClass("text-success");
    if(lang_change=='zh') lang_change='zh-CN';
    var left  = ($(window).width()/2)-(900/2);
    top   = ($(window).height()/2)-(600/2);
    window.open("https://translate.google.com/?sl=en&tl="+lang_change+"&text="+s_txt,"Carrot_Translate","width=900, height=600, top="+top+", left="+left);
}

function tr_emp(name_tag,lang_tag,lang_change) {
    var s_txt=$("#" + name_tag).html();
    $("#"+name_tag).addClass("text-success");
    if(lang_change=='zh') lang_change='zh-CN';
    var left  = ($(window).width()/2)-(900/2);
    top   = ($(window).height()/2)-(600/2);
    window.open("https://translate.google.com/?sl="+lang_tag+"&tl="+lang_change+"&text="+s_txt,"Carrot_Translate","width=900, height=600, top="+top+", left="+left);
}

function tr_inp(name_tag,lang_tag,lang_change) {
    var s_txt=$("#" + name_tag).val();
    $("#"+name_tag).addClass("text-success");
    if(lang_change=='zh') lang_change='zh-CN';
    if(lang_tag=='zh') lang_tag='zh-CN';
    var left  = ($(window).width()/2)-(900/2);
    top   = ($(window).height()/2)-(600/2);
    window.open("https://translate.google.com/?sl="+lang_tag+"&tl="+lang_change+"&text="+s_txt,"Carrot_Translate","width=900, height=600, top="+top+", left="+left);
}

function paste_tag(name_tag) {
    navigator.clipboard.readText().then(text => {$("#"+name_tag).val(text.trim());});
}

function goto_ytb_download_mp3(url){
    if(url==""){ carrot.msg("Url not null!","error");return false;}
    var url_ytb=url.replace("youtube.com","youtubepp.com");
    window.open(url_ytb, "_blank");
}

function search_web(s_search,site='youtube'){
    var url_web='';
    if(site=='youtube') url_web="https://www.youtube.com/results?search_query="+s_search;
    if(site=='google') url_web="https://www.google.com/search?q="+s_search;
    window.open(url_web, "_blank");
}

function toLowerCase_tag(name_tag){
    var s_txt=$("#" + name_tag).val();
    s_txt=s_txt.toLowerCase();
    $("#" + name_tag).val(s_txt);
}

function delete_file(emp){
    Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure you want to delete the file '"+$(emp).attr("fullPath")+"' ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) carrot.del_file(emp);
    });
}
var carrot=new Carrot_Site();

$(document).ready(function () {
    $("#load_bar").css("width","0%");
    $("#head").hide();
    $("#head_nav").hide();
    $("#logo_carrot").on("contextmenu", function () { carrot.act_mode_dev(); return false; });
    $("#btn_recognition").click(function(){carrot.start_recognition();});

    var ContextMenu = [{
        icon: 'fa fa-home',
        label: 'Home Page',
        action:function(){carrot.home();},
        submenu: null,
        disabled: false
      },
      {
        icon: 'fa-solid fa-bag-shopping',
        label: 'Shop',
        action:function(){carrot.pay.list_product();},
        submenu: null,
        disabled: false
      },
      {
        icon: 'fa-solid fa-heart',
        label: 'About Us',
        action:function(){carrot.about_us.show_page();},
        submenu: null,
        disabled: false
      },
    ];
    
    $('body').on('contextmenu', function(e) {
      e.preventDefault();
      superCm.createMenu(ContextMenu, e);
    });
});
