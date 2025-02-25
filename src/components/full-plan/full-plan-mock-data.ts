// These are probably fine, I think they just didn't get parsed correctly
// const summaries = JSON.parse(
//   "{\"January\":\"\",\"February\":\"\",\"March\":\"March is busy with starting broccoli, cauliflower, and snap peas indoors. Use seed trays with well-draining mix, maintain warm temperatures, and provide adequate light for strong seedlings. Keep airflow to prevent disease. Check seedling growth regularly.\",\"April\":\"Continue nurturing broccoli, cauliflower, and pea seedlings. Snap peas are transplanted outdoors early April; ensure they have support to climb, and harden off first. Begin hardening off broccoli and cauliflower for a future transplant.\",\"May\":\"In early May, transplant broccoli outdoors; ensure plants settle well by watering and mulching. Snap peas are ready for harvest by late May. Start corn seeds indoors with adequate warmth and light. Care for cauliflower seedlings with light and consistent watering.\",\"June\":\"Maintain broccoli and protect from pests. Continue harvesting snap peas and prepare the area for corn planting mid-June. Harden off and transplant corn seedlings to prepared soil. Keep watch for pests on all plants.\",\"July\":\"Harvest broccoli through mid-July and remove plants for future cauliflower planting. Harden off cauliflower seedlings. Manage watering and pests in corn plants. Be vigilant to provide enough water and pest control.\",\"August\":\"Prepare Plot 1 for cauliflower, transplant seedlings. Continue corn care, start harvesting late August. Begin kale seeds indoors; ensure light exposure and airflow for strong seedlings.\",\"September\":\"Maintain watering and pest control for cauliflower. Finish corn harvest by mid-September and prepare for kale. Harden off kale seedlings and transplant. Watch transplanted kale for shock and watering needs.\",\"October\":\"Continue care for cauliflower, maintaining water and observing head size. Begin blanching heads. Ensure kale receives consistent watering, monitor for pests, and mulch to retain moisture.\",\"November\":\"Harvest cauliflower mid-November, cleanup afterwards. Start kale harvest early November, taking leaves from base. Monitor for pests and clear after final harvests, preparing garden for next year.\",\"December\":\"\"}"
// )
//
// const introExtras = JSON.parse(
//   "{\"pruning\":\"\",\"supportStructures\":\"The Original Snap Pea variety, like many pea plants, will benefit from the use of support structures such as trellises or stakes. As these vines grow, they naturally seek to climb, which helps keep the plants off the ground and improves air circulation. Start by installing a trellis or placing stakes at the time of sowing, or very soon after. Position the supports in a north-south orientation to obtain optimal sunlight for both sides of the trellis. As the snap peas begin to grow, gently guide the tendrils onto the support; they will naturally anchor themselves. This practice will result in healthier plants, ease of harvest, and more prolific pea production. For corn, though not a vine like peas, planting rows two to three feet apart can support stalks against wind.\"}"
// )

