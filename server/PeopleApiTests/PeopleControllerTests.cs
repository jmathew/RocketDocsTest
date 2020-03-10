using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using PeopleApi;
using Shouldly;
using Xunit;

namespace PeopleApiTests {

    public class PeopleControllerTests :IClassFixture<CustomWebApplicationFactory<PeopleApi.Startup>> 
    {

        private readonly CustomWebApplicationFactory<PeopleApi.Startup> _factory;

        public PeopleControllerTests(CustomWebApplicationFactory<PeopleApi.Startup> factory) 
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/people")]
        public async Task GetEndpointsReturnOk(string url)
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync(url);

            // TODO: Set up db context for tests.
            response.EnsureSuccessStatusCode();
        }

        public class PostPersonResponse {
            public Guid id { get; set;}
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string middleInitial {get; set;}
            public int age {get; set;}
            public string hairColor {get; set;}
        }

        [Fact]
        public async Task CreatePerson() 
        {
            var client = _factory.CreateClient();

            var payload = new {
                FirstName = "Timothy",
                LastName = "Buckwheat",
                MiddleInitial = "P",
                Age = 98,
                HairColor = "Steel Panther"
            };
            var serialized = JsonSerializer.Serialize(payload);

            var response = await client.PostAsync("/api/people", new StringContent(serialized, Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<PostPersonResponse>(content);

            // Properties will be returned camelCase by default
            // https://github.com/dotnet/runtime/issues/31094
            json.id.ShouldNotBeNull();
            json.firstName.ShouldBe(payload.FirstName);
            json.lastName.ShouldBe(payload.LastName);
            json.middleInitial.ShouldBe(payload.MiddleInitial);
            json.age.ShouldBe(payload.Age);
            json.hairColor.ShouldBe(payload.HairColor);
        }

        //[Fact]
        public async Task GetPerson() 
        {

        }

        //[Fact]
        public async Task UpdatePerson() 
        {

        }

        //[Fact]
        public async Task DeletePerson() 
        {

        }
    }
}