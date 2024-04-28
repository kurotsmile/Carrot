class Carrot_data{

    request=null;
    db=null;
    databaseName="";
    databaseVersion=1;

    constructor(databaseName, databaseVersion) {
        this.databaseName = databaseName;
        this.databaseVersion = databaseVersion;
        this.request = indexedDB.open(this.databaseName , databaseVersion);
        this.request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            this.db.createObjectStore("apps",{keyPath: 'id_doc'});
            this.db.createObjectStore("app_info",{keyPath: 'id_doc'});
            this.db.createObjectStore("images",{keyPath: 'id_doc'});
            this.db.createObjectStore("stores",{keyPath: 'id_doc'});
            this.db.createObjectStore("icons",{keyPath: 'id_doc'});
            this.db.createObjectStore("icon_category",{keyPath: 'id_doc'});
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

    load_image(id_doc,url,emp){
        this.get("images",id_doc,(d)=>{
            if(d){
                const imageUrl = URL.createObjectURL(d.data);
                if(d.data.size>500) $("#"+emp).attr("src", imageUrl);
                else $("#"+emp).attr("src","images/150.png");
            }else{
                $("#"+emp).attr("src", url);
            }
        },()=>{
            fetch(url)
            .then(response => response.blob())
            .then(blob => {
                var data_img={id_doc:id_doc,data:blob};
                this.add("images",data_img);
                $("#"+emp).attr("src",url);
            })
            .catch(error => {
                $("#"+emp).attr("src","images/150.png");
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