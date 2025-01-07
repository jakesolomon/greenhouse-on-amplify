export interface SearchParameter {
  name: string
  tags: string[]
  category: string
}

export interface SelectableCropType {
  displayName: string;
  collectionHandle: string
  subTypeParameters?: SearchParameter[]
  generalDataHandle?: string // matches the handle in getCropDataFromTrueLeafDescription/handler.ts#handbookData
}

export const trueLeafCropTypes: {[key: string]: SelectableCropType} = {
  "Amaranth": {
    displayName: "Amaranth",
    collectionHandle: "amaranth"
  },
  "Bean (snap, bush)": {
    displayName: "Bean (snap, bush)",
    collectionHandle: "bean-planting-seeds",
    subTypeParameters: [
      {"name":"Snap","tags":["Snap Bean"],"category":"Pod Type"},
      {"name":"Bush Beans","tags":["Bush Bean"],"category":"Bean Type"}
    ],
    generalDataHandle: "Bush Bean",
  },
  "Bean (snap, pole)": {
    displayName: "Bean (snap, pole)",
    collectionHandle: "bean-planting-seeds",
    subTypeParameters: [
      {"name":"Snap","tags":["Snap Bean"],"category":"Pod Type"},
      {"name":"Pole Beans","tags":["Pole Bean"],"category":"Bean Type"}
    ],
    generalDataHandle: "Pole Bean",
  },
  "Bean (shell)": {
    displayName: "Bean (shell)",
    collectionHandle: "bean-planting-seeds",
    subTypeParameters: [
      {"name": "Shell","tags": ["Shell Bean"],"category":"Pod Type"}
    ]
  },
  "Beet": {
    displayName: "Beet",
    collectionHandle: "beet-garden-seed",
    generalDataHandle: "Beet"
  },
  "Broccoli": {
    displayName: "Broccoli",
    collectionHandle: "broccoli-gardening-seeds",
    generalDataHandle: "Broccoli"
  },
  "Brussels Sprouts": {
    displayName: "Brussels Sprouts",
    collectionHandle: "brussels-sprouts-planting-seed",
    generalDataHandle: "Brussels Sprouts"
  },
  "Burdock": {
    displayName: "Burdock",
    collectionHandle: "burdock"
  },
  "Cabbage": {
    displayName: "Cabbage",
    collectionHandle: "cabbage-planting-seed",
    generalDataHandle: "Cabbage"
  },
  "Cardoon": {
    displayName: "Cardoon",
    collectionHandle: "cardoon-seeds"
  },
  "Carrot": {
    displayName: "Carrot",
    collectionHandle: "carrot-planting-seeds",
    generalDataHandle: "Carrot"
  },
  "Cauliflower": {
    displayName: "Cauliflower",
    collectionHandle: "cauliflower-planting-seed",
    generalDataHandle: "Cauliflower"
  },
  "Celeriac": {
    displayName: "Celeriac",
    collectionHandle: "celeriac-root-seed",
    generalDataHandle: "Celeriac"
  },
  "Celery": {
    displayName: "Celery",
    collectionHandle: "celery-garden-seed",
    generalDataHandle: "Celery"
  },
  "Chard": {
    displayName: "Chard",
    collectionHandle: "chard-growing-seed",
    generalDataHandle: "Chard"
  },
  "Chinese Toon": {
    displayName: "Chinese Toon",
    collectionHandle: "chinese-toon"
  },
  "Collard": {
    displayName: "Collard",
    collectionHandle: "collard-garden-seed",
    generalDataHandle: "Collards"
  },
  "Corn": {
    displayName: "Corn",
    collectionHandle: "corn-seed-for-garden-planting",
    generalDataHandle: "Corn"
  },
  "Cucamelon": {
    displayName: "Cucamelon",
    collectionHandle: "cucamelon-seeds"
  },
  "Cucumber": {
    displayName: "Cucumber",
    collectionHandle: "cucumber-planting-seed",
    generalDataHandle: "Cucumber"
  },
  "Dandelion Greens": {
    displayName: "Dandelion Greens",
    collectionHandle: "italian-dandelion"
  },
  "Eggplant": {
    displayName: "Eggplant",
    collectionHandle: "eggplant-garden-seed",
    generalDataHandle: "Eggplant"
  },
  "Endive": {
    displayName: "Endive",
    collectionHandle: "endive-planting-seed",
    generalDataHandle: "Endive"
  },
  "Fennel": {
    displayName: "Fennel",
    collectionHandle: "fennel",
  },
  "Flowering Brassicas": {
    displayName: "Flowering Brassicas",
    collectionHandle: "flowering-brassica"
  },
  "Garlic Bulbs": {
    displayName: "Garlic Bulbs",
    collectionHandle: "garlic-bulbs"
  },
  "Gourd": {
    displayName: "Gourd",
    collectionHandle: "gourd-planting-seed",
    generalDataHandle: "Gourds"
  },
  "Jicama": {
    displayName: "Jicama",
    collectionHandle: "jicama"
  },
  "Kale": {
    displayName: "Kale",
    collectionHandle: "kale-garden-seed",
    generalDataHandle: "Kale"
  },
  "Kohlrabi": {
    displayName: "Kohlrabi",
    collectionHandle: "kohlrabi-growing-seed",
    generalDataHandle: "Kohlrabi"
  },
  "Komatsuna": {
    displayName: "Komatsuna",
    collectionHandle: "komatsuna"
  },
  "Leek": {
    displayName: "Leek",
    collectionHandle: "leek",
    generalDataHandle: "Leek"
  },
  "Lettuce": {
    displayName: "Lettuce",
    collectionHandle: "lettuce-seed-for-planting",
    generalDataHandle: "Lettuce"
  },
  "Melon": {
    displayName: "Melon",
    collectionHandle: "melons",
    generalDataHandle: "Melon"
  },
  "Mibuna": {
    displayName: "Mibuna",
    collectionHandle: "mibuna"
  },
  "Misome": {
    displayName: "Misome",
    collectionHandle: "misome"
  },
  "Mizuna": {
    displayName: "Mizuna",
    collectionHandle: "mizuna-seeds"
  },
  "Molokhia": {
    displayName: "Molokhia",
    collectionHandle: "molokhia"
  },
  "Mustard": {
    displayName: "Mustard",
    collectionHandle: "mustard-garden-seed",
    generalDataHandle: "Mustard"
  },
  "Okra": {
    displayName: "Okra",
    collectionHandle: "okra-planting-seed",
    generalDataHandle: "Okra"
  },
  "Onion": {
    displayName: "Onion",
    collectionHandle: "onion-vegetable-seed",
    generalDataHandle: "Onion"
  },
  "Orach": {
    displayName: "Orach",
    collectionHandle: "orach-vegetable-seed",
    generalDataHandle: "Orach"
  },
  "Pak Choi (Bok Choy)": {
    displayName: "Pak Choi (Bok Choy)",
    collectionHandle: "pak-choi-bok-choy"
  },
  "Parsnip": {
    displayName: "Parsnip",
    collectionHandle: "parsnip-garden-seed",
    generalDataHandle: "Parsnip"
  },
  "Pea": {
    displayName: "Pea",
    collectionHandle: "pea-garden-seed",
    generalDataHandle: "Pea"
  },
  "Pepper": {
    displayName: "Pepper",
    collectionHandle: "garden-peppers-seed",
    generalDataHandle: "Pepper"
  },
  "Perilla (Shiso)": {
    displayName: "Perilla (Shiso)",
    collectionHandle: "shiso"
  },
  "Pumpkin": {
    displayName: "Pumpkin",
    collectionHandle: "garden-pumpkin-seed",
    generalDataHandle: "Pumpkin"
  },
  "Purslane": {
    displayName: "Purslane",
    collectionHandle: "purslane-seed-for-planting",
    generalDataHandle: "Purslane"
  },
  "Radicchio": {
    displayName: "Radicchio",
    collectionHandle: "radicchio-garden-seed",
    generalDataHandle: "Radicchio"
  },
  "Radish (spring)": {
    displayName: "Radish (spring)",
    collectionHandle: "garden-radish-seed",
    subTypeParameters: [
      {"name":"Spring","tags":["Spring Radish"],"category":"Type"}
    ],
    generalDataHandle: "Spring Radish"
  },
  "Radish (winter)": {
    displayName: "Radish (winter)",
    collectionHandle: "garden-radish-seed",
    subTypeParameters: [
      {"name":"Winter","tags":["Winter Radish"],"category":"Type"}
    ],
    generalDataHandle: "Winter Radish"
  },
  "Rutabaga": {
    displayName: "Rutabaga",
    collectionHandle: "rutabaga-garden-seed",
    generalDataHandle: "Rutabaga"
  },
  "Roselle": {
    displayName: "Roselle",
    collectionHandle: "roselle"
  },
  "Salsify": {
    displayName: "Salsify",
    collectionHandle: "salsify-garden-seed",
    generalDataHandle: "Salsify"
  },
  "Soybean": {
    displayName: "Soybean",
    collectionHandle: "soybean"
  },
  "Spinach": {
    displayName: "Spinach",
    collectionHandle: "spinach-planting-seed",
    generalDataHandle: "Spinach"
  },
  "Strawberry": {
    displayName: "Strawberry",
    collectionHandle: "garden-strawberry-seed",
    generalDataHandle: "Strawberry"
  },
  "Tatsoi (Tat Choy)": {
    displayName: "Tatsoi (Tat Choy)",
    collectionHandle: "tatsoi-tat-choy-seed"
  },
  "Tomato": {
    displayName: "Tomato",
    collectionHandle: "tomato-vegetable-seed",
    generalDataHandle: "Tomato"
  },
  "Tomatillo": {
    displayName: "Tomatillo",
    collectionHandle: "tomatillo"
  },
  "Toraji (Balloon Flower)": {
    displayName: "Toraji (Balloon Flower)",
    collectionHandle: "toraji"
  },
  "Turnip": {
    displayName: "Turnip",
    collectionHandle: "turnip-vegetable-seed",
    generalDataHandle: "Turnip"
  },
  "Watermelon": {
    displayName: "Watermelon",
    collectionHandle: "watermelon-garden-seed",
    generalDataHandle: "Watermelon"
  },
  "Winter Squash": {
    displayName: "Winter Squash",
    collectionHandle: "squash-garden-seed",
    subTypeParameters: [
      {"name":"Winter - Other","tags":["Winter"],"category":"Squash Type"}
    ],
    generalDataHandle: "Winter Squash"
  },
  "Zucchini": {
    displayName: "Zucchini",
    collectionHandle: "zucchini-vegetable-seed",
    generalDataHandle: "Summer Squash"
  }
}