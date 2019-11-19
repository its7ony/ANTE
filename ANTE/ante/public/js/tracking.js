let lugares = [];
let customMarker = null;
let customMarkers = [];
let drawRuta = null;

function clearMarkers() {
    customMarkers.forEach(m=> m.setMap(null));
    customMarkers = [];
    if(drawRuta != null){
        drawRuta.setMap(null);
    }
}

function initMap() {
    let matrizANTE = new google.maps.LatLng(21.150908,-101.71110470000002);
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;

   var mapDiv = document.getElementById('map');

   var mapOptions = {
       center: matrizANTE,
       zoom:15,
       zoomControl:true,
       mapTypeControl: true,
       mapTypeControlOptions: {
       style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
       mapTypeIds: ['roadmap', 'terrain','satellite','hybrid']
        }
   }
    map = new google.maps.Map(mapDiv,mapOptions);
}

function obtenerPendientes(){
    let Tab = document.getElementById('Pendientes');
    cargar();   
    $.post('/traerRutasPendientes',
        function (data){
            let html = "";
            if(data[0]!=[]){
               
                lugares = data;
                data.map((info,i)=>{
                    html = html + `<option value="${info.id}">${info.id}_${info.descripcion}</option>`
                }
            )};
        Tab.innerHTML = html;    
    });
}

function traerRuta(){
    clearMarkers();
    let id = document.getElementById("Pendientes").selectedIndex;
    let ruta = lugares[id];

    //AGREGAR MATRIZ//
    let matriz = {lat:21.150908,lng:-101.71110470000002}
    ruta.coordenadas.coordenadas.push(matriz);

    //ORDENAR COORDENADAS//
    ruta.coordenadas.coordenadas.sort( function (a, b) {
        let diffA = (Number(a.lat) - matriz.lat) + (Number(a.lng) - matriz.lng);
        let diffB = (Number(b.lat) - matriz.lat) + (Number(b.lng) - matriz.lng);
        if(diffA > diffB){
            return 1;
        } else if(diffA < diffB){
            return -1;
        } else {
            return 0; 
        }
    });

    let titulo = document.getElementById("Titulo");
    titulo.textContent = "Rastreo de pedidos: "+ruta.repartidor;
    let array = ruta.coordenadas.coordenadas;
    array.map((info,i)=>{
        customMarker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(info.lat,info.lng)
            
        });
        customMarkers.push(customMarker);
        customMarkers.forEach(element => {
            element.setMap(map);
        });
    });
    
     // INFORMACIÓN DE LA RUTA (coordenadas, color de línea, etc...)
      drawRuta = new google.maps.Polyline({
        path: ruta.coordenadas.coordenadas,
        geodesic: true,
        strokeColor: '#4285f4',
        strokeOpacity: 2.0,
        strokeWeight: 3
      });
      // CREAR RUTA EN EL MAPA
      drawRuta.setMap(map);
}
