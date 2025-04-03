import React, {useEffect, useState} from 'react';
// import { createRoot } from "react-dom/client";
import {Document, Page, Text as PDFText, View, Image as PDFImage, pdf} from '@react-pdf/renderer';
import stringWidth from 'string-pixel-width';


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
import { Crop, IntroExtras, FullPlanTaskList } from "../../types.ts";

import { introExtras, allTasks, summaries } from "./full-plan-mock-data.ts"
import {Style} from "@react-pdf/types";

if (!React.useId) {
  let idCounter = 0;
  React.useId = function useId() {
    idCounter += 1;
    return `useId-${idCounter}`;
  };
}

const estimateTextHeight = (text: string, fontSize: number, lineHeight: number, columnWidth: number): number => {
  const words = text.split(' ');
  let lineCount = 1;
  let currentWidth = 0;

  words.forEach((word) => {
    const wordWidth = stringWidth(word, { size: fontSize });
    if (currentWidth + wordWidth > columnWidth) {
      lineCount++;
      currentWidth = wordWidth;
    } else {
      currentWidth += wordWidth;
    }
  });
  console.log("lineCount: ", lineCount);
  return lineCount * fontSize * lineHeight; // Adjust multiplier for line height
}

const measureElement = async (
  text: string,
  columnWidth: number,
  style: Style
): Promise<number> => {
  const lineHeight = Number(style.lineHeight) || 1.5;
  const marginBottom = Number(style.marginBottom) || 0;
  // const heightPx = measureTextHeight(text, Number(style.fontSize), lineHeight, columnWidth);
  const heightPx = estimateTextHeight(text, Number(style.fontSize), lineHeight, columnWidth) + marginBottom
  // return heightPx * 3; // convert pixels to PDF points (if 1px = 1/3 pt)
  return heightPx
};

// Old method of actually rendering text in a hidden div to measure element height. Worked pretty well, but can't do this in the backend without spinning up a headless server like Puppetteer
// const measureElement = async (
//   text: string,
//   columnWidth: number,
//   style: React.CSSProperties
// ): Promise<number> => {
//   // Create a temporary container to render the element off-screen
//   const container = document.createElement("div");
//   container.style.position = "absolute";
//   container.style.visibility = "hidden"; // Hide it from the user
//   // slightly smaller in html than in pdf
//   const divColumnWidth = columnWidth - 9
//   container.style.width = `${divColumnWidth}px`; // Match the column width
//   container.style.display = "block";
//   container.style.whiteSpace = "pre-wrap"; // Ensure text wraps
//   Object.assign(container.style, style);
//
//   document.body.appendChild(container);
//
//   // Create a root and render the text inside a styled div
//   const root = createRoot(container);
//   root.render(
//     <div style={{ ...style, display: "block", whiteSpace: "pre-wrap", fontFamily: "Merriweather-Sans", fontSize: 11 }}>
//       {text}
//     </div>
//   );
//   // Wait for the next frame to ensure rendering has completed
//   await new Promise((resolve) => setTimeout(resolve, 0));
//   // await new Promise((resolve) => requestAnimationFrame(resolve));
//   // await new Promise((resolve) => setTimeout(resolve, 10)); // Slightly longer delay
//
//   // **Force reflow** before measuring
//   // @ts-ignore
//   const thing = container.offsetHeight; // Read container.offsetHeight to force a layout update, value not needed
//
//   // Measure height
//   const height = container.getBoundingClientRect().height;
//
//   root.unmount();
//   document.body.removeChild(container);
//
//   // return height * 3; // Convert px to PDF points // recommended by chat, not using
//   if (height === 0) {
//     // Sometimes it doesn't render on time for elements with no line breaks. As a fallback, calculate the height of 1 line.
//     // A 16-point font (16pt) is roughly equivalent to 22 pixels tall, so multiply by 1.5
//     return (Number(style.fontSize) * 1.5 + Number(style.marginBottom))
//   }
//   return height
// };

