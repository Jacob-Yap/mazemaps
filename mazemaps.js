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
map.on("load", function () {
  // MazeMap ready

  var spearCoordinates = { lng: 145.13433289910176, lat: -37.91301299847796 };
  var firepitCoordinates = {
    lng: 145.13278060280857,
    lat: -37.913076644295764,
  };

  var locationsList = [spearCoordinates, firepitCoordinates];

  // For all locations in locationsList, create a marker
  for (let i = 0; i < locationsList.length; i++) {
    var coordinates = locationsList[i];
    createMarkers(map, coordinates);
  }
  // createMarkers(map, spear_coordinates);
  map.on("click", onMapClick);
});

/**
 * Creating a marker at a specified location on the map
 */
function createMarkers(map, lngLat) {
  // var centreCoordinate = map.getCenter();
  // var coordinates = { lng: 145.1327, lat: -37.9131, zLevel: 1 };
  // var coordinates = { lng: longitude, lat: latitude, zLevel: 1 };
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

  createPopup(marker);

  /**
   * Creating the popups which show when the markers are clicked
   */
  function createPopup(marker) {
    var popup = new Mazemap.Popup({
      closeOnClick: true,
      offset: [0, -27],
    }).setHTML(
      '<h3>AR experience</h3><p>Explanation of the indegenous location point </p><p style="max-width: 200px;"> Click the <a href = "https://esol-michelle-chen.github.io/MonkeyPox/" target="_blank"> link</a> and scan the AR marker to view an AR experience</p>'
    );

    marker.setPopup(popup);
  }
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
  createMarkers(map, lngLat);
}
