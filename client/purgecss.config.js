// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer"),
    require("@fullhuman/postcss-purgecss")({
      content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,scss}"], // Make sure to include .scss files here
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ],
};
