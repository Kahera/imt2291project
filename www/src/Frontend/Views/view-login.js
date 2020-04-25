import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import { login } from '../Redux/actions'
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
            email: {
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

            a {
                text-decoration: none;
                color: black;
            }

            paper-input.custom {
                --paper-input-container-label-floating: {
                    width: auto;
                }    
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
                <label for="msg">${this.msg}</label>
                <form onsubmit="javascript: return false;">
                    <paper-input-container always-float-label auto-validate>
                        <label slot="label" for="email">Email</label>
                        <input slot="input" type="email" id="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"><br/>
                    </paper-input-container>
                    <paper-input-container always-float-label auto-validate>
                        <label slot="label" for="password">Password</label>
                        <input slot="input" type="password" id="password" name="password"><br/>
                    </paper-input-container>
                    <a href="${window.MyAppGlobals.rootPath}register">
                        <paper-button class="btn" raised id="register">Register</paper-button>
                    </a>
                    <button class="btn" id="login" @click="${this.login}">Log in</button>
                </form>
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
        console.log(`${window.MyAppGlobals.serverURL}src/Backend/User/login.php`);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/login.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => {
            if (res.ok) {                   // Successfully logged in
                res => res.json();
                this.updateUserStatus(res);
                store.dispatch(login({ uid: res.uid, email: res.email, userType: res.userType }));
                window.location.href = (window.MyAppGlobals.rootPath);
            } else {
                this.msg = res.msg;
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
                if (res.ok) {  // Successfully logged out
                    this.updateUserStatus(res);
                    store.dispatch(logOut());
                } else {
                    //TODO: Tell user no logout happened
                }
            })
    }

    updateUserStatus(res) {
        this.loggedin = (res.uid != null);
        this.userType = res.userType;
        this.validate = res.validated;
        this.email = res.email;
        this.student = false;
        this.teacher = false;
        this.admin = false;
        switch (res.userType) {
            case 'student': this.student = true;
                break;
            case 'teacher': this.teacher = true;
                break;
            case 'admin': this.admin = true;
                break;
        }
    }
}
customElements.define('view-login', ViewLogin);