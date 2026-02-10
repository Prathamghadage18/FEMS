# Farm Plots Map Feature

## Overview
A new interactive map page has been added to the FEMS (Farm Enterprise Management System) frontend at `/plots/map`. This page displays all farm plots on an interactive map using Leaflet.js, with live weather data and reverse geocoding.

## Features

### 📍 Interactive Map
- **Leaflet.js Integration**: Fully interactive map with pan and zoom capabilities
- **OpenStreetMap Tiles**: High-quality, free, and up-to-date map tiles
- **Auto-fit Bounds**: Map automatically adjusts to show all your plots
- **Custom Markers**: Each plot is marked with a pin on the map

### 🌤️ Live Weather Data
Integration with **Open-Meteo API** provides real-time weather information for each plot:
- Current temperature (°C)
- Relative humidity (%)
- Wind speed (km/h)
- Precipitation (mm)
- Weather conditions (Clear sky, Cloudy, Rain, etc.)

### 🗺️ Reverse Geocoding
**BigDataCloud API** integration displays:
- Region/locality name
- City
- State/Province
- Country

### 📊 Plot Information
Each marker popup displays:
- Plot name
- Plot size (acres)
- Soil type
- Assigned crop
- Village name
- GPS coordinates (latitude, longitude)
- Location details (from reverse geocoding)
- Current weather conditions

### 📈 Dashboard Statistics
The page includes overview cards showing:
- Total number of plots
- Total area (in acres)
- Number of crops planted

## Files Created

1. **`/src/app/plots/map/page.jsx`** - Main page component
   - Handles authentication
   - Fetches plot and crop planning data
   - Displays statistics cards
   - Manages loading and error states

2. **`/src/app/plots/map/MapView.jsx`** - Map component
   - Leaflet map rendering
   - Marker components with popups
   - Weather data fetching
   - Reverse geocoding integration
   - Auto-fit bounds functionality

3. **Updated `/src/app/globals.css`** - Custom styles for map
   - Popup styling
   - Rounded corners and shadows
   - Close button customization

## Dependencies Installed

```bash
npm install leaflet react-leaflet --legacy-peer-deps
npm install --save-dev @types/leaflet --legacy-peer-deps
```

## Usage

### Accessing the Map
Navigate to: `http://localhost:3001/plots/map`

### Prerequisites
- User must be authenticated
- Plots must have valid latitude and longitude coordinates
- Internet connection required for:
  - Map tiles (OpenStreetMap)
  - Weather data (Open-Meteo API)
  - Reverse geocoding (BigDataCloud API)

### Adding Coordinates to Plots
If your plots don't have coordinates:
1. Go to `/plots`
2. Add or edit a plot
3. Enter valid latitude and longitude values
4. Save the plot
5. Return to `/plots/map` to see it on the map

## API Integrations

### 1. Open-Meteo API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Free tier**: No API key required
- **Data provided**: Real-time weather conditions
- **Documentation**: https://open-meteo.com/

### 2. BigDataCloud Reverse Geocoding
- **Endpoint**: `https://api.bigdatacloud.net/data/reverse-geocode-client`
- **Free tier**: No API key required
- **Data provided**: Location names from coordinates
- **Documentation**: https://www.bigdatacloud.com/

### 3. Backend API
- **Endpoint**: `/api/plot/plots/` - Fetch all plots
- **Endpoint**: `/api/crop/crop-plots/` - Fetch crop planning data

## Technical Details

### Client-Side Rendering
The map uses dynamic imports to avoid SSR issues with Leaflet:
```javascript
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

### Marker Icon Fix
Leaflet's default marker icons need special handling in Next.js:
```javascript
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
```

### Weather Code Mapping
Weather codes from Open-Meteo are mapped to human-readable descriptions:
- 0: Clear sky
- 1-3: Cloudy variations
- 51-67: Rain variations
- 71-77: Snow variations
- 80-99: Showers and thunderstorms

## Responsive Design

The map is fully responsive:
- **Desktop**: Full-width map (600px height)
- **Tablet/Mobile**: Adapts to screen width
- **Statistics Cards**: Grid layout that stacks on smaller screens
- **Map Controls**: Touch-friendly on mobile devices

## Error Handling

The page handles several error scenarios:
1. **No authentication**: Redirects to signin page
2. **No plots**: Shows empty state with call-to-action
3. **No coordinates**: Displays helpful error message
4. **Weather API failure**: Shows "Weather data unavailable"
5. **Geocoding failure**: Simply doesn't show region name

## Performance Optimizations

- Dynamic imports prevent SSR issues
- Weather and geocoding data fetched only when popup is opened
- Map tiles loaded on-demand
- Component-level loading states
- Efficient data filtering (only plots with valid coordinates)

## Future Enhancements

Potential improvements:
- [ ] Add clustering for many plots
- [ ] Show weather forecast (not just current)
- [ ] Add soil moisture data
- [ ] Plot boundary polygons (not just markers)
- [ ] Historical weather data charts
- [ ] Export map as image
- [ ] Filter plots by crop type
- [ ] Search for specific plots
- [ ] Add drawing tools for new plots

## Troubleshooting

### Map doesn't load
- Check browser console for errors
- Ensure Leaflet CSS is imported
- Verify internet connection for map tiles

### No markers appear
- Verify plots have valid latitude/longitude
- Check browser console for API errors
- Ensure backend is running and accessible

### Weather data not showing
- Check Open-Meteo API status
- Verify coordinates are valid
- Check browser network tab for failed requests

### TypeScript errors
- Ensure all type packages are installed:
  ```bash
  npm install --save-dev @types/leaflet @types/react @types/react-dom
  ```

## License
Part of the FEMS project.

## Support
For issues or questions, please contact the development team.
