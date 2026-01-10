// app/utils/default-quiz.ts

export const defaultQuestions = [
  {
    key: "settingStyle",
    title: "Choose the setting's style",
    type: "select",
    description: null,
    min: null,
    suggestions: null,
    options: [
      {
        value: "solitaire",
        label: "Solitaire",
        image: "https://images.pexels.com/photos/9953654/pexels-photo-9953654.jpeg",
        description: "A timeless single diamond elevated by delicate prongs.",
        icon: null,
        upgrade: null,
        karats: null,
        extra: null,
        highlight: null,
        diamondImage: null,
        specs: null,
      },
      {
        value: "halo",
        label: "Halo",
        image: "https://images.pexels.com/photos/9953654/pexels-photo-9953654.jpeg",
        description: "A sparkling circle of diamonds surrounds the center stone.",
        icon: null,
        upgrade: null,
        karats: null,
        extra: null,
        highlight: null,
        diamondImage: null,
        specs: null,
      },
      // ... add all other settingStyle options here
      // threeStone, vintage, pave, cathedral, bezel
    ],
  },

  {
    key: "metal",
    title: "Choose the metal",
    type: "select",
    description: null,
    min: null,
    suggestions: null,
    options: [
      {
        value: "whiteGold",
        label: "White Gold",
        image: "https://images.pexels.com/photos/18451698/pexels-photo-18451698.jpeg",
        description: "Modern, bright, and rhodium-plated for lasting shine.",
        icon: null,
        upgrade: null,
        karats: [
          { value: "14k", label: "14K White Gold" },
          { value: "18k", label: "18K White Gold", upgrade: true },
        ],
        extra: null,
        highlight: null,
        diamondImage: null,
        specs: null,
      },
      // ... add yellowGold, roseGold, platinum
    ],
  },

  {
    key: "origin",
    title: "Choose diamond's origin",
    type: "select",
    description:
      "They are both the same, Natural diamonds are formed deep within the Earth, while lab diamonds are created in a lab",
    min: null,
    suggestions: null,
    options: [
      {
        value: "labGrown",
        label: "Lab Grown",
        image: null,
        description:
          "Lab-grown diamonds are created using advanced technology that replicates natural diamond formation.",
        icon: "https://images.pexels.com/photos/31677627/pexels-photo-31677627.jpeg",
        upgrade: null,
        karats: null,
        extra: {
          title: "What is a Lab-Grown Diamond?",
          content:
            "Lab-grown diamonds are produced in highly controlled environments using cutting-edge technology that mimics how diamonds form in nature.",
        },
        highlight: null,
        diamondImage: null,
        specs: null,
      },
      // ... add natural
    ],
  },

  {
    key: "shape",
    title: "Choose diamond's shape",
    type: "select",
    description: null,
    min: null,
    suggestions: null,
    options: [
      {
        value: "round",
        label: "Round",
        image: "https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg",
        description: null,
        icon: null,
        upgrade: null,
        karats: null,
        extra: null,
        highlight: null,
        diamondImage: null,
        specs: null,
      },
      // ... add oval, cushion, pear, marquise, emerald, radiant, princess, asscher, heart
    ],
  },

  {
    key: "budget",
    title: "How much would you like to spend?",
    type: "budget",
    description: null,
    min: 1700,
    suggestions: [2000, 3500, 5000],
    options: [], // no options for budget type
  },

  {
    key: "priority",
    title: "Find your match",
    type: "select",
    description: null,
    min: null,
    suggestions: null,
    options: [
      {
        value: "superHighQuality",
        label: "Super High Quality",
        image: null,
        description:
          "Colorless with superb cut, no visible imperfections with smaller carat size",
        icon: null,
        upgrade: null,
        karats: null,
        extra: null,
        highlight: null,
        diamondImage: "https://images.pexels.com/photos/3715989/pexels-photo-3715989.jpeg",
        specs: {
          carat: "1.5",
          color: "J",
          clarity: "SI1",
          ratio: "1.01",
        },
      },
      // ... add balanced, asBigAsPossible
    ],
  },
] as const;