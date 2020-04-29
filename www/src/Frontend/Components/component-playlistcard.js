import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '@polymer/paper-card/paper-card'
import '@polymer/paper-icon-button/paper-icon-button'
import '@polymer/iron-icons/iron-icons'

export class ComponentPlaylistcard extends LitElement {

    static get properties() {
        return {
            playlist: Object,
            user: Object
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
            :host {
                display: block;
                padding-bottom: 1em;
            }

            paper-card {
                cursor: pointer;
            }

            .card {
                width: 40em;
                max-width: 90%;
            }
            
            .card-title {
                font-weight: bold;
                font-size: medium;
            }

            .card-info {
                font-size: small;
            }
            `,
        ]
    }

    //TODO: Check if subscribe or unsubscribe based on student subscription
    render() {
        return html`
            <paper-card class="card" @click="${this.goto}">
                <div class="card-content">
                    <div class="card-title">
                        ${this.playlist.title}
                    </div>
                    <div class="card-info">
                        ${this.playlist.subject}
                    </div>
                    <div class="card-info">
                        ${this.playlist.theme}
                    </div>
                    <div class="card-info">
                        ${this.playlist.description}
                    </div>
                </div>
                ${this.user.userType == 'student' ?
                html`
                <paper-icon-button @click="${this.subscribe}" icon="heart"></paper-icon-button>
                ` : html``
            }
            </paper-card>
        `;
    }

    goto() {
        const url = window.MyAppGlobals.rootPath + "playlist?pid=" + this.playlist.pid;
        window.location.href = url;
    }

    subscribe(e) {
        /*
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}/src/Backend/Playlist/subscribe.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
            */
    }

    unsubscribe(e) {
        /*
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}/src/Backend/Playlist/unsubscribe.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
            */
    }
}
customElements.define('component-playlistcard', ComponentPlaylistcard);