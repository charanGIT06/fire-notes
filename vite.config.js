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
            src: "/icons/fire-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/fire-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/fire-128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/fire-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/fire-168.png",
            sizes: "168x168",
            type: "image/png",
          },
          {
            src: "/icons/fire-192.png",
            sizes: "192x192",
            type: "image/png",
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
              },
            ],
          },
          {
            name: "Shared Notes",
            short_name: "Shared",
            description: "Notes shared with you.",
            url: "/shared",
            icons: [
              {
                src: "/icons/fire-192.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "Archived Notes",
            short_name: "Archived",
            description: "Archived Notes",
            url: "/archive",
            icons: [
              {
                src: "/icons/fire-192.png",
                sizes: "192x192",
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
