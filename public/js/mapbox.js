/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFya2xvcmVuemVkIiwiYSI6ImNrOGw5dmZlZzAxa3AzbW55MjAzNTQ2YmQifQ.VADTXzblcyxCqHBJ0acFFg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/marklorenzed/ck8la0vmb0gp81jmsx0gbubrt',
    scrollZoom: false
    //   center: [-118.113491, 34.111745],
    //   zoom: 8,
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  // execute the moving and zooming
  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 }
  });
};
