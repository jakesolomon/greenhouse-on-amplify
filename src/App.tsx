import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from '@mantine/core';
import '@mantine/core/styles.css';
import Quiz from './components/quiz.tsx';

import './App.css'

function App() {

  const myGreen: MantineColorsTuple = [
    '#f5fae7',
    '#eaf1da',
    '#d5e0b8',
    '#becf94',
    '#abc075',
    '#9fb661',
    '#98b255',
    '#849c45',
    '#748b3a',
    '#63782c'
  ];

  const theme = createTheme({
    colors: {
      myGreen
    }
  });

  return (
    <MantineProvider theme={theme}>
      <Quiz/>
    </MantineProvider>
)
}

export default App
