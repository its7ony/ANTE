function iniciar(){
    if(localStorage.getItem('user')!= null){
        window.location.href = "http://localhost:3000/main";
    }
}

function enviar(){
    let usuario = document.getElementById('txtUser').value;
    let passw = document.getElementById('txtPwd').value;
    if(usuario != "" && passw != ""){
        $.post('/home', {user: usuario, pwd: passw},
             function (data,status){
               if(data.length > 0){
                    localStorage.setItem('user',data[0].username.toString());
                    window.location.href= "http://localhost:3000/main";
               }else{
                   alert("Usuario o Contraseña Incorrecto");
               }
            });
    }
    
}
function cargar(){
    validar();
    document.getElementById("identity_name").textContent = localStorage.getItem('user');
}

function validar(){
    if(localStorage.getItem('user') == null){
        window.location.href = "http://localhost:3000/";
    }else{
        let user = localStorage.getItem('user');
        $.post('/validate', {user: user},
        function (data){
          if(data == 0){
              return true;
          }else{
            window.location.href = "http://localhost:3000/";
          }
       });
    }
}

function salir(){
    localStorage.clear();
    window.location.href = "http://localhost:3000/";
}
