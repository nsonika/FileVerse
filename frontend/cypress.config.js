const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Your app's URL
    specPattern: "cypress/integration/**/*.js", // Ensure this points to your test files
    fixturesFolder: "cypress/fixtures",
    supportFile: "cypress/support/e2e.js",
    downloadsFolder: "cypress/downloads",
  },
});
