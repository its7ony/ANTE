function crear(){
    let user = document.getElementById("txtUsuario").value;
    let name = document.getElementById("txtNombre").value;
    let paterno = document.getElementById("txtPaterno").value;
    let materno = document.getElementById("txtMaterno").value;
    let pwd = user+new Date()+paterno[0]+materno[0];
    pwd = md5(pwd);
    pwd = pwd[0] + pwd[1] + pwd[2] + pwd[3] + pwd[4];
    alert("Su contraseña es: "+pwd);
    debugger;
    $.post('/createEmployee', {username: user, clave:pwd , nombre: name , apellido_paterno: paterno, apellido_materno: materno, rol: 1, disponible:true , estatus: 1},
    function (data){
        if(data == "OK"){
            alert("Repartidor Guardado Correctamente"); 
            window.location.href= "http://localhost:3000/employees";
        }
    });
}
