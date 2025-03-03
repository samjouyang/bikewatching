// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Ftb3V5YW5nIiwiYSI6ImNtN2IzcG13dDAycGgya29kNnNkdTh2cmoifQ.CqpS-hfcWIEa1VjXldUEkA';

// Initialize time filter variable
let timeFilter = -1; // -1 means no filtering

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // ID of the div where the map will render
  style: 'mapbox://styles/mapbox/streets-v12', // Map style
  center: [-71.09415, 42.36027], // [longitude, latitude]
  zoom: 12, // Initial zoom level
  minZoom: 5, // Minimum allowed zoom
  maxZoom: 18 // Maximum allowed zoom
});

// Select the slider and display elements
const timeSlider = document.getElementById('time-slider');
const selectedTime = document.getElementById('selected-time');
const anyTimeLabel = document.getElementById('any-time');

// Helper function to format time (HH:MM AM/PM)
function formatTime(minutes) {
  const date = new Date(0, 0, 0, 0, minutes); // Set hours & minutes
  return date.toLocaleString('en-US', { timeStyle: 'short' }); // Format as HH:MM AM/PM
}

// Helper function to convert a Date object to minutes since midnight
function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

// Function to filter trips by time
function filterTripsByTime(trips, timeFilter) {
  return timeFilter === -1
    ? trips // If no filter is applied (-1), return all trips
    : trips.filter((trip) => {
        // Convert trip start and end times to minutes since midnight
        const startedMinutes = minutesSinceMidnight(trip.started_at);
        const endedMinutes = minutesSinceMidnight(trip.ended_at);

        // Include trips that started or ended within 60 minutes of the selected time
        return (
          Math.abs(startedMinutes - timeFilter) <= 60 ||
          Math.abs(endedMinutes - timeFilter) <= 60
        );
      });
}

// Function to update the UI based on the slider value
function updateTimeDisplay() {
  timeFilter = Number(timeSlider.value); // Get slider value

  if (timeFilter === -1) {
    selectedTime.textContent = ''; // Clear time display
    anyTimeLabel.style.display = 'block'; // Show "(any time)"
  } else {
    selectedTime.textContent = formatTime(timeFilter); // Display formatted time
    anyTimeLabel.style.display = 'none'; // Hide "(any time)"
  }

  // Trigger filtering logic
  filterStationsByTime();
}

// Function to compute station traffic
function computeStationTraffic(stations, trips) {
  // Filter trips based on the selected time
  const filteredTrips = filterTripsByTime(trips, timeFilter);

  // Compute departures
  const departures = d3.rollup(
    filteredTrips,
    (v) => v.length,
    (d) => d.start_station_id
  );

  // Compute arrivals
  const arrivals = d3.rollup(
    filteredTrips,
    (v) => v.length,
    (d) => d.end_station_id
  );

  // Update each station with arrivals, departures, and total traffic
  return stations.map((station) => {
    let id = station.short_name;
    station.arrivals = arrivals.get(id) ?? 0;
    station.departures = departures.get(id) ?? 0;
    station.totalTraffic = station.arrivals + station.departures;
    return station;
  });
}

// Function to filter stations by time and update the map
function filterStationsByTime() {
  d3.csv('https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv', (trip) => {
    // Convert date strings to Date objects
    trip.started_at = new Date(trip.started_at);
    trip.ended_at = new Date(trip.ended_at);
    return trip;
  }).then(trips => {
    d3.json('https://dsc106.com/labs/lab07/data/bluebikes-stations.json').then(jsonData => {
      const stations = computeStationTraffic(jsonData.data.stations, trips);

      // Update the circles on the map
      const svg = d3.select('#map').select('svg');
      const circles = svg.selectAll('circle').data(stations);

      // Create a radius scale based on total traffic
      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(stations, (d) => d.totalTraffic)])
        .range([0, 25]);

      // Create a quantize scale for traffic flow
      const stationFlow = d3.scaleQuantize().domain([0, 1]).range([0, 0.5, 1]);

      // Update the circles
      circles
        .attr('r', d => radiusScale(d.totalTraffic)) // Set radius based on total traffic
        .style('--departure-ratio', d => stationFlow(d.departures / d.totalTraffic)) // Set departure ratio
        .select('title')
        .text(d => `${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
    });
  });
}

// Bind the slider's input event to the update function
timeSlider.addEventListener('input', updateTimeDisplay);

// Set the initial display state
updateTimeDisplay();

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
      'line-color': '#0BA10A',  // A bright green using hex code
      'line-width': 4,          // Thicker lines
      'line-opacity': 0.5       // Slightly less transparent
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
      'line-color': '#0BA10A',  // A bright green using hex code
      'line-width': 4,          // Thicker lines
      'line-opacity': 0.5       // Slightly less transparent
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
    d3.csv(csvurl, (trip) => {
      // Convert date strings to Date objects
      trip.started_at = new Date(trip.started_at);
      trip.ended_at = new Date(trip.ended_at);
      return trip;
    }).then(trips => {
      console.log(trips);

      // Calculate traffic for the first time
      stations = computeStationTraffic(stations, trips);

      // Create a radius scale based on total traffic
      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(stations, (d) => d.totalTraffic)])
        .range([0, 25]);

      // Create a quantize scale for traffic flow
      const stationFlow = d3.scaleQuantize().domain([0, 1]).range([0, 0.5, 1]);

      // Create circles for each station
      const circles = svg.selectAll('circle')
        .data(stations)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d.totalTraffic)) // Set radius based on total traffic
        .style('--departure-ratio', d => stationFlow(d.departures / d.totalTraffic)) // Set departure ratio
        .attr('fill', 'var(--color)')  // Use CSS variable for fill color
        .attr('stroke', 'white')    // Circle border color
        .attr('stroke-width', 1)    // Circle border thickness
        .attr('opacity', 0.8);      // Circle opacity

      // Add tooltips to each circle
      circles.each(function(d) {
        d3.select(this)
          .append('title')
          .text(`${d.totalTraffic} trips (${d.departures} departures, ${d.arrivals} arrivals)`);
      });

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