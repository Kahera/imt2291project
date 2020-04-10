import { LitElement, html, css } from 'lit-element';
import '../Components/component-usermanagement'

export class ViewAdmin extends LitElement {

    static styles = css`
    :host {
        display: block;
    }
    `;

    render() {
        return html`
        <h2>Admin page</h2>

        <h3>Newly registered teachers</h3>
        <component-usermanagement></component-usermanagement>

        <h3>Admins</h3>
        <component-usermanagement></component-usermanagement>
        `;
    }
}
customElements.define('view-admin', ViewAdmin);