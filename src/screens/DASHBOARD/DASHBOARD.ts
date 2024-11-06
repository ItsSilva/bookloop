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
import { dataClubs } from '../../data/dataClubs';
import '../../components/logoutButton/logoutButton';
import clubInfo, { AttributeClubInfo } from '../../components/elements/clubInfo/clubInfo';
import '../../components/elements/clubInfo/clubInfo';
import { appState, dispatch, addObserver } from '../../store';
import DiscoverLandingCards, { AttributeDiscoverLandingCards } from '../../components/DiscoverLandingCards/DiscoverLandingCards';
import Banner, { AttributeBanner } from '../../components/banner/banner';
import { getUserNameAction, navigate, setUserCredentials, getDiscoverCardsAction, getClubsAction} from '../../store/actions';
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
        // Cargar las tarjetas de discover si no están cargadas
        if (appState.cards.length === 0) {
            const action = await getDiscoverCardsAction();
            if (action) {
                dispatch(action);
            }
        }
        this.render();
    }

    async renderUserClubs(container: HTMLElement) {
        try {
            const userId = appState.user;
            
            if (!userId) {
                console.error("No user ID found in appState");
                return;
            }

            container.innerHTML = '';

            if (!Array.isArray(appState.cards)) {
                console.log("No discover cards found in appState");
                this.renderEmptyState(container);
                return;
            }

            // Filter the cards where the current user is in usersid
            const userClubs = appState.cards.filter((club: any) => 
                club.usersid && Array.isArray(club.usersid) && club.usersid.includes(userId)
            );

            if (userClubs.length === 0) {
                this.renderEmptyState(container);
                return;
            }

            const clubsTitle = this.ownerDocument.createElement('div');
            clubsTitle.className = 'clubs-title';
            clubsTitle.style.backgroundColor = '#F9F5F3';
            clubsTitle.style.borderRadius = '12px';
            clubsTitle.style.padding = '2rem';
            clubsTitle.style.width = '100%';
            clubsTitle.style.height = '35px';
            clubsTitle.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
            clubsTitle.style.marginBottom = '20px';
            clubsTitle.style.alignItems = 'center';
            clubsTitle.style.display = 'flex';

            const clubsTitleText = this.ownerDocument.createElement('h3');
            clubsTitleText.textContent = 'Clubs';
            clubsTitleText.style.color = 'rgb(100, 113, 199)';
            clubsTitle.appendChild(clubsTitleText);


            const clubsContainer = this.ownerDocument.createElement('div');
            clubsContainer.className = 'clubs-container';
            clubsContainer.style.display = 'flex';
            clubsContainer.style.flexDirection = 'column';
            clubsContainer.style.gap = '1rem';
            clubsContainer.style.backgroundColor = '#F9F5F3';
            clubsContainer.style.borderRadius = '10px';
            clubsContainer.style.width = '100%';
            clubsContainer.style.padding = '1rem';
            clubsContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';

            userClubs.forEach((club: any) => {
                const clubCard = this.ownerDocument.createElement('div');
                clubCard.className = 'club-card';

                const clubInfoElement = this.ownerDocument.createElement('club-info') as clubInfo;
                clubInfoElement.setAttribute(AttributeClubInfo.uid, String(club.uid));
                clubInfoElement.setAttribute(AttributeClubInfo.image, club.image);
                clubInfoElement.setAttribute(AttributeClubInfo.name, club.name);
                clubInfoElement.setAttribute(AttributeClubInfo.members, club.members);
                clubInfoElement.setAttribute(AttributeClubInfo.button, 'Joined');
                
                // Apply styles to the button
                const button = clubInfoElement.shadowRoot?.querySelector('.button') as HTMLButtonElement;
                if (button) {
                    button.disabled = true;
                    button.style.backgroundColor = '#808080';
                }

                clubCard.appendChild(clubInfoElement);
                clubsContainer.appendChild(clubCard);
            });
            container.appendChild(clubsTitle);
            container.appendChild(clubsContainer);

        } catch (error) {
            console.error("Error rendering user clubs:", error);
            this.renderErrorState(container);
        }
    }

    renderEmptyState(container: HTMLElement) {
        const emptyState = this.ownerDocument.createElement('div');
        emptyState.className = 'empty-state';
        
        const message = this.ownerDocument.createElement('p');
        message.textContent = 'No clubs joined yet. Discover new clubs to join!';
        message.className = 'empty-state-message';
        
        const discoverLink = this.ownerDocument.createElement('a');
        discoverLink.href = '#/discover';
        discoverLink.textContent = 'Explore Clubs';
        discoverLink.className = 'discover-link';
        
        emptyState.appendChild(message);
        emptyState.appendChild(discoverLink);
        container.appendChild(emptyState);
    }

    renderErrorState(container: HTMLElement) {
        const errorState = this.ownerDocument.createElement('div');
        errorState.className = 'error-state';
        
        const message = this.ownerDocument.createElement('p');
        message.textContent = 'Unable to load your clubs. Please try again later.';
        message.className = 'error-message';
        
        const retryButton = this.ownerDocument.createElement('button');
        retryButton.textContent = 'Retry';
        retryButton.className = 'retry-button';
        retryButton.onclick = async () => {
            const action = await getClubsAction();
            if (action) {
                dispatch(action);
                this.render();
            }
        };
        
        errorState.appendChild(message);
        errorState.appendChild(retryButton);
        container.appendChild(errorState);
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../src/screens/DISCOVERLANDING/DISCOVERLANDING.css';
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

            const clubsContainer = this.ownerDocument.createElement('section');
            clubsContainer.className = 'clubs-container';

            if (dataClubs && Array.isArray(dataClubs)) {
                const clubsCard1 = this.ownerDocument.createElement('clubs-card') as ClubsCard;
                clubsCard1.setAttribute('cardtitle', 'Clubs');
                clubsCard1.setAttribute('buttontext', 'Your Clubs');
                clubsCard1.setAttribute('cardcolor', '#6471C7');
                clubsCard1.setAttribute('buttoncolor', '#6471C7');
                clubsContainer.appendChild(clubsCard1);
            }

            this.renderUserClubs(clubsContainer);

            container.appendChild(clubsContainer);

            this.shadowRoot.appendChild(navBar);
            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('app-dashboard', Dashboard);
export default Dashboard;