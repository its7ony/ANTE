var map;
var laSalleBajio = {lat: 21.150908, lng: -101.71110470000002};

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: laSalleBajio,
        zoom: 15
    });

   //getPointsAll();
}