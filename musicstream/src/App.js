import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });

  return (
      <Router>
        <div className="waveStream">
        <ThemeProvider theme={theme}>
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
        </ThemeProvider>
        </div>
      </Router>
  );
}

export default App;
