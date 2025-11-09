## Instuctions to setup docker server localy and pushing to Dockerhub
## Create the docker iamge with the following steps:
#     docker build -t hihassan1998/auth-server-service:1.0 .
## Check docker image created: 
#     docker images
## Test run server image
#     docker run -d hihassan1998/auth-server-service:1.0 
## PUsh to dockerhub after everthing checks out
#     docker push

# Use official Node.js image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the server folder into /app
COPY . .

# Expose the port
EXPOSE 1300

# Command to run the server at container start
CMD ["node", "app.js"]