export const allTasks =
  [
    {
      "plot": 1,
      "crop": "Broccoli",
      "tasks": {
        "January": [],
        "February": [],
        "March": [
          "***indoors***Start broccoli seeds indoors approximately 6-8 weeks before the outdoor transplanting date, which would be around March 1. Use seed-starting trays filled with seed starting mix, which has good drainage and aeration ideal for seeds.",
          "***indoors***Ensure a consistent temperature of 65°F-70°F during germination. If necessary, use a seedling heat mat to maintain warmth. Without consistent warmth, seeds can germinate slowly.",
          "***indoors***Provide sufficient light by placing seedlings under grow lights for 12-14 hours daily. Broccoli requires strong light; inadequate light can cause the seedlings to become leggy, where stems become long and weak. Alternatively, place them in a bright, south-facing window if grow lights are unavailable, though this may not provide optimal light in early spring.",
          "***indoors***Use a small fan on a low setting to circulate air around seedlings to prevent damping off, a fungal disease that can quickly kill seedlings, and to promote stronger stem development."
        ],
        "April": [
          "***indoors***Continue to nurture broccoli seedlings by watering when the top layer of soil starts to dry out. Be careful not to over-water, as this can lead to root rot.",
          "***indoors***About two weeks before transplanting, begin hardening off broccoli seedlings. Start by placing them outdoors in a sheltered area for a few hours and gradually increase their exposure to outdoor conditions each day."
        ],
        "May": [
          "Transplant broccoli seedlings outdoors around May 1. Choose a cloudy day or in the late afternoon to reduce transplant shock, which can cause the plants to wilt or grow slowly initially.",
          "Space the seedlings approximately 12-24 inches apart in rows that are 24-36 inches apart, allowing them room to grow.",
          "Water the transplants thoroughly after planting to help settle the soil around the roots and encourage strong establishment.",
          "Apply a layer of mulch around the plants to retain soil moisture and prevent weed growth."
        ],
        "June": [
          "Ensure broccoli plants receive about 1-1.5 inches of water per week. Consistent moisture is key to head formation.",
          "Keep an eye out for common pests such as cabbage worms and aphids. Use row covers to protect young plants and inspect leaves regularly, removing any pests by hand if possible. Consider using natural insecticides like neem oil if infestations occur.",
          "Fertilize broccoli plants with a balanced vegetable fertilizer according to package instructions to support growth and head formation."
        ],
        "July": [
          "From July 10, begin to harvest broccoli as heads reach maturity and before yellow flower buds open. Cut heads from the plant with about 6 inches of stem attached.",
          "Continue watering and look after remaining plants as side shoots may develop which can also be harvested.",
          "By July 24, complete all harvesting and remove broccoli plants to prepare the area for the next planting cycle, such as cauliflower. Clear the beds of any remaining plant debris and consider adding compost to enrich the soil."
        ],
        "August": [],
        "September": [],
        "October": [],
        "November": [],
        "December": []
      }
    },
    {
      "plot": 1,
      "crop": "Cauliflower",
      "tasks": {
        "January": [],
        "February": [],
        "March": [
          "***indoors***Start cauliflower seeds indoors approximately 6-8 weeks before the transplanting date. Use seed-starting trays filled with a high-quality seed-starting mix. Sow seeds about 1/4 inch deep."
        ],
        "April": [
          "***indoors***Keep the seed starting trays in a warm location around 65°F-70°F to promote germination. If your home is cooler, consider using a seedling heat mat. Without adequate warmth, germination may be delayed."
        ],
        "May": [
          "***indoors***Once seedlings emerge, provide them with 12-16 hours of light per day using grow lights or placing them in a very sunny window. Grow lights are ideal as they prevent seedlings from becoming leggy due to insufficient natural light. If using natural light, rotate trays for even growth."
        ],
        "June": [
          "***indoors***Ensure good airflow around seedlings by using a small fan. This helps prevent fungal diseases like damping-off, which can cause seedlings to collapse suddenly.",
          "***indoors***Water seedlings consistently but do not overwater. Ensure good drainage to prevent root rot. Signs of overwatering include yellowing leaves."
        ],
        "July": [
          "***indoors***Harden off seedlings in early July. This involves gradually exposing them to outdoor conditions over 1-2 weeks. Start with a few hours in indirect sunlight and gradually increase their exposure."
        ],
        "August": [
          "Prepare the outdoor garden for transplanting. Clear weeds and amend the soil with compost to provide nutrients for the cauliflower.",
          "Transplant seedlings outdoors on August 27, spacing them 18-24 inches apart. Bury the seedlings up to their first true leaves to encourage strong root development.",
          "Water well after transplanting to help them settle and reduce transplant shock."
        ],
        "September": [
          "Monitor cauliflower plants for any signs of pests such as cabbage worms and aphids. Handpick or use insecticidal soap if problems arise.",
          "Water consistently, especially during dry spells, providing about 1-1.5 inches per week to maintain steady growth."
        ],
        "October": [
          "Continue watering and inspecting plants for pests and diseases. Remove any diseased leaves promptly.",
          "Start watching the plant as the heads begin to form. Once heads are about 2-3 inches in diameter, consider blanching (covering the heads) to keep them white and tender."
        ],
        "November": [
          "Harvest cauliflower heads between November 15 and November 22 when they reach a desirable size. The heads should be compact, crisp, and white.",
          "Finish up any remaining harvests by November 22, and remove old plant debris from the garden to prevent overwintering pests."
        ],
        "December": []
      }
    },
    {
      "plot": 2,
      "crop": "Pea (snap)",
      "tasks": {
        "January": [],
        "February": [],
        "March": [
          "***indoors***Start snap pea seeds indoors in early March, approximately 4 weeks before the transplanting date (April 5th). Use deep containers or pots filled with a well-draining potting mix or a seed-starting mix to accommodate the deep roots of pea plants. Sow seeds about 1 inch deep.",
          "***indoors***Ensure the seeds germinate at a temperature ranging from 55°F to 65°F. Snap peas prefer cooler conditions, so a heated mat is not typically needed.",
          "***indoors***Place the containers in a bright location with access to natural sunlight or under grow lights, offering about 10-12 hours of light daily. Snap pea seedlings do not require as intense lighting conditions as some other crops.",
          "***indoors***To strengthen seedlings, provide airflow using a small fan for a few hours each day, preventing issues like damping off, which is a fungal disease that causes seedlings to collapse."
        ],
        "April": [
          "***indoors***Continue caring for your snap pea seedlings, ensuring they have adequate light and are watered appropriately—soil should remain moist but not soggy.",
          "***indoors***Start the hardening off process one to two weeks before the transplant date (April 5th) by gradually introducing seedlings to outdoor conditions. Begin with a couple of hours in a shaded, sheltered outdoor location and slowly increase their exposure to direct sunlight and wind.",
          "Transplant snap pea seedlings outdoors around April 5th. Choose a planting site with full sun to light shade, and amend soil with compost to enhance drainage and fertility. Space seedlings approximately 4-6 inches apart, and set up a support structure, like a trellis, for peas to climb due to their vining nature.",
          "Monitor for signs of transplant shock, such as wilting, and keep the soil consistently moist but not waterlogged."
        ],
        "May": [
          "Once snap pea flowers appear, be vigilant for pests such as aphids. Organic sprays or insecticidal soap can be effective treatments if pests are spotted.",
          "Begin harvesting snap peas around the end of May as they reach maturity. Pods are ready when they are plump but before the peas inside become too large. Harvest regularly to encourage continued production.",
          "Consistent watering is crucial during this period, providing about 1 inch of water per week, especially in case of insufficient rainfall. Applying mulch around plants can also help retain moisture and keep weeds at bay."
        ],
        "June": [
          "Continue harvesting snap peas regularly until the harvest end date of June 15th, encouraging prolonged pod production and preventing maturation of the peas inside.",
          "Approaching mid-June, begin removing plants once all peas have been harvested to prepare the area for planting corn around June 15th. Clear away all plant debris and consider enriching the soil with additional compost or aged manure to prepare for the next crop."
        ],
        "July": [],
        "August": [],
        "September": [],
        "October": [],
        "November": [],
        "December": []
      }
    },
    {
      "plot": 2,
      "crop": "Corn",
      "tasks": {
        "January": [],
        "February": [],
        "March": [],
        "April": [],
        "May": [
          "***indoors***Start corn seeds indoors approximately 3-4 weeks before the outdoor planting date (around May 15). Use seed-starting trays filled with seed starting mix. Sow seeds about 1 inch deep and cover with soil.",
          "***indoors***Ensure a consistent temperature of around 60°F-70°F for germination, which typically takes 7-10 days. A seedling heat mat can help maintain ideal soil temperatures, especially if the home is cooler.",
          "***indoors***Once seeds have germinated, place the seedlings under grow lights or in a very well-lit area where they can receive 12-14 hours of light daily. Insufficient light may lead to tall, weak (leggy) seedlings, which are less viable when transplanted outdoors.",
          "***indoors***Use a fan on low setting to gently breeze the seedlings daily, helping to develop strong stems and prevent damping off, a common fungal disease that causes seedlings to rot at the base and collapse."
        ],
        "June": [
          "***indoors***Harden off corn seedlings by gradually exposing them to outdoor conditions over 7-10 days before transplanting.",
          "Prepare the outdoor planting area by ensuring it has rich, well-draining soil; consider enriching with compost for additional nutrition.",
          "Transplant corn seedlings outdoors around June 15 after ensuring the soil temperature is consistently above 60°F. Space plants 8-12 inches apart in multiple rows to allow for adequate pollination."
        ],
        "July": [
          "Water corn plants regularly, providing 1-1.5 inches of water per week, keeping soil consistently moist but not waterlogged.",
          "Apply a layer of mulch around the base of the plants to retain soil moisture and suppress weeds.",
          "Monitor for pests such as corn earworms and watch for signs of fungal diseases. If needed, use organic pest control methods like neem oil or insecticidal soap."
        ],
        "August": [
          "Continue watering and monitoring soil moisture, especially during dry spells, as corn requires consistent moisture for growth and kernel production.",
          "Start harvesting corn as early as August 29 when the silks at the end of the ear are brown, and the kernels are full and milky if pierced.",
          "Inspect and handle any pest or disease issues promptly to avoid affecting crop yield, especially during this critical growth stage."
        ],
        "September": [
          "Complete the harvest of all corn by September 5 to make room for Kale planting.",
          "Remove corn stalks and clear the area, preparing the site for the upcoming Kale crop. Consider turning the remaining plant material into compost or use as mulch."
        ],
        "October": [],
        "November": [],
        "December": []
      }
    },
    {
      "plot": 2,
      "crop": "Kale",
      "tasks": {
        "January": [],
        "February": [],
        "March": [],
        "April": [],
        "May": [],
        "June": [],
        "July": [],
        "August": [
          "***indoors***Start kale seeds indoors approximately 5-7 weeks before the desired outdoor transplanting date (around August 20 for a September 7 transplant). Use seed-starting trays filled with a sterile seed starting mix to ensure proper drainage and prevent disease. Sow seeds about 1/4 inch deep.",
          "***indoors***Ensure the seed trays are kept at a consistent temperature of around 60°F-70°F. Kale does not require a heat mat as it prefers cooler germination temperatures.",
          "***indoors***Place seedlings under grow lights if possible, ensuring they receive 12-16 hours of light each day. If relying on natural light, place them in a south-facing window. Insufficient light may cause leggy growth, so rotating trays can help distribute light evenly.",
          "***indoors***Use a small fan to provide airflow around the seedlings once they have sprouted, reducing the risk of damping off (a fungal disease that can kill seedlings). Monitor for symptoms like stem collapse and ensure adequate spacing and air circulation."
        ],
        "September": [
          "Begin hardening off kale seedlings around August 26 by gradually introducing them to outdoor conditions over a 7-10 day period. Start by placing them in a shaded, protected area for a few hours each day, gradually increasing their exposure to sunlight and outdoor temperatures.",
          "Transplant kale seedlings outdoors around September 7, choosing a well-drained, sunny location. Space the seedlings about 12-18 inches apart to allow them to grow fully. Ensure the soil is enriched with compost to provide necessary nutrients.",
          "Monitor newly transplanted kale for signs of transplant shock, such as wilting or stunted growth. Ensure plants are well-watered after transplanting to help them adjust to their new environment."
        ],
        "October": [
          "Continue to water kale plants consistently, ensuring the soil remains moist but not waterlogged. Kale prefers cooler weather and will benefit from regular watering, especially if the weather is dry.",
          "Apply mulch around the base of the plants to retain soil moisture and suppress weeds.",
          "Inspect plants regularly for pests such as aphids or cabbage worms. Handpick or use organic treatments like insecticidal soap if needed to manage infestations."
        ],
        "November": [
          "Begin harvesting kale around November 11 for tender leaves. Harvest leaves starting from the base of the plant upwards, leaving the central growing point intact to encourage ongoing production until the end of the harvest period around November 23.",
          "Continue to monitor for pests and disease, especially in milder climates where pests may persist. Regularly check the undersides of leaves for eggs or larvae.",
          "After the final harvest, remove spent plants to clear the garden bed in preparation for winter or other crops. Compost healthy plant debris and dispose of any diseased materials."
        ],
        "December": []
      }
    }
  ]

