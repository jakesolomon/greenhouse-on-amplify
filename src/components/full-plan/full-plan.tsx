import React, { useEffect, useState } from 'react';
import {
  introExtras,
  kaleJSONLocationTagged,
  radishJSONLocationTagged,
  summaries,
  tomatoJSONLocationTagged
} from "./full-plan-mock-data.ts";
import { Document, Page, Text as PDFText, pdf, View, Image as PDFImage } from '@react-pdf/renderer';

import {
  gettingStartedP1,
  gettingStartedP2,
  gettingStartedP3,
  gettingStartedP4,
  gardenLayoutP1,
  gardenLayoutP2,
  gardenLayoutExampleP1,
  gardenLayoutExampleP2,
  soilP1,
  soilP2,
  soilP3,
  soilP4,
  soilP5,
  gardeningTechniquesP1,
  gardeningTechniquesP2,
  gardeningTechniquesP3
} from "./full-plan-content.ts";
import grid from '../../assets/grid.png'
import overviewExample from '../../assets/overview-example.png'
import layoutExample from '../../assets/layout-example.png'

import { styles } from './full-plan-styles.ts'
import {Crop} from "../../types.ts";

if (!React.useId) {
  let idCounter = 0;
  React.useId = function useId() {
    idCounter += 1;
    return `useId-${idCounter}`;
  };
}

