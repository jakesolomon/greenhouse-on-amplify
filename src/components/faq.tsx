import {Text, Accordion} from "@mantine/core";

const Faq = () => {

  const faqData = [
    {
      value: "who-is-this-for",
      question: "Who is this app for?",
      answer:
        "This app is for anyone who wants to grow a thriving vegetable garden, whether you’re a complete beginner or a seasoned gardener looking for a more streamlined approach to creating a planting schedule. Whether you have a small backyard, a large plot, or even just a few containers, Growing Guide can help you make the most of your space and resources.",
    },
    {
      value: "vegetable-types",
      question: "What types of vegetables does the app support?",
      answer:
        <Text>The app focuses on <em>annual</em> vegetables, herbs, and other common garden plants. Annuals are ideal for one-season planning, as they grow, produce, and are harvested within a single year.</Text>,
    },
    {
      value: "subscription",
      question: "What does it cost to generate a plan?",
      answer:
        "You can generate a personalized garden plan for free, giving you a sneak peek at how your garden could thrive. However, to unlock the full plan and access the detailed month-to-month task list, a subscription is required."
    }
  ];

  return (
    <Accordion
      variant="filled"
      radius="md"
      transitionDuration={300}
      chevronPosition="right"
      mb="xl"
    >
      {faqData.map((faq) => (
        <Accordion.Item value={faq.value} key={faq.value}>
          <Accordion.Control>{faq.question}</Accordion.Control>
          <Accordion.Panel>{faq.answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )

}

export default Faq
