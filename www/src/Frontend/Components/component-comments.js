import { LitElement, html, css } from 'lit-element';

export class ComponentComments extends LitElement {

    static get properties() {
        return {
            vid: Number,
            comments: Array
        }
    }

    constructor() {
        super();

        //Initialise property with empty array
        this.comments = [];

        //Fill array
        this._getcomments();
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

    //TODO: If comment user == user uid -> show delete button 
    render() {
        return html`
        ${this.comments.map(comment => html`
        <comment-author>${comment.email}</comment-author>
        <comment>${comment.comment}</comment>
        `)}
        `;
    }

    _getComments() {
        get('../../Backend/Video/getComments.php').then(comments => this.comments = comments).catch(err => {
            notify('Failed to get comments', err)
        })
    }
}
customElements.define('component-comments', ComponentComments);