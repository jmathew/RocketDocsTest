using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;


namespace PeopleApi {

    [Route("api")]
    public class PeopleController : Controller {

        [HttpGet]
        [Route("")]
        public async Task<string> Hello() {
            return "Hello";
        }
    }
}
