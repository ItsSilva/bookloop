import '../postPopUp/postPopUp'
import PostPopUp, { Attribute3 } from '../../components/postPopUp/postPopUp';
import { addLikes } from '../../utils/firebase';
import { addLikesAction } from '../../store/actions';
import { dispatch, appState, addObserver } from '../../store';

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
    uid?: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
        this.uid = appState.userData?.uid;
    }

    static get observedAttributes() {
        return Object.keys(Attribute2) as Array<Attribute2>;
    }

    attributeChangedCallback(
        propName: Attribute2,
        oldValue: string | number | undefined,
        newValue: string | number | undefined
    ) {
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
                this.likes = newValue ? Number(newValue) : 0;
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
                    <div class="comments-list" id="commentsList"></div>
                </section>
            `;

            this.addLikeHandler(); // Solo se llama en render
        }
    }

    async addLikeHandler() {
        const likeButton = this.shadowRoot?.querySelector<HTMLButtonElement>('#likeButton');

        if (likeButton) {
            likeButton.addEventListener('click', async (e) => {
                e.stopPropagation();

                console.log('click en', this.uid);


                if (!this.uid) {
                    console.error("Post UID is missing!");
                    return;
                }

                likeButton.innerHTML = `<i class="${this.liked ? 'fas fa-heart' : 'far fa-heart'}"></i> ${this.likes}`;

                try {
                    console.log('appstate id en post', appState);
                    console.log('user id en post', appState.userData.uid);

                    const userId = appState.userData.uid;
                    if (!userId) {
                        throw new Error("User ID not found in appState!");
                    }

                    // Update likes in Firebase
                    const updatedLikes = await addLikes(this.uid); // Pasamos el ID del post, no el userId
                    return updatedLikes

                } catch (error) {
                    console.error("Error updating likes:", error);
                    likeButton.innerHTML = `<i class="${this.liked ? 'fas fa-heart' : 'far fa-heart'}"></i> ${this.likes}`;
                }
            });
        }
    }
}

customElements.define('post-component', Post);
export default Post;