const getImageBase64 = () => {
  return localStorage.getItem("capturedImage") || null;
};


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

  // A custom component that splits text into two columns based on word count.
  const TwoColumnText = (text: string) => {
    // Split the text into words for the two-column split
    const words = text.split(/\s+/).filter(Boolean);
    // const totalWords = words.length;
    // const halfWords = Math.floor(totalWords / 2);

    const totalCharacters = text.length
    const halfCharacters = Math.floor(totalCharacters / 2);

    // Split words into two groups
    // const column1Words = words.slice(0, halfWords);
    // const column2Words = words.slice(halfWords);

    const column1Words: string[] = []
    const column2Words: string[] = []

    words.forEach(word => {
      if (column1Words.join(" ").length < halfCharacters) {
        column1Words.push(word);
      } else {
        column2Words.push(word);
      }
    })

    // Reassemble into strings
    const column1 = column1Words.join(' ');
    const column2 = column2Words.join(' ');

    // Helper to render text with preserved line breaks
    const renderTextWithLineBreaks = (content: string) => {
      return content.split('NEWLINE').map((line, index) => (
        <PDFText key={index} style={styles.text}>
          {line}
        </PDFText>
      ));
    };

    return (
      <View style={styles.columnsContainer}>
        <View style={styles.column1}>
          {renderTextWithLineBreaks(column1)}
        </View>
        <View style={styles.column2}>
          {renderTextWithLineBreaks(column2)}
        </View>
      </View>
    );
  };

  const seedlingTaskPrefix = '***indoors***';

  const monthSectionsFromJson = months.map((m: Month, index: number) => {
    if (
      radishJSONLocationTagged[m]?.length === 0 &&
      tomatoJSONLocationTagged[m]?.length === 0 &&
      kaleJSONLocationTagged[m]?.length === 0
    ) return null

    // Manually remove margin bottom from the last item, as it can cause page breaks. If no content follows before the next manual `break`, you get an empty page.
    const getItems = (data: string[]) =>
      data!
        .filter(e => !e.startsWith(seedlingTaskPrefix))
        .map((item, index) =>
          <PDFText
            key={index.toString()}
            style={index + 1 === data.filter(e => !e.startsWith(seedlingTaskPrefix)).length ? {...styles.text, marginBottom: 0, paddingBottom: 0} : styles.text}
          >
            {item}
          </PDFText>
        )

    const getSeedlingItems = (data: string[]) =>
      data!
        .filter(e => e.startsWith(seedlingTaskPrefix))
        .map((item, index) =>
          <PDFText
            key={index.toString() + "-seedling"}
            style={index + 1 === data.filter(e => e.startsWith(seedlingTaskPrefix)).length ? {...styles.text, marginBottom: 0, paddingBottom: 0} : styles.text}
          >
            {item.slice(seedlingTaskPrefix.length)}
          </PDFText>
        )

    const renderSubSection = (title: string, items: JSX.Element[]) => (
      <View>
        <PDFText key={index} style={{...styles.subHeader, marginTop: 12}}>{title}</PDFText>
        <View wrap>
          {items}
        </View>
      </View>
    )

    const summary = summaries[m]

    const radishItems = getItems(radishJSONLocationTagged[m])
    const radishSeedlingItems = getSeedlingItems(radishJSONLocationTagged[m])

    const tomatoItems = getItems(tomatoJSONLocationTagged[m])
    const tomatoSeedlingItems = getSeedlingItems(tomatoJSONLocationTagged[m])

    const kaleItems = getItems(kaleJSONLocationTagged[m])
    const kaleSeedlingItems = getSeedlingItems(kaleJSONLocationTagged[m])

    const thereAreSeedlingItems = (
      radishSeedlingItems.length !== 0 ||
      tomatoSeedlingItems.length !== 0 ||
      kaleSeedlingItems.length !== 0
    )

    const thereAreNonSeedlingItems = (
      radishItems.length !== 0 ||
      tomatoItems.length !== 0 ||
      kaleItems.length !== 0
    )

    return(
      <View break key={index.toString()} >
        <PDFText style={{...styles.chapterHeader, marginBottom: 36}}>{m}</PDFText>
        {TwoColumnText(summary!)}
        <View style={thereAreNonSeedlingItems ? {marginBottom: 12} : undefined}>
          {
            thereAreSeedlingItems &&
            <>
              <PDFText style={{...styles.subHeader, marginTop: 6, marginBottom: 0}}>SEEDLING STATION</PDFText>
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
        </View>
        <View style={thereAreSeedlingItems ? {marginTop: 6} : undefined}>
          {
            thereAreNonSeedlingItems &&
            <>
              <PDFText style={{...styles.subHeader, marginTop: 0, marginBottom: 0}}>PLOT 1</PDFText>
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
        </View>
      </View>
    )
  }).filter(e => e !== null)

  const scheduleSummary: string = JSON.parse(localStorage.getItem("scheduleSummary") || "");

  const [url, setUrl] = useState("");

  const generatePdf = async () => {
    const blob = await pdf(
      <MyDocument/>
    ).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    setUrl(pdfUrl);
  };

  useEffect(() => {
    generatePdf();
  }, []);

  const ganttImageSrc = getImageBase64();

  const crops = JSON.parse(localStorage.getItem("cropData") || `[{"name":"Crops not found","variety":"","shortDescription":""}]`);
  const CropList = crops.map((crop: Crop, index: number) => (
    <View key={index} wrap={false}>
      <PDFText style={styles.subHeader}>
        {crop.name} - {crop.variety}
      </PDFText>
      <PDFText style={styles.text}>
        {crop.shortDescription}
      </PDFText>
    </View>
  ))

  const pruningAdvice = introExtras["pruning"]
  const supportStructuresAdvice = introExtras["support_structures"]



  const MyDocument = () => (
    <Document pageLayout="twoPageLeft">
      <Page style={styles.body}>

        {/*Getting Started*/}
        <View wrap={false}>
          <PDFText style={styles.chapterHeader}>Getting Started</PDFText>
          <PDFText style={styles.subHeader}>How To Read This Book</PDFText>
          {TwoColumnText(
            [gettingStartedP1, gettingStartedP2, gettingStartedP3].join('NEWLINE'),
          )}
        </View>
        <View wrap={false}>
        {TwoColumnText(
            [gettingStartedP4].join('NEWLINE'),
          )}
        </View>
        <View wrap={false}>
          <PDFText style={styles.subHeader}>Plan Overview</PDFText>
          {TwoColumnText(scheduleSummary)}
        </View>

        {/*/!*Garden Layout Page*!/*/}
        <View break style={styles.flexContainer}>
          <PDFText style={styles.subHeader}>Garden Layout</PDFText>
          {TwoColumnText([gardenLayoutP1, gardenLayoutP2].join('NEWLINE'))}
          {
            ganttImageSrc
            ? <PDFImage
                style={styles.image}
                src={ganttImageSrc}
              />
            : "No image found"
          }
          <View style={styles.remainingSpace}>
            <PDFImage
              style={styles.imageOverflow}
              src={grid}
            />
          </View>
        </View>

        {/*/!*Garden Layout Example*!/*/}
        <View break style={styles.flexContainer}>
          <PDFText style={styles.subHeader}>Garden Layout Example</PDFText>
          {TwoColumnText([gardenLayoutExampleP1, gardenLayoutExampleP2].join('NEWLINE'))}
          {
            ganttImageSrc
              ? <PDFImage
                style={styles.image}
                src={overviewExample}
              />
              : "No image found"
          }
          <View style={styles.remainingSpace}>
            <PDFImage
              // style={styles.imageOverflow}
              style={{height: 180}}
              src={layoutExample}
            />
          </View>
        </View>

        {/*Crops*/}
        <View break>
          <PDFText style={styles.chapterHeader}>Crops</PDFText>
          {CropList}
        </View>

        {/*Understanding Your Garden*/}
        <View break wrap={false}>
          <PDFText style={styles.chapterHeader}>Understanding Your Garden</PDFText>
          <PDFText style={styles.subHeader}>Soil</PDFText>
          {TwoColumnText([soilP1, soilP2].join('NEWLINE'))}
        </View>
        <View break wrap={false}>
          {TwoColumnText([soilP3, soilP4, soilP5].join('NEWLINE'))}
        </View>
        <View break>
          <PDFText style={styles.chapterHeader}>Gardening Techniques</PDFText>
        </View>
        <View wrap={false}>
          <PDFText style={styles.subHeader}>Tools</PDFText>
          {TwoColumnText(gardeningTechniquesP1)}
        </View>
        <View wrap={false}>
          <PDFText style={styles.subHeader}>Grow Lights</PDFText>
          {TwoColumnText(gardeningTechniquesP2)}
        </View>
        <View wrap={false}>
          <PDFText style={styles.subHeader}>Row Covers</PDFText>
          {TwoColumnText(gardeningTechniquesP3)}
        </View>
        {
          pruningAdvice !== "" &&
          <View wrap={false}>
            <PDFText style={styles.subHeader}>Pruning</PDFText>
            {TwoColumnText(pruningAdvice)}
          </View>
        }
        {
          supportStructuresAdvice !== "" &&
          <View wrap={false}>
            <PDFText style={styles.subHeader}>Support Structures</PDFText>
            {TwoColumnText(supportStructuresAdvice)}
          </View>
        }

        {/*Monthly Planner*/}
        {monthSectionsFromJson}

        {/*Page number*/}
        <PDFText style={styles.pageNumber} render={({pageNumber, totalPages}) => (
          `${pageNumber} / ${totalPages}`
        )} fixed/>
      </Page>
    </Document>
  );

  return url
    ? <>
      <iframe src={url} style={{width: '100%', height: '95vh'}} title="PDF Preview"/>
    </>
    : null;
}

export default FullPlan
