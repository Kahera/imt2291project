import { LitElement, html, css } from 'lit-element';
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-icon-button'


export class ComponentUsermanagement extends LitElement {

    static get properties() {
        return {
            user: Object,
            pending: {
                type: Boolean,
                value: false
            }
        }
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }

            .user {
                display: inline-block;
            }

            paper-icon-button.red {
                display: inline-block;
                color: var(--paper-red-500);
            }

            paper-icon-button.green {
                display: inline-block;
                color: var(--paper-green-500);
            }

            `,
        ]
    }

    render() {
        return html`
        <div class="user">
                <p>Email</p>
                <div class="btns"
                        <paper-icon-button icon="remove-circle" class="red" @click="${this._approve}"></paper-icon-button>
                        ${this.pending ?
                html`
                            <paper-icon-button icon="add-circle" class="green" @click="${this._reject}"></paper-icon-button>`
                : html``
            }
                        
                </div>
        </div>
        `;
    }

    //TODO: Finish these functions
    _reject(e) {

    }

    _approve(e) {

    }
}
customElements.define('component-usermanagement', ComponentUsermanagement);