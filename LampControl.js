import { useState , useEffect } from 'react';

function LampControl({ lampId, lampName, initialStatus }) {
	//const [isOn, setIsOn] = useState(false);
	const [status, setStatus] = useState('Laddar...');
	const [newValue, setNewValue] = useState('');
	const [value, setValue] = useState('20');
	const [isSensor, setIsSensor] = useState(false);


	useEffect(() => {
		getStatus();
		getValue();
	}, []);
	
	const getStatus = async () => {
		try {
			const response = await fetch(`http://localhost:5015/Device/${lampId}`, {
				method: 'GET'
			});

			if (!response.ok) {
				const errorText = await response.text();
				return;
			} else {
				const data = await response.json();
				setStatus(data.status);
				setIsSensor(data.type === 'sensor');

			}

		} catch (error) {
			console.error('Fel vid kommunikation med backend:', error);
  		}
	}

	const getValue = async () => {
		try {
			const response = await fetch(`http://localhost:5015/Device/${lampId}`, {
				method: 'GET'
			});

			if (!response.ok) {
				const errorText = await response.text();
				return;
			} else {
				const data = await response.json();
				if (data.value !== undefined) {
					setValue(data.value);
				}
			}

		} catch (error) {
			console.error('Fel vid kommunikation med backend:', error);
  		}
	}

	const changeValue = async () => {
		try {
			const response = await fetch(`http://localhost:5015/Device/${lampId}/value`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parseInt(newValue, 10))

			});

			if (response.ok) {
				await getStatus();
				await getValue();
			}

		} catch (err) {
			console.error('Fel vid toggle:', err);
		}
	};

	const toggleLamp = async () => {
		try {
			const response = await fetch(`http://localhost:5015/Device/${lampId}/status`, {
				method: 'PUT'
			});

			if (response.ok) {
				await getStatus();
			}

		} catch (err) {
			console.error('Fel vid toggle:', err);
		}
	};

	return (
		<>
		<div className='device-name-button'>
			<p>{lampName}</p>

			{isSensor && status=="ON" && (
				<div className="sensor-control">
					<input
						className='temp-input'
						type="number"
						value={newValue}
						onChange={(e) => setNewValue(e.target.value)}
						placeholder="Temp"
						min="15"
						max="30"
					/>
					<button className="temp-knapp" onClick={changeValue}>Ändra</button>
				</div>
			)}
			
			<label className="switch">
				<input
					type="checkbox"
					checked={status.toLowerCase() === 'on'}
					onChange={toggleLamp}
				/>
				<span className="slider round"></span>
			</label>
		</div>
		</>
	);
}

export default LampControl;
