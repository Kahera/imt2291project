import { LitElement, html, css } from 'lit-element';
import store from '../Redux/store'
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

        this.vid = location.search.split('vid=')[1];
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
        <div class="container">
            <form id="form" onsubmit="javascript: return false;" enctype="multipart/form-data">
                <paper-input-container id="input" always-float-label>
                    <label slot="label" for="comment">Add a comment</label>
                    <input slot="input" type="text" id="comment" name="comment"></paper-input>
                </paper-input-container>
                <button id="btn_comment" @click="${this.comment}" raised>Comment</button>
            </form>
        </div>
        `;
    }

    comment(e) {
        const data = new FormData(e.target.form);
        data.append('vid', this.vid);

        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/addComment.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                window.location.reload();
            } else {
                this.msg = res.msg;
            }
        })
    }
}
customElements.define('component-comment', ComponentComment);