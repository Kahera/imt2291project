import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-toast'
import store from '../Redux/store'
import '../Components/component-usermanagement'
import get from '../Utility/requests';

export class ViewAdmin extends LitElement {

    static get properties() {
        return {
            user: Object,
            teachersPending: Array,
            teachersConfirmed: Array,
            admins: Array
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;

        //Initialise properties with empty arrays
        this.teachersPending = [];
        this.teachersConfirmed = [];
        this.admins = [];

        //Fill arrays
        this._getPendingTeachers();
        this._getValidatedTeachers();
        this._getAdmins();
    }

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
        <h2>Admin page</h2>

        ${this.teachersPending.length > 0 ?
                html`
                <h3>Pending teacher requests</h3>
                ${this.teachersPending.map(i => html`<component-usermanagement .user=${i} .pending="true"></component-usermanagement>`)}

            `: html`
                <h3> No teachers pending.</h3>
            `}
        <h3>Teachers</h3>
        ${this.teachersConfirmed.map(i => html`<component-usermanagement .user=${i}></component-usermanagement>`)}
        
        <h3>Admins</h3>
        ${this.admins.map(i => html`<component-usermanagement .user=${i}></component-usermanagement>`)}
        `
    }

    _getPendingTeachers() {
        get('../../Backend/User/getPendingTeachers.php').then(pending => this.teachersPending = pending).catch(err => {
            _renderToast('Failed to get pending teachers', err)
        })
    }

    _getValidatedTeachers() {
        get('../../Backend/User/getConfirmedTeachers.php').then(confirmed => this.teachersConfirmed = confirmed).catch(err => {
            _renderToast('Failed to get teachers', err)
        })
    }

    _getAdmins() {
        get('../../Backend/User/getAdmins.php').then(admins => this.admins = admins).catch(err => {
            _renderToast('Failed to get admins', err)
        })
    }

    _renderToast(msg, err) {
        return html`<paper-toast text='${msg + ':' + err}'></paper-toast>`
    }
}
customElements.define('view-admin', ViewAdmin);