import logo from './logo.svg';
import './App.css';
import {MainLayout} from "./Layout";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UserMng} from "./user-mng/UserMng";
import {Login} from "./Login";
import SourceMng from "./source-mng/SourceMng";

function App() {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    return (
    // <div className="App">
    <div>
      {/*<header className="App-header">*/}
      {/*  <img src={logo} className="App-logo" alt="logo" />*/}
      {/*  <p>*/}
      {/*    Edit <code>src/App.js</code> and save to reload.*/}
      {/*  </p>*/}
      {/*  <a*/}
      {/*    className="App-link"*/}
      {/*    href="https://reactjs.org"*/}
      {/*    target="_blank"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*  >*/}
      {/*    Learn React*/}
      {/*  </a>*/}
      {/*</header>*/}
        <BrowserRouter>
            <Routes>
                <Route path='login' element={<Login/>}/>
                {/*<Route path='admin' element={currentUser?<MainLayout content={<UserMng/>}/>:null}/>*/}
                <Route path='user-mng' element={<MainLayout content={<UserMng/>}/>}/>
                <Route path='source-mng' element={<MainLayout content={<SourceMng/>}/>}/>
            </Routes>
        </BrowserRouter>
      {/*<MainLayout></MainLayout>*/}
    </div>
  );
}

export default App;
