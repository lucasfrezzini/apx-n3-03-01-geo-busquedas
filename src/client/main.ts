import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

// Configura tu token de acceso
mapboxgl.accessToken =
  "pk.eyJ1IjoidGFub2RldmVsb3BlciIsImEiOiJjbTYzdXoxY3YxZzFzMmxvdW9oN3EwZ3p6In0.5rPl_irsXaZzKAt1lMg-iw";

// Inicializa el mapa
const map = new mapboxgl.Map({
  container: "map", // ID del contenedor del mapa
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-74.5, 40], // Coordenadas iniciales [longitud, latitud]
  zoom: 9,
});

// Crea una instancia del geocodificador con tipos
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: {
    color: "orange",
  },
});

// Añade el geocodificador al mapa
map.addControl(geocoder);

// Maneja el evento de selección de un resultado
geocoder.on("result", (event) => {
  const result = event.result;
  console.log("Dirección seleccionada:", result.place_name);
  console.log("Coordenadas:", result.geometry.coordinates);
});
