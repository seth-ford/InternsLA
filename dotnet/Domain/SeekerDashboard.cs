using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class SeekerDashboard
    {
        public int JobsAppliedForCount { get; set; }
        public int TotalJobsCount { get; set; }
        public int EventCount { get; set; }
        public int OrgFollowedCount { get; set; }
    }
}
