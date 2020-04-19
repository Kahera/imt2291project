import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-input/paper-input'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-card/paper-card'

export class ViewLogin extends LitElement {

    static get properties() {
        return {
            loggedin: {
                type: Boolean,
                value: false
            },
            userType: {
                type: String,
            },
            validated: {
                type: Boolean,
                value: false
            },
            username: {
                type: String,
            }
        }
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 2em;
            }

            .card {
                width: 50em;
            }
            
            .card-content {
                padding: 1em;
            }

            .btn {
                font-size: small;
                margin-top: 1em;
                margin-bottom: 0.8em;
            }
            `,
        ]
    }

    render() {
        return html`
        <paper-card class="card">
            <div class="card-content">
                <paper-input type="email" id="email" label="Email" autocomplete="email" required></paper-input>
                <paper-input type="password" id="password" label="Password" autocomplete="password" required></paper-input>
                <paper-button class="btn" raised id="register">Register</paper-button>
                <paper-button class="btn" raised id="login">Log in</paper-button>
            </div>
        </paper-card>
            `;
    }


    /**
     * Called when the user clicks the log in button
     *
     * @param  {Object} e event object from the click on the button. Contains
     * information about the form.
     */
    login(e) {
        const data = new FormData(e.target.form); // Wrap the form in a FormData object
        fetch(`${window.MyAppGlobals.serverURL}/src/Backend/Utility/login.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }
        ).then(res => res.json())         // When a reply has arrived
            .then(res => {
                if (res.status == 'OK') {  // Successfully logged in
                    this.updateStatus(res);
                    store.dispatch(logIn({ uid: res.uid, uname: res.uname, userType: res.userType }));
                } else {
                    //TODO: Tell user login failed
                }
            })
    }

    /**
    * Called when the user clicks the log out button
    */
    logout() {
        fetch(`${window.MyAppGlobals.serverURL}/src/Backend/Utility/logout.php`, {
            credentials: "include"
        }
        ).then(res => res.json())
            .then(res => {
                if (res.status == 'SUCCESS') {  // Successfully logged out
                    this.updateStatus(res);
                    store.dispatch(logOut());
                } else {
                    //TODO: Tell user no logout happened
                }
            })
    }

    updateUserStatus(res) {
        this.loggedin = (res.res.uid != null);
        this.userType = res.userType;
        this.validate = res.validated;
        this.username = res.username;
    }

}
customElements.define('view-login', ViewLogin);