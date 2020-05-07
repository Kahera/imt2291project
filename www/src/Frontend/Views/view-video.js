import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '../Components/component-videoplayer'
import '../Components/component-videocueviewer'
import '../Components/component-videoinfo'
import '../Components/component-comment'
import '../Components/component-comments'
import '@polymer/paper-toast/paper-toast'


export class ViewVideo extends LitElement {
    //Some code borrowed from videoVTT example

    static get properties() {
        return {
            vid: Number,
            user: Object,
            userPlaylists: Array,
            videoInfo: Object,
            comments: Array,
            videofile: String,
            vttfile: String,
            cues: Array,
            activecues: Array,
            selectedPlaylist: Number
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

            //Check if user is teacher or admin - if yes, get that users owned playlists
            if (this.user.userType == 'teacher' || this.user.userType == 'admin') {
                this.getUsersPlaylists();
            }
        })

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
        this.addEventListener('jumpToTimecode', e => this.shadowRoot.querySelector('component-videoplayer').setTime(e.detail.timeCode));

        //Get info
        this.getVideoInfo();
        this.getComments();
        this.getSubtitles();
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
                width: 85%;
            }

            .container {
                display: grid;
                grid-template-columns: 1em 4fr 1fr 1em;
                grid-template-rows: minmax(auto, 800px); 
            }

            .cues {
                grid-column-start: 3;
                grid-row-start: 1;
            }

            .player {
                grid-column-start: 2;
                grid-row-start: 1;
            }

            .card {
                width: 95%;
                grid-column-start: 2;
                grid-row-start: 2;
                margin-left: 1.5em;
                margin-right: 1.5em;
            }

            component-videocueviewer {
                grid-column-start: 3;
                grid-row-start: 1;
                grid-row-end: 1;
                align-self: start; 
                padding-bottom: 100px;
            }

            component-videoinfo {
                width: 95%;
                margin-left: 1.2em;
                margin-right: 0.5em;
                grid-column-start: 2;
                grid-row-start: 2;
            }

            .teacherButtons {
                grid-column-start: 3; 
                grid-row-start: 2;
            }

            component-comment {
                grid-column-start: 2;
                grid-row-start: 3;
            }

            component-comments {
                grid-column-start: 2;
                grid-row-start: 4;
            }

            paper-item {
                padding-top: 0.5em;
                padding-bottom: 0.5em;
                padding-right: 1em;
                padding-left: 1em;
            }
            `,
        ]
    }

    render() {
        return html`
        <div class="container">
            <div class="player">
                <component-videoplayer 
                    vid="${this.vid}"
                    vttfile="${this.vttfile}">
                </component-videoplayer>
            </div>
            <div class="cues">
                <component-videocueviewer 
                    cues="${this.cues}" 
                    activecues="${this.activecues}">
                </component-videocueviewer>
            </div>

            ${((this.user.userType == 'teacher' && this.user.validated) || this.user.userType == 'admin') ? html`
                <div class="teacherButtons">
                    <paper-button class="btn" id="btn_delete" @click=${this.deleteVideo} raised>Delete video</paper-button>

                    ${this.userPlaylists.length < 1 ? html`
                        <paper-dropdown-menu id="dropdown" label="No playlists to add to" disabled></paper-dropdown-menu>
                    `: html`
                        <paper-dropdown-menu id="dropdown">
                            <paper-listbox slot="dropdown-content" class="dropdown-content" id="listbox" label="Add to playlist" @iron-select="${this.getPidValue}">
                                ${this.userPlaylists.map(i => html`<paper-item playlist=${i.pid}>${i.title}</paper-item>`)}
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-button class="btn" id="btn_add" @click="${this.addVideoToPlaylist}" raised>Add to playlist</paper-button>
                    `}
                </div>

                <paper-card class="card">
                    <div class="card-content">
                        <form onsubmit="javascript: return false;" enctype="multipart/form-data">
                            <paper-input-container always-float-label>
                                <label slot="label" for="title">Title</label>
                                <input slot="input" type="text" name="title" placeholder="${this.videoInfo.title}">
                            </paper-input-container>
                            <paper-input-container always-float-label>
                                <label slot="label" for="description">Description</label>
                                <input slot="input" type="text" id="description" name="description" placeholder="${this.videoInfo.description}">
                            </paper-input-container>
                            <paper-input-container always-float-label>
                                <label slot="label" for="lecturer">Lecturer</label>
                                <input slot="input" type="text" id="lecturer" name="lecturer" placeholder="${this.videoInfo.lecturer}">
                            </paper-input-container>
                            <paper-input-container always-float-label>
                                <label slot="label" for="theme">Theme</label>
                                <input slot="input" type="text" name="theme" placeholder="${this.videoInfo.theme}">
                            </paper-input-container>
                            <paper-input-container always-float-label>
                                <label slot="label" for="subject">Subject</label>
                                <input slot="input" type="text" name="subject" placeholder="${this.videoInfo.subject}">
                            </paper-input-container>
                            <paper-input-container always-float-label>
                                <label slot="label" for="thumbnail">New thumbnail [must be image file]</label>
                                <input slot="input" type="file" name="thumbnailfile" accept="image/*">
                            </paper-input-container>
                            <paper-input-container always-float-label>
                                <label slot="label" for="subtitles">New subtitles [must be .vtt file]</label>
                                <input slot="input" type="file" name="subtitles" accept="text/vtt">
                            </paper-input-container>
                            <button id="register" @click="${this.updateVideo}">Update</button>
                        </form>
                    </div>
                </paper-card>
            
                `: html`
                <!-- Student/not validated teacher/not logged in -->
                <component-videoinfo .video=${this.videoInfo}></component-videoinfo>
            `}

            <component-comment></component-comment>
            <component-comments></component-comments>
        </div>
        `
    }


    firstUpdated() {
        const video = document.querySelector('component-videoplayer');

        video.addEventListener('cuesUpdated', e => {
            document.querySelector('component-videocueviewer').setAttribute('cues', JSON.stringify(e.detail.cues));
        });
    }

    getSubtitles() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getVideoSubtitles.php?vid=${this.vid}`
        ).then(res => res.text()
        ).then(res => {
            this.vttfile = res;
            this.createCues();
        })
    }

    createCues() {
        const videoplayer = this.shadowRoot.querySelector('component-videoplayer');
        const track = videoplayer.shadowRoot.querySelector('video track');

        track.addEventListener('load', e => {
            const tempcues = [];
            const trackCues = e.path[0].track.cues;
            for (let i = 0; i < trackCues.length; i++) {               // Go through the cue list
                tempcues.push(trackCues[i]);                             // Add all cues to an array
            };
            this.cues = tempcues;
        })
    }

    getVideoInfo() {
        //Get vid from URL and append to form
        this.vid = location.search.split('vid=')[1];
        const data = new FormData();
        data.append('vid', this.vid);

        //Then fetch the video info
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getVideo.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                this.videoInfo = res;
            } else {
                this.msg = res.msg;
            }
        })
    }

    getComments() {
        const data = new FormData();
        data.append('vid', this.vid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getComments.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                this.comments = res;
            } else {
                this.msg = res.msg;
            }
        })
    }

    getUsersPlaylists() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/getPlaylistByOwner.php`, {
            method: 'POST',
            credentials: "include"
        }).then(res => res.json()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                this.userPlaylists = Object.values(res);;
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.userPlaylists.pop();
            }
        })
    }

    getPidValue(e) {
        const index = e.target.selected;
        this.selectedPlaylist = this.userPlaylists[index];
    }

    addVideoToPlaylist(e) {
        const data = new FormData(e.target.form);
        data.append('vid', this.vid);
        data.append('pid', this.selectedPlaylist.pid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/addVideoToPlaylist.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                this.msg = "Video added to playlist!";
            } else {
                this.msg = res['msg'];
            }
        });
    }

    updateVideo(e) {
        const data = new FormData(e.target.form);
        var vid = location.search.split('vid=')[1];
        data.append('vid', vid);

        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Video/updateVideo.php`);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/updateVideo.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                //Reload to update page
                window.location.reload();
            } else {
                this.msg = res.msg;
                return html`
                <paper-toast text="${this.msg}" opened></paper-toast> `
            }
        })
    }

    deleteVideo() {
        const data = new FormData();
        data.append('vid', this.vid);

        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Video/deleteVideo.php`);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/deleteVideo.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                window.location = window.MyAppGlobals.rootPath;
            } else {
                this.msg = res.msg;
            }
        })
    }


}
customElements.define('view-video', ViewVideo);