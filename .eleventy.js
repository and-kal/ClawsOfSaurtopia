const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
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

  eleventyConfig.addShortcode("bandsAndColours", function (roster) {
    const randomColourPairings = [
      ["#f9e07a", "blueviolet"],
      ["fuchsia", "#34086d"],
      ["#B506A5", "#DEFD17"],
      ["#631f8e", "yellow"],
      ["#884198", "#68ECE8"],
      ["#cdd460", "blue"],
      ["#050f3b", "springgreen"],
      ["#090494", "#23DA8B"],
      ["#D632DB", "#0E091C"],
      ["#C66035", "#0E0C00"],
    ];

    const bandsWarmup = [
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
        link: "https://soundcloud.com/fatiguesuspecte",
      },
    ];
    const bandsFestival = [
      {
        name: "Atol Atol Atol {PL}",
        bio: "island post-punk from the South of Poland",
        link: "https://atolatolatol.bandcamp.com/album/koniec-sosu-tysi-ca-wysp",
      },
      {
        name: "Fatique Suspecte {Lpz}",
        bio: "experimental breakcore/techno combined with ambient and noise",
        link: "https://soundcloud.com/fatiguesuspecte",
      },
    ];

    const bands = roster === "warmup" ? bandsWarmup : bandsFestival;

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
