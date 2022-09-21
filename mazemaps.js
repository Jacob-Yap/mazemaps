/**
 * Initialising the map
 */

var map = new Mazemap.Map({
  // container id specified in the HTML
  container: "map",
  campuses: 159,
  // initial position in lngLat format
  center: { lng: 145.1327, lat: -37.9131 }, // longitude & latitude coordinates of Monash University Clayton Campus

  // initial zoom
  zoom: 18,
  zLevel: 3,
});

// Add zoom and rotation controls to the map.
map.addControl(new Mazemap.mapboxgl.NavigationControl());

/**
 * On load of the map
 */

map.on("load", async function () {
  loadLocations();
  map.on("click", onMapClick);
});

/**
 * Function to load locations and add makrers and popups
 */
function loadLocations() {
  fetch("./locations.json")
    .then((response) => {
      return response.json();
    })
    .then((locationsData) => {
      // For all locations in locationsList, create a marker
      for (item in locationsData) {
        console.log(locationsData[item]);
        let location = locationsData[item];
        if (location["lnglat"]) {
          let marker = createMarker(map, location["lnglat"]);
          createPopup(
            marker,
            location["title"],
            location["description"],
            location["link"]
          );
        }
      }
      // map.on("click", onMapClick);
    });
}

/**
 * Creating a marker at a specified location on the map
 */
function createMarker(map, lngLat) {
  var marker = new Mazemap.MazeMarker({
    color: "MazeBlue",
    size: 40,
    zLevel: 1,
    innerCircle: true,
    glyph: "AR",
    glyphSize: 12,
    glyphColor: "MazeBlue",

    preventClickBubble: false, // Allow click to go through to global map layer
  })
    .setLngLat(lngLat)
    .addTo(map);

  // createPopup(marker);
  return marker;
}

/**
 * Creating the popups which show when the markers are clicked
 */
function createPopup(marker, title, description, link) {
  var popup = new Mazemap.Popup({
    closeOnClick: true,
    offset: [0, -27],
  }).setHTML(
    `<h3>${title}</h3><p>${description} </p><p style="max-width: 200px;"> Click the <a href = ${link} target="_blank"> link</a> and scan the AR marker to view an AR experience</p>`
  );

  marker.setPopup(popup);
}

// FOR DEV PURPOSES TO HELP FIGURE OUT COORDINATES OF LOCATIONS ON MAP
/**
 * On click: Create a marker wherever the user clicks and console log the coordinates
 */

function onMapClick(e) {
  // var longitude = e.longitude;
  var lngLat = e.lngLat;
  console.log(lngLat);
  console.log(Mazemap.Data.getPoiAt(lngLat, 1));
  createMarker(map, lngLat);
}

/**
 * Side navigation
 */
function openNav() {
  document.getElementById("menuBar").style.width = "250px";
}
function closeNav() {
  document.getElementById("menuBar").style.width = "0";
}
