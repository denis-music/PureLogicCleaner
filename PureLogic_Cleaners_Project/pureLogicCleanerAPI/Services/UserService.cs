using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using pureLogicCleanerAPI.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using pureLogicCleanerAPI.Helper;
using pureLogicCleanerAPI.Models;

namespace pureLogicCleanerAPI.Services;

public class UserService(IMapper mapper, IConfiguration configuration) : IUserService
{
    private  readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    private readonly IConfiguration _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

    //public bool IsUsernameTaken(string username)
    //{
    //    var users = _dbContext.Users.FirstOrDefault(x => x.Username == username);

    //    if (users == null)
    //        return false;

    //    return true;
    //}

    public async Task<Users> RegisterUser(UserUpsert userDto)
    {
        if(userDto is null)
            throw new ArgumentNullException(nameof(userDto));

        var entity = _mapper.Map<Users>(userDto);

        if (userDto.Password != userDto.PasswordConfirm)
        {
            throw new Exception("Password and password confirm not matched !");
        }
        entity.PasswordSalt = HashGenerator.GenerateSalt();
        entity.PasswordHash = HashGenerator.GenerateHash(entity.PasswordSalt, userDto.Password);

        return entity;
    }

    public Users ValidateUser(UserForAuthenticationDto userForAuth, Users user)
    {
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
    public async Task<string> CreateToken(Users user)
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
    private async Task<List<Claim>> GetClaims(Users user)
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