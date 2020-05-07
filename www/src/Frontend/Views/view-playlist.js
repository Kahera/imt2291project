import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-toast/paper-toast'
import '@polymer/paper-card/paper-card'

export class ViewPlaylist extends LitElement {

    static get properties() {
        return {
            user: Object,
            playlist: Object,
            videos: Array,
            userVideos: Array,
            videoMsg: String,
            selectedVideo: Number
        }
    }

    //TODO: Set button inactive before value chosen
    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        //Initialise properties with empty arrays
        this.videos = [];
        this.userVideos = [];

        //Subscribe to changes in storage
        store.subscribe((state) => {
            this.user = store.getState().user;

            //Check if user is teacher or admin
            if (this.user.userType == 'teacher' || this.user.userType == 'admin') {
                this.getUsersVideos();
            }
        })
        //Get playlist info and videos in it
        this.getPlaylist();
        this.getPlaylistVideos();
    }


    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
            }

            li {
                list-style-type: none;
                padding-top: 0.5em;
                padding-bottom: 0.5em;
                padding-right: 1em;
                padding-left: 1em;
            }

            .videocard {
                width: 90%;
            }

            .editpage {
                display: grid;
                grid-template-columns: 1em 3fr 1fr 1em;
                grid-template-rows: auto; 
            }

            paper-card {
                padding: 1em;
                grid-column-start: 2;
            }

            paper-dropdown-menu {
                white-space: nowrap;
                width: 60%;
            }

            paper-button {
                font-size: small;
            }

            .btn_add {
                display: inline-block;
            }

            paper-listbox {
                display: inline-block;
            }

            .info-teacher {
                grid-column-start: 2;
                grid-row-start: 1;
            }
            
            component-videocard {
                grid-column-start: 2;
                padding-top: 1em;
                padding-bottom: 1em;
            }

            .teacherButtons {
                grid-column-start: 3;
                padding: 1em; 
            }

            .videoOrder {
                white-space: nowrap;
            }

            .positioninput {
                width: 35%;
                display: inline-block;
                justify-self: centre;
                align-self: centre;
            }

            .btn_update {
                display: inline-block;
                justify-self: centre;
                align-self: centre;
            }

            .videos-teacher {
                display: grid;
                grid-template-columns: 2em 3fr 1fr 2em;
                grid-template-rows: auto; 
            }

            paper-input.custom {
                --paper-input-container-label-floating: {
                    width: auto;
                }    
            }
            `,
        ]
    }

    render() {
        return html`
        ${((this.user.userType == 'teacher' && this.user.validated) || this.user.userType == 'admin') ? html`
        <div class="editpage">
            <paper-card>
                <form onsubmit="javascript: return false;" enctype="multipart/form-data">
                    <paper-input-container always-float-label>
                        <label slot="label" for="title">Title</label>
                        <input slot="input" type="text" name="title" placeholder="${this.playlist.title}">
                    </paper-input-container>
                    <paper-input-container always-float-label>
                        <label slot="label" for="theme">Theme</label>
                        <input slot="input" type="text" name="theme" placeholder="${this.playlist.theme}">
                    </paper-input-container>
                    <paper-input-container always-float-label>
                        <label slot="label" for="subject">Subject</label>
                        <input slot="input" type="text" name="subject" placeholder="${this.playlist.subject}">
                    </paper-input-container>
                    <paper-input-container always-float-label>
                        <label slot="label" for="description">Description</label>
                        <input slot="input" type="text" id="description" name="description" placeholder="${this.playlist.description}">
                    </paper-input-container>
                    <button id="create" @click="${this.updatePlaylistInfo}">Update</button>
                </form>
            </paper-card>

            
            <div class="teacherButtons">
                <paper-button class="btn" id="btn_delete" @click=${this.deletePlaylist} raised>Delete playlist</paper-button></br>
                ${this.userVideos.length < 1 ? html`
                    <paper-dropdown-menu id="dropdown" label="No videos to add" disabled></paper-dropdown-menu>
                `: html`
                    <paper-dropdown-menu id="dropdown" always-float-label label="Add video...">
                        <paper-listbox slot="dropdown-content" class="dropdown-content" id="listbox" @iron-select="${this.getValue}">
                            <!-- These webcomponents don't act as they should... HOW is <li> a reasonable solution???? -->
                            ${this.userVideos.map(i => html`<li><paper-item value="${i.vid}">${i.title}</paper-item></li>`)}
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-button class="btn" id="btn_add" @click="${this.addVideo}" raised>Add</paper-button>
                    `}
            </div>
        </div>
        <hr>
        <div class="videos-teacher">
        ${this.videos.length > 0 ? html`
            ${this.videos.map(i => html`
                <component-videocard class="videocard" .video=${i}></component-videocard>
                <div class="teacherButtons">
                    <form class="videoOrder" onsubmit="javascript: return false;">
                        <button @click="${this.removeVideo}" raised>Remove from playlist</button>
                        <paper-input-container always-float-label auto-validate>
                            <label slot="label" for="position">New position</label>
                            <input slot="input" type="number" id="order" name="order">
                        </paper-input-container>
                        <input type="hidden" id="vid" name="vid" value="${i.vid}">
                        <button class="btn" id="btn_update" @click="${this.updateOrder}">Update</button>
                    </form>
                </div> `)}`
                    : html`<p>${this.videoMsg}</p>`}
        </div>

        <!-- Student/not validated teacher/not logged in -->
        `: html`
            <div class="info">
                <component-playlistcard .playlist=${this.playlist}></component-playlistcard>
            </div>
            <hr>
            <div class="videos">
                ${this.videos.length > 0 ? html`
                    ${this.videos.map(i => html`<component-videocard class="videocard" .video=${i}></component-videocard>`)}
                ` : html`
                    <p>${this.videoMsg}</p>
                `}`}`
    }

    getValue(e) {
        const index = e.target.selected;
        this.selectedVideo = this.userVideos[index];
    }

    getPlaylist() {
        //Get vid from URL and append to form
        var pid = location.search.split('pid=')[1];
        const data = new FormData();
        data.append('pid', pid);

        //Fetch the playlist info
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/getPlaylist.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                this.playlist = res;
            } else {
                this.msg = res.msg;
            }
        })
    }

    getPlaylistVideos() {
        //Get vid from URL and append to form
        var pid = location.search.split('pid=')[1];
        const data = new FormData();
        data.append('pid', pid);

        //And fetch playlist videos
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getVideosByPlaylist.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                this.videos = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.videos.pop();
            } else {
                this.videoMsg = "This playlist has no videos yet.";
            }
        })
    }

    getUsersVideos() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getVideosByOwner.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully logged in
            if (res.msg == 'OK') {
                this.userVideos = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.userVideos.pop();
            }
        })
    }

    addVideo(e) {
        const data = new FormData(e.target.form);
        data.append('pid', this.playlist.pid);
        data.append('vid', this.selectedVideo.vid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/addVideoToPlaylist.php`, {
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
        });
    }

    deletePlaylist() {
        const data = new FormData();
        data.append('pid', this.playlist.pid);

        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/deletePlaylist.php`);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/deletePlaylist.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                //Reload to update page
                window.location.href = window.MyAppGlobals.rootPath;
            } else {
                this.msg = res.msg;
                return html`
                <paper-toast text="${this.msg}" opened></paper-toast> `
            }
        })
    }

    removeVideo(e) {
        const data = new FormData(e.target.form);
        data.append('pid', this.playlist.pid);

        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/removeVideoFromPlaylist.php`);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/removeVideoFromPlaylist.php`, {
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

    updateOrder(e) {
        const data = new FormData(e.target.form);
        data.append('pid', this.playlist.pid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/updatePlaylistOrder.php`, {
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

    updatePlaylistInfo(e) {
        const data = new FormData(e.target.form);
        data.append('pid', this.playlist.pid);
        console.log(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/updatePlaylistInfo.php`);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/updatePlaylistInfo.php`, {
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
}
customElements.define('view-playlist', ViewPlaylist);