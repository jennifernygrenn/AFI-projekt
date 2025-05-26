import logo from './logo.svg';
import './App.css';
//import HouseView from './HouseView.js';
import AddDevice from './AddDevice.js';
import ControlView from './ControlView.js';
import Room from './Room.js';
import { useStatus } from 'react';


function App() {
    return(
        <div className="App">
            <main>
            	<h1>Välkommen till Smart Home</h1>
                <p>Här kan du styra dina enheter.</p>
                <h2>Kontrollpanel</h2>
                <div className="controll-grid">
                    <Room room="Vardagsrum" />
                    <Room room="Kök" />
                    <Room room="Sovrum" />
                    <Room room="Toa" />
                    <Room room="Hall" />
                </div>
            </main>
        </div>
    );
}


export default App;
