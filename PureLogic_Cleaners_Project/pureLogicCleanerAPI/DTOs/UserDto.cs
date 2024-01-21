using System.ComponentModel.DataAnnotations;

namespace pureLogicCleanerAPI.DTOs;

public class UserDto
{
    public int Id { get; set; }

    public string? FirstName { get; init; }
    public string? LastName { get; init; }

    [Required(ErrorMessage = "Username is required")]
    public string? Username { get; init; }

    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; init; }
    public string? Email { get; init; }
    public int Age { get; set; }
}