export const introExtras = {
  "pruning": "Pruning is particularly beneficial for the 'Tomato - Large Red Cherry' as it enhances airflow, which helps prevent diseases and encourages healthier growth. When the tomato plants have reached about 12 to 18 inches in height, begin by removing any small suckers that appear in the leaf axils (the joints on the main stem). This will direct the plant's energy towards producing larger fruits. Additionally, remove any yellow or dead leaves from the bottom of the plant once it is established and as the plant continues to grow. This practice also facilitates efficient nutrient distribution and allows sunlight to reach deeper into the plant's structure.",
  "supportStructures": "Support structures are crucial for 'Tomato - Large Red Cherry' plants. As tomatoes grow, they often become top-heavy and require support to keep the plant upright and the fruits off the ground, preventing rot and promoting better air circulation. Install tomato cages or stakes shortly after transplanting the seedlings into the garden, as this minimizes root disturbance. Use soft ties or twine to gently secure the main stem to the support, ensuring you check regularly and adjust ties to avoid cutting into the stem as it grows. This practice will also make it easier to prune and harvest the plants, as well as reduce the risk of disease."
}

export const summaries = {
  "January": null,
  "February": null,
  "March": "As the chill of winter begins to lift slightly in March, it's time to embark on your gardening journey indoors. March is the month to sow the seeds of anticipation—and tomatoes! Starting tomato seeds indoors around March 19 will give them ample time to grow strong and healthy before they face the great outdoors. With temperatures still quite chilly outside, your seedlings will thrive in the warmth of your home, ideally around 70°F-75°F. Make sure they receive plenty of light, as this will prevent them from becoming leggy. As for your outdoor garden plot, prepare for radishes by ensuring the soil is loose and free from debris. Add compost to enrich the soil, setting the stage for a bountiful radish harvest in the coming months. Consider starting to plant arugula, as it makes an excellent companion to radishes by deterring pests like aphids.",
  "April": "April brings the first true touch of spring, with temperatures gradually rising and daylight extending gloriously. Radishes are ready for sowing outdoors; these hardy plants laugh in the face of light frosts, making them perfect for early planting. Keep an eye on your tomato seedlings indoors, ensuring they are thriving and beginning the hardening off process to prepare for eventual outdoor life. The garden beckons with the promise of growth, and enriching the soil in preparation for your tomatoes with compost will pay dividends later on. If you haven't yet, plant arugula to protect against pests and begin thinking about basil, which will soon join your tomatoes as a flavorful companion.",
  "May": "In May, the garden really begins to flourish as the temperatures become more consistent and suitable for tender seedlings. This is the time to harvest radishes, quick-growing delights that they are. Be vigilant, as you don’t want them to linger too long in the soil and lose their crispness. May 19 is marked on your calendar for transplanting tomato seedlings outdoors. Harden them off well beforehand, as this gradual introduction to the elements will make them robust. Now is also the excellent time to plant basil near your tomatoes to enhance flavors and deter pests such as whiteflies. And just as one phase ends, another begins: make room for new growth as the last of the radishes are cleared to welcome the unfolding adventure of tomato planting.",
  "June": "June is a delightful time in the garden, as everything takes on vibrancy and vigor. With the average high reaching 78°F, your tomatoes are settling in nicely to their new home. Water them consistently and mulch to keep the roots cool and the soil moist while retarding weed growth. Keep a lookout for pests and use organic remedies like neem oil if necessary. Start planting dill early this month to coincide with kale's planting in late summer, allowing it to reach maturity just in time to provide beneficial insect attraction and pest control.",
  "July": "July is marked by warmth and flourishing growth in the garden. As your tomatoes bask in the summer sun, they begin to fruit. Regular watering is essential, with consistency being key to avoiding issues like blossom end rot. Watch for pests and diseases, continuing the care and nurturing that keeps plants healthy and productive. As you tend to your tomato plants, consider the symbiotic advantage of their neighbor, basil, enhancing both flavor and repelling some common pests.",
  "August": "With summer at its peak, August is the perfect time to start seeds indoors for a bounty of fall crops. Begin with kale early in the month, providing them optimum conditions with good lighting and airy circulation to prevent damping off. As your tomatoes continue to produce fruit in abundance, regularly harvesting them will promote further growth and production. Keep maintaining your garden with careful observation and removals where necessary to ensure plant health.",
  "September": "September transitions the garden from summer to the kinder temperatures of autumn. As the tomatoes complete their cycle by September 7, it's time to prepare the plot for kale. Since kale thrives in cooler temperatures, this month marks a new beginning in the garden. After hardening off your kale seedlings started in August, transplant them on an overcast day to minimize shock, and watch them flourish as the days shorten.",
  "October": "Fall is in full swing in October, with cooler temperatures creating a comfortable growing environment for kale, a resilient crop that can withstand some frost. Continue tending to your plants by monitoring for pests and diseases while ensuring consistent watering. Take advantage of the pest-repellent capabilities of dill planted in June, but remember to remove it once it bolts to make way for kale's robust maturity.",
  "November": "November's chill announces the final stages of the growing season, and it's time to start enjoying the fruits (or rather, leaves) of your labor. Begin harvesting kale around mid-month, optimally picking mature leaves from the outer layers and allowing the center to keep growing. This harvesting method encourages the plant to produce new growth, providing you with a steady supply of fresh, nutrient-rich greens long into winter.",
  "December": null
}

