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
  chapterHeader: {
    fontSize: 36,
    lineHeight: 1,
    fontFamily: 'Poppins',
    fontWeight: 700,
    marginBottom: 88,
  },
  sectionHeader: {
    fontSize: 14,
    lineHeight: 2,
    fontFamily: 'Poppins',
    fontWeight: 700,
  },
  subHeader: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: 700,
    marginBottom: 12,
  },
  body: {
    color: '#333',
    paddingTop: "1in",
    paddingBottom: "1in",
    paddingHorizontal: "1in",
  },
  page: {
    flexDirection: 'row',
    marginBottom: 20, // space between pages
  },
  text: {
    marginBottom: 18,
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: 'Merriweather',
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
  columnsContainer: {
    flexDirection: 'row',
    // Adjust the height as needed or let it be dynamic.
  },
  column1: {
    flex: 1,
    marginRight: 10
  },
  column2: {
    flex: 1,
    marginLeft: 10
  },
});