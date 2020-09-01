using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photo")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotoController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(_cloudinaryConfig.Value.CloudName, _cloudinaryConfig.Value.ApiKey, _cloudinaryConfig.Value.ApiSecret);

            _cloudinary = new Cloudinary(acc);

        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoToReturnDTO>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDto pfcdto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userdb = await _repo.GetUser(userId);

            var file = pfcdto.File;
            var uploadresult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadresult = _cloudinary.Upload(uploadParams);
                }
            }

            pfcdto.Url = uploadresult.Url.ToString();
            pfcdto.PublicId = uploadresult.PublicId;

            var photo = _mapper.Map<Photo>(pfcdto);

            if (!userdb.Photos.Any(x => x.IsMain))
                photo.IsMain = true;

            userdb.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoToReturnDTO>(photo);
                return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Photos.Any(x => x.Id != id))
                return Unauthorized();

            var currentPhoto = await _repo.GetPhoto(id);

            if (currentPhoto.IsMain)
                return BadRequest("This photo is already your display pic");

            var mainPhotoForUser = await _repo.GetMainPhotoForUser(userId);
            mainPhotoForUser.IsMain = false;

            currentPhoto.IsMain = true;
            if (await _repo.SaveAll())
                return NoContent();
            else
                return BadRequest("Photo could not be changed to main");

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Photos.Any(x => x.Id != id))
                return Unauthorized();

            var currentPhoto = await _repo.GetPhoto(id);

            if (currentPhoto.IsMain)
                return BadRequest("You cannot delete your main photo");

            if (currentPhoto.PublicId != null)
            {
                //delete from cloudinary

                var deleteParams = new DeletionParams(currentPhoto.PublicId);

                var result = _cloudinary.Destroy(deleteParams);
                if (result.Result == "ok")
                {
                    _repo.Delete(currentPhoto);
                }
                else return BadRequest("Something went wrong while deleting photo from cloudinary");
            }
            else
            {
                _repo.Delete(currentPhoto);
            }


            if (await _repo.SaveAll())
                return Ok();
            else return BadRequest("Something went wrong while deleting photo");
        }

    }
}