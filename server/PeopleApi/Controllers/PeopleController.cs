using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PeopleApi {

    [Route("api/people")]
    public class PeopleController : Controller 
    {
        private AppContext _context;

        public PeopleController(AppContext context) {
            _context = context;
        }

        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<Person>> GetPeople() {
            return _context.People;
        }

        // TODO: Projections

        [HttpGet]
        [Route("{id}")]
        public async Task<Person>  GetPerson(Guid id) {

            
            /*
            TODO: Move this to MD file
            Normally there would be a response wrapper around all API responses.
            public class Response<T>
            {
                public Response();

                [Required]
                public bool Success { get; set; }
                public string ErrorNamespace { get; set; }
                public string ErrorCode { get; set; }
                public string ErrorMessage { get; set; }
                public string ErrorDetails { get; set; }
                public T Data { get; set; }
            }
            */

            // In cases of missing person, respond with no content (""). Normally
            // I'd throw an error.
            var person = _context.People.SingleOrDefault(p => p.Id == id);

            return person;
        }

        public class PostPersonPayload {

            // TODO: Many of these values need validation. IE age should be > 0 and a whole number
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string MiddleInitial {get; set;}
            public int Age {get; set;}
            public string HairColor {get; set;}
        }
        
        [HttpPost]
        [Route("")]
        public async Task<Person> PostPeople([FromBody]PostPersonPayload data) 
        {
            var person = new Person() {
                // Just going to assume all non-string properties are required
                Id = Guid.NewGuid(),
                FirstName = data.FirstName,
                LastName = data.LastName,
                MiddleInitial = data.MiddleInitial,
                Age = data.Age,
                HairColor = data.HairColor,
            };

            await _context.AddAsync(person);

            await _context.SaveChangesAsync();

            return person;
        }


        public class PutPersonPayload {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string MiddleInitial {get; set;}
            public int? Age {get; set;}
            public string HairColor {get; set;}
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<Person> PutPeople(Guid id, [FromBody]PutPersonPayload data)
        {
            // This will throw an error
            var person = _context.People.Single(p => p.Id == id);

            // When binding the body payload, the JSON parser interprets undefined as null.
            // Ideally, we would like undefined to be treated as 'do not update' while retaining the 
            // ability to set a value to null explicitly. IIRC that isn't possible currently.
            // This would be the ideal setup:
            // { "Age": 10 } > Age is set to new value
            // { "Age": null } > Age is set to null
            // { /* Age not included in JSON */ } > Age value is not touched
            // This is what we get:
            // { "Age": 10 } > Age is set to new value
            // { "Age": null } > Age is not touched
            // { /* Age not included in JSON */ } > Treated exactly the same as null.
            // 
            // It's possible that this has changed with System.Text.Json in Aspnet core 3.
            // https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-converters-how-to

            if(data.FirstName != null) { person.FirstName = data.FirstName; }
            if(data.LastName != null) { person.LastName = data.LastName; }
            if(data.MiddleInitial != null) { person.MiddleInitial = data.MiddleInitial; }
            if(data.Age.HasValue) { person.Age = data.Age.Value; }
            if(data.HairColor != null) { person.MiddleInitial = data.MiddleInitial; }


            await _context.SaveChangesAsync();
            return person;
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task DeletePerson(Guid id) {
            var person = _context.People.Single(p => p.Id == id);

            _context.People.Remove(person);

            await _context.SaveChangesAsync();
        }
    }
}
