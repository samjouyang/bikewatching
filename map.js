




// // Set your Mapbox access token here
// mapboxgl.accessToken = 'pk.eyJ1Ijoic2Ftb3V5YW5nIiwiYSI6ImNtN2IzcG13dDAycGgya29kNnNkdTh2cmoifQ.CqpS-hfcWIEa1VjXldUEkA';

// document.addEventListener('DOMContentLoaded', function() {
//   // Initialize the map
//   const map = new mapboxgl.Map({
//     container: 'map', // ID of the div where the map will render
//     style: 'mapbox://styles/mapbox/streets-v12', // Map style
//     center: [-71.09415, 42.36027], // [longitude, latitude]
//     zoom: 12, // Initial zoom level
//     minZoom: 5, // Minimum allowed zoom
//     maxZoom: 18 // Maximum allowed zoom
//   });

//   map.on('load', () => { 
//     // Add Boston bike lanes
//     map.addSource('boston_route', {
//       type: 'geojson',
//       data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
//     });

//     map.addLayer({
//       id: 'boston-bike-lanes',
//       type: 'line',
//       source: 'boston_route',
//       paint: {
//         'line-color': '#37FF33',  // A bright green using hex code
//         'line-width': 4,          // Thicker lines
//         'line-opacity': 0.6       // Slightly less transparent
//       }
//     });

//     // Add Cambridge bike lanes
//     map.addSource('cambridge_route', {
//       type: 'geojson',
//       data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson?...'
//     });

//     map.addLayer({
//       id: 'cambridge-bike-lanes',
//       type: 'line',
//       source: 'cambridge_route',
//       paint: {
//         'line-color': '#37FF33',  // A bright green using hex code
//         'line-width': 4,          // Thicker lines
//         'line-opacity': 0.6       // Slightly less transparent
//       }
//     });

//     // Load the nested JSON file
//     const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
//     d3.json(jsonurl).then(jsonData => {
//       console.log('Loaded JSON Data:', jsonData);  // Log to verify structure

//       // Access the stations array
//       const stations = jsonData.data.stations;
//       console.log('Stations Array:', stations);

//       // Select the SVG element
//       const svg = d3.select('#map').select('svg');

//       // Function to convert station coordinates to pixel coordinates
//       function getCoords(station) {
//         const point = new mapboxgl.LngLat(+station.lon, +station.lat);  // Convert lon/lat to Mapbox LngLat
//         const { x, y } = map.project(point);  // Project to pixel coordinates
//         return { cx: x, cy: y };  // Return as object for use in SVG attributes
//       }

//       // Create circles for each station
//       const circles = svg.selectAll('circle')
//         .data(stations)
//         .enter()
//         .append('circle')
//         .attr('r', 5)               // Radius of the circle
//         .attr('fill', 'steelblue')  // Circle fill color
//         .attr('stroke', 'white')    // Circle border color
//         .attr('stroke-width', 1)    // Circle border thickness
//         .attr('opacity', 0.8);      // Circle opacity

//       // Function to update circle positions
//       function updatePositions() {
//         circles
//           .attr('cx', d => getCoords(d).cx)  // Set the x-position using projected coordinates
//           .attr('cy', d => getCoords(d).cy); // Set the y-position using projected coordinates
//       }

//       // Initial position update when map loads
//       updatePositions();

//       // Update positions on map events
//       map.on('move', updatePositions);     // Update during map movement
//       map.on('zoom', updatePositions);     // Update during zooming
//       map.on('resize', updatePositions);   // Update on window resize
//       map.on('moveend', updatePositions);  // Final adjustment after movement ends

//     }).catch(error => {
//       console.error('Error loading JSON:', error);  // Handle errors if JSON loading fails
//     });

//     const csvurl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';

//     // d3.csv(csvurl).then(trips => {
//     //     console.log(trips);

//     //     departures = d3.rollup(
//     //         trips,
//     //         (v) => v.length,
//     //         (d) => d.start_station_id,
//     //       );
        
//     //       stations = stations.map((station) => {
//     //         let id = station.short_name;
//     //         station.arrivals = arrivals.get(id) ?? 0;
//     //         // TODO departures
//     //         // TODO totalTraffic
//     //         return station;
//     //       });

//     // }).catch(error => {
//     //     console.error("Error loading the CSV data:", error);
//     // });

//     d3.csv(csvurl).then(trips => {
//         console.log(trips);
      
//         // Calculate departures for each station
//         const departures = d3.rollup(
//           trips,
//           (v) => v.length, // Count the number of trips for each station
//           (d) => d.start_station_id // Group by start_station_id
//         );
      
//         // Calculate arrivals for each station
//         const arrivals = d3.rollup(
//           trips,
//           (v) => v.length, // Count the number of trips for each station
//           (d) => d.end_station_id // Group by end_station_id
//         );
      
//         // Update the stations array with arrivals, departures, and total traffic
//         stations = stations.map((station) => {
//           let id = station.short_name;
      
//           // Get arrivals and departures for the station
//           station.arrivals = arrivals.get(id) ?? 0; // If no arrivals, default to 0
//           station.departures = departures.get(id) ?? 0; // If no departures, default to 0
      
