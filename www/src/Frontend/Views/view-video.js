import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '../Components/component-videoplayer'
import '../Components/component-videoinfo'

export class ViewVideo extends LitElement {
    //Some code borrowed from videoVTT example

    static get properties() {
        return {
            user: Object,
            userPlaylists: Array,
            video: Object,
            comments: Array,
            videofile: String,
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

        this.getVideo();


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
        //this.getComments();

        //Check if user is teacher or admin - if yes, get that users owned playlists
        /*if (this.user.type == 'teacher' || this.user.type == 'admin') {
            this.getUsersPlaylists();
        }
        */
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
        <p>heihei</p>
        <div class="info">
            <component-videoplayer videofile="${this.videofile}" vttfile="${this.vttfile}></component-videocard>
            <component-videocueviewer cues="${this.cues}" activecues="${this.activecues}"></component-videocueviewer>
        </div>

        <div class="teacherButtons">
        ${(this.user.type == 'teacher' || this.user.type == 'admin') ?
                html`
            <paper-button class="btn" id="btn_delete" @click=${this.deleteVideo}>Delete video</paper-button>

            <paper-dropdown-menu id="dropdown">
                ${this.userPlaylists.map(i => html`<paper-item video=${i}.title></paper-item>`)}
            </paper-dropdown-menu>
            <paper-button class="btn" id="btn_add" @click="${this.addVideoToPlaylist}" raised>Add to playlist</paper-button>`
                : html``
            }
        </div>

        <div class="comments">
            ${this.userPlaylists.map(i => html`<paper-item comments="${this.comments}"></paper-item>`)}
        </div>
        `;
    }

    getVideo() {
        //Get vid from URL and append to form
        var vid = location.search.split('vid=')[1];

        const data = new FormData();
        data.append('vid', vid);

        //Then fetch the video info
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getVideo.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                this.video = res;
            } else {
                this.msg = res.msg;
            }
        })

        //And fetch videofile
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getVideoFile.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.arrayBuffer()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                this.videofile = res;
            } else {
                this.msg = res.msg;
            }
        })
    }

    addVideoToPlaylist(e) {
        const data = new FormData(e.target.form);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/addVideoToPlaylist.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(data => this.msg = data['msg']);
    }

    getComments() {

    }

    getUsersPlaylists() {

    }


}
customElements.define('view-video', ViewVideo);