document.addEventListener("DOMContentLoaded", () =>  {

    const latitude = document.querySelector('#latitude');
    const longitude = document.querySelector('#longitude');
    const locateBtn = document.querySelector('#locate-btn');
    const modalBtn = document.querySelector('#modal-btn');

    
    modalBtn.addEventListener('click', () => {
        const {L, map} = buildMap(-2.541441, -44.256159);

        // Marker variable
        let marker;

        // Function to set a marker and alert coordinates
        function setMarker(lat, lng) {
            if (marker) {
            marker.remove();
            }

            marker = L.marker([lat, lng]).addTo(map);

            latitude.value = lat;
            longitude.value = lng;
        }

        // Map click event
        map.on('click', function(e) {
            const { lat, lng } = e.latlng;
            setMarker(lat, lng);
        });

        // Locate button event
        locateBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    map.setView([lat, lng], 13); // Zoom to location
                    setMarker(lat, lng);
                },
                (error) => {
                    alert('Geolocation failed: ' + error.message);
                }
            );
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    });

    function buildMap(lat,lon)  {
        document.getElementById('weathermap').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";

        var map = L.map('map').setView([0, 0], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        setTimeout(function(){ 
            map.invalidateSize()
            map.setView(new L.LatLng(lat,lon), 12);
        }, 100);

        return {L, map};
    }
});