//           // Calculate total traffic (arrivals + departures)
//           station.totalTraffic = station.arrivals + station.departures;
      
//           return station;
//         });
      
//         console.log('Updated Stations:', stations); // Log the updated stations array
      
//       }).catch(error => {
//         console.error("Error loading the CSV data:", error);
//       });

//       const radiusScale = d3
//         .scaleSqrt()
//         .domain([0, d3.max(stations, (d) => d.totalTraffic)])
//         .range([0, 25]);


//   });
// });






// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Ftb3V5YW5nIiwiYSI6ImNtN2IzcG13dDAycGgya29kNnNkdTh2cmoifQ.CqpS-hfcWIEa1VjXldUEkA';

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map
  const map = new mapboxgl.Map({
    container: 'map', // ID of the div where the map will render
    style: 'mapbox://styles/mapbox/streets-v12', // Map style
    center: [-71.09415, 42.36027], // [longitude, latitude]
    zoom: 12, // Initial zoom level
    minZoom: 5, // Minimum allowed zoom
    maxZoom: 18 // Maximum allowed zoom
  });

  map.on('load', () => { 
    // Add Boston bike lanes
    map.addSource('boston_route', {
      type: 'geojson',
      data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
    });

    map.addLayer({
      id: 'boston-bike-lanes',
      type: 'line',
      source: 'boston_route',
      paint: {
        'line-color': '#37FF33',  // A bright green using hex code
        'line-width': 4,          // Thicker lines
        'line-opacity': 0.6       // Slightly less transparent
      }
    });

    // Add Cambridge bike lanes
    map.addSource('cambridge_route', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson?...'
    });

    map.addLayer({
      id: 'cambridge-bike-lanes',
      type: 'line',
      source: 'cambridge_route',
      paint: {
        'line-color': '#37FF33',  // A bright green using hex code
        'line-width': 4,          // Thicker lines
        'line-opacity': 0.6       // Slightly less transparent
      }
    });

    // Load the nested JSON file
    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
    d3.json(jsonurl).then(jsonData => {
      console.log('Loaded JSON Data:', jsonData);  // Log to verify structure

      // Access the stations array
      let stations = jsonData.data.stations;
      console.log('Stations Array:', stations);

      // Select the SVG element
      const svg = d3.select('#map').select('svg');

      // Function to convert station coordinates to pixel coordinates
      function getCoords(station) {
        const point = new mapboxgl.LngLat(+station.lon, +station.lat);  // Convert lon/lat to Mapbox LngLat
        const { x, y } = map.project(point);  // Project to pixel coordinates
        return { cx: x, cy: y };  // Return as object for use in SVG attributes
      }

      // Load the CSV file to calculate traffic
      const csvurl = 'https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv';
      d3.csv(csvurl).then(trips => {
        console.log(trips);

        // Calculate departures for each station
        const departures = d3.rollup(
          trips,
          (v) => v.length, // Count the number of trips for each station
          (d) => d.start_station_id // Group by start_station_id
        );

        // Calculate arrivals for each station
        const arrivals = d3.rollup(
          trips,
          (v) => v.length, // Count the number of trips for each station
          (d) => d.end_station_id // Group by end_station_id
        );

        // Update the stations array with arrivals, departures, and total traffic
        stations = stations.map((station) => {
          let id = station.short_name;

          // Get arrivals and departures for the station
          station.arrivals = arrivals.get(id) ?? 0; // If no arrivals, default to 0
          station.departures = departures.get(id) ?? 0; // If no departures, default to 0

          // Calculate total traffic (arrivals + departures)
          station.totalTraffic = station.arrivals + station.departures;

          return station;
        });

        console.log('Updated Stations:', stations); // Log the updated stations array

        // Create a radius scale based on total traffic
        const radiusScale = d3
          .scaleSqrt()
          .domain([0, d3.max(stations, (d) => d.totalTraffic)])
          .range([0, 25]);

        // Create circles for each station
        const circles = svg.selectAll('circle')
          .data(stations)
          .enter()
          .append('circle')
          .attr('r', d => radiusScale(d.totalTraffic)) // Set radius based on total traffic
          .attr('fill', 'steelblue')  // Circle fill color
          .attr('stroke', 'white')    // Circle border color
          .attr('stroke-width', 1)    // Circle border thickness
          .attr('opacity', 0.8);      // Circle opacity

        // Function to update circle positions
        function updatePositions() {
          circles
            .attr('cx', d => getCoords(d).cx)  // Set the x-position using projected coordinates
            .attr('cy', d => getCoords(d).cy); // Set the y-position using projected coordinates
        }

        // Initial position update when map loads
        updatePositions();

        // Update positions on map events
        map.on('move', updatePositions);     // Update during map movement
        map.on('zoom', updatePositions);     // Update during zooming
        map.on('resize', updatePositions);   // Update on window resize
        map.on('moveend', updatePositions);  // Final adjustment after movement ends

      }).catch(error => {
        console.error("Error loading the CSV data:", error);
      });

    }).catch(error => {
      console.error('Error loading JSON:', error);  // Handle errors if JSON loading fails
    });
  });
});