import { reactRouter } from "@react-router/dev/vite";
import { pigment } from "@pigment-css/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [pigment({}), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
