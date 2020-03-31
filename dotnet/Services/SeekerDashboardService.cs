using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class SeekerDashboardService : ISeekerDashboardService
    {
        IDataProvider _SeekerDashboardService = null;

        public SeekerDashboardService(IDataProvider SeekerDashboardService)
        {
            _SeekerDashboardService = SeekerDashboardService;
        }

        public SeekerDashboard GetById(int id)
        {
            SeekerDashboard seekerDashboard = null;
            string procName = "[dbo].[SeekerDashboard_CountByUserId]";
            _SeekerDashboardService.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                seekerDashboard = new SeekerDashboard();
                int index = 0;

                seekerDashboard.JobsAppliedForCount = reader.GetSafeInt32(index++);
                seekerDashboard.TotalJobsCount = reader.GetSafeInt32(index++);
                seekerDashboard.EventCount = reader.GetSafeInt32(index++);
                seekerDashboard.OrgFollowedCount = reader.GetSafeInt32(index++);

            });
            return seekerDashboard;
        }
    }
}
