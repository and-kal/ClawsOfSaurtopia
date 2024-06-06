const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPassthroughCopy("./assets/css/*.css");
  eleventyConfig.addPassthroughCopy("./assets/fonts");
  eleventyConfig.addPassthroughCopy("./assets/img");
  eleventyConfig.addPassthroughCopy("./assets/other");
  eleventyConfig.addPassthroughCopy("./assets/video");
  eleventyConfig.addPassthroughCopy("./assets/*.*");
  eleventyConfig.addPassthroughCopy("./archive/2022");
  eleventyConfig.addPassthroughCopy("./archive/assets");
  eleventyConfig.addPassthroughCopy("./archive/html");
  eleventyConfig.addPassthroughCopy("./archive/media");
  eleventyConfig.addPassthroughCopy({
    "./node_modules/hydra-synth/dist/hydra-synth.js":
      "/assets/js/hydra-synth.js",
  });

  eleventyConfig.setBrowserSyncConfig({
    files: "./assets/css/*.css",
  });

  eleventyConfig.addShortcode("bandsAndColours", function (roster) {
    const randomColourPairings = [
      ["#F12E2F", "#1B0A0B"],
      ["#D86CB4", "#001651"],
      ["#824F5A", "#FEF2BD"],
      ["#D07E35", "#102437"],
      ["#BDA8C5", "#560A52"],
      ["#3577AE", "#FDFECB"],
      ["#F69423", "#181578"],
      ["#32CBE9", "#301951"],
      ["#92ECCA", "#110A02"],
      ["#373B52", "#C5EF80"],
      ["#A8E004", "#0506A7"],
    ];

    const bandsWarmup1 = [
      {
        name: "Danse Musique Rhône-Alpes",
        bio: false,
        link: "https://dmra.bandcamp.com",
      },
      {
        name: "BZMC fka. Black Zone Myth Chant",
        bio: false,
        link: "https://blackzonemythchant.bandcamp.com",
      },
      {
        name: "iion & elder pogs",
        bio: false,
        link: "https://soundcloud.com/poganyg",
      },
    ];
    const bandsWarmup2 = [
      {
        name: "Atol Atol Atol",
        bio: false,
        link: "https://ubac.bandcamp.com/album/koniec-sosu-tysi-ca-wysp",
      },
      {
        name: "Nape Neck",
        bio: false,
        link: "https://napeneck.bandcamp.com/",
      },
      {
        name: "Ilia Gorowitz",
        bio: false,
        link: "https://iliagorovitz.bandcamp.com",
      },
    ];
    const bandsFestivalFriday = [
      {
        name: "Sheik Anorak",
        bio: false,
        link: "https://gafferrecords.bandcamp.com/album/gbg2",
      },
      {
        name: "Circuit Bending Surprise Act",
        bio: false,
        link: "https://clawsofsaurtopia.glitch.me/workshops2024",
      },
      {
        name: "Viola Yip",
        bio: false,
        link: "https://www.youtube.com/watch?v=I_3ZA_AiZtQ",
      },
      {
        name: "Schleu",
        bio: false,
        link: "https://www.youtube.com/watch?v=o5Ilts-0Dxs",
      },

      {
        name: "Jan Van Angelopoulos & Fotis Siotas",
        bio: false,
        link: "https://www.youtube.com/watch?v=2K0zk4BRN_Y",
      },
      {
        name: "weird ugly fish / keista bjauri žuvis",
        bio: false,
        link: "https://weirduglyfish.bandcamp.com/album/legs-are-for-swimming",
      },
      {
        name: "Coldsore",
        bio: false,
        link: "https://coldsore-sound.tumblr.com/",
      },
      {
        name: "W.E.E.B.Z",
        bio: false,
        link: "https://soundcloud.com/callshopradio/disposable-time-w-weebz-160524/",
      },
    ];
    const bandsFestivalSaturday = [
      {
        name: "Cuntroaches",
        bio: false,
        link: "https://www.youtube.com/watch?v=KQ90sqzcunU",
      },
      {
        name: "Miss Tetanos",
        bio: false,
        link: "https://www.youtube.com/watch?v=mRw7jDelmc0",
      },
      {
        name: "P≡B",
        bio: false,
        link: "https://www.youtube.com/watch?v=a69ZprY4M_8",
      },
      { name: "Der Warst", bio: false, link: "https://schaefersimon.de" },
      {
        name: "Ignaz Schick",
        bio: false,
        link: "https://www.youtube.com/watch?v=sfeNyvmz7JY",
      },
      {
        name: "TRRMÀ",
        bio: false,
        link: "https://www.youtube.com/watch?v=uprVt6G7p5U",
      },
      {
        name: "Munka:Weber",
        bio: false,
        link: "https://www.youtube.com/watch?v=FMub_RS1yxc",
      },
      {
        name: "DJ Pregnant",
        bio: false,
        link: "https://soundcloud.com/yoavsk",
      },
    ];

    const bands = () => {
      switch (roster) {
        case "warmup1":
          return bandsWarmup1;
        case "warmup2":
          return bandsWarmup2;
        case "festivalFriday":
          return bandsFestivalFriday;
        case "festivalSaturday":
          return bandsFestivalSaturday;
        default:
          break;
      }
    };

    let htmlElement = "";
    bands().map((band, index) => {
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
        ${
          band.bio
            ? `<div class='band_bio'>
          ${band.bio}
        </div>`
            : ""
        }
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
