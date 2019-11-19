
function getEmployees(){
    cargar();   
    $.post('/getEmployees',
    function (data){
        if(data[0]!=[]){
            let html = "";
            const array = data;
            const Tab = document.querySelector('#Empleados');
            
            array.map((info,i)=>{
                html = html + `
                <tr>
                    <td>
                        <img src="images/users/default-user.png" class="img-fluid img-thumbnail" width="100">
                    </td>
                    <td id="lblName${i+1}">${info.nombre+" "+info.apellido_paterno+" "+info.apellido_materno}</td> 
                    <td id="lblUserName${i+1}">${info.username}</td>
                    <td id="lblRole${i+1}">Repartidor</td>
                    <td>
                        <button id="btnDelete-user${i+1}" class="btn btn-danger" onclick="deleteEmployee(${(i+1)})"/>Eliminar
                    </td>
                </tr>`;
            });
         
             Tab.innerHTML = html;    
        }
    });
}



function deleteEmployee(id){
    let usuario = "lblUserName"+id;
    usuario = document.getElementById(usuario).textContent;
    $.post('/deleteEmploye', {user: usuario},
    function (data){
        if(data == "OK"){
            getEmployees();
        }
    });
}