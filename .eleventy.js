const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc, {
    components: [
      "_components/**/*.webc",
      "npm:@11ty/is-land/*.webc",
      "npm:@11ty/eleventy-plugin-syntaxhighlight/*.webc",
    ],
  });
  eleventyConfig.addPassthroughCopy("./_includes/*.css");
  eleventyConfig.addPassthroughCopy("./assets");
  return {
    passthroughFileCopy: true,
  };
};
