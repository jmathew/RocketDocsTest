using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace PeopleApi {
    public class AppContext: DbContext
    {
        public AppContext(DbContextOptions<AppContext> options) : base(options) {}

        public DbSet<Person> People {get; set;}

        // TODO: Abstract connection string into start up.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            if(options.IsConfigured) { return; }

            options.UseSqlite("Data Source=people.db");
        }
    }

    // TODO: Get information on if any of these are required.
    public class Person {
        public Guid Id { get; set;}
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleInitial {get; set;}
        public string Email {get; set;}
        public int Age {get; set;}
        public string HairColor {get; set;}
    }
}