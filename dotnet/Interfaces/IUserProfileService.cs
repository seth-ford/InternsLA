using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.UserProfile;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services
{
    public interface IUserProfileService
    {
        UserProfile Get(int Id);
        Login Check(string email);
        Paged<UserProfile> Paginate(int pageIndex, int pageSize);
        int Add(UserProfileAddRequest model, int userId);
        int AddProfile(UserProfileAddRequest_V2 model, int userId);
        void Update(UserProfileUpdateRequest model);
        void Delete(int id);
    }
}

