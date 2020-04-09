import { LitElement, html } from 'lit-element';

export class Homepage extends LitElement {

    static styles = css`
    :host {
        display: block;
    }
    `;

    render() {
        return html`<p>Hei fra views/homepage.js</p>`;
    }
}
customElements.define('homepage', Homepage);