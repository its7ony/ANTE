
function getUser(){
    cargar();   
    let user = localStorage.getItem('user');
    $.post('/getUser', {user: user},
    function (data){
        document.getElementById("txtUsuario").value = data[0].username;
        document.getElementById("txtNombre").value = data[0].nombre;
        document.getElementById("txtPaterno").value = data[0].apellido_paterno;
        document.getElementById("txtMaterno").value = data[0].apellido_materno;
        document.getElementById("txtPwd").value = data[0].clave;
    });
}


function updateUser(){
    let user = document.getElementById("txtUsuario").value;
    let name = document.getElementById("txtNombre").value;
    let paterno = document.getElementById("txtPaterno").value;
    let materno = document.getElementById("txtMaterno").value;
    let pwd = document.getElementById("txtPwd").value;
    if(user != "" && name != "" && paterno != "" && materno != "" && pwd != ""){
        $.post('/editUser', {username: user, clave:pwd , nombre: name , apellido_paterno: paterno, apellido_materno: materno, rol: 1, estatus: 1},
        function (data){
            if(data == "OK"){
                alertify
                    .success("Información Actualizada Correctamente", function () {
                        window.location.reload;
                    });
            }else{
                alertify
                    .warning("Error al actualizar sus datos", function () {
                        window.location.reload;
                    });
            }
        });
    }
}