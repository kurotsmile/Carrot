class Carrot_data{

    request=null;
    db=null;
    databaseName="";
    databaseVersion=1;

    constructor(databaseName, databaseVersion) {
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        if (!indexedDB) {
            console.log("Trình duyệt của bạn không hỗ trợ IndexedDB.");
        } else {
            console.log("IndexedDB đã được khai báo thành công trên trình duyệt của bạn.");
        }

        this.databaseName = databaseName;
        this.databaseVersion = databaseVersion;
        this.request = indexedDB.open(this.databaseName , databaseVersion);
        this.request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            this.db.createObjectStore("home",{keyPath: 'id_doc'});
            this.db.createObjectStore("apps",{keyPath: 'id_doc'});
            this.db.createObjectStore("app_info",{keyPath: 'id_doc'});
            this.db.createObjectStore("images",{keyPath: 'id_doc'});
            this.db.createObjectStore("stores",{keyPath: 'id_doc'});
            this.db.createObjectStore("icons",{keyPath: 'id_doc'});
            this.db.createObjectStore("icon_category",{keyPath: 'id_doc'});
            this.db.createObjectStore("football",{keyPath: 'id_doc'});
            this.db.createObjectStore("football_info",{keyPath: 'id_doc'});
            this.db.createObjectStore("background",{keyPath: 'id_doc'});
            this.db.createObjectStore("audio",{keyPath: 'id_doc'});
            this.db.createObjectStore("code",{keyPath: 'id_doc'});
            this.db.createObjectStore("code_info",{keyPath: 'id_doc'});
            this.db.createObjectStore("midi",{keyPath: 'id_doc'});
            this.db.createObjectStore("radio",{keyPath: 'id_doc'});
            this.db.createObjectStore("share",{keyPath: 'id_doc'});
            this.db.createObjectStore("floor",{keyPath: 'id_doc'});
            this.db.createObjectStore("ebook",{keyPath: 'id_doc'});
            this.db.createObjectStore("ebook_info",{keyPath: 'id_doc'});
            this.db.createObjectStore("ebook_category",{keyPath: 'id_doc'});
            this.db.createObjectStore("bible",{keyPath: 'id_doc'});
            this.db.createObjectStore("bible_info",{keyPath: 'id_doc'});
            this.db.createObjectStore("song",{keyPath: 'id_doc'});
            this.db.createObjectStore("song_info",{keyPath: 'id_doc'});
            this.db.createObjectStore("character_fashion",{keyPath: 'id_doc'});
            this.db.createObjectStore("user",{keyPath: 'id_doc'});
            this.db.createObjectStore("user_info",{keyPath: 'id_doc'});
        }
        this.request.onsuccess = () => {
            this.db = this.request.result;
        };
        this.request.onerror = () => {
            console.log("Connecting IndexDB Error","error");
        };
    }

    add(collection,data){
       this.db.transaction(collection, "readwrite").objectStore(collection).add(data);
    }

    get(collection,id_doc,act_done,act_fail){
        var request = this.db.transaction(collection).objectStore(collection).get(id_doc)
        request.onsuccess = (event) => {
            if(event.target.result==undefined)
                act_fail();
            else
                act_done(event.target.result);
        }
        request.onerror=()=>{
            act_fail();
        }
    }

    get_doc(collection,id_doc,act_done,act_fail){
        this.get(collection,id_doc,act_done,act_fail);
    }

    img(id_doc,url,emp){
        carrot.data.load_image(id_doc,url,emp);
    }

    load_image(id_doc,url,emp){
        this.get("images",id_doc,(d)=>{
            if(d){
                const imageUrl = URL.createObjectURL(d.data);
                if(d.data.size>500) $("."+emp).attr("src", imageUrl);
                else $("."+emp).attr("src","images/150.png");
            }else{
                $("."+emp).attr("src", url);
            }
        },()=>{
            fetch(url)
            .then(response => {
                if (!response.ok) {
                    $("."+emp).attr("src","images/150.png");
                }
                return response.blob();
            }).then(blob => {
                var data_img={id_doc:id_doc,data:blob};
                this.add("images",data_img);
                $("."+emp).attr("src",url);
            })
            .catch(error => {
                $("."+emp).attr("src", url);
            });
        });
    }

    list(collection) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(collection, "readonly");
            let objectStore = transaction.objectStore(collection);
            let items = [];

            objectStore.openCursor().onsuccess = (event) => {
                    let cursor = event.target.result;
                    if (cursor) {
                        items.push(cursor.value);
                        cursor.continue();
                    } else {
                        if(items.length==0)
                            reject();
                        else
                            resolve(items);
                    }
            };

            transaction.onerror = () => {
                reject("Error listing items");
            };
        });
    }

    clear(collection) {
        let transaction = this.db.transaction([collection], "readwrite");
        let objectStore = transaction.objectStore(collection);
        objectStore.clear();
    }
}