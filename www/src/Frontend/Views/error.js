import { LitElement, html, css } from 'lit-element';

export class Error extends LitElement {

    static styles = css`
    :host {
        display: block;
        padding: 10px 20px;
    }
    `;

    render() {
        return html`
        <h2>Error</h2>

        <P>There was an error. 
            <a href="/">Go back home</a>
        </P>`;
    }

}
customElements.define('error', Error);