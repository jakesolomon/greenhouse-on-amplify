import {Text, Accordion} from "@mantine/core";

const Faq = () => {

  const faqData = [
    // {
    //   value: "who-is-this-for",
    //   question: "Who is this app for?",
    //   answer:
    //     "This app is for anyone who wants to grow a thriving vegetable garden, whether you’re a complete beginner or a seasoned gardener looking for a more streamlined approach to creating a planting schedule. Whether you have a small backyard, a large plot, or even just a few containers, Growing Guide can help you make the most of your space and resources.",
    // },
    {
      value: "difference",
      question: "How is this different from other vegetable growing planners?",
      answer:
        "Most planners are either prescriptive guides (telling you what to grow and when) or open-ended tools (requiring you to do lots of planning and research). The Growing Guide calculates an optimized planting schedule based on your region's climate and your preferred crops, so you get the best of both worlds."
    },
    {
      value: "vegetable-types",
      question: "What types of vegetables does The Growing Guide support?",
      answer:
        <Text>
          Your guide will focus on <em>annual</em> vegetables and herbs. (Annuals are ideal for one-season planning, as they grow, produce, and are harvested within a single year.) This allows us to create a one-year guide that takes your crops from planting to harvest.
        </Text>,
    },
    {
      value: "cost",
      question: "Is it really free?",
      answer:
        "Sure is."
    },
    // {
    //   value: "format",
    //   question: "Can I print my guide, or is it only digital?",
    //   answer:
    //     "When you order a guide, you can opt for a digital-only plan and we'll send a PDF to your email, which you can print at home. If you can order a print copy, we'll print your guide into a booklet and ship your guide right to your door. Orders ship within 5 business days."
    // }
    // {
    //   value: "format",
    //   question: "Can I print my guide, or is it only digital?",
    //   answer:
    //     "When you order a guide, you can opt for a digital-only plan and we'll send a PDF to your email, which you can print at home. If you can order a print copy, we'll print your guide into a booklet and ship your guide right to your door. Orders ship within 5 business days."
    // }
  ];

  return (
    <Accordion
      variant="contained"
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
