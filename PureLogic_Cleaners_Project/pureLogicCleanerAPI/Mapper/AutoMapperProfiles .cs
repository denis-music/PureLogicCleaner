using AutoMapper;
using pureLogicCleanerAPI.DTOs;
using pureLogicCleanerAPI.Models;

namespace pureLogicCleanerAPI.Mapper;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<UserDto, Users>().ReverseMap();
        CreateMap<Users, UserForAuthenticationDto>().ReverseMap();
        CreateMap<UserUpsert, Users>().ReverseMap();
        CreateMap<UsersVM, Users>().ReverseMap();

    }
}
