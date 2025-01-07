// const goodTestPrompt =
//   "**Crop Data:**\n" +
//   "\n" +
//   "\"<p>80-90 Days to maturity. <em>Zea mays</em>. Peaches and Cream Hybrid Corn Seeds. Non-GMO, annual, hybrid, Sweet Corn. Suitable for growing in garden plots or raised beds. Corn tolerates heat and drought-prone regions. Resistant to Northern Corn Leaf Blight, Southern Corn Leaf Blight. Peaches and Cream Hybrid is a staple American crop. Full season fresh market bicolor corn. Designed for a fresh market, roadside stand, and home garden. The Peaches and Cream Hybrid variety of corn seeds is a hybrid that provides a high yield of yellow and white kernels. The stalks produce large, eight inch ears. The Peaches and Cream Hybrid crop does best with full sun, in grow zones three to eleven. ~177 seeds/oz.</p>\n" +
//   "<!--split-->\n" +
//   "<p><a href=\"https://www.trueleafmarket.com/pages/the-vegetable-growing-guide-from-true-leaf-market\" target=\"_blank\"><strong>Download Free Vegetable Growing Guide PDF</strong></a></p>\n" +
//   "<!--attr-->\n" +
//   "<ul>\n" +
//   "<li>\n" +
//   "<strong>Latin Name:</strong><span> <em>Zea mays</em></span>\n" +
//   "</li>\n" +
//   "<li>\n" +
//   "<strong>Hardiness Zone:</strong> 2, 3, 4, 5, 6, 7, 8, 9, 10 Annual: Not Intended to Overwinter</li>\n" +
//   "<li>\n" +
//   "<strong>Days to Maturity:</strong>80-90</li>\n" +
//   "<li>\n" +
//   "<strong>Days to Germination:</strong> 7-10</li>\n" +
//   "<li>\n" +
//   "<strong>Germination Temperature:</strong> 60-95 °F (16-35 °C)</li>\n" +
//   "<li>\n" +
//   "<strong>Seeding Depth:</strong> 1.5-2 inches</li>\n" +
//   "<li>\n" +
//   "<strong>Direct Sow:</strong> Yes</li>\n" +
//   "<li>\n" +
//   "<strong>Corn Type:</strong> Sweet - Sweet Corn is the most popular corn for eating as corn on the cob or corn niblets. It has a high sugar content and is best enjoyed when picked a little early before the sugars turn to starch. This is your classic barbeque and picnic summer corn.</li>\n" +
//   "<li>\n" +
//   "<strong>Plant Spacing:</strong> 10-15 inches</li>\n" +
//   "<li>\n" +
//   "<strong>Row Spacing:</strong> 24-36 inches</li>\n" +
//   "<li>\n" +
//   "<strong>Plant Height:</strong> 72-84 inches</li>\n" +
//   "<li>\n" +
//   "<strong>Plant Width:</strong> 8-12 inches</li>\n" +
//   "<li>\n" +
//   "<strong>Growth Habit:</strong> Upright</li>\n" +
//   "<li>\n" +
//   "<strong>Growth Speed:</strong> Mid - Ready for harvest around 80 to 95 days from direct sowing to harvesting ripe ears of corn.</li>\n" +
//   "<li>\n" +
//   "<strong>Soil Preference:</strong> PH level of 6 to 6.5, rich soil with Organic matter is best.</li>\n" +
//   "<li>\n" +
//   "<strong>Temperature Preference:</strong> Warmer</li>\n" +
//   "<li>\n" +
//   "<strong>Light Preference:</strong> Full Sun</li>\n" +
//   "<li>\n" +
//   "<strong>Pests and Diseases:</strong> Resistant to Northern Corn Leaf Blight, Southern Corn Leaf Blight. Susceptible to corn wireworms, cutworms, and fungal diseases</li>\n" +
//   "<li>\n" +
//   "<strong>Peaches and Cream Hybrid Corn Color:</strong> Bicolor (Yellow and White)</li>\n" +
//   "<li>\n" +
//   "<strong>Peaches and Cream Hybrid Corn Flavor:</strong> Sugary Enhanced (se) - Sweeter and more tender than (su) corn, and the conversion of sugar to starch is slower, so can be picked and stored for almost a week before eating.</li>\n" +
//   "<li>\n" +
//   "<strong>Special Use:</strong> Canning or Freezing - This variety may be stored by canning or freezing to be used throughout the year.</li>\n" +
//   "<li>\n" +
//   "<strong>Machine Harvest Friendly:</strong> Yes</li>\n" +
//   "</ul>\n" +
//   "<!--endattr-->\n" +
//   "<p><br></p>\n" +
//   "<h3>How to Grow Peaches and Cream Hybrid (se) Corn From Seed</h3>\n" +
//   "<p>SE means sugary enhanced. Begin by sowing directly outdoors, one inch deep with six to eight inches between seeds and thirty inches between rows. When choosing a site in your garden, keep the sun in mind; these tall stalks have potential to block the sunlight from other plants. While growing, the crops will need one to one and a half inches of water. When the kernels are firm, the ear is ripe. To harvest, firmly pull the ear downwards while twisting. The unhusked ears can be kept in the fridge for up to one week.</p>\n" +
//   "<h3>Facts:</h3>\n" +
//   "<p> </p>\n" +
//   "<h3>Seeds Per Package:</h3>\n" +
//   "<ul>\n" +
//   "<li>20 g - Approximately 100 Seeds</li>\n" +
//   "<li>1 oz - Approximately 140 Seeds</li>\n" +
//   "<li>4 oz - Approximately 560 Seeds</li>\n" +
//   "<li>1 lb - Approximately 2,400 Seeds</li>\n" +
//   "<li>5 lb - Approximately 12,000 Seeds</li>\n" +
//   "<li>25 lb - Approximately 60,000 Seeds</li>\n" +
//   "</ul>\""
//
// const badTestPrompt =
//   "**Crop Data:**\n" +
//   "\n" +
//   "\"<p>pee peep</p>\n" +
//   "<!--split-->\n" +
//   "<p><a href=\"https://www.trueleafmarket.com/pages/the-vegetable-growing-guide-from-true-leaf-market\" target=\"_blank\"><strong>Download Free Vegetable Growing Guide PDF</strong></a></p>\n" +
//   "<!--attr-->\n" +
//   "<ul>\n" +
//   "<li>\n" +
//   "<strong>Latin Name:</strong><span> <em>Zea mays</em></span>\n" +
//   "</li>\n" +
//   "<strong>Corn Type:</strong> Sweet - Sweet Corn is the most popular corn for eating as corn on the cob or corn niblets. It has a high sugar content and is best enjoyed when picked a little early before the sugars turn to starch. This is your classic barbeque and picnic summer corn.</li>\n" +
//   "<li>\n" +
//   "<li>\n" +
//   "<strong>Special Use:</strong> Canning or Freezing - This variety may be stored by canning or freezing to be used throughout the year.</li>\n" +
//   "<li>\n" +
//   "<strong>Machine Harvest Friendly:</strong> Yes</li>\n" +
//   "</ul>\n" +
//   "<!--endattr-->\n" +
//   "<p><br></p>\n" +
//   "<h3>How to Grow Peaches and Cream Hybrid (se) Corn From Seed</h3>\n" +
//   "<h3>Facts:</h3>\n" +
//   "<p> </p>\n" +
//   "<h3>Seeds Per Package:</h3>\n" +
//   "<ul>\n" +
//   "<li>20 g - Approximately 100 Seeds</li>\n" +
//   "<li>1 oz - Approximately 140 Seeds</li>\n" +
//   "<li>4 oz - Approximately 560 Seeds</li>\n" +
//   "<li>1 lb - Approximately 2,400 Seeds</li>\n" +
//   "<li>5 lb - Approximately 12,000 Seeds</li>\n" +
//   "<li>25 lb - Approximately 60,000 Seeds</li>\n" +
//   "</ul>\""

// Use these functions in code to test the above prompts
// export const getCropDataWithGoodTrueLeafDescription = async () => {
//   const response =
//     await amplifyClient.queries.getCropDataFromTrueLeafDescription({ generalDataHandle: "Corn", userMessage: goodTestPrompt });
//   console.log(response);
// };
//
// export const getCropDataWithBadTrueLeafDescription = async () => {
//   const response =
//     await amplifyClient.queries.getCropDataFromTrueLeafDescription({ generalDataHandle: "Corn but this handle is wrong", userMessage: badTestPrompt });
//   console.log(response);
// };