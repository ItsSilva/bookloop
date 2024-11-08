import '../postPopUp/postPopUp'
import PostPopUp, { Attribute3 } from '../../components/postPopUp/postPopUp';
import { addLikes } from '../../utils/firebase'
import { addLikesAction } from '../../store/actions';
import { dispatch, appState, addObserver } from '../../store';

export enum Attribute2 {
    'clubpic' = 'clubpic',
    'clubname' = 'clubname',
    'image' = 'image',
    'likes' = 'likes',
    'comments' = 'comments',
    'author' = 'author',
    'desc' = 'desc',
    'uid' = 'uid',
};

class Post extends HTMLElement {
    clubpic?: string;
    clubname?: string;
    image?: string;
    comments?: number;
    author?: string;
    desc?: string;
    usercomments: string[] = [];
    likes: number = 0;
    liked: boolean = false;
    uid: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
        this.uid = '';
        this.clubpic = '';
        this.clubname = '';
        this.image = '';
        this.comments = 0;
        this.author = '';
        this.desc = '';
        this.usercomments = [];
        this.likes = 0;
        this.liked = false;
    }

    static get observedAttributes() {
        return Object.keys(Attribute2) as Array<Attribute2>;
    }

    attributeChangedCallback(propName: Attribute2, oldValue: string | number | undefined, newValue: string | number | undefined) {
        switch (propName) {
            case Attribute2.clubpic:
                this.clubpic = newValue as string;
                break;
            case Attribute2.clubname:
                this.clubname = newValue as string;
                break;
            case Attribute2.image:
                this.image = newValue as string;
                break;
            case Attribute2.likes:
                this.likes = newValue ? Number(newValue) : 0; // Convert to number
                break;
            case Attribute2.comments:
                this.comments = newValue ? Number(newValue) : 0; // Convert to number
                break;
            case Attribute2.author:
                this.author = newValue as string;
                break;
            case Attribute2.desc:
                this.desc = newValue as string;
                break;
            case Attribute2.uid:
                this.uid = newValue as string;
                break;
            default:
                break;
        }
        this.render();
    }

    connectedCallback() {
        this.render();
        this.addComments();
        this.addLikeHandler();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="../src/components/postComponent/post.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                
                <section class="post--container">
                <div class="post--header">
                <img src="${this.clubpic}" alt="Club Picture" class="club-pic">
                <div class="club-info">
                <h2>${this.clubname}</h2>
                </div>
                </div>
                <img src="${this.image}" alt="Post Image" class="post-image">
                <div class="post--body">
                <div class="post--info">
                <button class="likes" id="likeButton">
                <i class="${this.liked ? 'fas fa-heart' : 'far fa-heart'}"></i> 
                ${this.likes}
                </button>
                <span class="comments"><i class="fas fa-comment"></i> ${this.usercomments.length}</span>
                </div>
                <div class="post--author">
                <h3>@${this.author}</h3>
                <p>${this.desc}</p>
                </div>
                </div>  
                <div class='container-inputs'>
                <div class="input-wrapper-inputtext">
                <i class="fa-solid fa-message" style="color: #999;"></i>
                <input type="text" placeholder="Say something!" name="textInput" id="commentInput">
                <button type="submit" id="sendComment">Send</button>
                </div>
                <div class="comments-list">
                ${this.usercomments.map(comment => `<p class="comment-item">@${this.author}: ${comment}</p>`).join('')}
                </div>
                </div>
                </section>
                `;

            this.addImageClickHandler();
            this.addLikeHandler();
            this.addComments();
        }
    }

    addImageClickHandler() {
        const postImage = this.shadowRoot?.querySelector<HTMLImageElement>('.post-image');

        if (postImage) {
            postImage.addEventListener('click', (event) => {
                event.stopPropagation();

                const postPopup = document.createElement('post-popup') as PostPopUp;
                postPopup.setPopupData(
                    this.usercomments,
                    this.clubname,
                    this.image,
                    this.clubpic,
                    this.author,
                    this.desc,
                    this.liked,
                );
                document.body.appendChild(postPopup);
                console.log("clicked");
            });
        }
    }

    addComments() {
        const input = this.shadowRoot?.querySelector<HTMLInputElement>('#commentInput');
        const button = this.shadowRoot?.querySelector<HTMLButtonElement>('#sendComment');

        if (input && button) {
            button.addEventListener('click', () => {
                const commentText = input.value.trim();
                if (commentText) {
                    this.usercomments.push(commentText);
                    this.comments = this.usercomments.length;
                    this.render();
                    input.value = '';
                }
            });

            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    button.click();
                }
            });
        }
    }

    async addLikeHandler() {
        const likeButton = this.shadowRoot?.querySelector<HTMLButtonElement>('#likeButton');

        if (likeButton && this.uid) {
            likeButton.addEventListener('click', async (e) => {
                e.stopPropagation();

                this.toggleLike();
                this.likes += this.liked ? 1 : -1;

                try {
                    await addLikes(this.uid, this.liked);
                    dispatch(addLikesAction(this.uid, this.liked));
                    this.render();
                } catch (error) {
                    console.error("Error adding likes:", error);
                    this.toggleLike(); // Revert like state if there's an error
                    this.likes += this.liked ? -1 : 1;
                    this.render();
                }
            });
        }
    }

    toggleLike() {
        this.liked = !this.liked;
    }
}

customElements.define('post-component', Post);
export default Post;