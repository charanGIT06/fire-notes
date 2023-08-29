import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Fire Notes",
        short_name: "Fire Notes",
        description: "A simple notes app built with React and Firebase",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "https://fire-notes.netlify.app/",
        scope: "/",
        icons: [
          {
            src: "/icons/fire-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/fire-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/fire-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        shortcuts: [
          {
            name: "New Note",
            short_name: "New Note",
            description: "Create a new note",
            url: "/",
            icons: [
              {
                src: "/icons/fire-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: "/^https://fire-notes.vercel.app/notes/",
            handler: "NetworkFirst",
            options: {
              cacheName: "notes-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 300,
              },
            },
          },
        ],
      },
    }),
  ],
});
