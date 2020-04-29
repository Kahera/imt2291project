import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '../Components/component-videoinfo'
import '@polymer/paper-toast/paper-toast'

export class ViewPlaylistcreate extends LitElement {

    static get properties() {
        return {
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
                padding: 10px 20px;
            }

            paper-input.custom {
                --paper-input-container-label-floating: {
                    width: auto;
                }    
            }

            a {
                text-decoration: none;
                color: black;
            }

            .card {
                width: 50em;
            }
            
            .card-content {
                padding: 1em;
            }

            .btn {
                font-size: small;
                margin-top: 1em;
                margin-bottom: 0.8em;
            }
            `,
        ]
    }

    render() {
        return html`
            <paper-card class="card" heading="Create playlist">
                <div class="card-content">
                    <label for="msg">${this.msg}</label>
                    <form onsubmit="javascript: return false;" enctype="multipart/form-data">
                        <paper-input-container always-float-label>
                            <label slot="label" for="title">Title</label>
                            <input slot="input" type="text" name="title" placeholder="Title" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="theme">Theme</label>
                            <input slot="input" type="text" name="theme" placeholder="Theme" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="subject">Subject</label>
                            <input slot="input" type="text" name="subject" placeholder="Subject" required>
                        </paper-input-container>
                        <paper-input-container always-float-label>
                            <label slot="label" for="description">Description</label>
                            <input slot="input" type="text" id="description" name="description" placeholder="Description" required>
                        </paper-input-container>
                        <a href="${window.MyAppGlobals.rootPath}">
                            <paper-button class="btn" raised id="cancel">Cancel</paper-button>
                        </a>
                        <button id="create" @click="${this.createPlaylist}">Create</button>
                    </form>
                </div>
            </paper-card>
            `;
    }

    createPlaylist(e) {
        const data = new FormData(e.target.form); //Wrap the form in a FormData object
        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/playlistCreation.php`);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/playlistCreation.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            console.log(res);
            //Successfully uploaded
            if (res.msg == 'OK') {
                //Go to home page
                window.location = window.MyAppGlobals.rootPath;
            } else {
                return html`
                <paper-toast text="${this.msg}" opened></paper-toast>`
            }
        })
    }
}
customElements.define('view-playlistcreate', ViewPlaylistcreate);