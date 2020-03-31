using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Education;
using Sabio.Models.Requests.Experience;
using Sabio.Models.Requests.Files;
using Sabio.Models.Requests.Seeker;
using Sabio.Models.Requests.Skills;
using Sabio.Models.Requests.UserProfile;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class UserProfileService : IUserProfileService
    {
        IDataProvider _data = null;
        public UserProfileService(IDataProvider data)
        {
            _data = data;
        }
        public UserProfile Get(int UserId)
        {
            string procName = "[dbo].[UserProfiles_Select_ById_V2]";
            UserProfile user = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@UserId", UserId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                user = MapUserProfile(reader);
            });
            return user;
        }

        public Login Check(string email)
        {
            Login login = new Login(false);
            string procName = "[dbo].[Users_SelectRoles_ByEmail]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Email", email);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int index = 0;
                login.Id = reader.GetSafeInt32(index++);
                if (reader.GetSafeInt32(index++) != 0)
                {
                    login.createdProfile = true;
                }
                string temp = reader.GetSafeString(index++);
                if (temp != null)
                {
                    login.Roles = JsonConvert.DeserializeObject<List<Role>>(temp);
                }
            });
            return login;
        }
        public Paged<UserProfile> Paginate(int pageIndex, int pageSize)
        {
            Paged<UserProfile> pagedResult = null;
            List<UserProfile> result = null;
            int totalCount = 0;
            string procName = "[dbo].[UserProfiles_SelectAllPaginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                UserProfile user = MapUserProfile(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(8);
                }

                if (result == null)
                {
                    result = new List<UserProfile>();
                }
                result.Add(user);
            }
        );
            if (result != null)
            {
                pagedResult = new Paged<UserProfile>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        public int Add(UserProfileAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[UserProfiles_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                UserProfileParamsCollection(model, col);
                col.AddWithValue("@UserId", userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oldId = returnCollection["@id"].Value;
                int.TryParse(oldId.ToString(), out id);
            });
            return id;
        }
        public int AddProfile(UserProfileAddRequest_V2 model, int userId)
        {
            int id = 0;
            string ProcName = "[dbo].[UserProfile_Insert_Wizard]";
            _data.ExecuteNonQuery(ProcName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                DataTable dtSkills = AddMultipleSkills(model.Seeker.Skills);
                DataTable dtFiles = AddMultipleFiles(model.Seeker.Files);
                DataTable dtEducation = AddMultipleEducationDetails(model.EducationDetails);
                DataTable dtExperience = AddMultipleExperienceDetails(model.ExperienceDetails);
                DataTable dtSeeker = AddSeeker(model.Seeker);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
                col.AddWithValue("@UserId", userId);
                UserProfileMapper(model, col, dtSkills, dtFiles, dtEducation, dtExperience, dtSeeker);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oldId = returnCollection["@id"].Value;
                int.TryParse(oldId.ToString(), out id);
            });
            return id;
        }

        public void Update(UserProfileUpdateRequest model)
        {
            string procName = "[dbo].[UserProfiles_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                UserProfileParamsCollection(model, col);
                col.AddWithValue("@UserId", model.UserId);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[UserProfiles_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }
        private void UserProfileParamsCollection(UserProfileAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@FirstName", model.FirstName);
            col.AddWithValue("@LastName", model.LastName);
            col.AddWithValue("@Mi", model.Mi);
            col.AddWithValue("@AvatarUrl", model.AvatarUrl);
        }
        private UserProfile MapUserProfile(IDataReader reader)
        {
            UserProfile user = new UserProfile();
            int startingIndex = 0;

            user.Id = reader.GetSafeInt32(startingIndex++);
            user.UserId = reader.GetSafeInt32(startingIndex++);
            user.FirstName = reader.GetSafeString(startingIndex++);
            user.LastName = reader.GetSafeString(startingIndex++);
            user.Mi = reader.GetSafeString(startingIndex++);
            user.AvatarUrl = reader.GetSafeString(startingIndex++);
            user.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            user.DateModified = reader.GetSafeUtcDateTime(startingIndex);
            return user;
        }
        private DataTable AddMultipleSkills(List<SkillTypeAddRequest> skills)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("SkillId", typeof(int));
            dt.Columns.Add("SkillLevelId", typeof(int));

            foreach (var row in skills)
            {
                DataRow dr = dt.NewRow();
                dr[0] = row.SkillId;
                dr[1] = row.SkillLevelId;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private DataTable AddMultipleFiles(List<FileAddRequest> files)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Url", typeof(string));
            dt.Columns.Add("FileTypeId", typeof(int));
            dt.Columns.Add("CreatedBy", typeof(int));

            foreach (var file in files)
            {
                DataRow dr = dt.NewRow();
                dr[0] = file.Url;
                dr[1] = file.FileTypeId;
                dr[2] = file.CreatedBy;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private DataTable AddMultipleEducationDetails(List<EducationAddRequest> educationDetails)
        {
            DataTable dt = new DataTable();
       
            dt.Columns.Add("CertificateTypeId", typeof(int));
            dt.Columns.Add("Major", typeof(string));
            dt.Columns.Add("InstituteName", typeof(string));
            dt.Columns.Add("StartDate", typeof(DateTime));
            dt.Columns.Add("EndDate", typeof(DateTime));
            dt.Columns.Add("GPA", typeof(decimal));
            dt.Columns.Add("Percentage", typeof(decimal));

            foreach (var ed in educationDetails)
            {
                DataRow dr = dt.NewRow();
                dr[0] = ed.CertificateTypeId;
                dr[1] = ed.Major;
                dr[2] = ed.InstituteName;
                dr[3] = ed.StartDate;
                dr[4] = ed.EndDate;
                dr[5] = ed.GPA.HasValue;
                dr[6] = ed.Percentage.HasValue;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        private DataTable AddMultipleExperienceDetails(List<ExperienceAddRequest> experienceDetails)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("IsCurrent", typeof(bool));
            dt.Columns.Add("StartDate", typeof(DateTime));
            dt.Columns.Add("EndDate", typeof(DateTime));
            dt.Columns.Add("JobTitle", typeof(string));
            dt.Columns.Add("CompanyName", typeof(string));
            dt.Columns.Add("City", typeof(string));
            dt.Columns.Add("State", typeof(string));
            dt.Columns.Add("Country", typeof(string));
            dt.Columns.Add("Description", typeof(string));

            foreach (var ex in experienceDetails)
            {
                DataRow dr = dt.NewRow();
                dr[0] = ex.IsCurrent;
                dr[1] = ex.StartDate;
                dr[2] = ex.EndDate;
                dr[3] = ex.JobTitle;
                dr[4] = ex.CompanyName;
                dr[5] = ex.City;
                dr[6] = ex.State;
                dr[7] = ex.Country;
                dr[8] = ex.Description;
                dt.Rows.Add(dr);

            }
            return dt;
        }
        private DataTable AddSeeker(SeekerProfileAddRequest seeker)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("IsSearchable", typeof(bool));
            dt.Columns.Add("HasActiveEmailNotification", typeof(bool));
            dt.Columns.Add("CurrentSalary", typeof(decimal));
            dt.Columns.Add("Currency", typeof(string));

            DataRow dr = dt.NewRow();
            dr[0] = seeker.IsSearchable;
            dr[1] = seeker.HasActiveEmailNotification;
            dr[2] = seeker.CurrentSalary.HasValue;
            dr[3] = seeker.Currency;
            dt.Rows.Add(dr);
            return dt;
        }
        private static void UserProfileMapper(UserProfileAddRequest_V2 model, SqlParameterCollection col, DataTable dtSkills, DataTable dtFiles, DataTable dtEducation, DataTable dtExperience, DataTable dtSeeker)
        {
            col.AddWithValue("@FirstName", model.FirstName);
            col.AddWithValue("@LastName", model.LastName);
            col.AddWithValue("@Mi", model.Mi);
            col.AddWithValue("@AvatarUrl", model.AvatarUrl);
            col.AddWithValue("@Skills", dtSkills);
            col.AddWithValue("@Files", dtFiles);
            col.AddWithValue("@Education", dtEducation);
            col.AddWithValue("@Experience", dtExperience);
            col.AddWithValue("@Seeker", dtSeeker);
        }
    }
}
