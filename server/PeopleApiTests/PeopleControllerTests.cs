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

        public class PersonResponse {
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
            var json = JsonSerializer.Deserialize<PersonResponse>(content);

            // Properties will be returned camelCase by default
            // https://github.com/dotnet/runtime/issues/31094
            json.id.ShouldNotBeNull();
            json.firstName.ShouldBe(payload.FirstName);
            json.lastName.ShouldBe(payload.LastName);
            json.middleInitial.ShouldBe(payload.MiddleInitial);
            json.age.ShouldBe(payload.Age);
            json.hairColor.ShouldBe(payload.HairColor);
        }

        [Fact]
        public async Task GetPerson() 
        {
            var client = _factory.CreateClient();
            var person = await CreatePersonAsync(client, "Get", "Person", "T", 22, "Electric blue");
            person.id.ShouldNotBeNull();

            var response = await client.GetAsync($"/api/people/{person.id}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<PersonResponse>(content);

            json.ShouldNotBeNull();
            json.id.ShouldBe(person.id);
        }

        [Fact]
        public async Task UpdatePerson() 
        {
            var client = _factory.CreateClient();
            var person = await CreatePersonAsync(client, "Get", "Person", "T", 22, "Electric blue");
            person.id.ShouldNotBeNull();
            person.firstName.ShouldBe("Get");
            person.lastName.ShouldBe("Person");
            person.middleInitial.ShouldBe("T");
            person.age.ShouldBe(22);
            person.hairColor.ShouldBe("Electric blue");

            // Update everything except the age and hair color
            var payload = new {
                FirstName = "Bernard",
                LastName = "Cooper",
                MiddleInitial = "U",
            };
            var serialized = JsonSerializer.Serialize(payload);

            var response = await client.PutAsync($"/api/people/{person.id}", new StringContent(serialized, Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<PersonResponse>(content);

            json.id.ShouldNotBeNull();
            json.id.ShouldBe(person.id);
            json.firstName.ShouldBe(payload.FirstName);
            json.lastName.ShouldBe(payload.LastName);
            json.middleInitial.ShouldBe(payload.MiddleInitial);
        }

        [Fact]
        public async Task DeletePerson() 
        {
            var client = _factory.CreateClient();
            var person = await CreatePersonAsync(client, "Get", "Person", "T", 22, "Electric blue");
            person.id.ShouldNotBeNull();

            var deleteResponse = await client.DeleteAsync($"/api/people/{person.id}");
            deleteResponse.EnsureSuccessStatusCode();

            // Attempt to get the person to prove it has actually been deleteed
            var getResponse = await client.GetAsync($"/api/people/{person.id}");
            getResponse.EnsureSuccessStatusCode();

            var getResponseContent = await getResponse.Content.ReadAsStringAsync();
            getResponseContent.ShouldBe("");
        }

        public async Task ListPeople() {
            var client = _factory.CreateClient();
            var person1 = await CreatePersonAsync(client, "Abe", "Lincoln", "?", 22, "Sandlewood brown");
            person1.id.ShouldNotBeNull();

            var person2 = await CreatePersonAsync(client, "Liz", "Lemon", "?", 22, "Brown");
            person2.id.ShouldNotBeNull();

            var response = await client.GetAsync("/api/people");
            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<List<PersonResponse>>(content);

            json.ShouldNotBeEmpty();
            json.Count.ShouldBe(2);
        }

        private async Task<PersonResponse> GetPersonAsync(HttpClient client, Guid id) {
            var response = await client.GetAsync($"/api/people/{id}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<PersonResponse>(content);

            return json;
        }

        private async Task<PersonResponse> CreatePersonAsync(HttpClient client, string first, string last, string initial, int age, string hair) {
            var payload = new {
                FirstName = first,
                LastName = last,
                MiddleInitial = initial,
                Age = age,
                HairColor = hair
            };
            var serialized = JsonSerializer.Serialize(payload);

            var response = await client.PostAsync("/api/people", new StringContent(serialized, Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<PersonResponse>(content);

            return json;
        } 
    }
}