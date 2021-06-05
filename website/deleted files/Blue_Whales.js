var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var myMap = L.map("map", {
  center: [
    36.2127, -121.1260
  ],
  zoom: 6,
  layers: [lightmap]
});

d3.csv("data/Blue_whale_data1.csv").then((blue) => {

  var blue_id_filter = blue.map(x => x.individualID);

  var blue_filter = blue_id_filter.filter((x, index) =>{
      return blue_id_filter.indexOf(x) === index;
  });

  var blue_id = d3.select("#selDataset");

  var test = blue_filter.map((id) => {
      blue_id
        .append("option")
        .property("value", id)
        .text(id);
    });

    createFeatures(blue_filter[0]);

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

function createFeatures(Blue_Blue_whale_id_filter) {

  if (Blue_Blue_whale_id_filter == "2005CA-Bmu-02082") {
    var blue_id = "2005CA-Bmu-02082"
  }
  else{
  console.log(this.value);
    var blue_id = this.value
  }

  function getValue(x) {
    if(x === "2005CA-Bmu-02082") {return "blue"}
    if(x === "2005CA-Bmu-01388") {return "DodgerBlue"}
    if(x === "2005CA-Bmu-00845") {return "MidnightBlue"}
    if(x === "2005CA-Bmu-01390") {return "lightblue"}

 }

  d3.csv("data/Blue_whales_North.csv").then((data_blue) => {

    var Blue_whale_ids = data_blue.filter(row => row.individualID == blue_id);

    var Blue_whales = Blue_whale_ids.map(blue => L.circleMarker([blue.lat,blue.long], {
      color: getValue(blue.individualID),
      fillColor: "white",
      fillOpacity: 0.75,
      radius: 3})
      .bindPopup(`${blue.lat},${blue.long}`))
      console.log(Blue_whales)
      console.log(whale_markers2)

    var whale_markers2 = L.layerGroup(Blue_whales)

    // Sending our whales layer to the createMap function
    createMap(whale_markers2, blue_id);
  });
};

function createMap(whale_markers2, Blue_whale_id) {
console.log(Blue_whale_id)
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap
    };

  var overlayMaps = {

  };
  overlayMaps[Blue_whale_id] = whale_markers2
  // L.control.remove();
  var test = L.control.layers(null, overlayMaps)
  test.remove(myMap)
  
  test.addTo(myMap);
};

var legend = L.control({position: 'topleft'});

  legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["2005CA-Bmu-02082", "2005CA-Bmu-01388","2005CA-Bmu-00845"],
        labels = ['<strong> </strong>'],
        labels = [];
        function getValue(x) {
          if(x === "2005CA-Bmu-02082") {return "blue"}
          if(x === "2005CA-Bmu-01388") {return "DodgerBlue"}
          if(x === "2005CA-Bmu-00845") {return "MidnightBlue"}
          // if(x === "2005CA-Bmu-01390") {return "lightblue"}
  
     
       }
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<strong> Bluefin Whale ID </strong>'
        div.innerHTML +=
            '<i style="background:' + getValue(grades[i]) + '"></i> ' +
            grades[i] + '<br>';
    }

    return div;
};
legend.addTo(myMap);
