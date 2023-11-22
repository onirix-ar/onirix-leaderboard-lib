import DEFAULT_CSS from '../constants/default.css';

/**
 * This is a class that manages the UI of the leaderboard, adds html, controls interaction, etc.
 */
class OxUIService {
    /**
     * HTML elements ids
     */
    LEADERBOARD_ID = 'ox-leaderboard';
    WELCOME_ID = 'ox-welcome';
    REGISTER_ID = 'ox-register';
    LOGIN_ID = 'ox-login';
    TERMS_PRIVACY = 'ox-terms-privacy';
    NEWSLETTER = 'ox-newsletter';
    NAME = 'ox-name';
    NICKNAME = 'ox-nickname';
    EMAIL = 'ox-email';
    PASSWORD = 'ox-password';
    REGISTER = 'ox-register-button';
    GO_LOGIN = 'ox-gotologin';
    ERROR_NAME = 'ox-error-name';
    ERROR_NICKNAME = 'ox-error-nickname';
    ERROR_EMAIL = 'ox-error-email';
    ERROR_PASSWORD = 'ox-error-pass';
    LABEL_TERMS_PRIVACY = 'ox-label-terms-privacy';
    LOGIN = 'ox-login-button';
    GO_REGISTER = 'ox-gotoregister';
    ERROR_LOGIN = 'ox-error-login';
    ERROR_REGISTER = 'ox-error-register';
    WARNING_PASSWORD = 'ox-warning-pass';
    WARNING_EMAIL = 'ox-warning-email';
    WARNING_USED_EMAIL = 'ox-warning-email-used';

    /**
     * Indicates whether it was first checked with the onblur event
     */
    firstCheckedEmailFormat = false;

    /**
     * Constructor. Initialize the text and add the CSS
     * @param   text for the UI 
     */
    constructor(uiTexts) {
        this.uiTexts = uiTexts;
        this.importCss();
    }

