using Microsoft.EntityFrameworkCore;
using pureLogicCleanerAPI.Models;

namespace pureLogicCleanerAPI.Context;

public class dbContext : DbContext
{
    public dbContext(DbContextOptions<dbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

}
