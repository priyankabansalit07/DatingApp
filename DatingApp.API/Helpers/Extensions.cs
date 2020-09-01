using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        //Below are the extension methods so we are adding "this" in parameters
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static int CalculateAge(this DateTime DOB)
        {
            var age = DateTime.Today.Year - DOB.Year;

            if (DOB.AddYears(age) > DateTime.Today) //Means birthday is about to come so we are decreamenting a year
                return age--;
            else
                return age;
        }

    }
}