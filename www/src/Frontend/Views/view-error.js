import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-button/paper-button'

export class ViewError extends LitElement {

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
            }
            `,
        ]
    }


    render() {
        return html`
        <h2>Error</h2>

        <p>There was an error.</p>
        <a href="/">
            <paper-button raised>Go back home</paper-button>
        </a>`;
    }

}
customElements.define('view-error', ViewError);