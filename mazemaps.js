var map = new Mazemap.Map({
  // container id specified in the HTML
  container: "map",
  campuses: "default",
  // initial position in lngLat format
  center: { lng: 145.133957, lat: -37.907803 }, // longitude & latitude coordinates of Monash University Clayton Campus

  // initial zoom
  zoom: 18,
  zLevel: 3,
});

// Add zoom and rotation controls to the map.
map.addControl(new Mazemap.mapboxgl.NavigationControl());

map.on("load", function () {
  // MazeMap ready

  var centreCoordinate = map.getCenter();

  var marker = new Mazemap.MazeMarker({
    color: "MazeBlue",
    size: 40,
    zLevel: 1,
    innerCircle: true,
    glyph: "1",
    glyphSize: 12,
    glyphColor: "MazeBlue",

    preventClickBubble: false, // Allow click to go through to global map layer
  })
    .setLngLat(centreCoordinate)
    .addTo(map);

  var p = new Mazemap.Popup({
    closeOnClick: true,
    offset: [0, -27],
  }).setHTML(
    '<h3>AR experience</h3><p>Explanation of the indegenous location point </p><p style="max-width: 200px;"> Click the <a href = "https://esol-michelle-chen.github.io/MonkeyPox/" target> link</a> and scan the AR marker to view an AR experience</p>'
  );

  marker.setPopup(p);
});
