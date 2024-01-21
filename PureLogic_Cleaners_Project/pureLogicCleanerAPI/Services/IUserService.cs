using pureLogicCleanerAPI.DTOs;
using pureLogicCleanerAPI.Models;

namespace pureLogicCleanerAPI.Services;

public interface IUserService
{
    Task<Users> RegisterUser(UserUpsert userDto);
    Users ValidateUser(UserForAuthenticationDto userForAuth, Users user);
    Task<string> CreateToken(Users user);
}