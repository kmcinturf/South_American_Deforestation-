var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var myMap = L.map("map", {
  center: [
    -15.0522, -53.2437
  ],
  zoom: 4,
  layers: [lightmap]
});

d3.csv("data/Swallow.csv").then((humming) => {
  

  var swallow_id_filter = humming.map(x => x.swallow_id);

  var swallow_filter = swallow_id_filter.filter((x, index) =>{
      return swallow_id_filter.indexOf(x) === index;
  });

  var swallow1 = d3.select("#selDataset");


  var test = swallow_filter.map((id) => {
    swallow1
        .append("option")
        .property("value", id)
        .text(id);
    });

    createFeatures(swallow_filter[0]);
    
});

var legend = L.control({position: 'topright'});
legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'selDataset');
    div.innerHTML = '<select id = selDataset></select>;';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(myMap);

var dropdown = d3.select("#selDataset").on("change", createFeatures);

function createFeatures(humming_filter) {


  if (humming_filter == "H988") {
    var swallow1 = "H988"
  }
  
  else{
  console.log(this.value);
    var swallow1 = this.value
  }

  function getValue(x) {
    if(x === "H988") {return "OrangeRed"}
    if(x === "H982") {return "Peru"}
    if(x === "H980") {return "Tomato"}

 }

  d3.csv("data/Swallow.csv").then((humming) => {

    var swallow_ids = humming.filter(row => row.swallow_id == swallow1);

    var humming_bird = swallow_ids.map(humming => L.circleMarker([humming.lat,humming.long], {
      color: getValue(humming.swallow_id),
      fillColor: "black",
      fillOpacity: 0.75,
      radius: 3})
      .bindPopup(`${humming.lat},${humming.long}`))
      console.log(humming_bird)
      console.log(humming_markers)

    var humming_markers = L.layerGroup(humming_bird)

    // Sending our whales layer to the createMap function
    createMap(humming_markers, swallow1);
  });
};

function createMap(humming_markers, swallow_ids) {

  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap
  };

  var overlayMaps = {

  };
  overlayMaps[swallow_ids] = humming_markers
  var test = L.control.layers(null, overlayMaps)
  test.remove(myMap)
  
  test.addTo(myMap);
};

var legend = L.control({position: 'topleft'});

  legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["H988", "H982","H980"],
        labels = ['<strong> Earthquake Depth </strong>'],
        labels = [];
        function getValue(x) {
          if(x === "H988") {return "OrangeRed"}
          if(x === "H982") {return "Peru"}
          if(x === "H980") {return "Tomato"}
     
       }

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<strong> Swallow ID </strong>'
        div.innerHTML +=
            '<i style="background:' + getValue(grades[i]) + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
};
legend.addTo(myMap);