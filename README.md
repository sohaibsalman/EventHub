# EventHub

A project developed in .NET Core, React and MobX

Repository for practicing the material thought in **Complete guide to building an app with .Net Core and React** course at Udemy by **Neil Cummings**. [Udemy Course Link](https://www.udemy.com/course/complete-guide-to-building-an-app-with-net-core-and-react/)

The project follows Clean Architecture for .NET Core and uses CQRs and Mediator Pattern

## Tools & Technologies used
- .NET Core for backend
- React JS from frontend
- MobX for state management
- Entity Framework Core for Database ORM
- SQlite for database

## Running the Project
These instructions will give you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You need the following tools to be install before getting started:

 - Node JS - [download here](https://nodejs.org/en/download/)
 - .NET Core - [download here](https://dotnet.microsoft.com/download/dotnet/)


### Setup on local machine
 1.  Clone the repository
```
git clone https://github.com/sohaibsalman/EventHub.git
```
2. Open terminal and move to the API/ directory to start the backend api
```
cd API/
dotnet restore
dotnet run
```
3. Open terminal and move to the client-app/ directory to start frontend
```
cd client-app/
npm install
npm start
```
