import { LitElement, html, css } from 'lit-element';
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

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }

            .card {
                width: 30em;
                max-width: 100%;
            }
            
            .card-title {
                font-weight: bold;
                font-size: medium;
            }
            `,
        ]
    }

    //TODO: Check if subscribe or unsubscribe based on student subscription
    render() {
        return html`
        <paper-card class="card" heading="${this.playlist.Title}">
            <div class="card-content">
                <div class="card-title">
                    ${this.playlist.subject}
                </div>
                <div class="card-description">
                    ${this.playlist.description}
                </div>
            </div>
            ${this.user.userType == 'student' ?
                html`
            <paper-icon-button @click="${this._subscribe}" icon="heart"></paper-icon-button>
            ` : html``
            }
        </paper-card>
        `;
    }

    _subscribe(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}/src/Backend/Playlist/subscribe.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }

    _unsubscribe(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}/src/Backend/Playlist/unsubscribe.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }

}
customElements.define('component-playlistcard', ComponentPlaylistcard);