using AutoMapper;
using pureLogicCleanerAPI.DTOs;
using pureLogicCleanerAPI.Models;

namespace pureLogicCleanerAPI.Mapper;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<UserDto, User>().ReverseMap();
        CreateMap<User, UserForAuthenticationDto>().ReverseMap();
        CreateMap<UserUpsert, User>().ReverseMap();

    }
}
