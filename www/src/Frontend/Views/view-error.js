import { LitElement, html, css } from 'lit-element';

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

        <P>There was an error. 
            <a href="/">Go back home</a>
        </P>`;
    }

}
customElements.define('view-error', ViewError);