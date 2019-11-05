
function getUser(){
    cargar();   
    let user = localStorage.getItem('user');
    $.post('/getUser', {user: user},
    function (data){
        document.getElementById("txtUsuario").value = data[0].username;
        document.getElementById("txtNombre").value = data[0].nombre;
        document.getElementById("txtPaterno").value = data[0].apellido_paterno;
        document.getElementById("txtMaterno").value = data[0].apellido_materno;
    });
}