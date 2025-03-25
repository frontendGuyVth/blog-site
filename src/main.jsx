import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDqjSKIE9tKHun3G151G37X4qLB9fvZeqM",
  authDomain: "blog-site-3a776.firebaseapp.com",
  projectId: "blog-site-3a776",
  storageBucket: "blog-site-3a776.firebasestorage.app",
  messagingSenderId: "360413922540",
  appId: "1:360413922540:web:c804fcae6452bd89f1d1c9"
};

const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
