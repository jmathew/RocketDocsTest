using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace PeopleApiTests {

    public class PeopleControllerTests :IClassFixture<WebApplicationFactory<PeopleApi.Startup>> 
    {

        private readonly WebApplicationFactory<PeopleApi.Startup> _factory;

        public PeopleControllerTests(WebApplicationFactory<PeopleApi.Startup> factory) 
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/people")]
        public async Task GetEndpointsReturnOk(string url)
        {
            
        }
    }
}