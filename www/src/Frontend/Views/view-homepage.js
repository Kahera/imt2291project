import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '../Components/component-videocard'
import '../Components/component-playlistcard'
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/paper-toast'
import '@polymer/iron-ajax/iron-ajax'

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

export class ViewHomepage extends LitElement {

    static get properties() {
        return {
            user: Object,
            videos: Array,
            playlists: Array,
            videoResulttype: String,
            playlistResulttype: String,
            videoMsg: String,
            playlistMsg: String,
            search: String
        }
    }

    constructor() {
        super();

        //Initialise properties with empty arrays
        this.videos = [];
        this.playlists = [];

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        //Subscribe to changes in storage
        store.subscribe((state) => {
            this.user = store.getState().user;

            this.search = location.search.split('search=')[1];

            if (this.search) {
                this.getSearchedVideos();
                this.getSearchedPlaylists();
            } else {
                //Gets videos and playlists with check on which should be gotten
                if (this.user.userType == 'student') {
                    this.getSubscribedPlaylists();
                    this.getSubscribedVideos();
                } else if (this.user.userType == 'teacher' || this.user.userType == 'admin') {
                    this.getOwnedPlaylists();
                    this.getOwnedVideos();
                } else {
                    this.getAllVideos();
                    this.getAllPlaylists();
                }
            }
        })
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }

            .content {
                display: grid;
                grid-template-columns: 1fr 20fr 20fr 1fr;
                grid-template-rows: auto;
            }

            .videos {
                grid-column-start: 2;
                grid-row-start: 1;
            }

            .card {
                width: 90%;
            }

            .playlists {
                grid-column-start: 3;
                grid-row-start: 1;
            }
            `,
        ]
    }

    render() {
        return html`
        <div class="content">
            <div class="videos">
                <h2>${this.videoResulttype}</h2>
                ${this.videoMsg ? html`<p>${this.videoMsg}` : html``}
                ${this.videos.map(i => html`<component-videocard class="card" .video=${i}></component-videocard>`)}

            </div>
            <div class="playlists">
                <h2>${this.playlistResulttype}</h2>
                ${this.playlistMsg ? html`<p>${this.playlistMsg}` : html``}
                ${this.playlists.map(i => html`<component-playlistcard class="card" .playlist=${i}></component-playlistcard>`)}
            </div>
        </div>
        `;
    }

    firstUpdated(changedProperties) {
        if (this.videos.length < 1) {
            this.getAllVideos();
        }
        if (this.playlists.length < 1) {
            this.getAllPlaylists();
        }
    }


    getSubscribedVideos() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getSubscribedVideos.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.videos = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.videos.pop();
                this.videoResulttype = "Videos from subscribed playlists";
            }
        })
    }

    getSubscribedPlaylists() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/getSubscribedPlaylists.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.playlists = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.playlists.pop();
                this.playlistResulttype = "Subscribed playlists";
            }
        })
    }

    getOwnedVideos() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getVideosByOwner.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.videos = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.videos.pop();
                this.videoResulttype = "Your videos";
            }
        })
    }

    getOwnedPlaylists() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/getPlaylistByOwner.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.playlists = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.playlists.pop();
                this.playlistResulttype = "Your playlists";
            }
        })
    }

    getAllVideos() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getAllVideos.php`
        ).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.videos = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.videos.pop();
                this.videoResulttype = "All videos";
            } else {
                this.videoMsg = res.msg;
            }
        })
    }

    getAllPlaylists() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/getAllPlaylists.php`
        ).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.playlists = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.playlists.pop();
                this.playlistResulttype = "All playlists";
            } else {
                this.playlistMsg = res.msg;
            }
        })
    }

    getSearchedPlaylists() {
        //Append search term to form
        const data = new FormData();
        data.append('searchTerm', this.search);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/searchPlaylists.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.playlists = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.playlists.pop();
                this.playlistResulttype = "Searched playlists";
            } else {
                this.playlistMsg = res.msg;
            }
        })
    }

    getSearchedVideos() {
        //Append search term to form
        const data = new FormData();
        data.append('searchTerm', this.search);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/searchVideos.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            //Successfully retrieved
            if (res.msg == 'OK') {
                this.videos = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.videos.pop();
                this.videoResulttype = "Searched videos";
            } else {
                this.videoMsg = res.msg;
            }
        })
    }

}
customElements.define('view-homepage', ViewHomepage);