using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/seeker")]
    [ApiController]
    public class SeekerDashboardApiController : BaseApiController
    {
        private ISeekerDashboardService _service = null;
        private IAuthenticationService<int> _authService = null;

        public SeekerDashboardApiController(ISeekerDashboardService service
            , ILogger<SeekerDashboardApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}/dashboard")]
        public ActionResult<ItemResponse<SeekerDashboard>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                SeekerDashboard seeker = _service.GetById(id);

                if (seeker == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<SeekerDashboard> { Item = seeker };
                }
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            return StatusCode(code, response);
        }
    }

}

