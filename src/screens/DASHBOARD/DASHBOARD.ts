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
import ClubsCard, { AttributeClubsCard } from '../../components/clubsCard/clubsCard';
import '../../components/clubsCard/clubsCard';
import ClubsCardDiscover, { AttributeClubsCardDiscover } from '../../components/clubsCardDiscover/clubsCardDiscover';
import '../../components/clubsCardDiscover/clubsCardDiscover';
import { dataClubs } from '../../data/dataClubs';
import '../../components/logoutButton/logoutButton';
import clubInfo, { AttributeClubInfo } from '../../components/elements/clubInfo/clubInfo';
import '../../components/elements/clubInfo/clubInfo';
import { appState, dispatch, addObserver } from '../../store';
import DiscoverLandingCards, { AttributeDiscoverLandingCards } from '../../components/DiscoverLandingCards/DiscoverLandingCards';
import Banner, { AttributeBanner } from '../../components/banner/banner';
import { getDiscoverCardsAction, getPostsAction } from '../../store/actions';
import { Screens } from '../../types/store';

class Dashboard extends HTMLElement {
    user: UserInfo[] = [];
    post: Post[] = [];
    currentUserPic: string = '';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);

        this.currentUserPic = dataUsers[0].userpic;
        const dataUser = dataUsers[0];

        const userCard = this.ownerDocument.createElement('user-info') as UserInfo;
        userCard.setAttribute('background', dataUser.background);
        userCard.setAttribute('userpic', dataUser.userpic);
        userCard.setAttribute('name', appState.userData.name);
        userCard.setAttribute('userName', appState.userData.username);
        this.user.push(userCard);

    }

    async connectedCallback() {
        // Cargar las tarjetas de discover si no están cargadas
        if (appState.cards.length === 0) {
            const action = await getDiscoverCardsAction();
            if (action) {
                dispatch(action);
            }
        }

        console.log('Dashboard cards', appState.cards.length);
        console.log('Dashboard post', appState.posts.length);



        if (appState.posts.length != 0) {

        } else {
            console.log('Dashboard quantity', appState.posts.length);

            const action = await getPostsAction();
            dispatch(action);
            console.log('post in appstate', appState.posts);


        }


        this.render();
    }

    async renderDiscoverCards(container: HTMLElement) {
        if (!appState.cards || !Array.isArray(appState.cards)) {
            console.log("No discover cards available");
            return;
        }
    }

    async renderGetPostsAction(container: HTMLElement) {
        try {
            const userId = appState.user;

            if (!userId) {
                console.error("No user ID found in appState");
                return;
            }

            container.innerHTML = '';


            appState.posts.forEach((dataPost: any) => {
                // console.log("Processing post data:", dataPost);
                // console.log('POST', dataPost);

                const post = this.ownerDocument.createElement('post-component') as Post;
                post.setAttribute(Attribute2.clubpic, dataPost.imageUrl);
                post.setAttribute(Attribute2.clubname, dataPost.name);
                post.setAttribute(Attribute2.image, dataPost.imageUrl);
                post.setAttribute(Attribute2.likes, dataPost.likes.length || 0);
                post.setAttribute(Attribute2.uid, dataPost.id);
                // post.setAttribute(Attribute2.comments, dataPost.comments);
                post.setAttribute(Attribute2.author, dataPost.name);
                post.setAttribute(Attribute2.desc, dataPost.caption);
                container.appendChild(post);
            });

        } catch (error) {
            console.error("Error rendering post-component:", error);
            return;
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../src/screens/DASHBOARD/DASHBOARD.css';
            this.shadowRoot.appendChild(link);

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

            // if (dataPosts && Array.isArray(dataPosts)) {
            //     dataPosts.forEach(dataPost => {
            //         const post = this.ownerDocument.createElement('post-component') as Post;

            //         post.setAttribute('clubpic', dataPost.clubpic);
            //         post.setAttribute('clubname', dataPost.clubname);
            //         post.setAttribute('image', dataPost.image);
            //         post.setAttribute('likes', dataPost.likes.toString());
            //         post.setAttribute('comments', dataPost.comments.toString());
            //         post.setAttribute('author', dataPost.author);
            //         post.setAttribute('desc', dataPost.desc);

            //         postDashboard.appendChild(post);
            //         this.post.push(post);
            //     });
            // } else {
            //     console.error('dataPosts is not an array or is undefined');
            // }

            postContainer.appendChild(postDashboard);
            this.renderGetPostsAction(postDashboard);

            const clubsContainer = this.ownerDocument.createElement('section');
            clubsContainer.className = 'clubs-container';

            if (dataClubs && Array.isArray(dataClubs)) {
                const clubsCard1 = this.ownerDocument.createElement('clubs-card') as ClubsCard;
                clubsCard1.setAttribute('cardtitle', 'Clubs');
                clubsCard1.setAttribute('buttontext', 'Your Clubs');
                clubsCard1.setAttribute('cardcolor', '#6471C7');
                clubsCard1.setAttribute('buttoncolor', '#6471C7');
                clubsContainer.appendChild(clubsCard1);

                const clubsCard2 = this.ownerDocument.createElement('clubs-card-discover') as ClubsCardDiscover;
                clubsCard2.setAttribute('cardtitle', 'Discover');
                clubsCard2.setAttribute('buttontext', 'Discover now');
                clubsCard2.setAttribute('cardcolor', '#C2BE4D');
                clubsCard2.setAttribute('buttoncolor', '#C2BE4D');
                clubsContainer.appendChild(clubsCard2);
            }

            this.renderDiscoverCards(clubsContainer);

            container.appendChild(clubsContainer);

            this.shadowRoot.appendChild(navBar);
            this.shadowRoot.appendChild(container);
        }
    }

    handleLogout() {
        // Limpia el estado del usuario en appState o realiza la acción de logout
        appState.user = {};
        dispatch({ type: 'LOGOUT' });

        // Redirigir al usuario a la pantalla de login o la página principal
        window.location.href = '/login';
    }

}

customElements.define('app-dashboard', Dashboard);
export default Dashboard;