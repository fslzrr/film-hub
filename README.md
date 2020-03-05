# Film Hub

This project is a progressive web app in react.js with serverless functionalities using firebase services.

### Development

#### Global Dependencies

1. Node [download](https://nodejs.org/en/download/)
2. Yarn [download](https://classic.yarnpkg.com/en/docs/install)
3. Firebase tools [download](https://firebase.google.com/docs/cli)

#### Local

1. Install firebase functions dependencies `cd functions && yarn install && cd ..`.
2. Emulate firebase functions locally `firebase emulators:start --only functions`.
3. Open new terminal tab.
4. Add .env file.
5. Install react app dependencies `yarn install`.
6. Start react development server `yarn start`.

#### Deployment

1. Build react app `yarn build`.
2. Deploy firebase functions and hosting `firebase deploy`.
