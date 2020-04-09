import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-button/paper-button'
import '@polymer/paper-icon-button'
import '@polymer/iron-icons'
import '@polymer/paper-input/paper-input'
import '@polymer/app-layout/app-layout'

export class Toolbar extends LitElement {

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 1em;
                background-color: whitesmoke;
                color: rgb(70, 70, 70);
            }

            #btn-home {
                justify-self: left;
                display: inline-block;
            }

            #input-search {
                justify-self: center;
                display: inline-block;
            }

            #btn-search {
                justify-self: center;
                display: inline-block;
            }

            #btn-log {
                font-size: small;
            }
            `,
        ]
    }

    render() {
        return html`
            <app-header reveals>
                <app-toolbar>
                    <paper-icon-button icon="icons:home" id="btn-home"></paper-icon-button>
                    <paper-input id="input-search" label="Search"></paper-input>
                    <paper-icon-button icon="icons:search" id="btn-search"></paper-icon-button>
                    <paper-button raised id="btn-log">Log in/out</paper-button>
                </app-toolbar>
            </app-header>
            `;
    }
}
customElements.define('component-toolbar', Toolbar);