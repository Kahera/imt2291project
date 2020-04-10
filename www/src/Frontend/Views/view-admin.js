import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
import '../Components/component-usermanagement'
import { get } from '../Utility/requests';

export class ViewAdmin extends LitElement {

    static get properties() {
        return {
            users: Array,
            pending: Array,
        }
    }

    constructor() {
        super();

        const state = store.getState();
        this.user = state.user;

        this.pending = [];

        this._pendingUsers();

    }

    static styles = css`
    :host {
        display: block;
    }
    `;

    render() {
        return html`
        <h2>Admin page</h2>

        ${this.pending.length > 0 ?
                html`
                <h3>Pending teacher requests</h3>
                <component-usermanagement></component-usermanagement>
            `: html`
            <h3>No teachers pending.</h3>
            `
            }

        <h3>Admins</h3>
        <component-usermanagement></component-usermanagement>
        `
    }

    _pendingUsers() {
        get('../../Backend/User/pending.php').then(pending => this.pending = pending).catch(err => {
            notify('Failed to get pending requests', err)
        })
    }
}
customElements.define('view-admin', ViewAdmin);