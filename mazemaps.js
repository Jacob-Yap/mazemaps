// Just the same way to initialize as always...
var map = new Mazemap.Map({
  container: "map",
  campuses: 159,
  center: { lng: 145.1327, lat: -37.9131 },
  zoom: 16,
  zLevel: 1,
  zLevelControl: false,
  scrollZoom: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
});

map.on("load", function () {
  var customZLevelBar1 = new Mazemap.ZLevelBarControl({
    className: "custom-zlevel-bar",
    autoUpdate: true,
    maxHeight: 300,
  });
  map.addControl(customZLevelBar1, "bottom-right");
  loadLocations();
});
/**---------------------------------------------------------------------------------------------------------------------------------------------------------------- */

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
        location["image"],
        location["link"]
      );
    }
  }
}
/**
 * Creating a marker at a specified location on the map
 */
function createMarker(map, lngLat, colour, icon) {
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

  return marker;
}

/**
 * Creating the popups which show when the markers are clicked
 */
function createPopup(marker, title, description, image, link) {
  var popup = new Mazemap.Popup({
    closeOnClick: true,
    offset: [0, -27],
  }).setHTML(
    `<h3>${title}</h3>
    <p>${description} </br><img src=${image} width="200" height="200"></p>
    <p style="max-width: 200px;"> Click the <a href = ${link} target="_blank"> link</a> and scan the AR marker to view an AR experience</p>`
  );

  marker.setPopup(popup);
}

function menuLocations() {
  console.log("---------------------------");
  toggleDisplay("controls");
  toggleDisplay("menuItems");
  toggleVisibility("locationItems");

  setLocations(indigenousLocations);
  // closeNav();
}

// Creates a blue dot marker and sets it at the specified location on the map
function dotMarker(map, lnglat) {
  var blueDot = new Mazemap.BlueDot({
    map: map,
  })
    .setZLevel(1)
    .setAccuracy(10)
    .setLngLat(lnglat)
    .show();
  var locationController = new Mazemap.LocationController({
    blueDot: blueDot,
    map: map,
  });
  locationController.setState("active");
  return locationController;
}

/**-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/** Live location follow */
var watchID;
var geoLoc;

function liveLocationUpdate(locationController, routeController, dest) {
  if (navigator.geolocation) {
    console.log("------------------ LIVE LOCATION ------------------");
    // console.log(dot);

    geoLoc = navigator.geolocation;
    watchID = geoLoc.watchPosition((position) =>
      showLocation(position, locationController, routeController, dest)
    );
    // showLocation, errorHandler);
    // console.log(geoLoc);
  } else {
    alert("Sorry, browser does not support geolocation!");
  }
}
function showLocation(position, locationController, routeController, dest) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  // var lnglat = { lng: longtidue, lat: latitude };
  console.log("-- UPDATED LOCATION --");
  console.log("Latitude : " + latitude + " Longitude: " + longitude);
  locationController.updateLocationData({
    lngLat: {
      lng: position.coords.longitude,
      lat: position.coords.latitude,
    },
  });
  setRoute(
    routeController,
    {
      lngLat: {
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      },
    },
    dest,
    true
  );
}
function errorHandler(err) {
  if (err.code == 1) {
    alert("Error: Access is denied!");
  } else if (err.code == 2) {
    alert("Error: Position is unavailable!");
  }
}

/**-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
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
    lngLat: { lng: position.coords.longitude, lat: position.coords.latitude },
    zLevel: 0,
  };
  console.log(liveCoordinates);
  var dest = {
    lngLat: { lng: 145.13454580933677, lat: -37.91235021393629 },
    zLevel: 0,
  };

  // Route
  var routeController = new Mazemap.RouteController(map, {
    routeLineColorPrimary: "#0099EA",
    routeLineColorSecondary: "#888888",
  });
  setRoute(routeController, liveCoordinates, dest, false);
  createMarker(map, { lng: longitude, lat: latitude }, "red", "A", true);
  var locationController = dotMarker(map, { lng: longitude, lat: latitude });
  liveLocationUpdate(locationController, routeController, dest);
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
function setRoute(routeController, start, dest, reroute) {
  Mazemap.Data.getRouteJSON(start, dest).then(function (geojson) {
    // console.log("@ geojson", geojson);
    // routeController.clear();
    routeController.setPath(geojson);

    // Fit the map bounds to the path bounding box
    if (!reroute) {
      var bounds = Mazemap.Util.Turf.bbox(geojson);
      map.fitBounds(bounds, { padding: 100 });
    }
  });
  console.log("-- ROUTED --");
  console.log(start);
}

/**------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/**
 * SIDE NAVIGATION
 */
function openNav() {
  document.getElementById("menuBar").style.width = "250px";
  console.log("------------------------------------------");
}
function closeNav() {
  document.getElementById("menuBar").style.width = "0";
}

/**
 * SEARCH CONTROLLER
 */
var mySearch = new Mazemap.Search.SearchController({
  campusid: 159,

  rows: 10,

  withpois: true,
  withbuilding: false,
  withtype: false,
  withcampus: false,

  resultsFormat: "geojson",
});

var mySearchInput = new Mazemap.Search.SearchInput({
  container: document.getElementById("search-input-container"),
  input: document.getElementById("searchInput"),
  suggestions: document.getElementById("suggestions"),
  searchController: mySearch,
}).on("itemclick", function (e) {
  var poiFeature = e.item;
  placePoiMarker(poiFeature);
});

/**
 * Markers
 */
var resultMarker = new Mazemap.MazeMarker({
  color: "rgb(253, 117, 38)",
  innerCircle: true,
  innerCircleColor: "#FFF",
  size: 34,
  innerCircleScale: 0.5,
  zLevel: 1,
});

function placePoiMarker(poi) {
  // Get a center point for the POI, because the data can return a polygon instead of just a point sometimes
  var lngLat = Mazemap.Util.getPoiLngLat(poi);
  console.log(Mazemap.Util.getPoiLngLat(poi));
  var zLevel = poi.properties.zValue;

  resultMarker.setLngLat(lngLat).setZLevel(poi.properties.zValue).addTo(map);

  map.zLevel = zLevel;

  map.flyTo({ center: lngLat, zoom: 19, duration: 2000 });
}

map.getCanvas().addEventListener("focus", function () {
  mySearchInput.hideSuggestions();
});

/** HIDE/DISPLAY */
function toggleDisplay(elementID) {
  var element = document.getElementById(elementID);
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

function toggleVisibility(elementID) {
  var element = document.getElementById(elementID);
  if (element.style.visibility === "visible") {
    element.style.display = "hidden";
  } else {
    element.style.visibility = "visible";
  }
}

// FOR DEV PURPOSES TO HELP FIGURE OUT COORDINATES OF LOCATIONS ON MAP
/**
 * On click: Create a marker wherever the user clicks and console log the coordinates
 */
// map.on("click", onMapClick);

// function onMapClick(e) {
//   // var longitude = e.longitude;
//   var lngLat = e.lngLat;
//   console.log(e.lngLat);
//   // console.log(Mazemap.Data.getPoiAt(lngLat, 1));
//   createMarker(map, lngLat);
// }