const FullPlan = () => {

  const crops = JSON.parse(localStorage.getItem("cropData")  || `[{"name":"Crops not found","variety":"","shortDescription":""}]`);
  const gantt = localStorage.getItem("capturedImage")
  const scheduleSummary: string = localStorage.getItem("scheduleSummary") ? JSON.parse(localStorage.getItem("scheduleSummary")!) : null;

  const inch = 72;
  // const pageWidth = 8.5 * inch;
  // const margin = 0.5 * inch;
  // const columnGap = 0.25 * inch;
  // const columnWidth = (pageWidth - 2 * margin - columnGap) / 2;
  const columnWidth = 3.3 * inch // should be 3.625 but this works better for line width estimation
  const subsequentPageContentHeight = 9.75 * inch; // In a perfect world, this is 10 (11 - two .5 in margins) Airing on the side of caution bc of line width inaccuracy.
  const firstPageContentHeight = subsequentPageContentHeight - 48 - 80 // subtract chapter header height and margin in pixels
  const subHeaderBuffer = Number(styles.subHeader.fontSize) * 1.5 * 1.5 // font size * scale pt to px * line height
  const widowBuffer = Number(styles.body.fontSize) * 1.5 * 1.5 * 2 // font size * scale pt to px * line height * two lines

  // --- Helper: For body text, split into two parts that fit the available height ---
// Here we simply add one word at a time until the rendered height exceeds the limit.
  async function splitBodyText(
    text: string,
    availableHeight: number
  ): Promise<[string, string]> {
    console.log("Text: ", text, " available height: ", availableHeight);
    const words = text.split(' ');
    console.log("words: ", words);
    let current = '';
    for (let i = 0; i < words.length; i++) {
      const testText = current ? `${current} ${words[i]}` : words[i];
      const height = await measureElement(testText, columnWidth, styles.body);
      if (height > availableHeight) {
        // Stop before adding this word
        console.log("Supposed to break here")
        break;
      }
      // console.log(current)
      current = testText;
    }
    const remainder = text.slice(current.length).trim();
    return [current, remainder];
  }

  const orderAndAnnotateTasks = async (
    annotatedTasks: FullPlanTaskList[]
  ): Promise<{ type: string; text: string; style: Style }[]> => {
    // month, location, crop, tasks
    const grouped: Record<string, Record<string, Record<string, string[]>>> = {};

    for (const {plot, crop, tasks: tasksByMonth} of annotatedTasks) {
      for (const [month, taskList] of Object.entries(tasksByMonth)) {
        if (!taskList || taskList.length === 0) continue;
        for (const task of taskList) {
          const cleanTask = task.replace('***indoors***', '').trim();
          const location =
            task.startsWith('***indoors***') ? 'Seedling Station' : `Plot ${plot}`;
          if (!grouped[month]) {
            grouped[month] = {}
          }
          if (!grouped[month][location]) {
            grouped[month][location] = {};
          }
          if (!grouped[month][location][crop]) {
            grouped[month][location][crop] = [];
          }
          grouped[month][location][crop].push(cleanTask);
        }
      }
    }

    // Now, we turn the grouped data into a list of strings and styles
    const contentItems = [];

    for (const month in grouped) {
      contentItems.push({type: 'chapterHeader', text: month, style: styles.chapterHeader}); // Month Chapter header

      // Do Seedling Station first
      if (grouped[month]['Seedling Station']) {
        contentItems.push({type: 'sectionHeader', text: "Seedling Station", style: styles.sectionHeader}); // Location header
        for (const crop in grouped[month]['Seedling Station']) {
          contentItems.push({type: 'subHeader', text: crop, style: styles.subHeader}); // Crop subheader
          for (const task of grouped[month]['Seedling Station'][crop]) {
            contentItems.push({type: 'body', text: task, style: styles.body}); // Task body text
          }
        }
      }

      for (const location in grouped[month]) {
        if (location !== "Seedling Station") {
          contentItems.push({type: 'sectionHeader', text: location, style: styles.sectionHeader}); // Location header
          for (const crop in grouped[month][location]) {
            contentItems.push({type: 'subHeader', text: crop, style: styles.subHeader}); // Crop subheader
            for (const task of grouped[month][location][crop]) {
              contentItems.push({type: 'body', text: task, style: styles.body}); // Task body text
            }
          }
        }
      }
    }

    return contentItems;
  };

  const generateTwoColumnPages = async (
    contentItems: { type: string; text: string; style: Style }[],
    chapterHeader?: string
  ): Promise<React.ReactElement[]> => {
    const pages: React.ReactElement[] = [];
    let currentPageHeight = chapterHeader ? firstPageContentHeight : subsequentPageContentHeight;

    let currentPage = { left: [] as React.ReactElement[], right: [] as React.ReactElement[] };
    let leftHeight = 0;
    let rightHeight = 0;

    const flushPage = () => {
      pages.push(
        <Page key={pages.length} style={styles.page}>
          { currentPageHeight === firstPageContentHeight && <PDFText style={styles.chapterHeader}>{chapterHeader}</PDFText>}
          <View style={styles.columnsContainer} wrap={false}>
            <View style={styles.columnLeft}>{currentPage.left}</View>
            <View style={styles.columnRight}>{currentPage.right}</View>
          </View>

          <PDFText style={styles.pageNumber} render={({pageNumber, totalPages}) => (
            `${pageNumber} / ${totalPages}`
          )} fixed/>
        </Page>
      );
      currentPage = { left: [], right: [] };
      leftHeight = 0;
      rightHeight = 0;
      currentPageHeight = subsequentPageContentHeight;
    }

    // contentItems.splice(20)
    console.log(contentItems)

    for (const item of contentItems) {
      // console.log(item.text);
      const textElement = <PDFText style={item.style} key={contentItems.indexOf(item)}>{item.text}</PDFText>;
      const elementHeight = await measureElement(item.text, columnWidth, item.style);
      // const elementHeight = 20

      if (rightHeight === 0) {
        // if we haven't started on the right yet
        if (item.type === "sectionHeader") {
          // if it's a section header
          if (leftHeight + elementHeight + subHeaderBuffer + widowBuffer <= currentPageHeight) {
            // and there's room on the left for the header, the following subheader, and two lines of text below, add the element.
            currentPage.left.push(textElement);
            leftHeight += elementHeight;
          } else {
            // if there's not enough room on the left, start on the right
            currentPage.right.push(textElement);
            rightHeight += elementHeight;
          }
        }
        if (item.type === "subHeader") {
          // if it's a subheader
          if (leftHeight + elementHeight + widowBuffer <= currentPageHeight) {
            // and there's room on the left for the header and two lines of text below, add the element.
            currentPage.left.push(textElement);
            leftHeight += elementHeight;
          } else {
            // if there's not enough room on the left, start on the right
            currentPage.right.push(textElement);
            rightHeight += elementHeight;
          }
        }
        if (item.type === "body") {
          // if it's body text
          if (leftHeight + elementHeight <= currentPageHeight) {
            // and there's room on the left, add the element.
            currentPage.left.push(textElement);
            leftHeight += elementHeight;
          } else {
            // if there's not enough room on the left
            if (leftHeight + widowBuffer <= currentPageHeight) {
              console.log("elementHeight is", elementHeight, ", L:", leftHeight, "R:", rightHeight);
              // but there's enough room for at least two lines, split the text // TODO check that there won't be orphans
              // add the fitPart to the left column, and add the rest to the right column
              const availableHeight = currentPageHeight - leftHeight
              const [fitPart, rest] = await splitBodyText(item.text, availableHeight);
              console.log("fitPart: ", fitPart, ", rest:", rest);
              currentPage.left.push(<PDFText style={item.style} key={`${contentItems.indexOf(item)}-L`}>{fitPart}</PDFText>);
              // to keep things "true" we should measure the height of fitPart and `leftHeight += fitPartHeight`, but this is extra computation that we don't need
              // TODO for testing purposes
              const fitPartHeight = await measureElement(fitPart, columnWidth, item.style);
              console.log("fitPartHeight: ", fitPartHeight);

              currentPage.right.push(<PDFText style={item.style} key={`${contentItems.indexOf(item)}-R`}>{rest}</PDFText>);
              const restHeight = await measureElement(rest, columnWidth, item.style);
              rightHeight += restHeight;
            } else {
              // and there isn't enough room for at least two lines, start on the right
              currentPage.right.push(textElement);
              rightHeight += elementHeight;
            }
          }
        }
      } else {
        // if we have started on the right
        if (item.type === "sectionHeader") {
          // if it's a header
          if (rightHeight + elementHeight + subHeaderBuffer + widowBuffer <= currentPageHeight) {
            // and there's room on the right for the header and the following subheader and two lines of text below, add the element.
            currentPage.right.push(textElement);
            rightHeight += elementHeight;
          } else {
            // if there's not enough room on the right, flush page and start on the next on the left
            flushPage();
            currentPage.left.push(textElement);
            leftHeight += elementHeight;
          }
        }
        if (item.type === "subHeader") {
          // if it's a header
          if (rightHeight + elementHeight + widowBuffer <= currentPageHeight) {
            // and there's room on the right for the header and two lines of text below, add the element.
            currentPage.right.push(textElement);
            rightHeight += elementHeight;
          } else {
            // if there's not enough room on the right, flush page and start on the next on the left
            flushPage();
            currentPage.left.push(textElement);
            leftHeight += elementHeight;
          }
        }
        if (item.type === "body") {
          // if it's body text
          if (rightHeight + elementHeight <= currentPageHeight) {
            // and there's room on the right, add the element.
            currentPage.right.push(textElement);
            rightHeight += elementHeight;
          } else {
            // if there's not enough room on the right
            if (rightHeight + widowBuffer <= currentPageHeight) {
              // but there's enough room for at least two lines, split the text
              // add the fitPart to the right column, flush page, and start on the next on the left with the rest
              const availableHeight = currentPageHeight - rightHeight
              const [fitPart, rest] = await splitBodyText(item.text, availableHeight);
              currentPage.right.push(<PDFText style={item.style} key={`${contentItems.indexOf(item)}-R`}>{fitPart}</PDFText>);
              flushPage()
              // to keep things "true" we should measure the height of fitPart and `rightHeight += fitPartHeight`, but this is extra computation that we don't need
              currentPage.left.push(<PDFText style={item.style} key={`${contentItems.indexOf(item)}-L`}>{rest}</PDFText>);
              const restHeight = await measureElement(rest, columnWidth, item.style);
              leftHeight += restHeight;
            } else {
              // and there isn't enough room for at least two lines, flush page and start on the left
              flushPage()
              currentPage.left.push(textElement);
              leftHeight += elementHeight;
            }
          }
        }
      }
    }

    // Add the remaining page
    console.log("Add the remaining page")
    if (currentPage.left.length > 0 || currentPage.right.length > 0) {
      flushPage();
    }
    return pages;
  };

  interface TwoColumnTasksByMonth {
    "January": React.ReactElement[] | null,
    "February": React.ReactElement[] | null,
    "March": React.ReactElement[] | null,
    "April": React.ReactElement[] | null,
    "May": React.ReactElement[] | null,
    "June": React.ReactElement[] | null,
    "July": React.ReactElement[] | null,
    "August": React.ReactElement[] | null,
    "September": React.ReactElement[] | null,
    "October": React.ReactElement[] | null,
    "November": React.ReactElement[] | null,
    "December": React.ReactElement[] | null,
  }

  const getTwoColumnTasksByMonth = async (items: {type: string, text: string, style: Style}[]): Promise<TwoColumnTasksByMonth> => {
    const monthItem = (month: string) => items.find(item => item.text === month)

    // bruh
    return(
      {
        "January": monthItem("January") ? await generateTwoColumnPages([{type: "body", text: summaries["January"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("January")!) + 1, monthItem("February") ? items.indexOf(monthItem("February")!) : items.length)], "January") : null,
        "February": monthItem("February") ? await generateTwoColumnPages([{type: "body", text: summaries["February"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("February")!) + 1, monthItem("March") ? items.indexOf(monthItem("March")!) : items.length)], "February") : null,
        "March": monthItem("March") ? await generateTwoColumnPages([{type: "body", text: summaries["March"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("March")!) + 1, monthItem("April") ? items.indexOf(monthItem("April")!) : items.length)], "March") : null,
        "April": monthItem("April") ? await generateTwoColumnPages([{type: "body", text: summaries["April"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("April")!) + 1, monthItem("May") ? items.indexOf(monthItem("May")!) : items.length)], "April") : null,
        "May": monthItem("May") ? await generateTwoColumnPages([{type: "body", text: summaries["May"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("May")!) + 1, monthItem("June") ? items.indexOf(monthItem("June")!) : items.length)], "May") : null,
        "June": monthItem("June") ? await generateTwoColumnPages([{type: "body", text: summaries["June"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("June")!) + 1, monthItem("July") ? items.indexOf(monthItem("July")!) : items.length)], "June") : null,
        "July": monthItem("July") ? await generateTwoColumnPages([{type: "body", text: summaries["July"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("July")!) + 1, monthItem("August") ? items.indexOf(monthItem("August")!) : items.length)], "July") : null,
        "August": monthItem("August") ? await generateTwoColumnPages([{type: "body", text: summaries["August"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("August")!) + 1, monthItem("September") ? items.indexOf(monthItem("September")!) : items.length)], "August") : null,
        "September": monthItem("September") ? await generateTwoColumnPages([{type: "body", text: summaries["September"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("September")!) + 1, monthItem("October") ? items.indexOf(monthItem("October")!) : items.length)], "September") : null,
        "October": monthItem("October") ? await generateTwoColumnPages([{type: "body", text: summaries["October"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("October")!) + 1, monthItem("November") ? items.indexOf(monthItem("November")!) : items.length)], "October") : null,
        "November": monthItem("November") ? await generateTwoColumnPages([{type: "body", text: summaries["November"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("November")!) + 1, monthItem("December") ? items.indexOf(monthItem("December")!) : items.length)], "November") : null,
        "December": monthItem("December") ? await generateTwoColumnPages([{type: "body", text: summaries["December"] || "", style: styles.body}, ...items.slice(items.indexOf(monthItem("December")!) + 1)], "December") : null
      }
    )
  }

  const getGettingStarted = async ()  => {
    return await generateTwoColumnPages([
      { type: "sectionHeader", text: "How to Read This Book", style: styles.sectionHeader },
      { type: "body", text: gettingStartedP1, style: styles.body},
      { type: "body", text: gettingStartedP2, style: styles.body},
      { type: "body", text: gettingStartedP3, style: styles.body},
      { type: "body", text: gettingStartedP4, style: styles.body},
      { type: "sectionHeader", text: "Plan Overview", style: styles.sectionHeader },
      { type: "body", text: scheduleSummary, style: styles.body}
    ], "Getting Started")
  }

  const generateCropElements = async (crops: Crop[]): Promise<React.ReactElement[]> => {
    const expandedCrops = crops.map(crop => [
      { type: "subHeader", text: `${crop.name} - ${crop.variety}`, style: styles.subHeader },
      { type: "body", text: crop.shortDescription, style: styles.body},
    ]).flat()
    return await generateTwoColumnPages(expandedCrops, "Crops")
  }

  const generateUnderstandingYourGardenElements = async (introExtras: IntroExtras): Promise<React.ReactElement[]> => {
    const pruningAdvice = introExtras["pruning"]
    const supportStructuresAdvice = introExtras["supportStructures"]
    const understandingYourGardenElements = [
      { type: "sectionHeader", text: 'Soil', style: styles.sectionHeader },
      { type: "body", text: soilP1, style: styles.body},
      { type: "body", text: soilP2, style: styles.body},
      { type: "body", text: soilP3, style: styles.body},
      { type: "body", text: soilP4, style: styles.body},
      { type: "body", text: soilP5, style: styles.body},
      { type: "sectionHeader", text: 'Tools', style: styles.sectionHeader },
      { type: "body", text: gardeningTechniquesP1, style: styles.body},
      { type: "sectionHeader", text: 'Grow Lights', style: styles.sectionHeader },
      { type: "body", text: gardeningTechniquesP2, style: styles.body},
      { type: "sectionHeader", text: 'Row Covers', style: styles.sectionHeader },
      { type: "body", text: gardeningTechniquesP3, style: styles.body},
    ]
    if (pruningAdvice !== "") {
      understandingYourGardenElements.push(
        { type: "sectionHeader", text: 'Pruning', style: styles.sectionHeader },
        { type: "body", text: pruningAdvice, style: styles.body},
      )
    }
    if (supportStructuresAdvice !== "") {
      understandingYourGardenElements.push(
        { type: "sectionHeader", text: 'Support Structures', style: styles.sectionHeader },
        { type: "body", text: supportStructuresAdvice, style: styles.body},
      )
    }

    return await generateTwoColumnPages(understandingYourGardenElements, "Understanding Your Garden")
  }

  // Uncomment for viewing in-browser
  const [url, setUrl] = useState("");

  const generatePdf = async () => {

    const gettingStarted = await getGettingStarted()
    const orderedAndAnnotatedTasks = await orderAndAnnotateTasks(allTasks)
    const tasksByMonth = await getTwoColumnTasksByMonth(orderedAndAnnotatedTasks)
    const cropsElements = await generateCropElements(crops)
    const understandingYourGardenElements = await generateUnderstandingYourGardenElements(introExtras)

    const blob = await pdf(
      <MyDocument
        tasksByMonth={tasksByMonth}
        gettingStarted={gettingStarted}
        cropsElements={cropsElements}
        understandingYourGardenElements={understandingYourGardenElements}
      />
    ).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    setUrl(pdfUrl);
  };
  useEffect(() => {
    generatePdf();
  }, []);

  interface MyDocumentProps {
    tasksByMonth: TwoColumnTasksByMonth
    gettingStarted: React.ReactElement[]
    cropsElements: React.ReactElement[]
    understandingYourGardenElements: React.ReactElement[]
  }

  const MyDocument = (props: MyDocumentProps) => {
    const { tasksByMonth, gettingStarted, cropsElements, understandingYourGardenElements } = props
    return (
      <Document pageLayout="twoPageLeft" >
        {/* Cover Page */}
        <Page>
          <PDFImage src={cover} style={{height: '100%'}} />
          {/*<PDFText style={styles.madeFor}>MADE FOR</PDFText>*/}
          {/*<PDFText style={styles.userName}>JAKE SOLOMON</PDFText>*/}
        </Page>

        {gettingStarted}

        {/*/!*Garden Layout Page*!/*/}
        <Page style={styles.page}>
          <PDFText style={styles.sectionHeader}>Garden Layout</PDFText>
          <PDFText style={styles.body}>{gardenLayoutP1}</PDFText>
          <PDFText style={styles.body}>{gardenLayoutP2}</PDFText>
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

          <PDFText style={styles.pageNumber} render={({pageNumber, totalPages}) => (
            `${pageNumber} / ${totalPages}`
          )} fixed/>
        </Page>

        {/*Garden Layout Example*/}
        <Page style={styles.page}>
          <PDFText style={styles.sectionHeader}>Garden Layout Example</PDFText>
          <PDFText style={styles.body}>{gardenLayoutExampleP1}</PDFText>
          <PDFText style={styles.body}>{gardenLayoutExampleP2}</PDFText>
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

          <PDFText style={styles.pageNumber} render={({pageNumber, totalPages}) => (
            `${pageNumber} / ${totalPages}`
          )} fixed/>
        </Page>

        {cropsElements}
        {understandingYourGardenElements}

        {
          tasksByMonth["January"] &&
          tasksByMonth["January"]
        }
        {
          tasksByMonth["February"] &&
          tasksByMonth["February"]
        }
        {
          tasksByMonth["March"] &&
          tasksByMonth["March"]
        }
        {
          tasksByMonth["April"] &&
          tasksByMonth["April"]
        }
        {
          tasksByMonth["May"] &&
          tasksByMonth["May"]
        }
        {
          tasksByMonth["June"] &&
          tasksByMonth["June"]
        }
        {
          tasksByMonth["July"] &&
          tasksByMonth["July"]
        }
        {
          tasksByMonth["August"] &&
          tasksByMonth["August"]
        }
        {
          tasksByMonth["September"] &&
          tasksByMonth["September"]
        }
        {
          tasksByMonth["October"] &&
          tasksByMonth["October"]
        }
        {
          tasksByMonth["November"] &&
          tasksByMonth["November"]
        }
        {
          tasksByMonth["December"] &&
          tasksByMonth["December"]
        }

        {/*<PDFText style={styles.pageNumber} render={({pageNumber, totalPages}) => (*/}
        {/*  `${pageNumber} / ${totalPages}`*/}
        {/*)} fixed/>*/}
      </Document>
    )
  }

  // Uncomment for viewing in-browser
  return url
    ? <>
      <iframe src={url} style={{width: '100%', height: '95vh'}} title="PDF Preview"/>
    </>
    : null;
}

export default FullPlan
