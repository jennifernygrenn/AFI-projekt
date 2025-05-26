import { useState , useEffect } from 'react';

import LampControl from './LampControl';

function ControlPanel() {
	const [lamps, setLamps] = useState([]);

	useEffect(() => {
		fetch('http://localhost:5015/Device')
		  .then(res => res.json())
		  .then(data => setLamps(data))
		  .catch(err => console.error('Kunde inte hämta lampor:', err));
	}, []);

	return (
		<div>
		  <h1>Kontrollpanel</h1>
		  {lamps.map(lamp => (
			<LampControl
			  key={lamp.id}
			  lampId={lamp.id}
			  lampName={lamp.name}
			  initialStatus={lamp.status}
			/>
		  ))}
		</div>
	  );
}

export default ControlPanel;