    /**
     * Apply the css from the file to the html
     * 
     * @internal
     */
    importCss() {
        const styleElement = document.createElement('style');
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = DEFAULT_CSS;
        } else {
            styleElement.appendChild(document.createTextNode(DEFAULT_CSS));
        }
        document.head.appendChild(styleElement);
    }

    /**
     * Remove the leaderboard element if exists and call the method to render a new one
     * @param   list of users
     * @param   current user nickname
     */
    renderLeaderBoard(usersList, userEmail) {
        this.removeElement(this.LEADERBOARD_ID);
        this.createLeaderboarDiv(usersList, userEmail);
    }

    /**
     * Remove one element from de ui
     * 
     * @internal
     * @param   element id 
     */
    removeElement(elementId) {
        const item = document.getElementById(elementId);
        if (item) {
            item.remove();
        }
    }

    /**
     * Creates the leaderboard element and add it to the DOM
     * 
     * @internal
     * @param   list of users 
     * @param   current user nickname
     */
    createLeaderboarDiv(usersList, userEmail) {
        const leaderBoard = document.createElement('div');
        leaderBoard.id = this.LEADERBOARD_ID;
        leaderBoard.classList.add('ox-lib-code', 'ox-leaderboard');
        if (null != userEmail && 0 < userEmail.length) {
            leaderBoard.classList.add('ox-leaderboard--updated');
        }
        leaderBoard.innerHTML = `
            <h1 class="ox-lib-code__logo">${this.uiTexts.leaderBoard.title}</h1>
            <h2>${this.uiTexts.leaderBoard.subtitle}</h2>
        `;
        
        leaderBoard.appendChild(this.getUsersUL(usersList, userEmail));
        leaderBoard.appendChild(
            this.getCloseButton(
                this.LEADERBOARD_ID,
                this.uiTexts.leaderBoard.close
            )
        );
        document.body.appendChild(leaderBoard);
    }
    
    /**
     * Create close button for welcome and leaderboard screens
     * 
     * @internal
     * @param   leaderboard or welcome id
     * @param   button text 
     * @returns the button element
     */
    getCloseButton(elementId, text = 'Close') {
        const closeButton = document.createElement('button');
        closeButton.innerHTML=text;
        closeButton.addEventListener('click', () => {
            this.removeElement(elementId);
            if (this.onClose) {
                this.onClose(elementId);
            }
        });
        return closeButton;
    }

    /**
     * Generate users ul list
     * 
     * @internal
     * @param   all users
     * @param   current user nickname
     * @returns lu
     */
    getUsersUL(usersList, userEmail) {
        const usersUL = document.createElement('ul');
        let index = 1;
        for (let i = 0; i < usersList.length; i++) {
            const user = usersList[i];
            if (i != 0 && user.score != usersList[i -1].score) {
                index++;
            }
            usersUL.appendChild(this.getUserLI(index, user, userEmail));
        }

        return usersUL;
    }

    /**
     * Creates a li element for each user
     * 
     * @internal
     * @param   position
     * @param   user 
     * @param   current user nickname
     * @returns li
     */
    getUserLI(index, user, userEmail = '') {
        const usersLI = document.createElement('li');
        if (0 == user.email.localeCompare(userEmail, 'es', { sensitivity: 'base' })) {
            usersLI.classList.add('ox-current-user');
        }
        usersLI.innerHTML = `
            <span>${index}º</span>
            <span>${user.nickname}</span>
            <span>${user.score}</span>
        `;
        return usersLI;
    }

    /**
     * Remove welcome screen if exitst and creates a new one
     */
    renderWelcome() {
        this.removeElement(this.WELCOME_ID);
        this.createWelcomeDiv();
    }

    /**
     * Creates welcome screen and manage it's events
     * 
     * @internal
     */
    createWelcomeDiv() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = this.WELCOME_ID;
        welcomeDiv.classList.add('ox-lib-code', 'ox-welcome');
        welcomeDiv.innerHTML = `
            <div class="ox-welcome__img ox-lib-code__logo"></div>
            <h1>${this.uiTexts.welcome.title}</h1>
            <p>${this.uiTexts.welcome.text}</p>
        `;
        welcomeDiv.appendChild(
            this.getCloseButton(this.WELCOME_ID, this.uiTexts.welcome.close)
        );
        document.body.appendChild(welcomeDiv);
    }

    /**
     * Remove register screen if exists and create a new one
     */
    renderRegister() {
        this.removeRegister();
        this.createRegisterDiv();
    }

    /**
     * Creates the register screen and manage it's events
     * 
     * @internal
     */
    createRegisterDiv() {
        const registerDiv = document.createElement('div');
        registerDiv.id = this.REGISTER_ID;
        registerDiv.classList.add('ox-lib-code', 'ox-register');
        registerDiv.innerHTML = `
            <h1 class="ox-lib-code__logo">${this.uiTexts.register.title}</h1>
            <form>
                <div>
                    <label>${this.uiTexts.register.name}</label>
                    <input id="ox-name" type="text" placeholder="${this.uiTexts.register.namePlaceholder}" />
                    <p class="ox-leaderboard-error" id="ox-error-name">${this.uiTexts.errors.name}</p>
                </div>
                <div>
                    <label>${this.uiTexts.register.nickname}</label>
                    <input id="ox-nickname" type="text" placeholder="${this.uiTexts.register.nicknamePlaceholder}" />
                    <p class="ox-leaderboard-error" id="ox-error-nickname">${this.uiTexts.errors.nickname}</p>
                </div>
                <div>
                    <label>${this.uiTexts.register.email}</label>
                    <input id="ox-email" type="email" placeholder="${this.uiTexts.register.emailPlaceholder}" />
                    <p class="ox-leaderboard-error" id="ox-error-email">${this.uiTexts.errors.email}</p>
                    <p class="ox-leaderboard-warning" id="ox-warning-email">${this.uiTexts.warnings.emailFormat} </p>
                    <p class="ox-leaderboard-warning" id="ox-warning-email-used">${this.uiTexts.warnings.emailUsed} </p>
                </div>
                <div>
                    <label>${this.uiTexts.register.pass}</label>
                    <input id="ox-password" type="password" minlength="6" placeholder="${this.uiTexts.register.passPlaceholder}"/>
                    <p class="ox-leaderboard-error" id="ox-error-pass">${this.uiTexts.errors.pass}</p>
                    <p class="ox-leaderboard-warning" id="ox-warning-pass">${this.uiTexts.warnings.passLength} </p>
                </div>
                <p class="ox-leaderboard-error" id="ox-error-register"></p>
                <div class="ox-checkbox ox-terms-privacy">
                    <input type="checkbox" id="ox-terms-privacy" value="false"/>
                    <label id="ox-label-terms-privacy">
                        <span id="ox-label-terms-privacy__policy">${this.uiTexts.register.accept} 
                        <a target="_blank" href="#">${this.uiTexts.register.privacy}</a></span>
                        <span id="ox-label-terms-privacy__terms">${this.uiTexts.register.and} <a href="#">${this.uiTexts.register.terms}</a></span>
                    </label>
                </div>
                <div class="ox-checkbox ox-newsletter">
                    <input type="checkbox" id="ox-newsletter" value="false"/>
                    <label>${this.uiTexts.register.newsletter}</label>
                </div>
            </form>
            <div>
                <button type="button" id="ox-register-button">${this.uiTexts.register.start}</button>
                <p>${this.uiTexts.register.account} <a id="ox-gotologin">${this.uiTexts.register.login}</a></p>
            </div>
        `;
        document.body.appendChild(registerDiv);

        this.privacyLinks();
        this.controlTermsPrivacyClick();
        this.controlNewsletterClick();

        const name = document.getElementById(this.NAME);
        const nickname = document.getElementById(this.NICKNAME);
        const email = document.getElementById(this.EMAIL);
        const pass = document.getElementById(this.PASSWORD);
        const termsPrivacy = document.getElementById(this.TERMS_PRIVACY);
        const newsletter = document.getElementById(this.NEWSLETTER);

        this.checkNameValidity(name);
        this.checkNicknameValidity(nickname);
        this.checkEmailValidity(email, true);
        this.checkPassValidity(pass);

        document.getElementById(this.REGISTER).addEventListener('click', async () => {
            if (await this.checkFormValidity(email, pass, name, nickname, termsPrivacy)) {
                document.getElementById(this.ERROR_REGISTER).style.display = 'none';
                if (this.onRegister) {
                    this.onRegister({
                        name: name.value,
                        nickname: nickname.value,
                        email: email.value,
                        pass: pass.value,
                        termsPrivacy: termsPrivacy.value,
                        newsletter: newsletter.value
                    });
                }
            }   
        });
        document.getElementById(this.GO_LOGIN).addEventListener('click', () => {
            this.removeRegister();
            this.renderLogin();
        })
    }

    /**
     * Handle click on terms and conditions
     * 
     * @internal
     */
    privacyLinks() {
        document.querySelector('#ox-label-terms-privacy__policy a').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.onPrivacyPolicyClick) {
                this.onPrivacyPolicyClick();
            }
        })
    
        document.querySelector('#ox-label-terms-privacy__terms a').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.onTermsClick) {
                this.onTermsClick();
            }
        })
    }
    
    /**
     * Set value to terms and privacy checkbox
     */
    controlTermsPrivacyClick() {
        const termsPrivacy = document.getElementById(this.TERMS_PRIVACY);
        termsPrivacy.onchange = () => {
            if (termsPrivacy.value == 'false') {
                termsPrivacy.value = 'true';
                termsPrivacy.classList.add('ox-cheked');
            } else {
                termsPrivacy.value = 'false';
                termsPrivacy.classList.remove('ox-cheked');
            }
            this.checkTermsPrivacyValidity(termsPrivacy, document.getElementById(this.LABEL_TERMS_PRIVACY));
        }
    }

    /**
     * Set value to newsletter checkbox
     */
    controlNewsletterClick() {
        const newsletter = document.getElementById(this.NEWSLETTER);
        newsletter.onchange = () => {
            if (newsletter.value == 'false') {
                newsletter.value = 'true';
                newsletter.classList.add('ox-cheked');
            } else {
                newsletter.value = 'false';
                newsletter.classList.remove('ox-cheked');
            }
        }
    }


    /**
     * Remove login screen if exist and create a new one
     */
    renderLogin() {
        this.removeLogin();
        this.createLoginDiv();
    }

    /**
     * Create the login screen and manage events on it
     * 
     * @internal
     */
    createLoginDiv() {
        const loginDiv = document.createElement('div');
        loginDiv.id = this.LOGIN_ID;
        loginDiv.classList.add('ox-lib-code', 'ox-login');
        loginDiv.innerHTML = `
            <h1 class="ox-lib-code__logo">${this.uiTexts.login.login}</h1>
            <p>${this.uiTexts.login.subheader}</p>
            <form>
                <div>
                    <label>${this.uiTexts.login.email}</label>
                    <input id="ox-email" type="email" placeholder="${this.uiTexts.login.emailPlaceholder}" />
                    <p class="ox-leaderboard-error" id="ox-error-email">${this.uiTexts.errors.email}</p>
                </div>
                <div>
                    <label>${this.uiTexts.login.pass}</label>
                    <input id="ox-password" type="password" minlength="6" placeholder="${this.uiTexts.login.passPlaceholder}" />
                    <p class="ox-leaderboard-error" id="ox-error-pass">${this.uiTexts.errors.pass}</p>
                    <p class="ox-leaderboard-warning" id="ox-warning-pass">${this.uiTexts.warnings.passLength} </p>
                </div>
            </form>
            <p class="ox-leaderboard-error" id="ox-error-login"></p>
            <div>
                <button type="button" id="ox-login-button">${this.uiTexts.login.start}</button>
                <p>${this.uiTexts.login.account} <a id="ox-gotoregister">${this.uiTexts.login.register}</a></p>
            </div>
        `;
        document.body.appendChild(loginDiv);

        const email = document.getElementById(this.EMAIL);
        const pass = document.getElementById(this.PASSWORD);

        this.checkEmailValidity(email);
        this.checkPassValidity(pass);

        document.getElementById(this.LOGIN).addEventListener('click', async () => {
            if (await this.checkFormValidity(email, pass)) {
                document.getElementById(this.ERROR_LOGIN).style.display = 'none';
                if (this.onLogin) {
                    this.onLogin({
                        email: email.value,
                        pass: pass.value
                    });
                }
            }
        });
        document.getElementById(this.GO_REGISTER).addEventListener('click', () => {
            this.removeLogin();
            this.renderRegister();
        });
    }

    /**
     * Check name field on blur and on change events
     * 
     * @internal
     * @param   name input
     */
    checkNameValidity(name) {
        const errorName = document.getElementById(this.ERROR_NAME);
        name.onblur = () => {
            this.checkFieldValue(name, errorName);
        }
        name.oninput = () => {
            this.checkFieldValue(name, errorName);
        }
    }

    /**
     * Check nickname field on blur and on change events
     * 
     * @internal
     * @param   nickname input
     */
    checkNicknameValidity(nickname) {
        const errorNickname = document.getElementById(this.ERROR_NICKNAME);
        nickname.onblur = () => {
            this.checkFieldValue(nickname, errorNickname);
        };
        nickname.oninput = () => {
            this.checkFieldValue(nickname, errorNickname);
        };
    }

    /**
     * Check email field on blur and on change events
     * 
     * @internal
     * @param   email input
     * @param   indicates if is on register or on login 
     */
    checkEmailValidity(email, checkFormat = false) {
        const errorEmail = document.getElementById(this.ERROR_EMAIL);
        email.onblur = () => {
            const validField = this.checkFieldValue(email, errorEmail);
            if (checkFormat) {
                this.firstCheckedEmailFormat = true;
                this.checkValidEmailFormat(email, !validField);
            }  
        };
        email.oninput = () => {
            const valid = this.checkFieldValue(email, errorEmail);
            if (checkFormat && this.firstCheckedEmailFormat) {
                this.checkValidEmailFormat(email, !valid);
            }
        };
    }


    /**
     * Check password field on blur and on change events
     * 
     * @internal
     * @param   password input
     */
    checkPassValidity(pass) {
        const errorPass = document.getElementById(this.ERROR_PASSWORD);
        pass.onblur = () => {
            const valid = this.checkFieldValue(pass, errorPass);
            if (valid) {
                this.checkPassLength(pass);
            } else {
                this.checkPassLength(pass, false);
            }
        }
        pass.oninput = () => {
            const valid = this.checkFieldValue(pass, errorPass);
            if (valid) {
                this.checkPassLength(pass);
            } else {
                this.checkPassLength(pass, false);
            }
        }
    }

    /**
     * Check the length of the password
     * 
     * @internal
     * @param   password input
     * @returns boolean
     */
    checkPassLength(pass, force = true) {
        const passWarning = document.getElementById(this.WARNING_PASSWORD);
        if (pass.value.length < 6 && force) {
            pass.classList.add('ox-leaderboard-warning');
            passWarning.style.display = "block";
            return false;
        } else {
            pass.classList.remove('ox-leaderboard-warning');
            passWarning.style.display = "none";
            return true;
        }
    }

    /**
     * Check the format of the email
     * 
     * @internal
     * @param   email input
     * @returns boolean
     */
    checkValidEmailFormat(email, force = false) {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        const emailWarning = document.getElementById(this.WARNING_EMAIL);
        if (regex.test(email.value) || force) {
            email.classList.remove('ox-leaderboard-warning');
            emailWarning.style.display = 'none';
            return true;
        } else {
            email.classList.add('ox-leaderboard-warning');
            emailWarning.style.display = 'block';
            return false;
        }
    }

    /**
     * Check if all the form fields are informed
     * 
     * @internal
     * @param   name element
     * @param   nickname element
     * @param   email element
     * @param   pass element
     * @param   termsPrivacy element 
     * @returns boolean 
     */
    async checkFormValidity(email, pass, name = null, nickname = null, termsPrivacy = null) {
        let validity = true;
        const errorName = document.getElementById(this.ERROR_NAME);
        const errorNickname = document.getElementById(this.ERROR_NICKNAME);
        const errorEmail = document.getElementById(this.ERROR_EMAIL);
        const errorPass = document.getElementById(this.ERROR_PASSWORD);
        const labelTermsPrivacy = document.getElementById(this.LABEL_TERMS_PRIVACY);
        const elements = [
            {
                element: name,
                elementError: errorName
            },
            {
                element: nickname,
                elementError: errorNickname
            },
            {
                element: email,
                elementError: errorEmail
            },
            {
                element: pass,
                elementError: errorPass
            }
        ];
        for (const el of elements) {
            if (el.element != null) {
                const valid = this.checkFieldValue(el.element, el.elementError);
                if (!valid) {
                    validity = false;
                }

                if (el.element.id == this.EMAIL && valid && this.firstCheckedEmailFormat) {
                    let emailValid = this.checkValidEmailFormat(email);
                    if (!emailValid) {
                        validity = false;
                    }
                }

                if (el.element.id == this.PASSWORD && valid) {
                    const passValidity = this.checkPassLength(pass);
                    if (!passValidity) {
                        validity = false;
                    }
                }
            }
        }

        if (termsPrivacy != null) {
            const termsPrivacyValidity = this.checkTermsPrivacyValidity(termsPrivacy, labelTermsPrivacy);
            if (!termsPrivacyValidity) {
                validity = false;
            }
        }
        return validity;
    }

    /**
     * Check if the terms and privacy checkbox is checked
     * 
     * @internal
     * @param   terms and privacy checkbox 
     * @param   terms and privacy label
     * @returns boolean
     */
    checkTermsPrivacyValidity(termsPrivacy, labelTermsPrivacy) {
        if (termsPrivacy.value == 'false') {
            labelTermsPrivacy.classList.add('ox-leaderboard-error');
            termsPrivacy.classList.add('ox-leaderboard-error');
            return false;
        } else {
            labelTermsPrivacy.classList.remove('ox-leaderboard-error');
            termsPrivacy.classList.remove('ox-leaderboard-error');
            return true;
        }
    }

    /**
     * Check if the field is empty and add classes to it
     * 
     * @internal
     * @param   element 
     * @param   element that shows the error
     * @returns boolean
     */
    checkFieldValue(element, errorElement) {
        if (element.value == '' || element.value == null) {
            errorElement.style.display = 'block';
            element.classList.add('ox-leaderboard-error');
            return false;
        } else {
            errorElement.style.display = 'none';
            element.classList.remove('ox-leaderboard-error');
            return true;
        }
    }
    
    /**
     * Enable welcome button to hear events over it
     */
    enableWelcomeButton() {
        const welcomeDiv = document.getElementById(this.WELCOME_ID);
        welcomeDiv.classList.add('ox-scene-ready');
    }

    /**
     * Show register error message
     * 
     * @param   message 
     */
    showRegisterError(error) {
        const p = document.getElementById(this.ERROR_REGISTER);
        p.innerText = error;
        p.style.display = 'block';
    }

    /**
     * Show login error message
     * 
     * @param   message
     */
    showLoginError(error) {
        const p = document.getElementById(this.ERROR_LOGIN);
        p.innerText = error;
        p.style.display = 'block';
    }

    /**
     * Remove from the DOM the login DIV
     */
    removeLogin() {
        this.removeElement(this.LOGIN_ID);
    }

    /**
     * Remove from the DOM the resgister DIV
     */
    removeRegister() {
        this.removeElement(this.REGISTER_ID);
        this.firstCheckedEmailFormat = false;
    }

}

export default OxUIService;