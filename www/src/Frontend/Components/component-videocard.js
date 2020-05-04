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

            paper-card {
                cursor: pointer;
                width: 100%;
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
            <paper-card class="card" image="${window.MyAppGlobals.serverURL}src/Backend/Video/getVideoThumbnail.php?vid=${this.video.vid}" @click="${this.goto}">
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
        `;
    }


    goto() {
        const url = window.MyAppGlobals.rootPath + "video?vid=" + this.video.vid;
        window.location.href = url;
    }
}
customElements.define('component-videocard', ComponentVideocard);