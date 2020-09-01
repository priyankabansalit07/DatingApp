using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUser(DataContext _context)
        {
            if (!_context.Users.Any()) //If users table is empty
            { //reading data from userseeddata.json and converting to list<user> and adding to users table in db
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var userList = JsonConvert.DeserializeObject<List<User>>(userData);

                foreach (var user in userList)
                {
                    byte[] pswdHash, pswdSalt;
                    CreatePasswordHash("password", out pswdHash, out pswdSalt);
                    user.PasswordHash = pswdHash;
                    user.PasswordSalt = pswdSalt;
                    user.Username = user.Username.ToLower();
                    _context.Users.Add(user);
                }
                _context.SaveChanges();

            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}