import './examples/style.css';
import './app/main.tsx';

import type {LayerProps, MarkerProps} from './src';
import {RenderMode, WebGlGlobe} from './src';

const distance = 20_000_000;

// Use a single PNG image for the globe
const customImageUrl = '/globe/Revised%20Globe%20sketch%2029th%20Jan.png';

const globeEl = document.querySelector('#globe')! as HTMLElement;
const globe = new WebGlGlobe(globeEl, {
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

// Notify WebGL globe when container dimensions change (e.g. responsive resize or move into hero)
const resizeObserver = new ResizeObserver(() => {
  const { width, height } = globeEl.getBoundingClientRect();
  if (width > 0 && height > 0) {
    try {
      globe.resize();
    } catch (e) {
      console.warn('Globe resize error:', e);
    }
  }
});
resizeObserver.observe(globeEl);

// Simple pin icon without text - sized for resized globe
// Three concentric circles scaled to 50x50
const pinIconHtml = `
  <div class="myMarker" style="width: 50px; height: 50px; margin: -25px;">
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Third circle (outermost): 10% opacity -->
      <circle cx="25" cy="25" r="20" fill="#7150E5" fill-opacity="0.1"/>
      <!-- Second circle (middle): 20% opacity -->
      <circle cx="25" cy="25" r="12.5" fill="#7150E5" fill-opacity="0.2"/>
      <!-- Main center circle: 100% opacity -->
      <circle cx="25" cy="25" r="4.5" fill="#7150E5"/>
    </svg>
  </div>`;

const markerProps: MarkerProps[] = [
  // New Zealand area
  {id: 'newzealand', html: pinIconHtml, lng: 174.76, lat: -41.29},
  // Jaipur, India
  {id: 'jaipur', html: pinIconHtml, lng: 75.79, lat: 26.92},
  // Random markers spread across the globe
  {id: 'paris', html: pinIconHtml, lng: 2.35, lat: 48.86},
  {id: 'tokyo', html: pinIconHtml, lng: 139.69, lat: 35.69},
  {id: 'capetown', html: pinIconHtml, lng: 18.42, lat: -33.93},
  {id: 'vancouver', html: pinIconHtml, lng: -123.12, lat: 49.28},
  {id: 'rio', html: pinIconHtml, lng: -43.21, lat: -22.91},
  {id: 'sydney', html: pinIconHtml, lng: 151.21, lat: -33.87}
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

