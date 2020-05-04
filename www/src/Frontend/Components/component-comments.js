import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-card/paper-card'

export class ComponentComments extends LitElement {

    static get properties() {
        return {
            comments: Array,
            vid: Number,
            msg: String,
        }
    }

    constructor() {
        super();

        //Get vid
        this.vid = location.search.split('vid=')[1];

        //Initialise property with empty array
        this.comments = [];

        //Fill array
        this.getComments();
    }


    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
            }

            .comment-author {
                font-weight: bold;
            }

            paper-card {
                width: 100%;
                padding: 1em;
                margin-bottom: 1em;
            }
            `,
        ]
    }

    //TODO: If comment user == user uid -> show delete button 
    render() {
        return html`
            ${this.comments.length < 1 ? html`
                ${this.msg}
            ` : html`
            ${this.comments.map(comment => html`
                <paper-card>
                    <div class="comment-author">${comment.email}</div>
                    <div class="comment">${comment.comment}</div>
                </paper-card>
                </br>
            `)}
            `}
        `;
    }

    getComments() {
        //Get vid from URL and append to form
        const data = new FormData();
        data.append('vid', this.vid);

        //Then fetch the video info
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/getComments.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                this.comments = Object.values(res);;
                //Because msg becomes it's own element, pop one to remove this before mapping
                this.comments.pop();
            } else {
                this.msg = res.msg;
            }
        })
    }

    deleteComment() {
        //Get vid from URL and append to form
        const data = new FormData();
        data.append('vid', this.vid);
        data.append('cid', this.selectedComment.cid);

        //Then fetch the video info
        fetch(`${window.MyAppGlobals.serverURL}src/Backend/Video/deleteComment.php`, {
            method: 'POST',
            credentials: "include",
            body: data
        }).then(res => res.json()
        ).then(res => {
            if (res.msg == 'OK') {
                this.comments = res;
            } else {
                this.msg = res.msg;
            }
        })
    }

}
customElements.define('component-comments', ComponentComments);