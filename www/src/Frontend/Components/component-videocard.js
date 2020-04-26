import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-card/paper-card'

export class ComponentVideocard extends LitElement {

    static get properties() {
        return {
            video: Object
        }
    }


    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding-bottom: 1em;
            }

            a {
                text-decoration: none;
                color: black;
            }

            .card {
                width: 40em;
                max-width: 90%;
            }
            
            .card-title {
                font-weight: bold;
                font-size: medium;
            }

            .card-info {
                font-size: small;
            }
            `,
        ]
    }

    //TODO: Insert image again when figuring out getting files
    //in paper-card: image="${this.video.thumbnail}"
    render() {
        return html`
        <a href="${window.MyAppGlobals.rootPath}video/${this.video.vid}">
            <paper-card class="card">
                <div class="card-content">
                    <div class="card-title">
                        ${this.video.title}
                    </div>
                    <div class="card-info">
                        Subject: ${this.video.subject}
                    </div>
                    <div class="card-info">
                        Lecturer: ${this.video.lecturer}
                    </div>
                    <div class="card-info">
                        Theme: ${this.video.theme}
                    </div>
                    <div class="card-info">
                        Description: ${this.video.description}
                    </div>
                </div>
            </paper-card>
        </a>
        `;
    }
}
customElements.define('component-videocard', ComponentVideocard);