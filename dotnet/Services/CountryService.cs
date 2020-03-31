using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Sabio.Services
{
    public class CountryService : ICountryService
    {
        IDataProvider _data = null;

        public CountryService(IDataProvider data)
        {
            _data = data;
        }

        public List<Country> GetAll()
        {
            List<Country> list = null;
            string procName = "[dbo].[Countries_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                Country aCountry = null;
                aCountry = addCountryParams(reader);

                if (list == null)
                {
                    list = new List<Country>();
                }
                if (aCountry != null)
                {
                    list.Add(aCountry);
                }
            });
            return list;
        }

        private static Country addCountryParams(IDataReader reader)
        {
            Country aCountry = new Country();

            int startingIndex = 0;
            aCountry.Id = reader.GetSafeInt32(startingIndex++);
            aCountry.Name = reader.GetSafeString(startingIndex++);
            aCountry.Code = reader.GetSafeString(startingIndex);

            return aCountry;
        }
    }
}
