using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Domain
{
    public class UserProfile : User
    {
       public int UserId { get; set; }
       public string Mi { get; set; }
       public string AvatarUrl { get; set; }
       public DateTime DateCreated { get; set; }
       public DateTime DateModified { get; set; }
    }
}
