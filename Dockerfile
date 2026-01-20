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
EXPOSE 3000

# Command to run the server at container start
# un comment and fix the commands for the deployment phase
# CMD ["node", "app.js"]
CMD ["npm", "run", "dev"]