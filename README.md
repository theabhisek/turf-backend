
# 🏏️Turf Booking ⚽️

Turf playground are used to play various sports like football, cricket. People enjoy playing on the turf, it has vibrant environment and very safe to play. Many school teams and clubs prefer turf playground for practice and training purpose. Sometime it becomes difficult to book turf playground because of timing issue or the slot getting booked previously. This sports ground booking website is proposed for booking the turf in an easy and efficient way.


## Deployment 🚀️

To deploy this project craete **Dockerfile** and **docker-compose.yml**

#### Dockerfile
    FROM node:alpine
    WORKDIR /usr/src/app
    COPY package*.json .
    RUN npm ci
    COPY . .
    CMD [ "npm", "run", "dev" ]

#### docker-compose.yml

    version: '3.9'
    services:
      #Mongo services:

      mongo-db:
        container_name: mongo-db
        image: mongo:latest
        restart: always
        ports:
          - 27017:27017
        volumes: 
          - mongo-db:/data/db
      # Node api services 
      api:
        build: .
        ports:
          - 3000:3000
        environment:
          PORT: 3000
          MONGODB_URI: mongodb://mongo-db:27017
          DB_NAME: turf
          NAME: app_user
        depends_on: 
          - mongo-db

    volumes:
      mongo-db: {}

## Environment Variables ⚙️

To run this project, you will need to add the following environment variables to your .env file

#### For production 

`key_id`=razorpay public key

`key_secret`= razorpay secret key

`PORT`

`MONGO_URL`

`JWT_SECRET_KEY`

`DB_NAME`

`NAME`

#### For locally


`PORT`

`JWT_SECRET_KEY`

`url=mongodb://localhost:27017/turf` 

`username `

`password`

`dbName` 

`key_id` = razorpay public key

`key_secret` = razorpay secret key

## Run Locally

Clone the project

```bash
  git clone https://github.com/CubexO/Turf-Backend.git
```

Go to the project directory

```bash
  cd Turf-backend/backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Support

For support, email abhishek.chouhan@cubexo.io
