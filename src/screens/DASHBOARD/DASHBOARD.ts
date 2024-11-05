import * as components from '../../components/index';
import '../../components/userInfo/userInfo';
import '../../components/navBar/navBar';
import '../../components/userMenu/userMenu';
import '../../components/newPost/newPost';
import '../../components/postComponent/post';
import UserInfo, { AttributeUserInfo } from '../../components/userInfo/userInfo';
import { dataUsers } from '../../data/dataUsers';
import Post, { Attribute2 } from '../../components/postComponent/post';
import { dataPosts } from '../../data/dataPosts';
import '../../components/postPopUp/postPopUp';
import PostPopUp, { Attribute3 } from '../../components/postPopUp/postPopUp';
import '../../components/elements/clubInfo/clubInfo';
import '../../components/clubsCard/clubsCard';
import ClubsCard, { AttributeClubsCard } from '../../components/clubsCard/clubsCard';
import { dataClubs } from '../../data/dataClubs';
import '../../components/logoutButton/logoutButton'; 
import { appState, dispatch } from '../../store';
import { getUserNameAction, navigate, setUserCredentials } from '../../store/actions';
import { Screens } from '../../types/store';

class Dashboard extends HTMLElement {
    user: UserInfo[] = [];
    post: Post[] = [];
    currentUserPic: string = '';
    isUserContainerVisible: boolean = true;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.currentUserPic = dataUsers[0].userpic;

        dataUsers.forEach(dataUser => {
            const userCard = this.ownerDocument.createElement('user-info') as UserInfo;
            userCard.setAttribute('background', dataUser.background);
            userCard.setAttribute('userpic', dataUser.userpic);
            userCard.setAttribute('name', dataUser.name);
            userCard.setAttribute('username', dataUser.username);
            this.user.push(userCard);
        });
    }

    async connectedCallback() {
        this.addEventListener('toggle-user-container', () => this.toggleUserContainer());
        // if (appState.user) {
        //     const action = await getUserNameAction();
        //     dispatch(action);
        // } else {
        //     this.render();
        // }
        const user = localStorage.getItem('user');
    if (!user) {
        dispatch(navigate(Screens.LOGIN));
    }
        this.render();
    }

    toggleUserContainer() {
        this.isUserContainerVisible = !this.isUserContainerVisible;
        const userContainer = this.shadowRoot?.querySelector('.user-container');
        const postContainer = this.shadowRoot?.querySelector('.post-container');
        const container = this.shadowRoot?.querySelector('.container');

        if (userContainer && postContainer && container) {
            // Ocultar/Mostrar el user-container
            userContainer.classList.toggle('hidden', !this.isUserContainerVisible);

            // Expandir el post-container y el container principal si user-container está oculto
            if (!this.isUserContainerVisible) {
                postContainer.classList.add('expanded');
                container.classList.add('full-width');
            } else {
                postContainer.classList.remove('expanded');
                container.classList.remove('full-width');
            }
        }
    }

    render() {
        if (this.shadowRoot) {
            const navBar = this.ownerDocument.createElement('nav-bar');
            navBar.setAttribute('icon', "../src/assets/logos/big_logo.png");
            navBar.setAttribute('img', "../src/assets/logos/medium_logo.png");
            navBar.setAttribute('input', "Search");

            const container = this.ownerDocument.createElement('section');
            container.className = 'container';

            const userContainer = this.ownerDocument.createElement('section');
            userContainer.className = 'user-container';

            this.user.forEach(userCard => {
                userContainer.appendChild(userCard);
            });

            const userMenu = this.ownerDocument.createElement('user-menu');
            userMenu.setAttribute('home', '#');
            userMenu.setAttribute('clubs', '#');
            userMenu.setAttribute('discover', '#');
            userMenu.setAttribute('help', '#');
            userMenu.setAttribute('setting', '#');

            userContainer.appendChild(userMenu);
            container.appendChild(userContainer);

            const postContainer = this.ownerDocument.createElement('section');
            postContainer.className = 'post-container';


            const newPost = this.ownerDocument.createElement('new-post');
            newPost.setAttribute('userpic', this.currentUserPic);
            newPost.setAttribute('text', 'Create new post');
            newPost.setAttribute('buttontext', 'Text');
            newPost.setAttribute('buttonimages', 'Images');
            newPost.setAttribute('inputtext', 'Share something...');
            newPost.setAttribute('inputimage', 'Drag and drop or upload media');
            newPost.setAttribute('club', 'Select a Club');
            newPost.setAttribute('post', 'Post');

            postContainer.appendChild(newPost);
            container.appendChild(postContainer);

            // Posts & pop up
            const postDashboard = this.ownerDocument.createElement('section');
            postDashboard.className = 'post-dashboard';

            if (dataPosts && Array.isArray(dataPosts)) {
                dataPosts.forEach(dataPost => {
                    const post = this.ownerDocument.createElement('post-component') as Post;

                    post.setAttribute('clubpic', dataPost.clubpic);
                    post.setAttribute('clubname', dataPost.clubname);
                    post.setAttribute('image', dataPost.image);
                    post.setAttribute('likes', dataPost.likes.toString());
                    post.setAttribute('comments', dataPost.comments.toString());
                    post.setAttribute('author', dataPost.author);
                    post.setAttribute('desc', dataPost.desc);



                    postDashboard.appendChild(post);
                    this.post.push(post);
                });
            } else {
                console.error('dataPosts is not an array or is undefined');
            }

            postContainer.appendChild(postDashboard);

            // clubs
            const clubsContainer = this.ownerDocument.createElement('section');
            clubsContainer.className = 'clubs-container';

            if (dataClubs && Array.isArray(dataClubs)) {
                const clubsCard1 = this.ownerDocument.createElement('clubs-card') as ClubsCard;
                clubsCard1.setAttribute('cardtitle', 'Clubs');
                clubsCard1.setAttribute('buttontext', 'Your Clubs');
                clubsCard1.setAttribute('cardcolor', '#6471C7');
                clubsCard1.setAttribute('buttoncolor', '#6471C7');
                clubsContainer.appendChild(clubsCard1);

                const clubsCard2 = this.ownerDocument.createElement('clubs-card') as ClubsCard;
                clubsCard2.setAttribute('cardtitle', 'Discover');
                clubsCard2.setAttribute('buttontext', 'Discover now');
                clubsCard2.setAttribute('cardcolor', '#C2BE4D');
                clubsCard2.setAttribute('buttoncolor', '#C2BE4D');
                clubsContainer.appendChild(clubsCard2);
            }

            console.log(clubsContainer);
            container.appendChild(clubsContainer);

            const logoutButton = this.ownerDocument.createElement('logout-button');
            logoutButton.setAttribute('text', 'Log out');
            logoutButton.className = 'logout-button'

            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/screens/DASHBOARD/DASHBOARD.css">
            `;
            this.shadowRoot.appendChild(navBar);
            this.shadowRoot.appendChild(logoutButton);
            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('app-dashboard', Dashboard);
export default Dashboard;