export const radishJSONLocationTagged =
  {
    "January": [],
    "February": [],
    "March": [
      "Prepare your garden bed as the soil begins to thaw and become workable. Loosen the soil and remove any debris or weeds. Radishes prefer loose, well-drained soil.",
      "Amend the soil with compost to enrich it with nutrients which supports radish growth. Radishes grow best in slightly acidic to neutral pH, around 6.0 to 7.0. Ensure your soil meets these conditions."
    ],
    "April": [
      "Direct sow radish seeds outdoors approximately 2-3 weeks before the last expected frost date, when the soil is around 40°F-50°F. For this location, aim to plant seeds around early April.",
      "Sow seeds 1/2 inch deep and 1 inch apart in rows about 12 inches apart. Radishes grow quickly and can withstand light frosts which makes them ideal for early spring sowing.",
      "Keep the soil consistently moist but not waterlogged. Radishes need regular watering to develop properly, but overwatering can lead to root rot.",
      "Thin seedlings once they reach 2 inches in height to about 2 inches apart to prevent overcrowding, which can stunt growth and reduce harvest size. Snip the seedlings at the soil line to thin them without disturbing nearby roots.",
      "Watch for common pests like flea beetles, which create small holes in the leaves. If noticed, use floating row covers to protect the plants."
    ],
    "May": [
      "Begin harvesting radishes around May 8 when they are about 1 inch in diameter. They tend to mature quickly, often within about 4-6 weeks after planting.",
      "Check the radishes frequently as they can become pithy or split if left in the ground too long.",
      "By May 15, complete the harvesting of all radishes. Remove radish plants and debris from the garden bed to prepare the space for tomato seedlings, which aim to be transplanted around May 19. This helps to ensure a clean bed with reduced risk of disease for the tomatoes."
    ],
    "June": [],
    "July": [],
    "August": [],
    "September": [],
    "October": [],
    "November": [],
    "December": []
  }

