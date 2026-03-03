import {Text, Timeline} from "@mantine/core";
import {NavLink} from "react-router-dom";
import {useState} from "react";

const ProductTimeline = () => {

  const [ hoveredTimelineElement, setHoveredTimelineElement ] = useState<number>()

  return (
    <Timeline
      active={hoveredTimelineElement}
      bulletSize={20}
      lineWidth={3}
      color="green"
      mt="xl"
      w="100%"
    >
      <Timeline.Item
        onMouseEnter={() => setHoveredTimelineElement(0)}
        title="Step 1: Tell Us About Your Garden"
      >
        <Text c="dimmed" size="sm" mt="sm">
          Share a few quick details—your zip code (so we can make accurate assumptions about your local climate), and what you want to grow from our list of supported crops (see <NavLink to='/faq'>FAQs</NavLink> for the full list).
        </Text>
      </Timeline.Item>

      <Timeline.Item
        onMouseEnter={() => setHoveredTimelineElement(1)}
        title="Step 2: Instant Personalized Plan"
      >
        <Text c="dimmed" size="sm" mt="sm">
          Using predictions for your climate conditions, we generate a complete growing schedule for your selected crops.
        </Text>
      </Timeline.Item>

      <Timeline.Item
        onMouseEnter={() => setHoveredTimelineElement(2)}
        title="Step 3: Refine and Customize"
      >
        <Text c="dimmed" size="sm" mt="sm">
          Adjust your crop selection, explore companion planting, and add variety to revise your garden design until you love it.
        </Text>
      </Timeline.Item>

      <Timeline.Item
        onMouseEnter={() => setHoveredTimelineElement(3)}
        title="Step 4: Get Your Personalized Guide"
      >
        <Text c="dimmed" size="sm" mt="sm">
          Generate your full Monthly Guide—with an option to receive in booklet form! Inside, you’ll find month-by-month tasks to prep, plant, transplant, maintain, and harvest—plus note-taking space to track your results—with smart techniques like succession planting and companion planting all built in.
        </Text>
      </Timeline.Item>

      {/*<Timeline.Item*/}
      {/*  onMouseEnter={() => setHoveredTimelineElement(4)}*/}
      {/*  title="Step 5: Your Monthly Guide"*/}
      {/*>*/}
      {/*  <Text c="dimmed" size="sm" mt="sm">*/}
      {/*    Each chapter tells you what to do that month—what to plant, transplant, prune, or harvest. Keep your garden productive all season long without the need to reasearch every step of the way.*/}
      {/*  </Text>*/}
      {/*</Timeline.Item>*/}

      <Timeline.Item
        onMouseEnter={() => setHoveredTimelineElement(4)}
        title="Step 5: Grow with Confidence"
      >
        <Text c="dimmed" size="sm" mt="sm">
          Follow your plan, watch your garden flourish, and enjoy the rewards of a productive and thriving vegetable garden!
        </Text>
      </Timeline.Item>
    </Timeline>
  )

}

export default ProductTimeline;
