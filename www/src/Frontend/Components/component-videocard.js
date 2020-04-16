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
            }

            .card {
                width: 30em;
                max-width: 100%;
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
        <paper-card class="card" image="${this.video.thumbnail}">
            <div class="card-content">
                <div class="card-title">
                    ${this.video.title}
                </div>
                <div class="card-info">
                    ${this.video.subject}
                </div>
                <div class="card-info-lecturer">
                        ${this.video.lecturer}
                </div>
                <div class="card-info">
                        ${this.video.theme}
                </div>
                <div class="card-description">
                    ${this.video.description}
                </div>
            </div>
        </paper-card>
        `;
    }
}
customElements.define('component-videocard', ComponentVideocard);