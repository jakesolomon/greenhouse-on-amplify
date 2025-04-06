import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Merriweather',
  src: 'https://fonts.gstatic.com/s/merriweathersans/v8/AKu1CjQ4qnV8MUltkAX3sFBI1aZvkJLeFEwcwXkBYq0.ttf',
  fontStyle: 'normal'
});

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYC3USBnSvpkopQaUR-2r7iU.ttf',
  fontStyle: 'normal'
})

Font.register({
  family: 'Poppins',
  fonts: [
    {src: '/fonts/Poppins-Regular.ttf'},
    {src: '/fonts/Poppins-Bold.ttf', fontWeight: 700},
    {src: '/fonts/Poppins-ExtraBold.ttf', fontWeight: 800},
  ]
})

Font.registerHyphenationCallback(word => [word]);

export const styles = StyleSheet.create({
  madeFor: {
    position: "absolute",
    top: 681,
    left: 80,
    fontSize: 11,
    fontFamily: "Poppins",
    fontWeight: 400
  },
  userName: {
    position: "absolute",
    top: 681,
    right: 80,
    fontSize: 11,
    fontFamily: "Poppins",
    fontWeight: 400
  },
  chapterHeader: {
    fontSize: 36,
    lineHeight: 1,
    fontFamily: 'Poppins',
    fontWeight: 700,
    // marginBottom: 88,
    marginBottom: 80 // had a one-line orphan in chapter 1
  },
  sectionHeader: {
    fontSize: 13,
    // fontFamily: 'Merriweather-Bold',
    fontFamily: 'Poppins',
    // marginBottom: 12,
    padding: 0,
    fontWeight: 700,
    textTransform: "uppercase"
  },
  subHeader: {
    fontSize: 11,
    // fontFamily: 'Merriweather',
    fontFamily: 'Poppins',
    // marginBottom: 12,
    padding: 0,
    fontWeight: 700,
    // marginTop: 6,
    // marginBottom: 6,
  },
  body: {
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: 'Merriweather',
  },
  notes: {
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 1,
    fontFamily: 'Merriweather',
  },
  page: {
    fontSize: 11,
    color: '#333',
    paddingTop: "0.5in",
    // paddingBottom: "0.5in", // controlling this with column height. Don't set it here or we risk react-pdf auto page breaks or text overlay bug.
    paddingHorizontal: "0.5in",
    // flexDirection: 'row',
  },
  columnsContainer: {
    flexDirection: 'row',
  },
  flexContainer: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    // marginVertical: 15,
    // marginHorizontal: 100,
    marginBottom: 10,
    // paddingBottom: 0
  },
  remainingSpace: {
    flex: 1,
    maxHeight: 200
  },
  imageOverflow: {
    flex: 1,
    width: "100%", // Full width
    height: "100%", // Ensures it fills the container
    objectFit: "cover", // Cover the full space without distortion
    objectPosition: "bottom right",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  // columnsContainer: {
  //   flexDirection: 'row',
  //   // Adjust the height as needed or let it be dynamic.
  // },
  // column1: {
  //   flex: 1,
  //   marginRight: 10
  // },
  // column2: {
  //   flex: 1,
  //   marginLeft: 10
  // },

  columnLeft: {
    flex: 1,
    marginRight: "0.125in", // half of a 0.25-inch gap between columns
  },
  columnRight: {
    flex: 1,
    marginLeft: "0.125in", // half of a 0.25-inch gap between columns
  },
});