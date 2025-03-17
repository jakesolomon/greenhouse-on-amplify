import React from 'react';
import { Document, Page, Text as PDFText, View, Image as PDFImage } from '@react-pdf/renderer';

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
import cover from '../../assets/booklet-cover.png'

import { styles } from './full-plan-styles.ts'
import { Crop, IntroExtras, FullPlanSummaries, FullPlanTaskList } from "../../types.ts";

if (!React.useId) {
  let idCounter = 0;
  React.useId = function useId() {
    idCounter += 1;
    return `useId-${idCounter}`;
  };
}

interface FullPlanProps {
  introExtras: IntroExtras,
  allTasks: FullPlanTaskList[],
  summaries: FullPlanSummaries,
  scheduleSummary: string,
  crops: Crop[],
  gantt: string
}

const FullPlan = (props: FullPlanProps) => {

  const { introExtras, allTasks, summaries, scheduleSummary, crops, gantt } = props

  // A custom component that splits text into two columns based on word count.
  const TwoColumnText = (text: string) => {
    // Split the text into words for the two-column split
    const words = text.split(/\s+/).filter(Boolean);

    const totalCharacters = text.length
    const halfCharacters = Math.floor(totalCharacters / 2);

    // Split words into two groups
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

  const formatTasksForPDF = (
    annotatedTasks: FullPlanTaskList[]
  ) => {
    const formatted: Record<string, Record<string, Record<string, string[]>>> = {};

    for (const { plot, crop, tasks: taskByMonth } of annotatedTasks) {
      for (const [month, taskList] of Object.entries(taskByMonth)) {
        if (taskList.length === 0) continue; // Skip months with no tasks

        if (!formatted[month]) {
          formatted[month] = {};
        }

        const locationKeys = taskList.map((task: string) =>
          task.startsWith('***indoors***') ? 'Seedling Station' : `Plot ${plot}`
        );

        for (const [index, task] of taskList.entries()) {
          const cleanTask = task.replace('***indoors***', '').trim();
          const targetLocation = locationKeys[index];

          if (!formatted[month][targetLocation]) {
            formatted[month][targetLocation] = {};
          }

          if (!formatted[month][targetLocation][crop]) {
            formatted[month][targetLocation][crop] = [];
          }

          formatted[month][targetLocation][crop].push(cleanTask);
        }
      }
    }

    return Object.entries(formatted).map(([month, locations]) => {
      const sortedLocations = Object.keys(locations).sort((a, b) =>
        a === "Seedling Station" ? -1 : b === "Seedling Station" ? 1 : 0
      );

      return (
        <View break key={month}>
          <PDFText style={{ ...styles.chapterHeader, marginBottom: 36 }}>
            {month}
          </PDFText>
          {/* @ts-expect-error summaries indexed by month */}
          {TwoColumnText(summaries[month])}
          {sortedLocations.map((location, locationIndex) => {
            const crops = Object.entries(locations[location]);

            return (
              <View key={location}>
                {/* Insert a page break *only* if the location header would be left alone at the bottom */}
                {locationIndex > 0 && <PDFText break style={{ opacity: 0, height: 1 }}> </PDFText>}

                <PDFText style={{ ...styles.subHeader, marginTop: 12, marginBottom: 0 }}>
                  {location.toUpperCase()}
                </PDFText>

                {crops.map(([crop, tasks], cropIndex) => {
                  return (
                    <View key={crop}>
                      {/* Insert a break *only* if this crop would be alone at the bottom */}
                      {cropIndex > 0 && <PDFText break style={{ opacity: 0, height: 1 }}> </PDFText>}

                      <PDFText style={{ ...styles.subHeader, marginTop: 6 }}>{crop}</PDFText>

                      <View>
                        {tasks.map((task, index) => (
                          <PDFText
                            key={index.toString()}
                            style={
                              index + 1 === tasks.length
                                ? { ...styles.text, marginBottom: 0, paddingBottom: 0 }
                                : styles.text
                            }
                          >
                            {task}
                          </PDFText>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      );
    });
  };

  // Uncomment for viewing in-browser
  // const [url, setUrl] = useState("");
  //
  // const generatePdf = async () => {
  //   const blob = await pdf(
  //     <MyDocument/>
  //   ).toBlob();
  //   const pdfUrl = URL.createObjectURL(blob);
  //   setUrl(pdfUrl);
  // };
  // useEffect(() => {
  //   generatePdf();
  // }, []);

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
  const supportStructuresAdvice = introExtras["supportStructures"]

  return (
    <Document pageLayout="twoPageLeft">
      Cover Page
      <Page>
        <PDFImage src={cover} />
        {/*<PDFText style={styles.madeFor}>MADE FOR</PDFText>*/}
        {/*<PDFText style={styles.userName}>JAKE SOLOMON</PDFText>*/}
      </Page>

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
            gantt
            ? <PDFImage
                style={styles.image}
                src={gantt}
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
          <PDFImage
            style={styles.image}
            src={overviewExample}
          />
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
        {/*{monthSectionsFromJson}*/}
        {formatTasksForPDF(allTasks)}

        {/*Page number*/}
        <PDFText style={styles.pageNumber} render={({pageNumber, totalPages}) => (
          `${pageNumber} / ${totalPages}`
        )} fixed/>
      </Page>
    </Document>
  );

  // Uncomment for viewing in-browser
  // return url
  //   ? <>
  //     <iframe src={url} style={{width: '100%', height: '95vh'}} title="PDF Preview"/>
  //   </>
  //   : null;
}

export default FullPlan
