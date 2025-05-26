import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faFan, faMugHot, faTv, faHouseLock,faCamera, faCircleRadiation, faSink, faSquare, faRug } from '@fortawesome/free-solid-svg-icons';

function Room({ room }) {
   const [devices, setDevices] = useState([]);
   const [error, setError] = useState(null);


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
    useEffect(() => {
        fetchDevicesByRoom();
    }, [room]);

    useEffect(() => {
        fetchDevicesByRoom();
    },);

    const getIconForDevice = (deviceName) => {
        const iconMap = {
            "Taklampa": faLightbulb,
            "Fönsterlampa": faLightbulb,
            "Sänglampa": faLightbulb,
            "Fläkt": faFan,
            "Robotdammsugare": faCircleRadiation,
            "Dörrlås": faHouseLock,
            "AC": faFan,
            "Diskmaskin": faSink,
            "Kamera": faCamera,
            "Tvättmaskin": faSquare,
            "Torktumlare":faSquare,
            "TV": faTv,
            "Kaffemaskin": faMugHot,
			"Golvvärme": faRug
        };

        return iconMap[deviceName];
    };

    const getColorForDevice = (deviceName, status) => {
        const yellowDevices = ["Taklampa", "Fönsterlampa", "Sänglampa"];
        const blueDevices = ["Fläkt", "Tvättmaskin", "Torktumlare", "Diskmaskin", "AC",];
        const redDevices = ["Dörrlås", "Kamera", "Golvvärme"];
        const greenDevices = ["Robotdammsugare"];
        const  braunDevices = ["Kaffemaskin"];
        const blackDevices=["TV"];

        if (yellowDevices.includes(deviceName)) {
            return status === 'ON' ? 'yellow' : 'grey';
        }else if (blueDevices.includes(deviceName)) {
            return status === 'ON' ? 'blue' : 'grey';
        }else if (redDevices.includes(deviceName)) {
            return status === 'ON' ? 'red' : 'grey';
        }else if(greenDevices.includes(deviceName)){
            return status === 'ON' ? 'green' : 'grey';
        }else if(braunDevices.includes(deviceName)){
            return status === 'ON' ? 'brown' : 'grey';
        }else if(blackDevices.includes(deviceName)){
            return status === 'ON' ? 'black' : 'grey';
        }
        else{
           return status === 'grey';
        }
    }

   return (
       <div className="room" style={{ position: 'relative', border: '1px solid #ccc', padding: '10px' }}>
           <h3>{room}</h3>
          
           {error && <p className="error">{error}</p>}
           <ul>
           {devices.map((device) => (
                   <li key={device.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <p>{device.name}</p>
                       <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                               <span>{device.status}</span>
							    
							    {device.type === 'sensor' && device.status === "ON" && (
									<span>{device.value}°C</span>
								)}

                                <FontAwesomeIcon
                                       icon={getIconForDevice(device.name)}
                                       style={{ color: getColorForDevice(device.name, device.status), fontSize: '30px' }}
                               />
                              
                       </div>
                   </li>
               ))}

           </ul>
       </div>
   );
}

export default Room;
