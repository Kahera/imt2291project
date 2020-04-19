import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-toast'
import store from '../Redux/store'
import { get, request } from '../Utility/requests'
import '../Components/component-videocard'
import '../Components/component-playlistcard'

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
            this._getSubscribedPlaylists();
            this._getSubscribedVideos();
        } else if (this.user.Type == 'teacher' || this.user.Type == 'admin') {
            this._getOwnedPlaylists();
            this._getOwnedVideos();
        } else {
            this._getAllPlaylists();
            this._getAllVideos();
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

    _getAllVideos() {
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getAllVideos.php`)
            .then(res => res.text())
            .then(text => console.log(text))


        /*
    request('../../src/Backend/Video/getAllVideos.php').then(videos => this.videos = videos).catch(err => {
        _renderToast('Failed to get all videos', err)
    })
    */
    }

    _getAllPlaylists() {
        request('../../src/Backend/Playlist/getAllPlaylists.php').then(playlists => this.playlists = playlists).catch(err => {
            _renderToast('Failed to get all playlists', err)
        })
    }

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

    _renderToast(msg, err) {
        return html`<paper-toast text='${msg + ':' + err}'></paper-toast>`
    }
}
customElements.define('view-homepage', ViewHomepage);