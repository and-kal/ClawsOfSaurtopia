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
  eleventyConfig.addPassthroughCopy("./archive/*.css");
  eleventyConfig.addPassthroughCopy("./assets/fonts");
  eleventyConfig.addPassthroughCopy("./assets/img");
  eleventyConfig.addPassthroughCopy("./assets/video");
  eleventyConfig.addPassthroughCopy("./assets/*.*");
  eleventyConfig.addPassthroughCopy("./archive/media");

  eleventyConfig.setBrowserSyncConfig({
    files: "./assets/css/*.css",
  });

  eleventyConfig.addShortcode("bandsAndColours", function () {
    const randomColourPairings = [
      ["#f9e07a", "blueviolet"],
      ["#631f8e", "yellow"],
      ["#cdd460", "blue"],
      ["#050f3b", "springgreen"],
      ["fuchsia", "#34086d"],
    ];

    const bands = [
      {
        name: "Pieuvre {Brln}",
        bio: "Berlin trio patching together raw, no wavey guitars, a punk-funk like rhythm section and well-crafted vocal melodies.",
        link: "https://kitchenlegrecordsberlin.bandcamp.com/album/pieuvre-hyperstretch",
      },
      {
        name: "Untel {Fr}",
        bio: "The music Untel generates is an odd one - a threshold towards some sunken worlds, some would say, or the celebrating of an unknown deity's wedding.",
        link: "https://soundcloud.com/untel-music",
      },
      {
        name: "PLS {Fr}",
        bio: "PLS is an electronic trio of 100% machines. They propose a music at the crossroads of several styles - between melodic synths, techno rhythms and saturated songs.",
        link: "https://pls1312.bandcamp.com/album/merimna-atrata",
      },
      {
        name: "Fatique Suspecte {Lpz}",
        bio: "A duo combining experimental breakcore/techno with ambient and noise undertones, equally matching for outdoor raves and the dirty basement of some diy punk squat.",
        link: " https://soundcloud.com/fatiguesuspecte ",
      },
    ];

    let htmlElement = "";

    bands.map((band, index) => {
      const currentColourPair =
        randomColourPairings[index % randomColourPairings.length];
      htmlElement += `<div
        class='band'
        style="color:${currentColourPair[0]};background-color:${currentColourPair[1]};border:3px groove ${currentColourPair[0]}">
        <a href='${band.link}' 
          target='_blank' rel='noopener noreferrer' 
          class='band_link'
          style="color:${currentColourPair[1]};background-color:${currentColourPair[0]}"
        >
          ${band.name}
        </a>
        <div class='band_bio'>
          ${band.bio}
        </div>
      </div>
    `;
    });

    return htmlElement;
  });
  return {
    passthroughFileCopy: true,
  };
};
