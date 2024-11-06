import * as components from '../../components/index';
import '../../components/userInfo/userInfo';
import '../../components/navBar/navBar';
import '../../components/userMenu/userMenu';
import UserInfo from '../../components/userInfo/userInfo';
import { dataUsers } from '../../data/dataUsers';
import '../../components/postPopUp/postPopUp';
import '../../components/elements/clubInfo/clubInfo';
import '../../components/clubsCard/clubsCard';
import ClubsCard, { AttributeClubsCard } from '../../components/clubsCard/clubsCard';
import '../../components/clubsCardDiscover/clubsCardDiscover';
import ClubsCardDiscover, { AttributeClubsCardDiscover } from '../../components/clubsCardDiscover/clubsCardDiscover';
import { dataClubs } from '../../data/dataClubs';
import '../../components/DiscoverLandingCards/DiscoverLandingCards';
import DiscoverLandingCards, { AttributeDiscoverLandingCards } from '../../components/DiscoverLandingCards/DiscoverLandingCards';
import '../../components/banner/banner';
import { appState, addObserver, dispatch } from '../../store/index';
import { getClubsAction, getDiscoverCardsAction } from '../../store/actions';
import Banner, { AttributeBanner } from '../../components/banner/banner';

class ClubsLanding extends HTMLElement {
    user: UserInfo[] = [];
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
        console.log('Clubs', appState.cards);
        try {
            if (!appState.cards || appState.cards.length === 0) {
                const action = await getDiscoverCardsAction();
                if (action) {
                    dispatch(action);
                }
            }
            this.render();
        } catch (error) {
            console.error("Error loading clubs:", error);
        }
        this.render()
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

            userClubs.forEach((club: any) => {
                const clubCard = this.ownerDocument.createElement('discover-landing-card') as DiscoverLandingCards;
                clubCard.setAttribute(AttributeDiscoverLandingCards.uid, String(club.uid));
                clubCard.setAttribute(AttributeDiscoverLandingCards.image, club.image);
                clubCard.setAttribute(AttributeDiscoverLandingCards.name, club.name);
                clubCard.setAttribute(AttributeDiscoverLandingCards.members, club.members);
                clubCard.setAttribute(AttributeDiscoverLandingCards.button, 'Joined');
                
                // Apply styles to the button
                const button = clubCard.shadowRoot?.querySelector('.button') as HTMLButtonElement;
                if (button) {
                    button.disabled = true;
                    button.style.backgroundColor = '#808080';
                }
                
                clubCard.classList.add('user-club-card');
                container.appendChild(clubCard);
            });

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

            console.log('Clubs', appState.cards);

            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../src/screens/CLUBSLANDING/CLUBSLANDING.css';
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
            container.appendChild(postContainer);

            const clubsContainer = this.ownerDocument.createElement('section');
            clubsContainer.className = 'clubs-container';

            const banner = this.ownerDocument.createElement('banner-component') as Banner;
            banner.setAttribute(AttributeBanner.utitle, 'Millions of clubs picked for you!');
            banner.setAttribute(AttributeBanner.text, 'Register in any club for FREE and start experiencing a new way of living your favorite literary stories.');
            banner.setAttribute(AttributeBanner.image, 'https://github.com/ItsSilva/bookloop/blob/juanito/src/assets/bannerIMG/handBanner.png?raw=true');
            banner.setAttribute('bg-color', '#6471c7');
            postContainer.appendChild(banner);

            const userClubsContainer = this.ownerDocument.createElement('div');
            userClubsContainer.className = 'discover-card-container';
            postContainer.appendChild(userClubsContainer);

            // Render the user's clubs
            this.renderUserClubs(userClubsContainer);

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

            container.appendChild(clubsContainer);

            this.shadowRoot.appendChild(navBar);
            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('app-clubs-landing', ClubsLanding);
export default ClubsLanding;