export const tomatoJSONLocationTagged =
  {
    "January": [],
    "February": [],
    "March": [
      "***indoors***Start tomato seeds indoors approximately 6-8 weeks before the outdoor planting date (around March 19th). Use seed-starting trays filled with seed starting mix, which is lighter and drains better than regular potting soil. Sow seeds 1/4 inch deep.",
      "***indoors***Provide a consistent temperature of around 70°F-75°F for germination. If your home is cooler, consider using a seedling heat mat under the trays to speed up germination. Without adequate warmth, seeds may germinate slowly or not at all.",
      "***indoors***Place the seedlings under grow lights or in a south-facing window where they will receive at least 12-16 hours of light daily. If you're using natural light, be aware that insufficient light can cause leggy seedlings (tall, weak stems), so grow lights are advisable. If unable to use grow lights, try to rotate the seedlings to get even sunlight access throughout the day.",
      "***indoors***Monitor for signs of damping off (a fungal disease that can kill seedlings). Symptoms include a sudden toppling of seedlings. To prevent this, ensure good airflow around your seedlings by using a small fan to keep air circulating around the plants."
    ],
    "April": [
      "***indoors***As it gets warmer, ensure that indoor tomato seedlings are kept in pots that are watered thoroughly but do not allow them to become waterlogged. Watch for signs of overwatering such as yellow leaves. If leaves are dropping and the soil is wet, reduce watering frequency.",
      "***indoors***Harden off tomato seedlings by gradually exposing them to outdoor conditions over a week before transplanting. Start with a few hours of indirect sunlight on a mild day and increase their outdoor time progressively.",
      "Prepare garden beds where tomatoes will be transplanted by clearing old plants and weeds, then enrich the soil with compost to improve nutrients."
    ],
    "May": [
      "***indoors***Harden off the seedlings for 1-2 weeks before transplanting. Gradually introduce them to outdoor conditions by placing them outside for a few hours each day, increasing the duration daily.",
      "Transplant tomato seedlings outdoors around May 19 after hardening off is complete and your outdoor soil temperature consistently reaches about 60°F. Space the seedlings about 24-36 inches apart to allow space for growth. Bury the stems of the seedlings deep in the soil to encourage robust root development.",
      "Monitor newly transplanted tomato plants for transplant shock (droopy leaves, stunted growth). Water them well after transplanting and continue regular watering to help them adjust."
    ],
    "June": [
      "Continue to water plants consistently, providing about 1-2 inches of water per week.",
      "Apply mulch around the base of the plants to help retain moisture and suppress weeds.",
      "Regularly inspect plants for pests such as hornworms or signs of disease. Use organic solutions like neem oil for pest control if needed."
    ],
    "July": [
      "Monitor for blossom end rot, which appears as black spots on the bottom of tomatoes; this is often due to inconsistent watering or calcium deficiency. Ensure consistent moisture levels and consider adding lime to your soil if calcium is low.",
      "Continue watering and weeding, ensuring plants have enough nutrients."
    ],
    "August": [
      "Tomatoes should be producing fruit. Harvest ripe tomatoes regularly to encourage more fruit production.",
      "Continue to monitor for pests and diseases, removing any affected leaves or fruit and treating as necessary."
    ],
    "September": [
      "Finish harvesting tomatoes by September 7 and begin removing the plants to make space for kale."
    ],
    "October": [],
    "November": [],
    "December": []
  }

