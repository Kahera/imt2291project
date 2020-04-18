import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-input/paper-input'
import '@polymer/paper-button/paper-button'

export class ComponentComment extends LitElement {

    static get properties() {
        return {
            vid: Number,
            user: Object
        }
    }

    constructor() {
        super();

        //Load user from storage
        const state = store.getState();
        this.user = state.user;
    }


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

    //TODO: disable button until input is filled
    render() {
        return html`
        <paper-input type="text" id="input_comment" label="Add a comment"></paper-input>
        <paper-button id="btn_comment" @click="${this._comment}">Comment</paper-button>
        `;
    }

    _comment(e) {
        const data = new FormData(e.target.form);
        data.append('vid', this.vid);
        data.append('user', this.user.uid);
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/comment.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json())
            .then(data => this.msg = data['msg']);
    }
}
customElements.define('component-comment', ComponentComment);