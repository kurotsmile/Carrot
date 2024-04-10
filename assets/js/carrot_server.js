class Carrot_Server{
    get_doc(act_done){
        fetch(carrot.config.url_server_rest_api[carrot.index_server]+"/app")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
              return response.json();
            })
            .then((data) => {
              act_done(this.simplifyDocument(data));
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
                return simplifyDocument(item.mapValue.fields);
              }
            });
          } else if ('mapValue' in value) {
            simplifiedObject[key] = simplifyDocument(value.mapValue.fields);
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