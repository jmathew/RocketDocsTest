# Getting started

Make sure the following is installed before running:
* [Dotnet core SDK](https://dotnet.microsoft.com/download) version `3.1.102` or greater
* [Node](https://nodejs.org/en/download/current/) version `13.8.0` or greater
* [Yarn](https://yarnpkg.com/getting-started/install) version `1.22.0` or greater
* [Gatsby CLI](https://www.gatsbyjs.org/docs/quick-start/) version `2.10.4` or greater


First we start up the server side:
```
cd server/PeopleApi
dotnet ef database update
dotnet run
```

This should create the `people.db` file and start the server at `http://localhost:5000`.


Next we'll start up the website. Return to the root of the repo.

```
cd site/PeopleSite
yarn
gatsby develop
```

This should install all required node packages and start up the gatsby development server
at `http://localhost:8000`.

Now that everything is setup, you can navigate to `http://localhost:8000` and browse the site.

If it's there are no people all that will be visible is an 'Add new person' button and some 
sparse table headings.

# Testing
There are integration tests for the server side.

You can run them like so:
```
cd server/PeopleApiTests
dotnet test
```

# Caveats
* There is no validation on most fields. Server side and client side. 
* There are only integration tests not unit tests.
* HTTPS is not enabled server side.