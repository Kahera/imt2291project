import { LitElement, html } from 'lit-element';
import '../Components/component-videoplayer'
import '../Components/component-videoinfo'

export class ViewVideo extends LitElement {
    //Some code borrowed from videoVTT example

    static get properties() {
        return {
            user: Object,
            userPlaylists: Array,
            comments: Array,
            videofile: String,
            videotype: String,
            vttfile: String,
            cues: String,
            activecues: Array
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        //Initialise properties with empty arrays
        this.comments = [];
        this.userPlaylists = [];
        this.videofile = '';
        this.videotype = '';
        this.vttfile = '';
        this.cues = [];
        this.activecues = [];

        //Set event listeners
        this.addEventListener('cuesUpdated', e => this.cues = JSON.stringify(e.detail.cues));
        this.addEventListener('cuechange', e => this.activecues = JSON.stringify(e.detail.activeCues));
        this.addEventListener('jumpToTimecode', e => this.shadowRoot.querySelector('video-viewer').setTime(e.detail.timeCode));

        //Get comments
        this._getComments();

        //Check if user is teacher or admin - if yes, get that users owned playlists
        if (this.user.type == 'teacher' || this.user.type == 'admin') {
            this._getUsersPlaylists();
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

    //TODO: Comment component
    //TODO: Texting
    //TODO: If teacher - add to playlist
    render() {
        return html`
        <div class="info">
            <component-videoplayer videofile="${this.videofile}" videotype="${this.videotype}" vttfile="${this.vttfile}></component-videocard>
            <component-videocueviewer cues="${this.cues}" activecues="${this.activecues}"></component-videocueviewer>
        </div>

        <div class="teacherButtons">
        ${(this.user.type == 'teacher' || this.user.type == 'admin') ?
                html`
            <paper-button class="btn" id="btn_delete" @click=${this._deleteVideo}>Delete video</paper-button>

            <paper-dropdown-menu id="dropdown">
                ${this.userPlaylists.map(i => html`<paper-item video=${i}.title></paper-item>`)}
            </paper-dropdown-menu>
            <paper-button class="btn" id="btn_add" @click="${this._addVideo}" raised>Add to playlist</paper-button>`
                : html``
            }
        </div>

        <div class="comments">
            ${this.userPlaylists.map(i => html`<paper-item comments="${this.comments}"></paper-item>`)}
        </div>
        `;
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

    _getComments() {

    }

    _getUsersPlaylists() {

    }


}
customElements.define('view-video', ViewVideo);