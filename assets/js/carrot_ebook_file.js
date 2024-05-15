class Carrot_Ebook_File{

    title='Undefined';
    lang='en';
    description='';
    author='';
    type='';

    container_xml='';
    content_opf='';

    toc_ncx='';
    chapters=Array();
    data_img_cover=null;

    constructor(){
        this.container_xml+='<?xml version="1.0" encoding="UTF-8"?>';
        this.container_xml+='<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">';
            this.container_xml+='<rootfiles>';
                this.container_xml+='<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>';
            this.container_xml+='</rootfiles>';
        this.container_xml+='</container>';
    }

    set_title(title){
        this.title=title;
        return this;
    }

    set_name(name){
        return this.set_title(name);
    }

    set_lang(lang){
        this.lang=lang;
        return this;
    }

    set_author(name){
        this.author=name;
        return this;
    }

    set_description(description){
        this.description=description;
        return this;
    }

    set_type(type){
        this.type=type;
        return this;
    }

    add_chapter(s_chapter_title,s_chapter_content){
        this.chapters.push({title:s_chapter_title,content:s_chapter_content});
        return this;
    }

    set_data_image_cover(data){
        this.data_img_cover=data;
        return this;
    }

    set_cover(data){
        return this.set_data_image_cover(data);
    }

    download(){
        var zip=new JSZip();
        var ebook_file=this;

        this.toc_ncx+='<?xml version="1.0" encoding="UTF-8"?>';
        this.toc_ncx+='<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">';
        this.toc_ncx+='<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">';

            this.toc_ncx+='<head>';
                this.toc_ncx+='<meta name="dtb:uid" content="urn:uuid:7a8a677c-ed6b-4ea1-a2dd-d46f4c886a73"/>';
                this.toc_ncx+='<meta name="dtb:depth" content="1"/>';
                this.toc_ncx+='<meta name="dtb:totalPageCount" content="0"/>';
                this.toc_ncx+='<meta name="dtb:maxPageNumber" content="0"/>';
            this.toc_ncx+='</head>';

            this.toc_ncx+='<docTitle>';
                this.toc_ncx+='<text>'+ebook_file.title+'</text>';
            this.toc_ncx+='</docTitle>';

            this.toc_ncx+='<navMap>';
                
                if(this.data_img_cover!=null){
                    this.toc_ncx+='<navPoint id="navPoint-0" playOrder="0">';
                    this.toc_ncx+='<navLabel><text>Cover</text></navLabel>';
                    this.toc_ncx+='<content src="Text/cover.xhtml"/>';
                    this.toc_ncx+='</navPoint>';
                }

                for(var i=0;i<this.chapters.length;i++){
                    this.toc_ncx+='<navPoint id="navPoint-'+(i+1)+'" playOrder="'+(i+1)+'">';
                    this.toc_ncx+='<navLabel><text>'+this.chapters[i].title+'</text></navLabel>';
                    this.toc_ncx+='<content src="Text/chapter_'+i+'.xhtml"/>';
                    this.toc_ncx+='</navPoint>';
                }
            this.toc_ncx+='</navMap>';

        this.toc_ncx+='</ncx>';

        this.content_opf+='<?xml version="1.0" encoding="utf-8"?>';
        this.content_opf+='<package version="2.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">';

            this.content_opf+='<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">';
                this.content_opf+='<dc:identifier opf:scheme="UUID" id="BookId">urn:uuid:7a8a677c-ed6b-4ea1-a2dd-d46f4c886a73</dc:identifier>';
                this.content_opf+='<dc:language>'+this.lang+'</dc:language>';
                this.content_opf+='<dc:title>'+this.title+'</dc:title>';
                if(this.description!='') this.content_opf+='<dc:description>'+this.description+'</dc:description>';
                if(this.author!='') this.content_opf+='<dc:creator opf:role="aut">'+this.author+'</dc:creator>';
                if(this.type!='') this.content_opf+='<dc:type>'+this.type+'</dc:type>';
                this.content_opf+='<meta name="Carrot Ebook version" content="1.9.30"/>';
                this.content_opf+='<dc:date opf:event="modification" xmlns:opf="http://www.idpf.org/2007/opf">2023-07-16</dc:date>';
                if(this.data_img_cover!=null) this.content_opf+='<meta name="cover" content="cover" />';
            this.content_opf+='</metadata>';

            this.content_opf+='<manifest>';
                if(this.data_img_cover!=null){
                    this.content_opf+='<item id="cover" href="images/cover.jpeg" media-type="image/jpeg"/>';
                    this.content_opf+='<item id="coverxml" href="Text/cover.xhtml" media-type="application/xhtml+xml"/>';
                }
                this.content_opf+='<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>';
                for(var i=0;i<this.chapters.length;i++){
                    this.content_opf+='<item id="chapter_'+i+'" href="Text/chapter_'+i+'.xhtml" media-type="application/xhtml+xml"/>';
                };
            this.content_opf+='</manifest>';

            this.content_opf+='<spine toc="ncx">';
                if(this.data_img_cover!=null)this.content_opf+='<itemref idref="coverxml"/>';
                for(var i=0;i<this.chapters.length;i++){
                    this.content_opf+='<itemref idref="chapter_'+i+'"/>';
                };
            this.content_opf+='</spine>';

        this.content_opf+='</package>';

        
        zip.file("mimetype","application/epub+zip");
        zip.file("META-INF/container.xml",this.container_xml);
        zip.file("OEBPS/toc.ncx",this.toc_ncx);
        zip.file("OEBPS/content.opf",this.content_opf);

        for(var i=0;i<this.chapters.length;i++){
            var xhtml='';
            xhtml+='<?xml version="1.0" encoding="utf-8"?>';
            xhtml+='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
            xhtml+='<html xmlns="http://www.w3.org/1999/xhtml">';
            xhtml+='<head><title>Chapter '+(i+1)+'</title></head>';
            xhtml+='<body>';
                xhtml+='<h2>'+this.chapters[i].title+'</h2>';
                xhtml+=this.chapters[i].content;
            xhtml+='</body>';
            xhtml+='</html>';
            zip.file("OEBPS/Text/chapter_"+i+".xhtml",xhtml);
        };

        if(this.data_img_cover!=null){
            var xhtml_cover='';
            xhtml_cover+='<?xml version="1.0" encoding="utf-8"?>';
            xhtml_cover+='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
            xhtml_cover+='<html xmlns="http://www.w3.org/1999/xhtml">';
                xhtml_cover+='<head>';
                    xhtml_cover+='<title>Cover Image</title>';
                    xhtml_cover+='<meta content="http://www.w3.org/1999/xhtml; charset=utf-8" http-equiv="Content-Type"/>';
                xhtml_cover+='</head>';
                xhtml_cover+='<body>';
                xhtml_cover+='<div class="body">';
                    xhtml_cover+='<img alt="cover" style="max-width: 100%;max-height: 100%;height: auto;width: auto;" src="../images/cover.jpeg"/>';
                xhtml_cover+='</div>';
                xhtml_cover+='</body>';
            xhtml_cover+='</html>';
            zip.file("OEBPS/Text/cover.xhtml",xhtml_cover);
            zip.file("OEBPS/images/cover.jpeg",this.data_img_cover);
        }

        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content,ebook_file.title+".epub");
        });
    }
}