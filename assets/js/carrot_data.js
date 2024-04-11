class Carrot_data{
    constructor(databaseName, databaseVersion) {
        this.databaseName = databaseName;
        this.databaseVersion = databaseVersion;
        this.db = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.databaseName, this.databaseVersion);

            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                db.createObjectStore("images", { keyPath: "id" });
            };

            request.onsuccess = function(event) {
                this.db = event.target.result;
                resolve();
            }.bind(this);

            request.onerror = function(event) {
                reject("Error opening IndexedDB");
            };
        });
    }

    loadImageOrSaveToIndexedDB(imageUrl,id,id_emp) {
        const transaction = this.db.transaction(["images"], "readonly");
        const objectStore = transaction.objectStore("images");
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = function(event) {
            const imageData = event.target.result;
            if (imageData) {
                const imageBlob = imageData.image;
                const imageUrl = URL.createObjectURL(imageBlob);
                $(`#${id_emp}`).attr("src", imageUrl);
            } else {
                this.saveImageToIndexedDB(imageUrl, id,id_emp);
            }
        }.bind(this);

        getRequest.onerror = function(event) {
            console.log("Error reading image from IndexedDB ("+id+")");
        };
    }

    saveImageToIndexedDB(imageUrl, id,id_emp) {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const transaction = this.db.transaction(["images"], "readwrite");
                const objectStore = transaction.objectStore("images");
                objectStore.put({ id: id, image: blob });
                $(`#${id_emp}`).attr("src", imageUrl);
            })
            .catch(error => {
                console.error('Error fetching image: '+id, error);
            });
    }

    loadImageByUrl(imageUrl, id,id_emp) {
        this.init()
        .then(() => {
            this.loadImageOrSaveToIndexedDB(imageUrl, id,id_emp);
        })
        .catch(error => {
            console.error(error);
        });
    }
}