export const kaleJSONLocationTagged =
  {
    "January": [],
    "February": [],
    "March": [],
    "April": [],
    "May": [],
    "June": [],
    "July": [],
    "August": [
      "***indoors***Start kale seeds indoors around August 3. Fill seed-starting trays with a quality seed starting mix, which provides a light and well-draining environment for seeds. Plant seeds about 1/4 inch deep.",
      "***indoors***Maintain a temperature of about 65°F-75°F for the best germination results. If necessary, use a heat mat beneath the trays to ensure consistent warmth. Kale seeds germinate best in cooler temperatures typical of late summer.",
      "***indoors***Place the seedlings under grow lights or by a window that receives ample sunlight, aiming for 12-16 hours of light per day. Insufficient lighting can lead to leggy seedlings, characterized by long, weak stems. Grow lights are highly recommended if natural light is limited.",
      "***indoors***Use a small fan to gently circulate air around your seedlings. This can help strengthen their stems and prevent issues like damping off, a common seedling ailment where young plants suddenly collapse."
    ],
    "September": [
      "***indoors***As seedlings grow, continue monitoring their light exposure and water needs. Ensure soil remains moist but not waterlogged to prevent root rot.",
      "***indoors***Commence the hardening off process around August 31. Begin by placing seedlings outdoors in a sheltered, shady area for a few hours each day, gradually increasing their exposure each day over the week leading up to transplant.",
      "Transplant kale seedlings into the garden around September 7, after hardening off is complete. Choose a day that is overcast or in the late afternoon to minimize transplant shock. Space the plants about 12-18 inches apart to accommodate their mature size.",
      "Water the newly transplanted kale thoroughly to ensure that the roots are well-settled and can access necessary nutrients from the soil settled and can access necessary nutrients from the soil."
    ],
    "October": [
      "Keep an eye on the weather as the first fall frost date approaches. Kale is frost-tolerant, but you can cover plants with row covers or cloches if a particularly hard frost is expected.",
      "Continue regular watering, ensuring consistent moisture. Mulching around the kale plants can help retain soil moisture and suppress weed growth.",
      "Inspect kale regularly for pests such as cabbage worms or aphids. Handpick visible pests or use an organic insecticidal soap as needed."
    ],
    "November": [
      "Begin harvesting kale around November 11. Harvest by picking the outer leaves and allowing the center of the plant to continue to grow, which supports ongoing leaf production.",
      "Regularly harvest mature leaves to prevent them from becoming too tough while also encouraging the plant to keep producing new leaves."
    ],
    "December": []
  }