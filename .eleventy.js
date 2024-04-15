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
        bio: "...",
        link: "https://dmra.bandcamp.com",
      },
      {
        name: "BZMC fka. Black Zone Myth Chant",
        bio: "...",
        link: "https://blackzonemythchant.bandcamp.com",
      },
    ];
    const bandsWarmup2 = [
      {
        name: "Atol Atol Atol",
        bio: "...",
        link: "https://ubac.bandcamp.com/album/koniec-sosu-tysi-ca-wysp",
      },
      {
        name: "Nape Neck",
        bio: "...",
        link: "https://napeneck.bandcamp.com/",
      },
      {
        name: "Ilia Gorowitz",
        bio: "...",
        link: "https://iliagorovitz.bandcamp.com",
      },
      {
        name: "Andarta",
        bio: "...",
        link: "https://andartagroup.bandcamp.com",
      },
    ];
    const bandsFestival = [
      {
        name: "Munka:Weber",
        bio: "...",
        link: "https://www.youtube.com/watch?v=FMub_RS1yxc",
      },
      {
        name: "Sheik Anorak",
        bio: "...",
        link: "https://gafferrecords.bandcamp.com/album/gbg2",
      },
      {
        name: "TRRMA'",
        bio: "...",
        link: "https://www.youtube.com/watch?v=uprVt6G7p5U",
      },
      {
        name: "Viola Yip",
        bio: "...",
        link: "https://www.youtube.com/watch?v=I_3ZA_AiZtQ",
      },
      {
        name: "Schleu",
        bio: "...",
        link: "https://www.youtube.com/watch?v=o5Ilts-0Dxs",
      },
      {
        name: "Cuntroaches",
        bio: "...",
        link: "https://www.youtube.com/watch?v=KQ90sqzcunU",
      },
      {
        name: "Miss Tetanos",
        bio: "...",
        link: "https://www.youtube.com/watch?v=mRw7jDelmc0",
      },
      {
        name: "P≡B",
        bio: "...",
        link: "https://www.youtube.com/watch?v=a69ZprY4M_8",
      },
      {
        name: "Jan Van Angelopoulos & Fotis Siotas",
        bio: "...",
        link: "https://www.youtube.com/watch?v=2K0zk4BRN_Y",
      },
      {
        name: "weird ugly fish / keista bjauri žuvis",
        bio: "...",
        link: "https://weirduglyfish.bandcamp.com/album/legs-are-for-swimming",
      },
      {
        name: "Ignaz Schick",
        bio: "...",
        link: "https://www.youtube.com/watch?v=sfeNyvmz7JY",
      },
      {
        name: "GRMMSK",
        bio: "...",
        link: "https://www.youtube.com/watch?v=3lkv_UjPJC0",
      },
    ];

    const bands = () => {
      switch (roster) {
        case "warmup1":
          return bandsWarmup1;
        case "warmup2":
          return bandsWarmup2;
        case "festival":
          return bandsFestival;
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
