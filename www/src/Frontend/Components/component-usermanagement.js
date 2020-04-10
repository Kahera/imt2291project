import { LitElement, html, css } from 'lit-element';
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-icon-button'


export class ComponentUsermanagement extends LitElement {

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
                <p>Name</p>
                <p>Email</p>
                <div class="btns"
                        <paper-icon-button icon="remove-circle" class="red"></paper-icon-button>
                        <paper-icon-button icon="add-circle" class="green"></paper-icon-button>
                </div>
        </div>
        `;
    }
}
customElements.define('component-usermanagement', ComponentUsermanagement);