using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Linq;
using TodoApi.Models;

namespace TodoApi.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class DeviceController : Controller
	{
		private readonly IMemoryCache _memoryCache;
		private const string CacheKey = "DeviceList";
		//private const string SensorCacheKey = "SensorList";


		public DeviceController(IMemoryCache memoryCache)
		{
			_memoryCache = memoryCache;
		}

		[HttpPost(Name = "InsertDeviceDetails")]
		[ProducesResponseType(StatusCodes.Status201Created)]
		public string InsertDeviceDetails([FromBody] DeviceDetails device)
		{
			// Hämta listan från cache eller skapa en ny om den inte finns
			var deviceList = _memoryCache.GetOrCreate(CacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<DeviceDetails>();
			});

			// Generera ett nytt ID och lägg till enheten i listan
			device.Id = deviceList.Count > 0 ? deviceList.Max(d => d.Id) + 1 : 1;
			deviceList.Add(device);

			// Uppdatera cachen
			_memoryCache.Set(CacheKey, deviceList);

			return $"Device with ID {device.Id} added successfully.";
		}
		/*
		[HttpPost("AddSensor", Name = "InsertSensorDetails")]
		[ProducesResponseType(StatusCodes.Status201Created)]
		public string InsertSensorDetails([FromBody] SensorDetails sensor)
		{
			// Hämta listan från cache eller skapa en ny om den inte finns
			var sensorList = _memoryCache.GetOrCreate(SensorCacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<SensorDetails>();
			});

			// Generera ett nytt ID och lägg till enheten i listan
			sensor.Id = sensorList.Count > 0 ? sensorList.Max(d => d.Id) + 1 : 1;
			sensorList.Add(sensor);

			// Uppdatera cachen
			_memoryCache.Set(SensorCacheKey, sensorList);

			return $"Sensor with ID {sensor.Id} added successfully.";
		}
		*/
		[HttpGet("{id}", Name = "GetDeviceById")]
		public ActionResult<DeviceDetails> GetDeviceById(int id)
		{
			// Hämta listan från cache
			var deviceList = _memoryCache.GetOrCreate(CacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<DeviceDetails>();
			});

			// Hitta enheten med det angivna ID:t
			var device = deviceList.FirstOrDefault(d => d.Id == id);
			if (device == null)
			{
				return NotFound($"Device with ID {id} not found.");
			}

			return device;
		}
		/*
		[HttpGet("GetSensor/{id}", Name = "GetSensorById")]
		public ActionResult<SensorDetails> GetSensorById(int id)
		{
			// Hämta listan från cache
			var sensorList = _memoryCache.GetOrCreate(SensorCacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<SensorDetails>();
			});

			// Hitta enheten med det angivna ID:t
			var sensor = sensorList.FirstOrDefault(d => d.Id == id);
			if (sensor == null)
			{
				return NotFound($"Device with ID {id} not found.");
			}
			return sensor;
		}
		*/
		[HttpPut("{id}/status", Name = "UpdateDeviceStatus")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public ActionResult<string> UpdateDeviceStatus(int id)
		{
			// Hämta listan från cache
			var deviceList = _memoryCache.GetOrCreate(CacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<DeviceDetails>();
			});

			// Hitta enheten med det angivna ID:t
			var device = deviceList.FirstOrDefault(d => d.Id == id);
			if (device == null)
			{
				return NotFound($"Device with ID {id} not found.");
			}

			// Växla status mellan "ON" och "OFF"
			device.Status = device.Status == "ON" ? "OFF" : "ON";

			// Uppdatera cachen
			_memoryCache.Set(CacheKey, deviceList);

			return Ok($"Device with ID {id} status updated to {device.Status}.");
		}

		[HttpPut("{id}/value", Name = "UpdateDeviceValue")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public ActionResult<string> UpdateDeviceValue(int id, [FromBody] int newValue)
		{
			// Hämta listan från cache
			var deviceList = _memoryCache.GetOrCreate(CacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<DeviceDetails>();
			});

			// Hitta enheten med det angivna ID:t
			var device = deviceList.FirstOrDefault(d => d.Id == id);
			if (device == null)
			{
				return NotFound($"Device with ID {id} not found.");
			}

			// Sätt nya värdet
			device.Value = newValue;

			// Uppdatera cachen
			_memoryCache.Set(CacheKey, deviceList);

			return Ok($"Device with ID {id} value updated to {device.Value}.");
		}
		
		[HttpGet("All", Name = "GetAllDevices")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public ActionResult<List<DeviceDetails>> GetAllDevices()
		{
			// Hämta listan från cache
			var deviceList = _memoryCache.GetOrCreate(CacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<DeviceDetails>();
			});
			if (deviceList == null || deviceList.Count == 0)
			{
				return NotFound("No devices found.");
			}
			
			return Ok(deviceList);
		}
		/*
		[HttpGet("AllSensors", Name = "GetAllSensors")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public ActionResult<List<SensorDetails>> GetAllSensors()
		{
			// Hämta listan från cache
			var sensorList = _memoryCache.GetOrCreate(SensorCacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<SensorDetails>();
			});
			if (sensorList == null || sensorList.Count == 0)
			{
				return NotFound("No devices found.");
			}

			return Ok(sensorList);
		}
		*/
		[HttpGet("ByRoom", Name = "GetDevicesByRoom")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public ActionResult<List<DeviceDetails>> GetDevicesByRoom(string room)
		{
			// Hämta listan från cache
			var deviceList = _memoryCache.GetOrCreate(CacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<DeviceDetails>();
			});

			// Filtrera enheterna baserat på rummet
			var devicesInRoom = deviceList.Where(d => d.Room == room).ToList();
			if (devicesInRoom == null || devicesInRoom.Count == 0)
			{
				return NotFound($"No devices found in room {room}.");
			}

			return Ok(devicesInRoom);
		}
	/*
		[HttpGet("ByRoomSensor", Name = "GetSensorsByRoom")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public ActionResult<List<SensorDetails>> GetSensorsByRoom(string room)
		{
			// Hämta listan från cache
			var sensorList = _memoryCache.GetOrCreate(SensorCacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<SensorDetails>();
			});

			// Filtrera enheterna baserat på rummet
			var sensorsInRoom = sensorList.Where(d => d.Room == room).ToList();
			if (sensorsInRoom == null || sensorsInRoom.Count == 0)
			{
				return NotFound($"No sensors found in room {room}.");
			}

			return Ok(sensorsInRoom);
		}
*/
		[HttpDelete("{id}", Name = "DeleteDevice")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public ActionResult<string> DeleteDevice(int id)
		{
			// Hämta listan från cache
			var deviceList = _memoryCache.GetOrCreate(CacheKey, entry =>
			{
				entry.SlidingExpiration = TimeSpan.FromMinutes(30);
				return new List<DeviceDetails>();
			});

			// Hitta enheten med det angivna ID:t
			var device = deviceList.FirstOrDefault(d => d.Id == id);
			if (device == null)
			{
				return NotFound($"Device with ID {id} not found.");
			}

			// Ta bort enheten från listan
			deviceList.Remove(device);

			// Uppdatera cachen
			_memoryCache.Set(CacheKey, deviceList);

			return Ok($"Device with ID {id} deleted successfully.");
		}
		/*
		[HttpDelete("Sensor/{id}", Name = "DeleteSensor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<string> DeleteSensor(int id)
        {
            // Hämta listan från cache
            var sensorList = _memoryCache.GetOrCreate(SensorCacheKey, entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromMinutes(30);
                return new List<SensorDetails>();
            });

            // Hitta enheten med det angivna ID:t
            var sensor = sensorList.FirstOrDefault(d => d.Id == id);
            if (sensor == null)
            {
                return NotFound($"Sensor with ID {id} not found.");
            }

            // Ta bort enheten från listan
            sensorList.Remove(sensor);

            // Uppdatera cachen
            _memoryCache.Set(SensorCacheKey, sensorList);

            return Ok($"Sensor with ID {id} deleted successfully.");
        }   */   
    }
}
