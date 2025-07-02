Overview:
Nicatours is a tourist / taxi type business for large groups that require a 13 passanger van. We can pick the client up from anywhere in Nicaragua and drive them anywhere in the country. The van we are using is a 2013 Hyundai H1 Diesel motor. Since the business is in Nicaragua everything on the website needs to be written in Spanish. 

Architecture:
This application will be hosted in Vercel using postgres as the database. We will use Nextjs as the framework. Since we are using Nextjs the front end will be React. Include Tailwind and a scss compiler. This application will be built using SOLID principals. The app will be using Typescript as the language.

Design: 
Use White and Blue, the Nicaraguan flag colors as the main color pallet. Build all the designs so that it will be mobile first. Adapt the design for larger screen sizes. Include tourist type photos and hero images from common Nicaragua tourist sites. 

Login:
Build a login mechanism using a table in the postgres database that will store a username, password hash, and salt. Build an endpoint on the backend that will accept a username and password and then validate it using the proper cryptographic algorithms. If the password is valid generate a JWT that is valid for 48 hours and return it in the response to the front end. On the front end build a login page form that takes a username and password. It will call this endpoint. On a successful response it will set the JWT in localstorage. Upon any page refresh or redirect the app should validate that the JWT is present and valid. If not redirect the user back to the login page. 

Ride Price Calculator Page:
The purpose of this page is to help calculate the price to charge a client. The business rules of how this page will calculate the price is the following.
We will input the total kilometers driven by the user. 
We will input the current price of Diesel in Cordobas. 
Our vehicle has a hard coded value of 10.2 liters per kilometer as its fuel economy. 
Create a formuola that will calculate the cost of fuel based on these variables. 

Next we need to account for maintenance and repairs for the vehicle. To calculate the maintenance cost take the total fuel costs and multiple it by 20%. 

Next we will want to calculate our profit margin. This will be a percentage value that is inputed by the user. Values could range from 10% - 100%. Multiple this by the cost of fuel. 

Lastly add the fuel cost to the maintanence costs and the profit margin to get a grand total all in Cordobas. 

Build a web form that will build out this page. 