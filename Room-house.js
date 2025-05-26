import { useState, useEffect } from 'react';
import LampControl from './LampControl';
import AddDevice from './AddDevice'; // Importera AddDevice-komponenten

function Room({ room }) {
   const [devices, setDevices] = useState([]);
   const [error, setError] = useState(null);
   const [showAddDevice, setShowAddDevice] = useState(false);
   const [showDeleteMode, setShowDeleteMode] = useState(false); // Ny state för delete-läge

   // Funktion för att hämta enheter baserat på rummet
   const fetchDevicesByRoom = async () => {
        try {
           	const response = await fetch(`http://localhost:5015/Device/ByRoom?room=${room}`, {
               method: 'GET',
           	});

           	if (!response.ok) {
               const errorText = await response.text();
               setError(`Inga enheter hittades`);
               return;
           	}

           	const devicesInRoom = await response.json();
           	setDevices(devicesInRoom);
           	setError(null);

       	} catch (err) {
           	console.error('Fel vid hämtning av enheter:', err);
           	setError('Ett fel inträffade vid hämtning av enheter.');
       	}
    };

    const handleDeleteDevice = async (lampId) => {
        try {
            const response = await fetch(`http://localhost:5015/Device/${lampId}`, {
               method: 'DELETE',
            });

            if (!response.ok) {
               const errorText = await response.text();
               alert(`Fel: ${errorText}`);
               return;
            }

           // alert(`Lampan med ID ${lampId} har tagits bort.`);
           fetchDevicesByRoom();

        } catch (err) {
           console.error('Fel vid borttagning av enhet:', err);
        }
    };

    useEffect(() => {
       fetchDevicesByRoom();
    }, [room]);


    return (
        <div className="room">
            <h3>{room}</h3>

            <button class="add-knapp" 
				onClick={() => setShowAddDevice(!showAddDevice)}>+
			</button>
            <button class="delete-knapp" 
				onClick={() => setShowDeleteMode(!showDeleteMode)}>-
			</button>

            {error && <p className="error">{error}</p>}
           	<ul className='devices-list'>
               	{devices.map((device) => (
               		<li key={device.id} className="device-item">
                   		<LampControl
                       		lampId={device.id}
                       		lampName={device.name}
                        	initialStatus={device.status}
                    	/>
                   		{showDeleteMode && (
                        	<button class = "drop-down-delete"
                            	onClick={() => handleDeleteDevice(device.id)}>X
                        	</button>
                        	)}
                    	</li>
                	))}
            	</ul>
            {showAddDevice && (
                <div className="add-square">
                    <AddDevice
                        defaultRoom={room}
                        onDeviceAdded={() => {
                            fetchDevicesByRoom();
                            setShowAddDevice(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}


export default Room;