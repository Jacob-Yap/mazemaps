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
      let marker = createMarker(map, location["lnglat"]);
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

function setIndigenousLocations() {
  setLocations(indigenousLocations);
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
// var liveLocation = document.getElementById("currentLocation");
function computeLiveLocation() {
  if (navigator.geolocation) {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  } else {
    // liveLocation.innerHTML = "Geolocation is not supported by this browser";
    alert("Geolocation is not supported by this browser");
  }
}

async function getDirections() {
  // Compute live location coorodinates
  const position = await computeLiveLocation();
  Promise.resolve(position);

  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  console.log(parseFloat(latitude));
  var liveCoordinates = {
    lngLat: { lng: longitude, lat: latitude },
    zLevel: 0,
  };
  var start = {
    lngLat: { lng: 145.13433289910176, lat: -37.91301299847796 },
    zLevel: 0,
  };
  var dest = {
    lngLat: { lng: 145.13454580933677, lat: -37.91235021393629 },
    zLevel: 0,
  };

  setRoute(liveCoordinates, dest);
}

function setRoute(start, dest) {
  var routeController = new Mazemap.RouteController(map, {
    routeLineColorPrimary: "#0099EA",
    routeLineColorSecondary: "#888888",
  });

  Mazemap.Data.getRouteJSON(start, dest).then(function (geojson) {
    console.log("@ geojson", geojson);

    routeController.setPath(geojson);

    // Fit the map bounds to the path bounding box
    var bounds = Mazemap.Util.Turf.bbox(geojson);
    map.fitBounds(bounds, { padding: 100 });
  });
}

/**
 * Search control
 */

// var searchController = new Mazemap.Search.searchController({
//   campusid: 159,
//   rows: 10,
//   start:0,
//   page:0,
//   wihtpois: true,
//   withbuilding: false,
//   withtype: false,
//   withcampus: false,
//   resultsFormat: "geojson",
// });

// var searchInput = new Mazemap.Search.searchInput({
//   container: document.getElementById("searchBar"),
//   input: document.getElementById("searchInput"),
//   suggestions: document.getElementById("suggestions"),
//   searchController: searchController,
// }).on("itemClick", function (e) {
//   var lngLat = e.lngLat;
//   createMarker(map, lngLat);
// });
