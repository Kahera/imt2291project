import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-icon-button'
import '@polymer/iron-icon'
import '@polymer/iron-icons'
import '@polymer/paper-input/paper-input'
import '@polymer/app-layout/app-layout'

export class Toolbar extends LitElement {

    static get properties() {
        return {
            user: Object,
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;
    }

    static get styles() {
        return [
            css`
            app-header{
                background-color: whitesmoke;
            --app-header-background-rear-layer: {
                background-color: whitesmoke;
                }; 
            }

            .toolbar {

                color: rgb(70, 70, 70);
                display: grid;
                grid-template-columns: 1em 2fr 10fr 2fr 1em;
                grid-template-rows: auto;
                padding-bottom: 1em;
            }

            #btn-home {
                display: inline-block;
                grid-column-start: 2;
                align-self: center;
                justify-self: left;
            }

            .searchbar {
                grid-column-start: 3;
                margin-bottom: 1em;
                width: 100%;
                align-self: center;
                justify-self: right;
            }

            #input-search {
                width: 80%;
                display: inline-block;
            }

            #btn-search {
                display: inline-block;
            }

            #btn-drawer {
                font-size: small;
                width: 50%; 
                grid-column-start: 4;
                align-self: center;
                justify-self: right;
            }
            `,
        ]
    }

    render() {
        return html`
            <app-header reveals>
                <app-toolbar class="toolbar">
                    <paper-icon-button class="btn" icon="home" id="btn-home"></paper-icon-button>
                    <div class="searchbar">
                        <paper-input id="input-search" label="Search"></paper-input>
                        <paper-icon-button icon="search" id="btn-search"></paper-icon-button>
                    </div>
                    <paper-icon-button class="btn" icon="account-circle" id="btn-drawer"></paper-icon-button>
                </app-toolbar>
            </app-header>
            `;
    }
}
customElements.define('component-toolbar', Toolbar);