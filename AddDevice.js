import { useEffect, useState } from 'react';

function AddDevice({ defaultRoom, onDeviceAdded }) {
    const [name, setName] = useState("Taklampa");
    const [status, setStatus] = useState('OFF');
    const [room, setRoom] = useState(defaultRoom||"Sovrum");
	const [type, setType] = useState('Device');

    const [option1, setOption1] = useState("Taklampa");
    const [option2, setOption2] = useState("Lampa2");
    const [option3, setOption3] = useState("Lampa3");
	const [option4, setOption4] = useState("Lampa3");


    useEffect(() => {
        if(room=="Sovrum"){
            setOption1("Taklampa");
            setOption2("Sänglampa");
            setOption3("AC");
			setOption4("TV");

        } else if(room=="Hall"){
            setOption1("Taklampa");
            setOption2("Dörrlås");
            setOption3("Kamera");
			setOption4("Golvvärme");
  
        }else if(room=="Vardagsrum"){
            setOption1("Taklampa");
            setOption2("Fönsterlampa");
            setOption3("Robotdammsugare"); 
			setOption4("TV");
        }
        else if(room=="Kök"){
            setOption1("Taklampa");
            setOption2("Diskmaskin");
            setOption3("Fläkt"); 
			setOption4("Kaffemaskin");
        }
        else if(room=="Toa"){
            setOption1("Taklampa");
            setOption2("Tvättmaskin");
            setOption3("Torktumlare"); 
			setOption4("Fläkt");
        }else{
            setOption1("Taklampa");
            setOption2("Lampa2");
            setOption3("Lampa3");
			setOption4("Lampa4");
        }
    }, [room]);

	const determineType = (name) => {
		return name.toLowerCase() === "ac" || "golvvärme" ? "sensor" : "device";
	};

       const handleInsert = async () => {
            try {
				const deviceType = determineType(name); 

				const body = {
					name: name,
					room: room,
					type: deviceType
				};

				if (deviceType === "device") {
					body.status = 'OFF';
				} else if (deviceType === "sensor") {
					body.value = 20;
					body.status = "OFF"
				}
				
                const response = await fetch("http://localhost:5015/Device", {
                	method: 'POST', 
					headers: {
                    	'Content-Type': 'application/json'
                	},
					//body: JSON.stringify(body)
                	
					body: JSON.stringify(body)
            	});

                console.log("Svar mottaget:", response.status);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Fel från servern:', errorText);
                    alert(`Fel: ${errorText}`);
                    return;
                } else {
                    const successText = await response.text();
                    // alert(`✅ ${successText}`);
                    if(onDeviceAdded){
                        await onDeviceAdded();
                    }  
                }
            } catch (error) {
                console.error('Fel vid kommunikation med backend:', error);
            }
       }
      
       return (
            <div className='add-device-container'>
                <h4>Lägg till enhet</h4>
				<div className="input-container">
					<label htmlFor="role" className="label-text">Namn: </label>
                    <select
                        id="role"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="dropdown"
                        >
                        <option value={option1}>{option1}</option>
                        <option value={option2}>{option2}</option>
                        <option value={option3}>{option3}</option>    
						<option value={option4}>{option4}</option>    
                    </select>
                </div>
				<div>
					<button className="add-device-button" onClick={handleInsert}>Lägg till</button>
				</div>
            </div>
        );
}
      
export default AddDevice;
