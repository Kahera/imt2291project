import { LitElement, html, css } from 'lit-element';
import '@polymer/iron-icons/iron-icons'
import '@polymer/paper-icon-button'
import '@polymer/paper-card'


export class ComponentUsermanagement extends LitElement {

    static get properties() {
        return {
            item: Object,
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

            .card {
                width: 40em;
                max-width: 90%;
            }
            

            .item {
                display: inline-block;
            }

            .card-info {
                display: inline-block;
            }

            .btn {
                justify-self: right;
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
        this.checkValidation();
        return html`
        <paper-card class="card">
            <div class="card-content">
                <div class="card-info">
                    Email: ${this.item.email}
                </div>
                    <paper-icon-button icon="remove-circle" class="btn red" @click="${this.reject}"></paper-icon-button>
                ${this.pending ? html`
                    <paper-icon-button icon="add-circle" class="btn green" @click="${this.approve}"></paper-icon-button>`
                : html``
            }
        </paper-card class="card">
        `;
    }

    //TODO: Finish these functions
    reject() {

    }

    approve() {

    }

    checkValidation() {
        if (this.item.validated == 0) {
            this.pending = true;
        }
    }
}
customElements.define('component-usermanagement', ComponentUsermanagement);