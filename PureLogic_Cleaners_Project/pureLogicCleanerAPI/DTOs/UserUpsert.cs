using System.ComponentModel.DataAnnotations;

namespace pureLogicCleanerAPI.DTOs;

public class UserUpsert
{
    public string? FirstName { get; init; }
    public string? LastName { get; init; }

    [Required(ErrorMessage = "Username is required")]
    public string? Username { get; init; }

    public string Password { get; set; }
    public string PasswordConfirm { get; set; }

    public string? Email { get; init; }
    public int Age { get; set; }
}
