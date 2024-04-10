class Carrot_Query{
    
    collections=[];
    select_fields=[];
    filters_search=[];

    constructor(collection){
        var coll={};
        coll["collectionId"]=collection;
        this.collections.push(coll);
    }

    add_select(name_field){
        var field={};
        field["fieldPath"]=name_field;
        this.select_fields.push(field);
    }

    add_where(field_name,searchValue,op="EQUAL"){
        var Filter={};
        var fieldFilter={};
        var f={};
        var v={};
        f["fieldPath"]=field_name;
        v["stringValue"]=searchValue;
        fieldFilter["field"]=f;
        fieldFilter["op"]=op;
        fieldFilter["value"]=v;
        Filter["fieldFilter"]=fieldFilter;
        this.filters_search.push(Filter);
    }

    toJson(){
        var query={};
        var structuredQuery={};
        if(this.select_fields.length>0) structuredQuery["select"]={fields: this.select_fields};
        structuredQuery["from"]=this.collections;
        structuredQuery["where"]={compositeFilter: {op: 'AND',filters: this.filters_search}};
        query["structuredQuery"]=structuredQuery;
        return JSON.stringify(query);
    }

    get_data(act_done){
        fetch(carrot.config.url_server_rest_api[carrot.index_server]+":runQuery", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: this.toJson()
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
            var list=[];
            for(var i=0;i<data.length;i++){
                list.push(carrot.server.simplifyDocument(data[i].document.fields));
            }
            act_done(list);
          })
          .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
          });
    }
}

class Carrot_Server{
    get_collection(collection,act_done){
        fetch(carrot.config.url_server_rest_api[carrot.index_server]+"/"+collection)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
              return response.json();
            })
            .then((data) => {
                var list=[];
                for(var i=0;i<data.documents.length;i++){
                    list.push(this.simplifyDocument(data.documents[i].fields));
                }
                act_done(list);
            }).catch((error) => {console.log('failed', error);});
    }

    get_doc(collection,document,act_done){
        fetch(carrot.config.url_server_rest_api[carrot.index_server]+"/"+collection+"/"+document)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
              return response.json();
            })
            .then((data) => {
                act_done(this.simplifyDocument(data.fields));
            }).catch((error) => {console.log('failed', error);});
    }

    simplifyDocument(fields) {
        const simplifiedObject = {};
        for (const [key, value] of Object.entries(fields)) {
          if ('stringValue' in value) {
            simplifiedObject[key] = value.stringValue;
          } else if ('integerValue' in value) {
            simplifiedObject[key] = parseInt(value.integerValue);
          } else if ('doubleValue' in value) {
            simplifiedObject[key] = parseFloat(value.doubleValue);
          } else if ('booleanValue' in value) {
            simplifiedObject[key] = value.booleanValue;
          } else if ('arrayValue' in value) {
            simplifiedObject[key] = value.arrayValue.values.map(item => {
              if ('stringValue' in item) {
                return item.stringValue;
              } else if ('integerValue' in item) {
                return parseInt(item.integerValue);
              } else if ('doubleValue' in item) {
                return parseFloat(item.doubleValue);
              } else if ('booleanValue' in item) {
                return item.booleanValue;
              } else {
                return carrot.server.simplifyDocument(item.mapValue.fields);
              }
            });
          } else if ('mapValue' in value) {
            simplifiedObject[key] = carrot.server.simplifyDocument(value.mapValue.fields);
          }
        }
        return simplifiedObject;
    }

    convertToFirestoreData(simplifiedObject) {
        const firestoreData = {};
      
        for (const [key, value] of Object.entries(simplifiedObject)) {
          if (typeof value === 'string') {
            firestoreData[key] = {
              stringValue: value
            };
          } else if (typeof value === 'number' && Number.isInteger(value)) {
            firestoreData[key] = {
              integerValue: value
            };
          } else if (typeof value === 'number' && !Number.isInteger(value)) {
            firestoreData[key] = {
              doubleValue: value
            };
          } else if (typeof value === 'boolean') {
            firestoreData[key] = {
              booleanValue: value
            };
          } else if (Array.isArray(value)) {
            firestoreData[key] = {
              arrayValue: {
                values: value.map(item => {
                  if (typeof item === 'string') {
                    return { stringValue: item };
                  } else if (typeof item === 'number' && Number.isInteger(item)) {
                    return { integerValue: item };
                  } else if (typeof item === 'number' && !Number.isInteger(item)) {
                    return { doubleValue: item };
                  } else if (typeof item === 'boolean') {
                    return { booleanValue: item };
                  } else {
                    return { mapValue: { fields: convertToFirestoreData(item) } };
                  }
                })
              }
            };
          } else if (typeof value === 'object') {
            firestoreData[key] = {
              mapValue: {
                fields: convertToFirestoreData(value)
              }
            };
          }
        }
      
        return firestoreData;
    }
}