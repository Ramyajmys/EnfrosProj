proj4.defs("urn:ogc:def:crs:EPSG::32632", "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [481650, 4980105]
    }
};

// var map = L.map('map');

L.Proj.geoJson(geojsonFeature).addTo(map);



console.log(data);
if (data.optimalSystemDesignDrawn && data.polygonsMapped) {
    localStorage.setItem("userLatlong", JSON.stringify(data));
    $(location).attr('href', 'map3.html');
} else if (!data.optimalSystemDesignDrawn && !data.polygonsMapped) {
    userLatlong = data;
    if (data.userLat == 0 && data.userLong == 0) {
        userLatlong['userLat'] = 13.003808081821816;
        userLatlong['userLong'] = 77.56874710321428;
        localStorage.setItem("userLatlong", JSON.stringify(data));
        var lat = userLatlong['userLat'];
        var long = userLatlong['userLong'];
        marker = L.marker([lat, long], {}).addTo(map);
        map.setView([lat, long], 21);
    } else {
        localStorage.setItem("userLatlong", JSON.stringify(data))
        $('#lat').val(data.userLat);
        $('#long').val(data.userLong);
        var lat = data.userLat;
        var long = data.userLong;
        marker = L.marker([lat, long], {}).addTo(map);
        map.setView([lat, long], 21);
    }
} else if (data.polygonsMapped) {
    localStorage.setItem("userLatlong", JSON.stringify(data));
    $(location).attr('href', 'map2.html');
}



// userLatlong = data;
// if (data.userLat == 0 && data.userLong == 0) {
//     userLatlong['userLat'] = 13.003808081821816;
//     userLatlong['userLong'] = 77.56874710321428;
//     localStorage.setItem("userLatlong", JSON.stringify(data));
//     var lat = userLatlong['userLat'];
//     var long = userLatlong['userLong'];
//     marker = L.marker([lat, long], {}).addTo(map);
//     map.setView([lat, long], 21);
// } else {
//     localStorage.setItem("userLatlong", JSON.stringify(data))
//     // console.log(JSON.stringify(data))
//     $('#lat').val(data.userLat);
//     $('#long').val(data.userLong);
//     var lat = data.userLat;
//     var long = data.userLong;
//     marker = L.marker([lat, long], {}).addTo(map);
//     map.setView([lat, long], 21);
// }


// var baseLayers = {
//     'Stamen Toner': defaultBase,
//     'ESRI Imagery': L.tileLayer.provider('Esri.WorldImagery'),
//     // 'ESRI Ocean Basemap': L.tileLayer.provider('Esri.OceanBasemap'),
//     'OSM Topo': osmLayer
// };

// Overlay grouped layers
// var groupOverLays = {
//     "OVERLAYS": {
//         "ORTHO": ortho,
//         "POLYGONS": polygon_buildings,
//         "GRIDS": grids_buildings_70
//     },
// };
// L.control.groupedLayers(baseLayers, groupOverLays).addTo(map);