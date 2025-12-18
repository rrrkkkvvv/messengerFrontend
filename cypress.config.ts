import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://192.168.0.122:5173",
    env: {},
    setupNodeEvents(on, config) {},
  },
});
