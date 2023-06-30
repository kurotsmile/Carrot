class Ai_Lover{
    key_block;
    chat;
    carrot;
    
    constructor(carrot) {
        this.carrot=carrot;
        this.chat=new AI_Chat(this.carrot);
        this.key_block=new AI_Key_Block(this.carrot);

        carrot.menu.create("character_fashion").set_label("Character fashion").set_icon("fa-solid fa-shirt").set_type("dev");
        var btn_test_pay=carrot.menu.create("test_pay").set_label("Test Play").set_icon("fa-brands fa-paypal").set_type("dev");
        $(btn_test_pay).click(function(){
            carrot.ai.test_upload_file();
        });
    }

    test_upload_file(){
        var html='';
        html+=' <input type="file" id="file" name="file"/>';
        this.carrot.show(html);
        document.getElementById('file').addEventListener('change', this.file_upload, false);
    }

    file_upload(evt){
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.target.files[0];
        var r=carrot.storage.ref();
        var metadata = {'contentType': file.type};
        r.child('images/' + file.name).put(file, metadata).then(function (snapshot) {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log('File metadata:', snapshot.metadata);
            snapshot.ref.getDownloadURL().then(function (url) {
                console.log('File available at', url);
            });
        }).catch(function (error) {
            console.error('Upload failed:', error);
        });
    }
}