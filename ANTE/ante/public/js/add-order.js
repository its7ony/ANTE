let lugares = [];
$(document).ready(function (){
  function initMap() {
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: {
        lat: 21.1523342,
        lng: -101.7135019,
      },
      zoom: 14
    });
 
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
 
    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
    
    google.maps.event.addListener(searchBox, 'places_changed', function() {
     var places = searchBox.getPlaces();
 
     if (places.length == 0) {
       return;
     }
     
     for (var i = 0, marker; marker = markers[i]; i++) {
       marker.setMap(null);
     }
 
     // For each place, get the icon, place name, and location.
     markers = [];
     var bounds = new google.maps.LatLngBounds();
     for (var i = 0, place; place = places[i]; i++) {
       var image = {
         url: place.icon,
         size: new google.maps.Size(71, 71),
         origin: new google.maps.Point(0, 0),
         anchor: new google.maps.Point(17, 34),
         scaledSize: new google.maps.Size(25, 25)
       };
 
       // Create a marker for each place.
       var marker = new google.maps.Marker({
         map: map,
         icon: image,
         title: place.name,
         position: place.geometry.location
       });
       
       const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Importante',
        text: '¿Deseas agregar '+marker.title+' a la lista?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          lugares.push(marker);
          swalWithBootstrapButtons.fire(
            '¡Enhorabuena!',
            'Has agregado '+marker.title+' a la lista',
            'success'
          )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'No se ha agregado '+marker.title+' a la lista',
            'error'
          )
        }
      })
       
       document.getElementById("pac-input").value = "";
       bounds.extend(place.geometry.location);
     }
 
        map.fitBounds(bounds);
   });
    
     google.maps.event.addListener(map, 'bounds_changed', function() {
     var bounds = map.getBounds();
     searchBox.setBounds(bounds);
   });
         
}
  google.maps.event.addDomListener(window, 'load', initMap);
});

  function cerrarModal(id){
    if(id == 0){
      let modal = document.getElementById("modalRutas");
      modal.style.display = "none";
    }
    if(id == 1){
      let modal = document.getElementById("modalRepartidores");
      modal.style.display = "none";
    }
   
  }

  function modalRuta(){
    let modal = document.getElementById("modalRutas");
    modal.style.display = "block";

    //CERRAR MODAL DESDE CUALQUIER PUNTO
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  }

function enable(){
    if($("#txtDescripcion").val() != ""){
        $('#btnRuta').prop('disabled', false);
    }else{
        $('#btnRuta').prop('disabled', true);
    }
}

function repartidores(){
  if(lugares.length>0){
    $.post('/getEmployeesA',function (data){
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
                      <button id="btnUser${i+1}" class="btn btn-danger" onclick="crearOrden(${(i+1)})"/>Aceptar
                  </td>
              </tr>`;
          });
       
           Tab.innerHTML = html;   
           $("#modalRepartidores").modal('show'); 
      }
  });
  }else{
   Swal.fire("Debes seleccionar al menos una ruta en el mapa");
  }
  
}

function crearOrden(id){

  let coordenadas = [];
  let usuario = "lblUserName"+id;
    usuario = document.getElementById(usuario).textContent;
  let date = new Date();
  let fecha = crearFecha();
  let tiempo = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  lugares.forEach(x => {
    let lugar = {lat:x.position.lat(),lng: x.position.lng()};
    coordenadas.push(lugar);
  });
  let descripcion = $("#txtDescripcion").val();

  let ruta = {
    id:usuario+"_"+fecha+"_"+tiempo,
    estatus:0,
    fecha: fecha,
    coordenadas:{
        coordenadas
    },
    descripcion: descripcion,
    repartidor: usuario,
    tiempo_Inicial: tiempo,
    tiempo_Final: ""
  }

  $.post('/createRoute', {route:JSON.stringify(ruta)},
  function (data){
      if(data == "OK"){
        actualizarEmpleado(usuario)
      }
  });
}

function actualizarEmpleado(usuario){
  $.post('/updateEmployee', {user: usuario},
  function (data){
      if(data == "OK"){
         window.location.href = "http://localhost:3000/orders";
      }
  });
}