import DEFAULT_UI_TEXTS from "./constants/default.text";
import OxFirebase from "./services/oxfirebase.service";
import OxUIService from "./services/oxui.service";

/**
 * Class to access and control leaderboard from outside
 */
class OnirixLeaderboardLib {

    /**
     * Variables
     */
    firebaseService = null;
    uiService = null;
    STORAGE_NAME = null;

    /**
     * Constructor. Initialize firebase and the ui service
     * 
     * @param   info to connect firebase 
     * @param   name of the firebase collection
     * @param   json object with ui texts
     */
    constructor(firebaseConfig, firebaseCollectionName, uiTexts = DEFAULT_UI_TEXTS) {
        this.STORAGE_NAME = 'oxleaderboard_'+firebaseCollectionName;
        this.firebaseService = new OxFirebase(firebaseConfig, firebaseCollectionName);
        this.uiService = new OxUIService(Object.assign(DEFAULT_UI_TEXTS, uiTexts));

        this.uiService.onClose = (closedElementId) => {
            switch (closedElementId) {
                case this.uiService.WELCOME_ID:
                case this.uiService.LEADERBOARD_ID:
                    this.runStart();
                    break;
                default:
                    console.warn('Unknown closed element id', closedElementId)
                    break;
            }
        }

        this.uiService.onLogin = (login) => {
            this.login(login)
        }

        this.uiService.onRegister = (register) => {
            this.registerUser(register);
        }

        this.uiService.onTermsClick = () => {
            if (this.onTerms) {
                this.onTerms();
            }
        }

        this.uiService.onPrivacyPolicyClick = () => {
            if (this.onPrivacyPolicy) {
                this.onPrivacyPolicy();
            }
        }

    }

    /**
     * Call firebase to login with email and password
     * 
     * @internal
     * @param   email and password
     */
    login(data) {
        this.firebaseService.login(data.email, data.pass).then(async credentials => {
            localStorage.removeItem(this.STORAGE_NAME);
            this.userData = await this.getUserData(credentials.user.uid);
            this.setUserData();
            this.uiService.removeLogin();
            this.launchExperience();
        }).catch(error => {
            console.error(error);
            this.uiService.showLoginError(error.code === "auth/invalid-login-credentials" ?
            "No user registered with the given email" : error.code === "auth/invalid-email" ? "Invalid email format" : "An error ocurred. Please, try again later");
        })
    }

    /**
     * Call firebase to create new user
     * 
     * @internal
     * @param   user data
     */
    registerUser(data) {
        this.firebaseService.register(data).then(credentials => {
            this.userData = data;
            delete this.userData.pass;
            this.userData["uuid"] = credentials.user.uid;
            this.addUser();
            this.uiService.removeRegister();
            this.launchExperience();
        }).catch(error => {
            console.error(error);
            this.uiService.showRegisterError(error.code === "auth/email-already-in-use" ?
            "The provided email is already in use" : error.code === "auth/invalid-email" ?
            "Invalid email format" : error.code === "auth/weak-password" ? "Password should be at least 6 characteres" : "An error ocurred. Please, try again later");
        });
    }

    /**
     * When the user logs in or registers, this method indicates to the class, function, etc. that is using this library that the experience can be launched.
     * 
     * @internal
     */
    launchExperience() {
        if (this.startExperience) {
            this.startExperience();
        }
    }

    /**
     * Call firebase to create new user in the collection
     * 
     * @internal
     */
    addUser() {
        this.firebaseService.insertUser(this.userData).then(() => {
            this.setUserData();
        }).catch(error => {
            console.error(error)
        })
    }

    /**
     * If there are user info in local storage runs the experience, otherwise show register
     * 
     * @internal
     */
    runStart() {
        if (this.userData == null) {
            this.showRegister();
        } else {
            this.launchExperience();
        }
    }

    /**
     * Get user data info and show the welcome screen
     * 
     * @param   autoEnabled 
     */
    async init(autoEnabled = true) {
        this.userData = await this.getUserData();
        this.showWelcome();
        if (autoEnabled) {
            this.enableWelcomeButton();
        }
    }

    /**
     * Get user data from local storage or from firebase
     * 
     * @internal
     * @param   user identifier 
     * @returns user data
     */
    async getUserData(uuid = null) {
        const storedData = localStorage.getItem(this.STORAGE_NAME);
        if (storedData || uuid != null) {
            const data = JSON.parse(storedData);
            const user = this.firebaseService.getUser(uuid != null ? uuid : data.uuid);
            return user;
        } else {
            return null;
        }
    }

    /**
     * Activate pointer events on button
     * 
     * @internal
     */
    enableWelcomeButton() {
        this.uiService.enableWelcomeButton();
    }
    
    /**
     * Get users from firebase and show leaderboard screen
     */
    async showLeaderBoard() {
        const leaderBoardItems = await this.firebaseService.getAllUsers();
        this.uiService.renderLeaderBoard(leaderBoardItems, this.userData?.email);
    }

    /**
     * Show leaderboard screen
     * 
     * @internal
     */
    showWelcome() {
        this.uiService.renderWelcome();
    }

    /**
     * Show register screen
     * 
     * @internal
     */
    showRegister() {
        this.uiService.renderRegister();
    }

    /**
     * Save in firebase current user score
     * 
     * @param   score achived 
     */
    async saveScore(score) {
        if (score > this.userData?.score) {
            this.userData.score = score
            await this.firebaseService.updateUser(this.userData);
            this.setUserData();
        }
    }

    /**
     * Set user data on local storage
     * 
     * @internal
     */
    setUserData() {
        localStorage.setItem(this.STORAGE_NAME, JSON.stringify(this.userData));
    }
}

export default OnirixLeaderboardLib;