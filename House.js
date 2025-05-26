import { useState, useEffect } from 'react';


function House() {
	const [devices, setDevices] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchDevices();
	}, );

	const fetchDevices = async () => {
		try {
			const response = await fetch(`http://localhost:5015/Device/All`, {
				method: 'GET',
			});
 
			if (!response.ok) {
				const errorText = await response.text();
				setError(`Fel: ${errorText}`);
				return;
			}
 
			const devices = await response.json();
			setDevices(devices);
			setError(null);
 
		} catch (err) {
			console.error('Fel vid hämtning av enheter:', err);
			setError('Ett fel inträffade vid hämtning av enheter.');
		}
	};
  
	return (
	  <><table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Status</th>
					<th>Room</th>

				</tr>
			</thead>
			<tbody>
				{devices.map((item) => (
					<tr key={item.room}>
						<td>{item.id}</td>
						<td>{item.name}</td>
						<td>{item.status}</td>
						<td>{item.room}</td>
					</tr>
				))}
			</tbody>
		</table>
		</>
	);
  }
  
  export default House;