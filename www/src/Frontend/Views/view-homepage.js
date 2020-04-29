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
            playlistMsg: String
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        //Initialise properties with empty arrays
        this.videos = [];
        this.playlists = [];

        //TODO: Figure out searched terms

        //Gets videos and playlists with check on which should be gotten
        if (this.user.Type == 'student') {
            this.getSubscribedPlaylists();
            this.getSubscribedVideos();
            this.videoResulttype = "Videos from subscribed playlists";
            this.playlistResulttype = "Subscribed playlists";
        } else if (this.user.Type == 'teacher' || this.user.Type == 'admin') {
            this.getOwnedPlaylists();
            this.getOwnedVideos();
            this.videoResulttype = "Your videos";
            this.playlistResulttype = "Your playlists";
        }

        if (this.videos.length < 1) {
            this.getAllVideos();
            this.videoResulttype = "All videos";
        }
        if (this.playlists.length < 1) {
            this.getAllPlaylists();
            this.playlistResulttype = "All playlists";
        }
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }

            .content {
                display: grid;
                grid-template-columns: 3em 50% 50% 3em;
                grid-template-rows: auto;
            }

            .videos {
                grid-column-start: 2;
                grid-row-start: 1;
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
                ${this.videos.map(i => html`<component-videocard .video=${i}></component-videocard>`)}

            </div>
            <div class="playlists">
                <h2>${this.playlistResulttype}</h2>
                ${this.playlistMsg ? html`<p>${this.playlistMsg}` : html``}
                ${this.playlists.map(i => html`<component-playlistcard .playlist=${i}></component-playlistcard>`)}
            </div>
        </div>
        `;
    }


    getSubscribedVideos() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/getSubscribedVideos.php`, {
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
            } else {
                this.videoMsg = res.msg;
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
                this.videos = Object.values(res);
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.videos.pop();
            } else {
                this.videoMsg = res.msg;
            }
        })
    }

    getOwnedVideos() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getOwnedVideos.php`, {
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
            } else {
                this.videoMsg = res.msg;
            }
        })
    }

    getOwnedPlaylists() {
        //Append uid to form
        const data = new FormData();
        data.append('uid', this.user.uid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Playlist/getOwnedPlaylists.php`, {
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
            } else {
                this.videoMsg = res.msg;
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
            } else {
                this.playlistMsg = res.msg;
            }
        })
    }

    /*
    _getSearchedPlaylists() {
        get('../../src/Backend/Playlist/getSearchedPlaylists.php').then(playlists => this.playlists = playlists).catch(err => {
            _renderToast('Failed to get searched playlists', err)
        })
    }

    _getSearchedVideos() {
        get('../../src/Backend/Playlist/getSearchedVideos.php').then(playlists => this.playlists = playlists).catch(err => {
            _renderToast('Failed to get searched videos', err)
        })
    }
   */



}
customElements.define('view-homepage', ViewHomepage);