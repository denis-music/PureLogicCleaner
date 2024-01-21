namespace pureLogicCleanerAPI.Models;

public class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PasswordSalt { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Adrress { get; set; } = string.Empty;
    public int Age { get; set; }

    public int SubscriptionId { get; set; }

    // need to add Subscription class to have connection between tables
    //public Subscription Subscription { get; set; }
    public DateTime SubscriptionDateBought { get; set; }
}