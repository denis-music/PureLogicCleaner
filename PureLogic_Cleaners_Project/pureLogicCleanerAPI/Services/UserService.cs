using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using pureLogicCleanerAPI.Context;
using pureLogicCleanerAPI.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using pureLogicCleanerAPI.Helper;
using pureLogicCleanerAPI.Models;

namespace pureLogicCleanerAPI.Services;

public class UserService : IUserService
{
    private readonly dbContext _dbContext;
    private  readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public UserService(dbContext dbContext, IMapper mapper, IConfiguration configuration)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public async Task<List<UserDto?>> GetAll()
    {
        var users = await _dbContext.Users.ToListAsync();

        if(users == null)
            throw new NullReferenceException($"Users list is empty.");

        return _mapper.Map<List<UserDto?>>(users);
    }

    public async Task<UserDto?> GetById(int id)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);

        if (user is null)
            throw new NullReferenceException($"User with Id={id} was null.");

        return _mapper.Map<UserDto?>(user);
    }

    public bool IsUsernameTaken(string username)
    {
        var users = _dbContext.Users.FirstOrDefault(x => x.Username == username);

        if (users == null)
            return false;

        return true;
    }

    public async Task RegisterUser(UserUpsert userDto)
    {
        if(userDto is null)
            throw new ArgumentNullException(nameof(userDto));

        var entity = _mapper.Map<Models.User>(userDto);

        if (userDto.Password != userDto.PasswordConfirm)
        {
            throw new Exception("Password and password confirm not matched !");
        }
        entity.PasswordSalt = HashGenerator.GenerateSalt();
        entity.PasswordHash = HashGenerator.GenerateHash(entity.PasswordSalt, userDto.Password);

        await _dbContext.Users.AddAsync(entity);

        await _dbContext.SaveChangesAsync();
    }

    public async Task<UserUpsert> Update(int id, UserUpsert userDto)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);

        if (user is null)
            throw new NullReferenceException($"User with Id={id} was null.");

        _dbContext.Users.Attach(user);
        _dbContext.Users.Update(user);
        _mapper.Map(userDto, user);

        await _dbContext.SaveChangesAsync();
        return _mapper.Map<UserUpsert>(user);
    }


    public async Task<User> ValidateUser(UserForAuthenticationDto userForAuth)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x =>x.Username == userForAuth.Username);

        if (user != null)
        {
            var newHash = HashGenerator.GenerateHash(user.PasswordSalt, userForAuth.Password);

            if (user.PasswordHash == newHash)
            {
                return user;
            }
        }
        return null;
    }

    // Create Token method
    public async Task<string> CreateToken(User user)
    {
        var signingCredentials = GetSigningCredentials();
        var claims = await GetClaims(user);
        var tokenOptions = GenerateTokenOptions(signingCredentials, claims);

        return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
    }

    private SigningCredentials GetSigningCredentials()
    {
        var conf = _configuration.GetSection("JwtSettings:Secret").ToString();

        var key = Encoding.UTF8.GetBytes(conf);
        var secret = new SymmetricSecurityKey(key);

        return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
    }

    // Creates a list of claims with the user
    private async Task<List<Claim>> GetClaims(User user)
    {
        var claims = new List<Claim>
        {
            new Claim("Firstname", user.FirstName),
            new Claim("Lastname", user.LastName),
            new Claim("Username", user.Username),
            new Claim("Email", user.Email)
        };

        return claims;
    }

    // Creates an object of the JwtSecurityToken type with all of the required options
    private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");

        var tokenOptions = new JwtSecurityToken
        (
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["expires"])),
            signingCredentials: signingCredentials
        );

        return tokenOptions;
    }
}