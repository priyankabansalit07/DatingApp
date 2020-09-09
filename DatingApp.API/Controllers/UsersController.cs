using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();

            //Mapping UserListDTO to User to hide sensitive info like passwords etc.
            var userList = _mapper.Map<IEnumerable<UsersListDTO>>(users);

            return Ok(userList);
        }

        [HttpGet("{id}",Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            //Mapping UserDetailsDTO to User to hide sensitive info like passwords etc.
            var userDetail = _mapper.Map<UserDetailsDTO>(user);

            return Ok(userDetail);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO dto)
        {

            // If id for which profile is updating does not match the id in token then unauthorized access
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userdb = await _repo.GetUser(id);
            _mapper.Map(dto, userdb);

            if (await _repo.SaveAll())
                return NoContent();  //Changes saved so returning nothing


            throw new Exception($"Updating profile with {id} failed on save"); //if not saved then throw exception
        }
    }
}