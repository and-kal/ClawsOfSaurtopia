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
      ["#E89026", "#421E89"],
      ["#D632DB", "#0E091C"],
      ["#74BE2E", "#1F1119"],
      ["fuchsia", "#34086d"],
      ["#C66035", "#0E0C00"],
      ["#B506A5", "#DEFD17"],
      ["#884198", "#68ECE8"],
      ["#090494", "#23DA8B"],
      ["#cdd460", "blue"],
      ["#f9e07a", "blueviolet"],
      ["#050f3b", "springgreen"],
      ["#631f8e", "yellow"],
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
    const bandsFestivalFriday = [
      {
        name: "Klöße {uk/de}",
        bio: "stumbling beats & eerie invocations",
        link: "https://kloosuh.bandcamp.com/album/kl-e",
        time: "9:00pm-9:45pm",
      },
      {
        name: "Gleetch Noise Show {lpz}",
        bio: "games with amplified toys",
        link: "https://soundcloud.com/intergalacticatadventures",
        time: "9:45pm-10:30pm",
      },
      {
        name: "Rundfunkorchestra {de}",
        bio: "electro-acoustic complications",
        link: "https://sonicimpulses.org/rundfunkorchester/",
        time: "10:30pm-11:15pm",
      },
      {
        name: "Territorial Gobbing {uk}",
        bio: "performative cut-up nonsense",
        link: "https://territorialgobbing.bandcamp.com",
        time: "11:15pm-12:00am",
      },
      {
        name: "It’s Everyone Else {slov/lpz)",
        bio: "oppressive industrial beats",
        link: "https://itseveryoneelse.bandcamp.com",
        time: "12:00am-12:45am",
      },
      {
        name: "Gorz {bln}",
        bio: "demonic futurist r&b",
        link: "https://lara-alarcon.bandcamp.com/",
        time: "12:45am-1:30am",
      },
      {
        name: "Nape Neck {uk}",
        bio: "punk funk chants",
        link: "https://napeneck.bandcamp.com",
        time: "1:30am-2:15am",
      },
    ];

    const bandsFestivalSaturday = [
      {
        name: "Deeskalationskommando {lpz}",
        bio: "light-controlled experimentalism",
        link: "https://soundcloud.com/inushini/deeskalationskommoando",
        time: "9:00pm-9:45pm",
      },
      {
        name: "Makroplastik {de}",
        bio: "glitchy broken beats",
        link: "https://makroplastik.bandcamp.com/album/a-b-r-a-z-e-n",
        time: "9:45pm-10:30pm",
      },
      {
        name: "Sathönay {fr}",
        bio: "mediterranean psych folk",
        link: "https://sathonay.bandcamp.com",
        time: "10:30pm-11:15pm",
      },
      {
        name: "Earth Logoff {de}",
        bio: "minimalist drum ‘n’ noise",
        link: "https://kitchenlegrecordsberlin.bandcamp.com/album/earthlogoff-fungym",
        time: "11:15pm-12:00am",
      },
      {
        name: "Fiat X Multipla {de}",
        bio: "8bit harsh noise",
        link: "#",
        time: "12:00am-12:45am",
      },
      {
        name: "Heimat {fr}",
        bio: "fake wave franco-allemande",
        link: "https://meineheimat.bandcamp.com/ ",
        time: "12:45am-1:30am",
      },
      {
        name: "Atol Atol Atol {PL}",
        bio: "danceable spasmodic delight",
        link: "https://atolatolatol.bandcamp.com/album/koniec-sosu-tysi-ca-wysp",
        time: "1:30am-2:15am",
      },
      {
        name: "Fatique Suspecte {Lpz}",
        bio: "A duo combining experimental breakcore/techno with ambient and noise undertones, equally matching for outdoor raves and the dirty basement of some diy punk squat.",
        link: "https://soundcloud.com/fatiguesuspecte",
        time: "2:15am-open end",
      },
    ];

    const bands = roster === "warmup" ? bandsWarmup : (roster === "festivalFriday" ? bandsFestivalFriday : bandsFestivalSaturday);

    let htmlElement = "";

    bands.map((band, index) => {
      const currentColourPair =
        randomColourPairings[index % randomColourPairings.length];

      htmlElement += `<div
        class='band'
        style="color:${currentColourPair[0]};background-color:${
        currentColourPair[1]
      };border:3px groove ${currentColourPair[0]}">
        <a href='${band.link}' 
          target='_blank' rel='noopener noreferrer' 
          class='band_link'
          style="color:${currentColourPair[1]};background-color:${
        currentColourPair[0]
      }"
        >
          ${band.name}
        </a>
        <div class='band_bio'>
          ${band.bio}
        </div>
        ${band.time ? `<div class="">${band.time}</div>` : ""}
      </div>
    `;
    });

    return htmlElement;
  });
  return {
    passthroughFileCopy: true,
  };
};
