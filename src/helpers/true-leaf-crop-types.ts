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
  idealHardinessZones: number[]
}

export const trueLeafCropTypes: { [key: string]: SelectableCropType } = {
  "Amaranth": {
    displayName: "Amaranth",
    collectionHandle: "amaranth",
    idealHardinessZones: [5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  "Bean (snap, bush)": {
    displayName: "Bean (snap, bush)",
    collectionHandle: "bean-planting-seeds",
    subTypeParameters: [
      {"name":"Snap","tags":["Snap Bean"],"category":"Pod Type"},
      {"name":"Bush Beans","tags":["Bush Bean"],"category":"Bean Type"}
    ],
    generalDataHandle: "Bush Bean",

    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Bean (snap, pole)": {
    displayName: "Bean (snap, pole)",
    collectionHandle: "bean-planting-seeds",
    subTypeParameters: [
      {"name":"Snap","tags":["Snap Bean"],"category":"Pod Type"},
      {"name":"Pole Beans","tags":["Pole Bean"],"category":"Bean Type"}
    ],
    generalDataHandle: "Pole Bean",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Bean (shell)": {
    displayName: "Bean (shell)",
    collectionHandle: "bean-planting-seeds",
    subTypeParameters: [
      {"name": "Shell","tags": ["Shell Bean"],"category":"Pod Type"}
    ],
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Beet": {
    displayName: "Beet",
    collectionHandle: "beet-garden-seed",
    generalDataHandle: "Beet",
    idealHardinessZones: [2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Broccoli": {
    displayName: "Broccoli",
    collectionHandle: "broccoli-gardening-seeds",
    generalDataHandle: "Broccoli",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Brussels Sprouts": {
    displayName: "Brussels Sprouts",
    collectionHandle: "brussels-sprouts-planting-seed",
    generalDataHandle: "Brussels Sprouts",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Burdock": {
    displayName: "Burdock",
    collectionHandle: "burdock",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  },
  "Cabbage": {
    displayName: "Cabbage",
    collectionHandle: "cabbage-planting-seed",
    generalDataHandle: "Cabbage",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Cardoon": {
    displayName: "Cardoon",
    collectionHandle: "cardoon-seeds",
    idealHardinessZones: [7, 8, 9, 10, 11, 12, 13]
  },
  "Carrot": {
    displayName: "Carrot",
    collectionHandle: "carrot-planting-seeds",
    generalDataHandle: "Carrot",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Cauliflower": {
    displayName: "Cauliflower",
    collectionHandle: "cauliflower-planting-seed",
    generalDataHandle: "Cauliflower",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Celeriac": {
    displayName: "Celeriac",
    collectionHandle: "celeriac-root-seed",
    generalDataHandle: "Celeriac",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Celery": {
    displayName: "Celery",
    collectionHandle: "celery-garden-seed",
    generalDataHandle: "Celery",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  "Chard": {
    displayName: "Chard",
    collectionHandle: "chard-growing-seed",
    generalDataHandle: "Chard",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Chinese Toon": {
    displayName: "Chinese Toon",
    collectionHandle: "chinese-toon",
    idealHardinessZones: [6, 7, 8, 9, 10, 11]
  },
  "Collard": {
    displayName: "Collard",
    collectionHandle: "collard-garden-seed",
    generalDataHandle: "Collards",
    idealHardinessZones: [6, 7, 8, 9, 10]
  },
  "Corn": {
    displayName: "Corn",
    collectionHandle: "corn-seed-for-garden-planting",
    generalDataHandle: "Corn",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Cucamelon": {
    displayName: "Cucamelon",
    collectionHandle: "cucamelon-seeds",
    idealHardinessZones: [7, 8, 9, 10, 11, 12, 13]
  },
  "Cucumber": {
    displayName: "Cucumber",
    collectionHandle: "cucumber-planting-seed",
    generalDataHandle: "Cucumber",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Dandelion Greens": {
    displayName: "Dandelion Greens",
    collectionHandle: "italian-dandelion",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Eggplant": {
    displayName: "Eggplant",
    collectionHandle: "eggplant-garden-seed",
    generalDataHandle: "Eggplant",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  "Endive": {
    displayName: "Endive",
    collectionHandle: "endive-planting-seed",
    generalDataHandle: "Endive",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  },
  "Fennel": {
    displayName: "Fennel",
    collectionHandle: "fennel",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Flowering Brassicas": {
    displayName: "Flowering Brassicas",
    collectionHandle: "flowering-brassica",
    idealHardinessZones: [7, 8, 9, 10, 11]
  },
  "Garlic Bulbs": {
    displayName: "Garlic Bulbs",
    collectionHandle: "garlic-bulbs",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Gourd": {
    displayName: "Gourd",
    collectionHandle: "gourd-planting-seed",
    generalDataHandle: "Gourds",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Jicama": {
    displayName: "Jicama",
    collectionHandle: "jicama",
    idealHardinessZones: [7, 8, 9, 10, 11, 12]
  },
  "Kale": {
    displayName: "Kale",
    collectionHandle: "kale-garden-seed",
    generalDataHandle: "Kale",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Kohlrabi": {
    displayName: "Kohlrabi",
    collectionHandle: "kohlrabi-growing-seed",
    generalDataHandle: "Kohlrabi",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Komatsuna": {
    displayName: "Komatsuna",
    collectionHandle: "komatsuna",
    idealHardinessZones: [6, 7, 8, 9, 10]
  },
  "Leek": {
    displayName: "Leek",
    collectionHandle: "leek",
    generalDataHandle: "Leek",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Lettuce": {
    displayName: "Lettuce",
    collectionHandle: "lettuce-seed-for-planting",
    generalDataHandle: "Lettuce",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Melon": {
    displayName: "Melon",
    collectionHandle: "melons",
    generalDataHandle: "Melon",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  "Mibuna": {
    displayName: "Mibuna",
    collectionHandle: "mibuna",
    idealHardinessZones: [5, 6, 7, 8, 9, 10]
  },
  "Misome": {
    displayName: "Misome",
    collectionHandle: "misome",
    idealHardinessZones: [5, 6, 7, 8, 9, 10]
  },
  "Mizuna": {
    displayName: "Mizuna",
    collectionHandle: "mizuna-seeds",
    idealHardinessZones: [5, 6, 7, 8, 9, 10]
  },
  "Molokhia": {
    displayName: "Molokhia",
    collectionHandle: "molokhia",
    idealHardinessZones: [8, 9, 10, 11, 12, 13]
  },
  "Mustard": {
    displayName: "Mustard",
    collectionHandle: "mustard-garden-seed",
    generalDataHandle: "Mustard",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  },
  "Okra": {
    displayName: "Okra",
    collectionHandle: "okra-planting-seed",
    generalDataHandle: "Okra",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Onion": {
    displayName: "Onion",
    collectionHandle: "onion-vegetable-seed",
    generalDataHandle: "Onion",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Orach": {
    displayName: "Orach",
    collectionHandle: "orach-vegetable-seed",
    generalDataHandle: "Orach",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  },
  "Pak Choi (Bok Choy)": {
    displayName: "Pak Choi (Bok Choy)",
    collectionHandle: "pak-choi-bok-choy",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  },
  "Parsnip": {
    displayName: "Parsnip",
    collectionHandle: "parsnip-garden-seed",
    generalDataHandle: "Parsnip",
    idealHardinessZones: [3, 4, 5, 6, 7, 8]
  },
  "Pea": {
    displayName: "Pea",
    collectionHandle: "pea-garden-seed",
    generalDataHandle: "Pea",
    idealHardinessZones: [3, 4, 5, 6, 7, 8]
  },
  "Pepper": {
    displayName: "Pepper",
    collectionHandle: "garden-peppers-seed",
    generalDataHandle: "Pepper",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Perilla (Shiso)": {
    displayName: "Perilla (Shiso)",
    collectionHandle: "shiso",
    idealHardinessZones: [7, 8, 9, 10, 11, 12]
  },
  "Pumpkin": {
    displayName: "Pumpkin",
    collectionHandle: "garden-pumpkin-seed",
    generalDataHandle: "Pumpkin",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Purslane": {
    displayName: "Purslane",
    collectionHandle: "purslane-seed-for-planting",
    generalDataHandle: "Purslane",
    idealHardinessZones: [5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  "Radicchio": {
    displayName: "Radicchio",
    collectionHandle: "radicchio-garden-seed",
    generalDataHandle: "Radicchio",
    idealHardinessZones: [4, 5, 6, 7, 8, 9]
  },
  "Radish (spring)": {
    displayName: "Radish (spring)",
    collectionHandle: "garden-radish-seed",
    subTypeParameters: [
      {"name":"Spring","tags":["Spring Radish"],"category":"Type"}
    ],
    generalDataHandle: "Spring Radish",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Radish (winter)": {
    displayName: "Radish (winter)",
    collectionHandle: "garden-radish-seed",
    subTypeParameters: [
      {"name":"Winter","tags":["Winter Radish"],"category":"Type"}
    ],
    generalDataHandle: "Winter Radish",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Rutabaga": {
    displayName: "Rutabaga",
    collectionHandle: "rutabaga-garden-seed",
    generalDataHandle: "Rutabaga",
    idealHardinessZones: [3, 4, 5, 6, 7, 8]
  },
  "Roselle": {
    displayName: "Roselle",
    collectionHandle: "roselle",
    idealHardinessZones: [8, 9, 10, 11, 12, 13]
  },
  "Salsify": {
    displayName: "Salsify",
    collectionHandle: "salsify-garden-seed",
    generalDataHandle: "Salsify",
    idealHardinessZones: [3, 4, 5, 6, 7, 8]
  },
  "Soybean": {
    displayName: "Soybean",
    collectionHandle: "soybean",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  },
  "Spinach": {
    displayName: "Spinach",
    collectionHandle: "spinach-planting-seed",
    generalDataHandle: "Spinach",
    idealHardinessZones: [2, 3, 4, 5, 6, 7, 8, 9]
  },
  "Strawberry": {
    displayName: "Strawberry",
    collectionHandle: "garden-strawberry-seed",
    generalDataHandle: "Strawberry",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  "Tatsoi (Tat Choy)": {
    displayName: "Tatsoi (Tat Choy)",
    collectionHandle: "tatsoi-tat-choy-seed",
    idealHardinessZones: [5, 6, 7, 8, 9, 10]
  },
  "Tomato": {
    displayName: "Tomato",
    collectionHandle: "tomato-vegetable-seed",
    generalDataHandle: "Tomato",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Tomatillo": {
    displayName: "Tomatillo",
    collectionHandle: "tomatillo",
    idealHardinessZones: [5, 6, 7, 8, 9, 10, 11]
  },
  "Toraji (Balloon Flower)": {
    displayName: "Toraji (Balloon Flower)",
    collectionHandle: "toraji",
    idealHardinessZones: [6, 7, 8, 9, 10]
  },
  "Turnip": {
    displayName: "Turnip",
    collectionHandle: "turnip-vegetable-seed",
    generalDataHandle: "Turnip",
    idealHardinessZones: [3, 4, 5, 6, 7, 8]
  },
  "Watermelon": {
    displayName: "Watermelon",
    collectionHandle: "watermelon-garden-seed",
    generalDataHandle: "Watermelon",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  "Winter Squash": {
    displayName: "Winter Squash",
    collectionHandle: "squash-garden-seed",
    subTypeParameters: [
      {"name":"Winter - Other","tags":["Winter"],"category":"Squash Type"}
    ],
    generalDataHandle: "Winter Squash",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  "Zucchini": {
    displayName: "Zucchini",
    collectionHandle: "zucchini-vegetable-seed",
    generalDataHandle: "Summer Squash",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  }
};
