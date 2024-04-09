import React from 'react';
import SenderComponent from './components/Sender/SenderPeer';
import DetailConfig from './components/DetailConfig/DetailConfigComponent'
import { Routes, Route } from 'react-router-dom';

const App = () => {

    return (
        <Routes>
            <Route exact={true} path='/:code' Component={SenderComponent}></Route>
            <Route exact={true} path='/' Component={SenderComponent}></Route>
            <Route exact={true} path='/detailConfig' Component={DetailConfig}></Route>
        </Routes>
    );
};

export default App;