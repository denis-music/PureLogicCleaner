using pureLogicCleanerAPI.DTOs;
using pureLogicCleanerAPI.Models;

namespace pureLogicCleanerAPI.Services;

public interface IUserService
{
    Task<List<UserDto?>> GetAll();
    Task<UserDto?> GetById(int id);
    Task RegisterUser(UserUpsert userDto);
    Task<UserUpsert> Update(int id, UserUpsert userDto);

    Task<User> ValidateUser(UserForAuthenticationDto userForAuth);
    Task<string> CreateToken(User user);
}