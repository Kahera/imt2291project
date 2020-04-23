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
            drawerOpened: Boolean
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        this.drawerOpened = false;
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

            a {
                text-decoration: none;
                color: black;
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

    //TODO: Fix logout
    render() {
        return html`
            <app-header reveals>
                <app-toolbar class="toolbar">
                    <a href="${MyAppGlobals.rootPath}">
                        <paper-icon-button class="btn" icon="home" id="btn-home"></paper-icon-button>
                    </a>
                    <div class="searchbar">
                        <paper-input id="input-search" label="Search"></paper-input>
                        <paper-icon-button icon="search" id="btn-search"></paper-icon-button>
                    </div>
                    <paper-icon-button class="btn" icon="account-circle" id="btn-drawer" @click="${this._drawerToggle}"></paper-icon-button>
                </app-toolbar>
            </app-header>

            <app-drawer slot="drawer" id="drawer" align="right" swipe-open position="right" opened="${this.drawerOpened}">
            <div class="drawer-content">
                ${this.user.uid ?
                html`
                    <paper-icon-item role="option">
                        <a href="${MyAppGlobals.rootPath}login">
                            <paper-button>Log in</paper-button>
                        </a>
                    </paper-icon-item>
                ` : `
                    <paper-icon-item role="option">
                        <paper-button href="[[rootPath]]logout">Log out</paper-button>
                    </paper-icon-item>

                    ${this.userType != 'student' ? 
                    html`
                        <paper-icon-item role="option">
                            <paper-button href="[[rootPath]]videoUpload">Admin page</paper-button>
                        </paper-icon-item>
                        <paper-icon-item role="option">
                        <paper-button href="[[rootPath]]playlistCreation">Admin page</paper-button>
                    </paper-icon-item>
                    ` : `` }
                    
                    ${this.userType == 'admin' ? 
                    html`
                        <paper-icon-item role="option">
                            <paper-button href="[[rootPath]]admin">Admin page</paper-button>
                        </paper-icon-item>
                    ` : `` }
                ` }
            </div>
        </app-drawer>
            `;
    }

    _drawerToggle() {
        this.drawerOpened = !this.drawerOpened;
    }
}
customElements.define('component-toolbar', Toolbar);