import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/paper-toast'
import '@polymer/iron-ajax/iron-ajax'
import store from '../Redux/store'
import '../Components/component-videocard'
import '../Components/component-playlistcard'

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

        //Gets videos and playlists with check on which should be gotten
        if (this.user.Type == 'student') {
            //this._getSubscribedPlaylists();
            //this._getSubscribedVideos();
        } else if (this.user.Type == 'teacher' || this.user.Type == 'admin') {
            //this._getOwnedPlaylists();
            //this._getOwnedVideos();
        } else {
            //this._getAllPlaylists();
            //this._getAllVideos();
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

    //TODO: Figure out searched videos
    render() {
        return html`
        <div class="content">
            <div class="videos">
                <h2>Videos</h2>
                ${this.videos.map(i => html`<component-videocard video=${i}></component-videocard>`)}
            </div>
            <div class="playlists">
                <h2>Playlists</h2>
                ${this.playlists.map(i => html`<component-playlistcard playlist=${i}></component-playlistcard>`)}
            </div>
        </div>
        `;
    }

    /*
    _getSubscribedVideos() {
        get('../../Backend/Playlist/getSubscribedVideos.php').then(playlists => this.playlists = playlists).catch(err => {
            _renderToast('Failed to get subscribed videos', err)
        })
    }

    _getSubscribedPlaylists() {
        get('../../Backend/Playlist/getSubscribedPlaylists.php').then(playlists => this.playlists = playlists).catch(err => {
            _renderToast('Failed to get subscribed playlists', err)
        })
    }

    _getOwnedVideos() {
        get('../../Backend/Playlist/getOwnedVideos.php').then(playlists => this.playlists = playlists).catch(err => {
            _renderToast('Failed to get owned videos', err)
        })
    }

    _getOwnedPlaylists() {
        get('../../src/Backend/Playlist/getOwnedPlaylists.php').then(playlists => this.playlists = playlists).catch(err => {
            _renderToast('Failed to get owned playlists', err)
        })
    }
    */
    _getAllVideos() {
        return html`
        <iron-ajax
            auto
            url="${window.MyAppGlobals.serverURL}src/Backend/Video/getAllVideos.php"
            handle-as="json"
            on-response="_handlePlaylistResponse"
            debounce-duration = "500"
        ></iron-ajax>
        `
        /*
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getAllVideos.php`)
            .then(res => res.text())
            .then(text => console.log(text))

        request('../../src/Backend/Video/getAllVideos.php').then(videos => this.videos = videos).catch(err => {
            _renderToast('Failed to get all videos', err)
        })
        */
        
    }

    _getAllPlaylists() {
        return html`
        <iron-ajax
            auto
            url="${window.MyAppGlobals.serverURL}src/Backend/Playlist/getAllPlaylists.php"
            handle-as="json"
            on-response="_handlePlaylistResponse"
            debounce-duration = "500"
        ></iron-ajax>
        `
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

    _renderToast(msg, err) {
        return html`<paper-toast text='${msg + ':' + err}'></paper-toast>`
    }
    

    _handlePlaylistResponse(event, request) {
        this.playlists = request.response;
        console.log(this.playlists);
    }

    _handleVideoResponse(event, request) {
        this.videos = request.response;
        console.log(this.videos);
    }
    
}
customElements.define('view-homepage', ViewHomepage);