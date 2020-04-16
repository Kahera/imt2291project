import { LitElement, html, css } from 'lit-element';
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

        //Gets videos and playlists
        this._getVideos();
        this._getPlaylists();
        //TODO: Check which videos and playlists are to be gotten
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

    //TODO: Make sure one videocard shows up for each video
    render() {
        return html`
        <div class="content">
            <div class="videos">
                <h2>Videos</h2>
                ${this.videos.map(i => html`<component-videocard .video=${i}></component-videocard>`)}
            </div>
            <div class="playlists">
                <h2>Playlists</h2>
                ${this.playlists.map(i => html`<component-playlistcard .playlist=${i}></component-playlistcard>`)}
            </div>
        </div>
        `;
    }

    _getVideos() {
        get('../../Backend/Video/getVideos.php').then(videos => this.videos = videos).catch(err => {
            notify('Failed to get admins', err)
        })
    }

    _getPlaylists() {
        get('../../Backend/Playlist/getPlaylist.php').then(playlists => this.playlists = playlists).catch(err => {
            notify('Failed to get admins', err)
        })
    }
}
customElements.define('view-homepage', ViewHomepage);