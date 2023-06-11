class Ai_Lover{
    db;
    constructor(db_set) {
        this.db=db_set;
    }

    async show_all_chat(querySnapshot) {
        var html = '';
        html += '<table class="table">';
        html += '<thead class="thead-light">';
        html += '<tr>';
        html += '<th scope="col">ID</th>';
        html += '<th scope="col">Key</th>';
        html += '<th scope="col">Msg</th>';
        html += '<th scope="col">Icon</th>';
        html += '<th scope="col">Action</th>';
        html += '</tr>';
        html += '</thead>';
    
        html += '<tbody>';
        querySnapshot.forEach((doc) => {
            var data_chat=doc.data();
            data_chat["id"]=doc.id;
            html += '<tr>';
            html += '<th scope="row">'+data_chat['id']+'</th>';
            html += '<td>'+data_chat['key']+'</td>';
            html += '<td>'+data_chat['msg']+'</td>';
            html += '<td>'+data_chat['icon']+'</td>';
            html += '<td><button type="button" class="btn btn-dark ai_lover_del_chat" id_doc="'+data_chat['id']+'"><i class="fa-solid fa-trash"></i> Delete</button></td>';
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';
        $("#main_contain").html(html);
    }
}