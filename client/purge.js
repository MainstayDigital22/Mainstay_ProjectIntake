const fs = require("fs");
const { PurgeCSS } = require("purgecss");
const sass = require("sass");

async function compileAndPurgeSCSS() {
  // Compile SCSS to CSS
  const compiled = sass.compile("src/styles.scss"); // Adjust the path as needed
  const compiledCSSPath = "src/compiledStyles.css"; // Temporary CSS file path
  fs.writeFileSync(compiledCSSPath, compiled.css);

  // Run PurgeCSS on the compiled CSS
  try {
    const purgeCSSResult = await new PurgeCSS().purge({
      content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
      css: [compiledCSSPath], // Use the compiled CSS file
    });

    if (purgeCSSResult && purgeCSSResult.length > 0 && purgeCSSResult[0].css) {
      fs.writeFileSync("src/purgedStyles.css", purgeCSSResult[0].css); // Final purged CSS output
      console.log("SCSS compiled and purged successfully.");
    } else {
      console.error("No CSS was output by PurgeCSS.");
    }
  } catch (error) {
    console.error("Error during SCSS compilation and purge:", error);
  } finally {
    // Optional: Clean up the temporary compiled CSS file
    fs.unlinkSync(compiledCSSPath);
  }
}

compileAndPurgeSCSS();
