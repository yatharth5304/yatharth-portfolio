import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins:[react()], server:{host:'127.0.0.1',port:5173,proxy:{'/api':'http://localhost:8080','/resume':'http://localhost:8080','/admin.html':'http://localhost:8080'}}, build:{outDir:'dist',chunkSizeWarningLimit:1100,rollupOptions:{output:{manualChunks:{three:['three','three-stdlib'],gsap:['gsap'],vendor:['react','react-dom','react-router-dom']}}}} });
