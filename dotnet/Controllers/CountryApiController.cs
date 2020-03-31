using Microsoft.AspNetCore.Authorization;
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
    [Route("api/countries")]
    [ApiController]
    public class CountryApiController : BaseApiController
    {
        private ICountryService _service = null;

        public CountryApiController(ICountryService service, ILogger<CountryApiController> logger) : base(logger)
        {
            _service = service;
        }
       
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<ItemResponse<List<Country>>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;

            try 
            {
                List<Country> list = _service.GetAll();
                if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<List<Country>> { Item = list };
                }
            }
            catch(ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            return StatusCode(code, response);
        }
    }
}
