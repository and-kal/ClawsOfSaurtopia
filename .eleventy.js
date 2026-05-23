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
  eleventyConfig.addPassthroughCopy("./archive/html/*.html");
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
      ["#D01640", "#F9FA9D"],
      ["#723DC8", "#F8D838"],
      ["#F12E2F", "#1B0A0B"],
      ["#94C566", "#48034E"],
      ["#7DFB52", "#911A1A"],
      ["#D86CB4", "#001651"],
      ["#824F5A", "#FEF2BD"],
      ["#D07E35", "#102437"],
      ["#BDA8C5", "#560A52"],
      ["#3577AE", "#FDFECB"],
      ["#F69423", "#181578"],
      ["#32CBE9", "#301951"],
      ["#92ECCA", "#110A02"],
      ["#C3F936", "#225C3B"],
      ["#373B52", "#C5EF80"],
      ["#A8E004", "#0506A7"],
    ];

    const bandsWarmup2024_1 = [
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
    const bandsWarmup2024_2 = [
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
    const bandsWarmup2026 = [
      {
        name: "Doskocz x Janssen",
        bio: "some more guitaristic shenanigans as conjured by Paweł Doskocz, however this time dequantized by Zdrój’s Sebastiaan Janssen’s drummeling",
        link: "https://youtu.be/3zsjoe_i11s",
      },
      {
        name: "tsev x Strzał w Kolano",
        bio: "an improvised symposium of ancient music held in an electronic agora brought to you by: Strzał w Kolano (of Kurws, Przepych, Pustostany and Norymberga) on detuned guitar and tsev on microtuned synthesizer",
        link: "https://youtu.be/NQg6de9QX58/",
      },
      {
        name: "T.u.B.",
        bio: "meditative noise weirdness as emitted by one of YOR’s members, expanding the designated usages of stringstruments, watering cans and various devices",
        link: "https://krutrecords.bandcamp.com/album/thats-the-law-in-this-land-after-all",
      },
    ];
    const bandsFestival2026Friday = [
      {
        name: "Molto [D]",
        bio: "minimal ambient electronics",
        link: "https://ominira.bandcamp.com/album/versatile-international-service",
      },
      {
        name: "Murder Murder [US]",
        bio: "screamin’ j. brass core",
        link: "https://murdermurder1.bandcamp.com/album/luxury",
      },
      {
        name: "mʊdʌki and krickl krackl [BY/CZ/D]",
        bio: "polyrhythmic dulcimer electronics",
        link: "https://mudaki.bandcamp.com/",
      },
      {
        name: "Jooklo Duo [IT]",
        bio: "distorted free jazz",
        link: "http://troglosound.altervista.org",
      },
      {
        name: "Bö.senberg [F/D]",
        bio: "hypnotic house drum",
        link: "https://industriemusicale.org/bo-senberg",
      },
      {
        name: "Jens Vetter [A]",
        bio: "synth-driven tek art",
        link: "https://jensvetter.bandcamp.com/",
      },
      {
        name: "Ford Escort [A]",
        bio: "glitchy neon noise",
        link: "https://www.mixcloud.com/DJ_Ford_Escort/",
      },
    ];
    const bandsFestival2026Saturday = [
      {
        name: "Πxl [D]",
        bio: "breath-controlled algorithms",
        link: "https://pixl.pink/",
      },
      {
        name: "Jean-Philippe Gross [F]",
        bio: "dedicated feedback drones",
        link: "https://jeanphilippegross.com/",
      },
      {
        name: "Jena Jang [KOR/CZ]",
        bio: "raw noise ’n’ voice",
        link: "https://jenajang.com/",
      },
      {
        name: "The Selva [POR]",
        bio: "post-jazzy tonewood",
        link: "https://arquivo.osso.pt/en/projects/the-selva/",
      },
      { name: "WAL [F]", bio: "superfresh future electronis" },
      {
        name: "Earth Logoff [D]",
        bio: "industrial cyber grind",
        link: "https://earthlogoff.bandcamp.com/",
      },
      {
        name: "DJ Shlucht [D]",
        bio: "eclectic turntable katz",
        link: "https://djshlucht.bandcamp.com/album/drone-day",
      },
    ];
    const bandsFestival2024Friday = [
      {
        name: "Sheik Anorak",
        bio: false,
        link: "https://gafferrecords.bandcamp.com/album/gbg2",
      },
      {
        name: "Circuit Bending Surprise Act",
        bio: false,
        link: "https://clawsofsaurtopia.neocities.org/archive/2024/workshops/",
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
    const bandsFestival2024Saturday = [
      {
        name: "Omni Selassi",
        bio: false,
        link: "https://omniselassi.bandcamp.com/",
      },
      {
        name: "C̶u̶n̶t̶r̶o̶a̶c̶h̶e̶s̶",
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
        case "warmup2024_1":
          return bandsWarmup2024_1;
        case "warmup2024_2":
          return bandsWarmup2024_2;
        case "warmup2026":
          return bandsWarmup2026;
        case "festival2026Friday":
          return bandsFestival2026Friday;
        case "festival2026Saturday":
          return bandsFestival2026Saturday;
        case "festival2024Friday":
          return bandsFestival2024Friday;
        case "festival2024Saturday":
          return bandsFestival2024Saturday;
        default:
          break;
      }
    };

    const shuffledColourPairings = [...randomColourPairings].sort(
      () => Math.random() - 0.5,
    );
    let htmlElement = "";
    bands().map((band, index) => {
      const currentColourPair =
        shuffledColourPairings[index % shuffledColourPairings.length];

      htmlElement += `<div
        class='band'
        style="color:${currentColourPair[0]};background-color:${
          currentColourPair[1]
        };border:3px groove ${currentColourPair[0]}">
        `;
      band.link
        ? (htmlElement += `<a href='${band.link}' 
          target='_blank' rel='noopener noreferrer' class='underline band_link' `)
        : (htmlElement += `<a class='band_link' `);
      htmlElement += `style="color:${currentColourPair[1]};background-color:${
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
