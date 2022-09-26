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

function dotMarker(map, lnglat) {
  window.blueDot = new Mazemap.BlueDot({
    map: map,
  })
    .setZLevel(1)
    .setAccuracy(10)
    .setLngLat(lnglat)
    .show();
}

map.on("load", async function () {
  loadLocations();

  // map.on("click", onMapClick);  // Create a marker wherever the user clicks
});

let indigenousLocations = "";
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
      // setLocations(locationsData);
      indigenousLocations = locationsData;
      // map.on("click", onMapClick);
    });
}
function setLocations(locationsData) {
  for (item in locationsData) {
    console.log(locationsData[item]);
    let location = locationsData[item];
    if (location["lnglat"]) {
      let marker = createMarker(map, location["lnglat"], "MazeBlue", "AR");
      createPopup(
        marker,
        location["title"],
        location["description"],
        location["link"]
      );
    }
  }
}
/**
 * Creating a marker at a specified location on the map
 */
function createMarker(map, lngLat, colour, icon, dot) {
  var marker = new Mazemap.MazeMarker({
    color: colour,
    size: 40,
    zLevel: 1,
    innerCircle: true,
    glyph: icon,
    glyphSize: 12,
    glyphColor: colour,

    preventClickBubble: false, // Allow click to go through to global map layer
  })
    .setLngLat(lngLat)
    .addTo(map);

  // createPopup(marker);
  if (dot) {
    dotMarker(map, lngLat);
  }

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

function setIndigenousLocations() {
  setLocations(indigenousLocations);
  closeNav();
}

// FOR DEV PURPOSES TO HELP FIGURE OUT COORDINATES OF LOCATIONS ON MAP
/**
 * On click: Create a marker wherever the user clicks and console log the coordinates
 */

// function onMapClick(e) {
//   // var longitude = e.longitude;
//   var lngLat = e.lngLat;
//   console.log(lngLat);
//   console.log(Mazemap.Data.getPoiAt(lngLat, 1));
//   createMarker(map, lngLat);
// }

/**
 * Side navigation
 */
function openNav() {
  document.getElementById("menuBar").style.width = "250px";
}
function closeNav() {
  document.getElementById("menuBar").style.width = "0";
}

/**
 * Live location
 */
// Main function for getting directions
async function getDirections() {
  // Compute live location coorodinates
  const position = await computeLiveLocation();
  Promise.resolve(position);

  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var liveCoordinates = {
    lngLat: { lng: longitude, lat: latitude },
    zLevel: 0,
  };
  console.log(liveCoordinates);
  var dest = {
    lngLat: { lng: 145.13454580933677, lat: -37.91235021393629 },
    zLevel: 0,
  };

  // Route
  setRoute(liveCoordinates, dest);
  createMarker(map, { lng: longitude, lat: latitude }, "red", "A", true);

  closeNav();
}
// Function which computes the live location of the device
function computeLiveLocation() {
  if (window.navigator.geolocation) {
    return new Promise((res, rej) => {
      window.navigator.geolocation.getCurrentPosition(res, rej);
    });
  } else {
    // liveLocation.innerHTML = "Geolocation is not supported by this browser";
    alert("Geolocation is not supported by this browser");
  }
}

// Function for route controller
function setRoute(start, dest) {
  var routeController = new Mazemap.RouteController(map, {
    routeLineColorPrimary: "#0099EA",
    routeLineColorSecondary: "#888888",
  });

  Mazemap.Data.getRouteJSON(start, dest).then(function (geojson) {
    console.log("@ geojson", geojson);
    // routeController.clear();
    routeController.setPath(geojson);

    // Fit the map bounds to the path bounding box
    var bounds = Mazemap.Util.Turf.bbox(geojson);
    map.fitBounds(bounds, { padding: 100 });
  });
}

/**
 * Search control
 */

// var searchController = new Mazemap.Search.SearchController({
//   campusid: 159,
//   rows: 10,
//   start: 0,
//   page: 0,
//   wihtpois: true,
//   withbuilding: false,
//   withtype: false,
//   withcampus: false,
//   resultsFormat: "geojson",
// });

// var searchInput = new Mazemap.Search.SearchInput({
//   container: document.getElementById("searchBar"),
//   input: document.getElementById("searchInput"),
//   suggestions: document.getElementById("suggestions"),
//   searchController: searchController,
// }).on("itemClick", function (e) {
//   var lngLat = e.lngLat;
//   createMarker(map, lngLat);
// });
