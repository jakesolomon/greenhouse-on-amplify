import {
  Container,
  Title,
  Text,
  AppShell,
  Center,
  Image,
} from "@mantine/core";
import Logo from "../../assets/full-logo-text-color.svg";
import {
  kaleJSONLocationTagged,
  radishJSONLocationTagged,
  summaries,
  tomatoJSONLocationTagged
} from "./full-plan-mock-data.ts";

const FullPlan = () => {

  type Month =
    "January" |
    "February" |
    "March" |
    "April" |
    "May" |
    "June" |
    "July" |
    "August" |
    "September" |
    "October" |
    "November" |
    "December"

  const months: Month[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  const seedlingTaskPrefix = '***indoors***';

  const formattedTextFromJson = months.map((m: Month, index: number) => {
    if (
      radishJSONLocationTagged[m]?.length === 0 &&
      tomatoJSONLocationTagged[m]?.length === 0 &&
      kaleJSONLocationTagged[m]?.length === 0
    ) return null

    const getItems = (data: string[]) =>
      data!
        .filter(e => !e.startsWith(seedlingTaskPrefix))
        .map((item, index) =>
          <li key={index.toString()}>{item}</li>)

    const getSeedlingItems = (data: string[]) =>
      data!
        .filter(e => e.startsWith(seedlingTaskPrefix))
        .map((item, index) =>
          <li key={index.toString() + "-seedling"}>{item.slice(seedlingTaskPrefix.length)}</li>)

    const renderSubSection = (title: string, items: JSX.Element[]) => (
      <>
        <Text fs="italic">{title}</Text>
        <ul style={{marginTop: 0}}>
          {items}
        </ul>
        <br/>
      </>
    )

    const summary = summaries[m]

    const radishItems = getItems(radishJSONLocationTagged[m])
    const radishSeedlingItems = getSeedlingItems(radishJSONLocationTagged[m])

    const tomatoItems = getItems(tomatoJSONLocationTagged[m])
    const tomatoSeedlingItems = getSeedlingItems(tomatoJSONLocationTagged[m])

    const kaleItems = getItems(kaleJSONLocationTagged[m])
    const kaleSeedlingItems = getSeedlingItems(kaleJSONLocationTagged[m])

    return(
      <div key={index.toString()}>
        <Center>
          <Title>{m}</Title>
        </Center>
        <Text fs="italic" my="md">{summary}</Text>
        {
          (radishSeedlingItems.length !== 0 ||
          tomatoSeedlingItems.length !== 0 ||
          kaleSeedlingItems.length !== 0) &&
          <>
            <Title order={4} mb="xs">Seedling Station</Title>
          </>
        }
        {
          radishSeedlingItems.length !== 0 &&
          renderSubSection("Radishes", radishSeedlingItems)
        }
        {
          tomatoSeedlingItems.length !== 0 &&
          renderSubSection("Tomatoes", tomatoSeedlingItems)
        }
        {
          kaleSeedlingItems.length !== 0 &&
          renderSubSection("Kale", kaleSeedlingItems)
        }
        {
          (radishItems.length !== 0 ||
          tomatoItems.length !== 0 ||
          kaleItems.length !== 0) &&
          <>
            <Title order={4} mb="xs">Plot 1</Title>
          </>
        }
        {
          radishItems.length !== 0 &&
          renderSubSection("Radishes", radishItems)
        }
        {
          tomatoItems.length !== 0 &&
          renderSubSection("Tomatoes", tomatoItems)
        }
        {
          kaleItems.length !== 0 &&
          renderSubSection("Kale", kaleItems)
        }
      </div>
    )
  }).filter(e => e !== null)

  return (
      <>
        <Container size="md">
          {formattedTextFromJson}
        </Container>
        <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
          <Center py="md">
            <Image src={Logo} className="footer-logo" alt="logo" />
          </Center>
        </AppShell.Footer>
      </>
  )
}

export default FullPlan
