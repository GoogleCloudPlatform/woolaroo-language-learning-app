![alt text](public/logo2200.png)

## Project Woolaroo - Exploring Indigenous language through photos.

> ###  “A picture is worth a thousand words.”
> ### - Old english adage, commonly attributed to copywriter Fred R. Barnard


Of the 7,000 languages spoken around the globe, 2,680 Indigenous languages - more than one third - are in danger of disappearing.

To help raise awareness and encourage people to explore indigenous languages, we developed Project Barnard - an open source photo-translation platform that’s powered by machine learning and image recognition.

Originally launched in New Zealand, as ‘Kupu’, in collaboration with Spark and the te aka Maori dictionary, this technology is now openly available for linguists and indigenous language organisations to create their own translation apps.

Our hope is that by enabling more people to share their language, users will be able to explore the indigenous languages around them, and ultimately be inspired to engage with them on a deeper level.

## To deploy
- Update src/config.json with the config of the project you are deploying (this can be obtained manually from the Firebase console).
- `npm run build`
- `firebase deploy` (`-m "release message"`)

## Running firebase functions locally

First follow instructions [here](https://firebase.google.com/docs/functions/local-emulator#set_up_admin_credentials_optional) to set up admin credentials.

Then,
- `cd functions; npm install; cd ..`
- `(sudo) npm install -g firebase-tools`
- `firebase login` OR `firebase login --reauth` (if your auth credentials have expired)
- `npm run serve_functions`

(hint: if you see "Error getting translations: Error: Getting metadata from plugin failed with error: invalid_grant", you may have to `gcloud auth application-default login`, then `gcloud components update`)

## Running React App locally
- `npm install` if necessary
- `npm run start`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
