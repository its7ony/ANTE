let lugares = [];
let customMarker = null;
let customMarkers = [];
let drawRuta = null;
let distancia = 0;

$(document).ready(function(){
    var socket = io.connect('http://localhost:3000', { 'forceNew': true });
    

socket.on('coordenadas', function (data) {
    console.log(data);
    var obj = data.replace(/'/g,"\"");
    obj = JSON.parse(obj);
    let repartidor = new google.maps.LatLng(obj.lat,obj.lng);
        customMarker = new google.maps.Marker({
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: repartidor,
            icon: {                             
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                           
            },
            title: obj.name
        });
        
        
        customMarker.setMap(map);
        

    });

})



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
    distancia = 0;
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

    for(var i=0; i<ruta.coordenadas.coordenadas.length; i++){
        if((i+1) ==ruta.coordenadas.coordenadas.length){

        }else{
            distancia = distancia + calcularDistancia(ruta.coordenadas.coordenadas[i].lat,ruta.coordenadas.coordenadas[i].lng,ruta.coordenadas.coordenadas[(i+1)].lat,ruta.coordenadas.coordenadas[(i+1)].lng);
        } 
      }

    let txtTitulo = document.getElementById("Titulo");
    txtTitulo.textContent = "Rastreo de pedidos: "+ruta.repartidor;
    let txtDistancia = document.getElementById("Distancia");
    txtDistancia.textContent = "Distancia: "+distancia.toFixed(2)+"km";
    let array = ruta.coordenadas.coordenadas;
    array.map((info,i)=>{
        customMarker = new google.maps.Marker({
            map: map,
            draggable: false,
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


function calcularDistancia(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        dist = dist * 1.609344 
        
        return dist
}
