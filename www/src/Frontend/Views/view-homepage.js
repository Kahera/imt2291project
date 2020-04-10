import { LitElement, html, css } from 'lit-element';
import '../Components/component-videocard'
import '../Components/component-playlistcard'

export class ViewHomepage extends LitElement {

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
                <component-videocard></component-videocard>
            </div>
            <div class="playlists">
                <h2>Playlists</h2>
                <component-playlistcard></component-playlistcard>
            </div>
        </div>
        `;
    }
}
customElements.define('view-homepage', ViewHomepage);