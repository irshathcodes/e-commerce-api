
# E-Commerce Api

Basic E-Commerce Api created using Express js, MongoDB with mongoose library.



## Documentation

[Documentation](https://ecommercenode-api.herokuapp.com/api-docs/)



### To run this project

```bash
  npm install
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI` - mongo db connection string

`EMAIL_USERNAME`
`EMAIL_PASSWORD` - your smtp server credentials or free ethereal account credentials for testing

`JWT_SECRET` - json web token private key

`COOKIE_SECRET` - secret key for signed cookie

`STRIPE_SECRET` - stripe api key for payment

`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET` - cloudinary credentials for storing product images.

`CLIENT_DOMAIN` - 
client domain url for sending verification url and stripe success or failure url


`NODE_ENV=production` - set it to production to enable http only cookie

