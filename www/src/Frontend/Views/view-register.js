import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-input/paper-input'
import '@polymer/paper-input/paper-input-container'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-card/paper-card'
import '@polymer/paper-checkbox/paper-checkbox'
import '@polymer/paper-toast/paper-toast'
import '@polymer/iron-ajax/iron-ajax'
import '@polymer/iron-form/iron-form';

export class ViewRegister extends LitElement {

    static get properties() {
        return {
            msg: String
        }
    }

    constructor() {
        super();
        this.msg = '';
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 2em;
                align-content: center; 
                justify-content: center; 
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
                <form class="login" onsubmit="javascript: return false;">
                    <paper-input-container always-float-label auto-validate>
                        <label slot="label" for="email">Email</label>
                        <input slot="input" type="email" id="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$" autocomplete><br/>
                    </paper-input-container>
                    <paper-input-container minlength="8" always-float-label auto-validate>
                        <label slot="label" for="password">Password</label>
                        <input slot="input" type="password" id="password" name="password" minlength="8" autocomplete="new-password"><br/>
                    </paper-input-container>
                    <paper-input-container always-float-label auto-validate>
                        <label slot="label" for="password">Repeat password</label>
                        <input slot="input" type="password" id="password_repeat" name="password_repeat" minlength="8" autocomplete="new-password"><br/>
                    </paper-input-container>
                    
                    <a href="${window.MyAppGlobals.rootPath}login">
                        <paper-button class="btn" raised id="cancel">Cancel</paper-button>
                    </a>
                    <button id="register" @click="${this.register}">Register</button>
                </form>
            </div>
        </paper-card>
        `;
    }


    register(e) {
        const data = new FormData(e.target.form);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/registerUser.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(data => {
            this.msg = data['msg'];
            console.log(data['msg'])
        });
    }

    _renderToast(msg) {
        return html`<paper-toast text='${msg}'></paper-toast>`
    }
}
customElements.define('view-register', ViewRegister);