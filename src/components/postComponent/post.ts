import '../postPopUp/postPopUp'
import PostPopUp, { Attribute3 } from '../../components/postPopUp/postPopUp';
import { addLikes } from '../../utils/firebase'
import { addLikesAction } from '../../store/actions';
import { dispatch, appState, addObserver } from '../../store';

import { addComment } from '../../utils/firebase';
import { addCommentAction } from '../../store/actions';

export enum Attribute2 {
    'clubpic' = 'clubpic',
    'clubname' = 'clubname',
    'image' = 'image',
    'likes' = 'likes',
    'author' = 'author',
    'desc' = 'desc',
    'uid' = 'uid',
};

class Post extends HTMLElement {
    clubpic?: string;
    clubname?: string;
    image?: string;
    author?: string;
    desc?: string;
    likes: number = 0;
    liked: boolean = false;
    uid: any;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
        this.uid = appState.user;
        this.clubpic = '';
        this.clubname = '';
        this.image = '';
        this.author = '';
        this.desc = '';
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
        console.log("Component connected");
        this.render();
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
                <span class="comments"><i class="fas fa-comment"></i> 0</span>
                </div>
                <div class="post--author">
                <h3>@${this.author}</h3>
                <p>${this.desc}</p>
                </div>
                </div>  
                <div class="comments-list" id="commentsList">
                </div>
                </div>
                </section>
                `;

            // this.addImageClickHandler();
            this.addLikeHandler();
            // this.addComments();
        }
    }

    // addImageClickHandler() {
    //     const postImage = this.shadowRoot?.querySelector<HTMLImageElement>('.post-image');

    //     if (postImage) {
    //         postImage.addEventListener('click', (event) => {
    //             event.stopPropagation();

    //             const postPopup = document.createElement('post-popup') as PostPopUp;
    //             postPopup.setPopupData(
    //                 [], // Empty comments array
    //                 this.clubname,
    //                 this.image,
    //                 this.clubpic,
    //                 this.author,
    //                 this.desc,
    //                 this.liked,
    //             );
    //             document.body.appendChild(postPopup);
    //             console.log("clicked");
    //         });
    //     }
    // }

    // addComments() {
    //     const input = this.shadowRoot?.querySelector<HTMLInputElement>('#commentInput');
    //     const button = this.shadowRoot?.querySelector<HTMLButtonElement>('#sendComment');
    //     const commentsList = this.shadowRoot?.querySelector<HTMLDivElement>('#commentsList');

    //     if (input && button && commentsList && this.uid) {
    //         button.addEventListener('click', async () => {
    //             const commentText = input.value.trim();
    //             if (commentText) {
    //                 try {
    //                     // Guardar el comentario en Firebase
    //                     await addComment(this.uid, commentText);

    //                     // Crear elemento de comentario
    //                     const commentElement = document.createElement('p');
    //                     commentElement.classList.add('comment-item');
    //                     commentElement.textContent = `@${this.author}: ${commentText}`;

    //                     // Agregar el comentario al div de comentarios
    //                     commentsList.appendChild(commentElement);
    //                     input.value = '';

    //                     // Despachar acción para actualizar el estado global
    //                     dispatch(addCommentAction(this.uid, commentText));
    //                 } catch (error) {
    //                     console.error("Error adding comment:", error);
    //                 }
    //             }
    //         });

    //         input.addEventListener('keypress', (event) => {
    //             if (event.key === 'Enter') {
    //                 button.click();
    //             }
    //         });
    //     }
    // }

    async addLikeHandler() {
        const likeButton = this.shadowRoot?.querySelector<HTMLButtonElement>('#likeButton');

        if (likeButton && this.uid) {
            likeButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                console.log("Button clicked!");

                // Optimistic update
                this.liked = !this.liked;
                this.likes += this.liked ? 1 : -1;

                likeButton.innerHTML = `<i class="${this.liked ? 'fas fa-heart' : 'far fa-heart'}"></i> ${this.likes}`;
                console.log(`Liked: ${this.liked}, Likes: ${this.likes}`);

                try {
                    // Update in Firebase
                    const updatedLikes = await addLikes(this.uid, this.uid);
                    this.likes = updatedLikes;
                    dispatch(addLikesAction(this.uid, this.liked));
                } catch (error) {
                    console.error("Error adding like:", error);

                    // Revert changes in case of error
                    this.liked = !this.liked;
                    this.likes += this.liked ? 1 : -1;
                    likeButton.innerHTML = `<i class="${this.liked ? 'fas fa-heart' : 'far fa-heart'}"></i> ${this.likes}`;
                }
            });
        } else {
            console.error("Like button not found or UID is missing.");
        }
    }



    toggleLike() {
        this.liked = !this.liked;
    }
}

customElements.define('post-component', Post);
export default Post;