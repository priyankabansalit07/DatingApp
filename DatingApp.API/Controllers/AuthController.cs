using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;


        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO userDTO)
        {
            userDTO.Username = userDTO.Username.ToLower();
            if (await _repo.UserExists(userDTO.Username))
            {
                return BadRequest("Username already exists");
            }

            // var userToCreate = new User
            // {
            //     Username = userDTO.Username
            // };

            var userToCreate = _mapper.Map<User>(userDTO);

            var createdUser = await _repo.Register(userToCreate, userDTO.Password);

            var userToReturn = _mapper.Map<UserDetailsDTO>(createdUser);

            //return StatusCode(201);

            //This will go to usersController and method =GetUser to return user.
            //Returning userToReturn= UserDetailDto because user Model have password information and we do not want to send that
            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id }, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDTO userForLoginDTO)
        {

            var dbUser = await _repo.Login(userForLoginDTO.Username.ToLower(), userForLoginDTO.Password);

            if (dbUser == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, dbUser.Id.ToString()),
                new Claim(ClaimTypes.Name, userForLoginDTO.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);


            var userdata = _mapper.Map<UsersListDTO>(dbUser);
            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                userdata
            });
        }
    }
}