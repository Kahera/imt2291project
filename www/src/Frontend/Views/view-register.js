import { LitElement, html } from 'lit-element';
import '@polymer/paper-input/paper-input'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-card/paper-card'
import '@polymer/paper-checkbox/paper-checkbox'

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
                        <paper-input type="email" id="email" label="Email" autocomplete="email" required></paper-input>
                        <paper-input type="new-password" id="password" label="Password" autocomplete="password" required></paper-input>
                        <paper-input type="new-password" id="password_repeat" label="Password" autocomplete="password" required></paper-input>
                        <paper-checkbox id="chk_lecturer">I am a lecturer</paper-checkbox>
                        <paper-button class="btn" raised id="cancel" href="[[rootPath]]>Cancel</paper-button>
                        <paper-button class="btn" raised id="register" @click="${this.register}">Register</paper-button>
                    </form>
                </div>
        </paper-card>
        `;
    }

    register(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/User/register.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }
}
customElements.define('view-register', ViewRegister);