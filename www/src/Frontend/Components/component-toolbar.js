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
            .toolbar {
                background-color: whitesmoke;
                color: rgb(70, 70, 70);
                display: grid;
                grid-template-columns: 1em 2fr 10fr 2fr 1em;
                grid-template-rows: auto;
            }

            #btn-home {
                display: inline-block;
                grid-column-start: 2;
                align-self: center;
            }

            .searchbar {
                grid-column-start: 3;
                margin-bottom: 1em;
                align-self: center;
            }

            #input-search {
                width: 80%;
                display: inline-block;
            }

            #btn-search {
                display: inline-block;
            }

            #btn-log {
                font-size: small;
                width: 50%; 
                grid-column-start: 4;
                justify-self: right;
            }
            `,
        ]
    }

    render() {
        return html`
            <app-header reveals>
                <app-toolbar class="toolbar">
                    <paper-icon-button icon="home" id="btn-home"></paper-icon-button>
                    <div class="searchbar">
                        <paper-input id="input-search" label="Search"></paper-input>
                        <paper-icon-button icon="icons:search" id="btn-search"></paper-icon-button>
                    </div>
                    <paper-button raised id="btn-log">Log in/out</paper-button>
                </app-toolbar>
            </app-header>
            `;
    }
}
customElements.define('component-toolbar', Toolbar);