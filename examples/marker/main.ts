import '../style.css';

import type {LayerProps, MarkerProps} from '../../src';
import {RenderMode, WebGlGlobe} from '../../src';

const distance = 20_000_000;

// Use a single PNG image for the globe
// Place your flat map image in the public directory and update the filename below
const customImageUrl = encodeURI('/Images/Illustrations 2/illustration-global-inspiration-map.png');

const globe = new WebGlGlobe(document.querySelector('#globe')!, {
  renderMode: RenderMode.GLOBE,
  layers: [
    {
      id: 'basemap',
      type: 'image',
      urlParameters: {},
      zIndex: 0,
      minZoom: 1,
      maxZoom: 4,
      debug: false,
      getUrl: () => customImageUrl
    } as LayerProps
  ],
  cameraView: {lng: 155, lat: -10, altitude: distance, isAnimated: false}
});

// Simple pin icon without text
// Three concentric circles: main (8.07), second (24.22), third (40.37)
const pinIconHtml = `
  <div class="myMarker" style="width: 50px; height: 50px; margin: -25px;">
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Third circle (outermost): 40.37 diameter, 10% opacity -->
      <circle cx="25" cy="25" r="20.185" fill="#7150E5" fill-opacity="0.1"/>
      <!-- Second circle (middle): 24.22 diameter, 20% opacity -->
      <circle cx="25" cy="25" r="12.11" fill="#7150E5" fill-opacity="0.2"/>
      <!-- Main center circle: 8.07 diameter, 100% opacity -->
      <circle cx="25" cy="25" r="4.035" fill="#7150E5"/>
    </svg>
  </div>`;

const markerProps: MarkerProps[] = [
  {id: 'ny', html: pinIconHtml, lng: -73.97, lat: 40.78},
  {id: 'london', html: pinIconHtml, lng: -0.12, lat: 51.5},
  {id: 'tokyo', html: pinIconHtml, lng: 139.69, lat: 35.69},
  {id: 'dubai', html: pinIconHtml, lng: 55.27, lat: 25.2},
  {id: 'paris', html: pinIconHtml, lng: 2.35, lat: 48.86},
  {id: 'moscow', html: pinIconHtml, lng: 37.62, lat: 55.75},
  {id: 'rio', html: pinIconHtml, lng: -43.21, lat: -22.91},
  {id: 'sydney', html: pinIconHtml, lng: 151.21, lat: -33.87},
  {id: 'cairo', html: pinIconHtml, lng: 31.24, lat: 30.05},
  {id: 'beijing', html: pinIconHtml, lng: 116.4, lat: 39.91},
  {id: 'mumbai', html: pinIconHtml, lng: 72.87, lat: 19.07},
  {id: 'la', html: pinIconHtml, lng: -118.24, lat: 34.05},
  {id: 'istanbul', html: pinIconHtml, lng: 28.99, lat: 41.01},
  {id: 'rome', html: pinIconHtml, lng: 12.49, lat: 41.9},
  {id: 'singapore', html: pinIconHtml, lng: 103.85, lat: 1.29}
];

markerProps.forEach(m => {
  m.onClick = id => console.log('clicked:', id);
});

globe.setProps({markers: markerProps});
globe.setControlsInteractionEnabled(true);
globe.startAutoSpin(1);
globe.setZoomEnabled(false);

// Debug: Listen for layer loading state changes
globe.addEventListener('layerLoadingStateChanged', (ev: any) => {
  console.log('Layer loading state:', ev.detail.layer.id, ev.detail.state);
  if (ev.detail.state === 'error') {
    console.error('Layer failed to load:', ev.detail.layer.id);
  }
});

