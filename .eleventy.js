const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginWebc, {
    components: [
      "_components/**/*.webc",
      "npm:@11ty/is-land/*.webc",
      "npm:@11ty/eleventy-plugin-syntaxhighlight/*.webc",
    ],
  });
  eleventyConfig.addPassthroughCopy("./assets/css/*.css");
  eleventyConfig.addPassthroughCopy("./assets");
  return {
    passthroughFileCopy: true,
  };
};
