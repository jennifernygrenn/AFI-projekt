import logo from './logo.svg';
import './App.css';
import House from './House';
import Room from './Room';
import Ritning from './Components/Ritning.png';

function App() {
  return (
    <div className="App">
		<h1>Simulering av hus</h1>
	  	<div className="controll-grid">
            <Room room="Vardagsrum" />
            <Room room="Kök" />
            <Room room="Sovrum" />
            <Room room="Toa" />
            <Room room="Hall" />
        </div>
    </div>
  );
}

export default App;
