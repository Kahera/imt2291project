import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'

export class ViewPlaylist extends LitElement {

    static get properties() {
        return {
            user: Object,
            playlist: Object,
            videos: Array,
            userVideos: Array,
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        //Initialise properties with empty arrays
        this.videos = [];
        this.userVideos = [];

        //Get videos and playlists
        this._getPlaylistVideos();
        this._getPlaylist();
        //TODO: Check which videos and playlists are to be gotten

        //Check if user is teacher or admin
        if (this.user.type == 'teacher' || this.user.type == 'admin') {
            this._getUsersVideos();
        }
    }


    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
            }
            `,
        ]
    }

    render() {
        return html`
        <div class="info">
            <component-playlistcard .playlist=${this.playlist}></component-playlistcard>
        </div>

        <div class="teacherButtons">
        ${(this.user.type == 'teacher' || this.user.type == 'admin') ?
                html`
            <paper-button class="btn" id="btn_delete" @click=${this._deletePlaylist}>Delete playlist</paper-button>

            <paper-dropdown-menu id="dropdown">
                ${this.userVideos.map(i => html`<paper-item .video=${i}.title></paper-item>`)}
            </paper-dropdown-menu>
            <paper-button class="btn" id="btn_add" @click="${this._addVideo}" raised>Add video</paper-button>`
                : html``
            }
        </div>

        <div class="videos">
        ${this.videos.map(i =>
                html`
            <component-videocard .video=${i}></component-videocard>
            <paper-button>Remove from playlist</paper-button>
            <div class="videoOrder">
                <paper-input>New position in playlist:</paper-input>
                <paper-button class="btn" id="btn_add" @click="${this._updateOrder}" raised>Update playlist order</paper-button>
            </div>
            `)}
        </div>
        `
    }

    _getPlaylist() {

    }

    __getPlaylistVideos() {

    }

    _getUsersVideos() {

    }

    _addVideo(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/addVideoToPlaylist.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }

    _deletePlaylist(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/deleteVideo.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }

    _updateOrder(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/updateOrder.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }
}
customElements.define('view-playlist', ViewPlaylist);