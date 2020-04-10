import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-card/paper-card'

export class ComponentPlaylistcard extends LitElement {

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }

            .card {
                width: 25em;
            }
            
            .card-title {
                font-weight: bold;
                font-size: medium;
            }
            `,
        ]
    }

    render() {
        return html`
        <paper-card class="card" heading="Playlist name">
            <div class="card-content">
                <div class="card-title">
                    Subject goes here?
                </div>
                <div class="card-description">
                    Playlist description goes here?
                </div>
            </div>
        </paper-card>
        `;
    }
}
customElements.define('component-playlistcard', ComponentPlaylistcard);