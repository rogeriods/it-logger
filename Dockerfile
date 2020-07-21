# pull official base image
FROM node:12.13-alpine

# set working directory
WORKDIR /usr/app

# install app dependencies
COPY package.json .
RUN npm install --silent

# add app
COPY . .

# start app
# CMD [ "npm", "start" ]