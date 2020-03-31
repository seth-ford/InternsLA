using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services
{
    public interface ICountryService
    {
        List<Country> GetAll();
    }
}
