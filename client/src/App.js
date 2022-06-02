import logo from './logo.svg';
import './App.css';
import './styles/app.scss';
import Toolbar from './components/Toolbar';
import SettingBar from './components/SettingBar';
import Canvas from './components/Canvas';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
        <div className="app">
          {/* Whenever the location changes, <Routes> looks through all its children <Route> elements 
          // to find the best match and renders that branch of the UI. */}
          <Routes>
            {/* Route будет вызываться если в пути есть динамически изменяемый идентификатор */}
            {/* <Route> kind of like an if statement; if its path matches the current URL, it renders its element */}
            <Route 
              path='/:id'
              element={
                <>
                  <Toolbar></Toolbar>
                  <SettingBar></SettingBar>
                  <Canvas></Canvas>
                </>
              }
            >
            </Route>
            <Route
                path="*"
                element={<Navigate replace to={`f${(+new Date).toString()}`} />}
            />
            {/* <Route path="/" element={<Navigate replace to="/home" />} /> */}
            {/* <Redirect to={`f${(+new Date).toString()}`}/> */}
          </Routes>
      </div>
    </BrowserRouter>
      // <div className="app">
      //   <Toolbar></Toolbar>
      //   <SettingBar></SettingBar>
      //   <Canvas></Canvas>
      // </div>
  );
}

export default App;
