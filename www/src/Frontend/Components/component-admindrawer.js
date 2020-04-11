import { LitElement, html } from 'lit-element';
import '@polymer/app-layout/app-drawer/app-drawer'

export class ComponentDrawer extends LitElement {

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }
            `,
        ]
    }

    render() {
        return html`
        <app-drawer slot="drawer" swipe-open="[[narrow]]">
            <app-toolbar>Admin</app-toolbar>
            <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="naviation">
                <a name="AdminPage" href="[[rootPath]]view-admin">Administer users</a>
            </iron-selector>
        </app-drawer>
        
        `;
    }

}
customElements.define('component-drawer', ComponentDrawer);