import { useState } from 'react';


function DeleteDevice({ defaultRoom, onDeviceDeleted }) {
   const [name, setName] = useState('');
   const [status, setStatus] = useState('');
   const [room, setRoom] = useState(defaultRoom);


   const handleDelete = async () => {
       try {
           const response = await fetch("http://localhost:5015/Device", {
               method: 'DELETE',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   name: name,
                   status: status,
                   room: room,
               }),
           });
           console.log("Svar mottaget:", response.status);
           if (!response.ok) {
               const errorText = await response.text();
               console.error('Fel från servern:', errorText);
               alert(`Fel: ${errorText}`);
               return;
           } else {
               const successText = await response.text();
               alert(`✅ ${successText}`);
               if (onDeviceDeleted) {
                   onDeviceDeleted(); // Anropa callback-funktionen för att uppdatera enhetslistan
               }
           }
       } catch (error) {
           console.error('Fel vid kommunikation med backend:', error);
       }
   };


   return (
       <div>
           <h4>Ta bort enhet</h4>
           <div>
               <label htmlFor="name" className="text-gray-700">Name:</label>
               <select
                   id="name"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="mt-2 p-2 bg-white border border-gray-300 rounded"
               >
                   <option value="Lampa1">Lampa1</option>
                   <option value="Lampa2">Lampa2</option>
                   <option value="Lampa3">Lampa3</option>
                   <option value="Lampa4">Lampa4</option>
               </select>
           </div>
           <div>
               <label htmlFor="status" className="text-gray-700">Status:</label>
               <select
                   id="status"
                   value={status}
                   onChange={(e) => setStatus(e.target.value)}
                   className="mt-2 p-2 bg-white border border-gray-300 rounded"
               >
                   <option value="ON">ON</option>
                   <option value="OFF">OFF</option>
               </select>
           </div>
           <div>
               <button onClick={handleDelete} style={{ background: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>
                   Ta bort
               </button>
           </div>
       </div>
   );
}


export default DeleteDevice;