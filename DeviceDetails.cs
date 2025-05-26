namespace TodoApi.Models;

public class DeviceDetails()
{
	//publika egenskaper
	public int Id { get; set; }
	public string? Name { get; set; }
	public string? Room { get; set; }
	public string? Type { get; set; }
	public string? Status { get; set; }
	public int Value { get; set; }
}