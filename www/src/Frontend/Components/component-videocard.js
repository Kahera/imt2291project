import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-card/paper-card'

export class ComponentVideocard extends LitElement {

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
        <paper-card class="card" image="https://www.insertcart.com/wp-content/uploads/2018/05/thumbnail.jpg">
            <div class="card-content">
                <div class="card-title">
                    Title here
                </div>
                <div class="card-description">
                    Video description goes here?
                </div>
            </div>
        </paper-card>
        `;
    }
}
customElements.define('component-videocard', ComponentVideocard);