import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({ 
  // server: {
  //   proxy: {
  //     "/": "http://10.10.8.150:8081",      
  //   }  
  // }, 
  plugins: [react()],
})