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

        //Subscribe to changes in storage
        store.subscribe((state) => {
            this.user = store.getState().user;
        })

    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding-bottom: 1em;
            }

            .container {
                padding: 1em;
                display: grid;
                grid-template-columns: 9fr 1fr;
                grid-template-rows: auto;
            }

            .card-content {
                grid-column-start: 1;
                grid-row-start: 1;
            }

            .btn {
                color: #4C4C4C
                grid-column-start: 2;
                grid-row-start: 1;
                justify-self: center;
                align-self: center;
            }

            paper-card {
                cursor: pointer;
                width: 100%;
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
            <paper-card class="card">
                <div class="container">
                    <div class="card-content" @click="${this.goto}">
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
                    <paper-icon-button class="btn" @click="${this.subscribe}" icon="favorite"></paper-icon-button>
                    ` : html``
            }
                </div>
            </paper-card>
            
        `;
    }

    goto() {
        const url = window.MyAppGlobals.rootPath + "playlist?pid=" + this.playlist.pid;
        window.location.href = url;
    }

    subscribe() {
        //Append values to form
        const data = new FormData();
        data.append('uid', this.user.uid);
        data.append('pid', this.playlist.pid);

        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/subscribe.php`);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/subscribe.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                //something
            } else {
                this.videoMsg = res.msg;
            }
        })
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