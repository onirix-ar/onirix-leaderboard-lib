# Onirix Leaderboard

![Version](https://img.shields.io/badge/version-1.0.4-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://docs.onirix.com/tutorials/onirix-leaderboard)
[![Twitter: onirix](https://img.shields.io/twitter/follow/onirix.svg?style=social)](https://twitter.com/onirix)

Library designed for seamless management of leaderboards, offering an automated and user-friendly approach.

This versatile library enables the customization of leaderboards, allowing users to rank participants effortlessly. It boasts built-in login and registration processes and provides methods for score updates and displaying user lists with their scores sorted in descending order.

Onirix Leaderboard uses Firebase to store user scores. You need to create a Firebase project with Firestore enabled. If you need help take a look at [our documentation](https://docs.onirix.com/tutorials/onirix-leaderboard).

## Install

```sh
npm install @onirix/leaderboard
```

Include the dependency within the HTML head tag:

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/@onirix/leaderboard@1.0.4/+esm"/>
</head>
```

As ESM modules:

```js
import OnirixLeaderboardLib from "https://cdn.jsdelivr.net/npm/@onirix/leaderboard@1.0.4/+esm";
```

## Usage

To initiate the library, you require the Firebase configuration. This configuration encompasses essential information about your Firebase project and the access key required to interact with it.

Configuration information and the collection name are required, with an option to include custom texts:

```js
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
};
const oxLeaderboard = new OnirixLeaderboardLib(firebaseConfig, COLLECTION_NAME);
```

Initialization is completed by calling the init method:

```js
oxLeaderboard.init();
```

Executing this method will launch the welcome screen and initiate user authentication through login and registration screens.

Once the user is authenticated, the startExperience will be executed. You must define it by adding the necessary code to start your experience.

```js
oxLeaderboard.startExperience = () => {
    /**
    *   Code to initiate your experience
     */
}
```

When the experience ends, updating the score value is crucial. Utilize the following code to achieve this:

```js
yourCode.updateScore = (score) => {
    oxLeaderboard.saveScore(score);
}
```

To view the leaderboard, execute the following function:

```js
yourCode.gameEnd = () => {
    oxLeaderboard.showLeaderBoard();
}
```
## Customize

### Customizing texts

When we create the library object we can add a parameter with the texts we want to use. This parameter is a JSON object structured according to the library screens.

With this code we are going to modify the texts of the welcome screen:

```js
const CUSTOM_UI_TEXTS = {
    welcome: {
        title: "My custom title!",
        text: "Animi eius quia aliquam ut. Quis sed autem ipsum quo molestiae voluptas a unde veniam. Asperiores modi maiores ipsa harum delectus. Temporibus quae sint.",
        close: "Go!"
    }
}

const oxLeaderboard = new OnirixLeaderboardLib(firebaseConfig, "my-firebase-collection", CUSTOM_UI_TEXTS);
oxLeaderboard.init();
```

### Customizing CSS

Each screen has an identifier: ox-welcome, ox-register, ox-login, and ox-leaderboard. By employing these selectors, you will be able to customize the style of individual elements under them in the DOM. For example:

To modify the look and feel of the Leaderboard you can add all the CSS you need to your experience through Onirix Studio's online code editor.

All leaderboard screens are annotated with the **ox-lib-code** css class. By styling that class you can apply changes to all the Leaderboard screens. Let's add some code to change the white background of the screens and the font.

```css
.ox-lib-code {
    filter: contrast(150%) brightness(105%);
    background: #FABADA;
    color: #2c1844;
    font: unset;
}
```

Each screen in the library has its own identifier and a specific CSS class for it: 'ox-leaderboard', 'ox-welcome', 'ox-register' and 'ox-login'. We can use these identifiers to modify a specific screen. 

You can make infinite changes to the interface by adding the appropriate CSS selectors. Through your browser's development tools you can explore the names of the css classes used by the library and add your own custom selectors and rules.

## OnirixLeaderboardLib Class

### Methods

This class facilitates bidirectional communication through three public methods and includes a listener triggering client actions. The startExperience function, when heard from the client, indicates that the user is logged in or registered, allowing the experience to commence or restart if the user clicks "Try again" on the leaderboard screen.

#### Constructor

The constructor accepts essential data for initializing both Firebase and UI texts:

```js
constructor(firebaseConfig, firebaseCollectionName, uiTexts = DEFAULT_UI_TEXTS);
```

- firebaseConfig: JSON detailing Firebase information during project creation.
- firebaseCollectionName: Name of the collection for document creation and updates.
- uiTexts: JSON file storing texts incorporated into the UI.

#### Initialization Method

```js
async init();
```

This method displays the welcome screen and initializes the step flow. It accepts a boolean parameter indicating whether the button should be enabled (enabled by default).

#### On terms and conditions

```js
oxLeaderboard.onTerms
```

Leaderboard will call this method when the user clicks on the link to view the terms and conditions.

#### On privacy policy

```js
oxLeaderboard.onPrivacyPolicy
```

Leaderboard will call this method when the user clicks on the link to view the privacy policy.

#### Start experience

```js
oxLeaderboard.startExperience
```

Leaderboard will call this method when the user is authenticated and the experience can begin.

#### Update Score

```js
async saveScore(score);
```

This method updates the user's score, with the score provided as a parameter.

#### Show Leaderboard

```js
async showLeaderBoard();
```

This function shows the leaderboard screen with all the relevant data.

## Not enough?

If you want to make deeper changes you can clone the Onirix Leaderboard code from our GitHub repository and create your own Leaderboard.
If you need help take a look at [our documentation](https://docs.onirix.com/tutorials/onirix-leaderboard).

## Author

👤 **Onirix**

* Website: www.onirix.com
* Twitter: [@onirix](https://twitter.com/onirix)
* Github: [@onirix-ar](https://github.com/onirix-ar)
* LinkedIn: [@onirixar](https://linkedin.com/in/onirixar)
