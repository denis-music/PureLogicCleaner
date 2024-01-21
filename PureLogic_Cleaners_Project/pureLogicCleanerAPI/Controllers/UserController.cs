using Microsoft.AspNetCore.Mvc;
using pureLogicCleanerAPI.DTOs;
using pureLogicCleanerAPI.Services;

namespace pureLogicCleanerAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService ?? throw new ArgumentNullException(nameof(userService));
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        return Ok(await _userService.GetAll());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        return Ok(await _userService.GetById(id));
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser([FromBody] UserUpsert userDto)
    {
        await _userService.RegisterUser(userDto);

        return Ok();
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpsert userDto)
    {
        await _userService.Update(id, userDto);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto userForAuthenticationDto)
    {
        var user = await _userService.ValidateUser(userForAuthenticationDto);

        if(user is null)
            return Unauthorized();

        return Ok(new
            {
                token = await _userService.CreateToken(user)
            }
        );
    }
}
