using System.Linq;
using AutoMapper;
using DatingApp.API.DTO;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfile : Profile
    {
        //This is to tell automapper about the model it need to support
        public AutoMapperProfile()
        {
            CreateMap<User, UsersListDTO>()
            .ForMember(dest => dest.PhotoUrl,               //For member are used to map individual property by modifying
            opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age,
            opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
            ;


            CreateMap<User, UserDetailsDTO>()
            .ForMember(dest => dest.PhotoUrl,
            opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age,
            opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
            ;

            CreateMap<Photo,PhotoDTO>();
            CreateMap<UserUpdateDTO,User>(); //Here source is DTO because we are sending updateDto to update user.

            CreateMap<PhotoForCreationDto,Photo>();
            CreateMap<Photo,PhotoToReturnDTO>();

        }
    }
}