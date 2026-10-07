import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const PROTECTED_MEDIA = 'img, picture, video, .case-study-card__image-media';

function isProtectedMedia(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(PROTECTED_MEDIA));
}

document.addEventListener('contextmenu', (event) => {
  if (isProtectedMedia(event.target)) event.preventDefault();
});

document.addEventListener('dragstart', (event) => {
  if (isProtectedMedia(event.target)) event.preventDefault();
});

const rootElement = document.getElementById('app-root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
