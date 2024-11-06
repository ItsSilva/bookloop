import * as components from '../../components/index';
import '../../components/userInfo/userInfo';
import '../../components/navBar/navBar';
import '../../components/userMenu/userMenu';
import UserInfo, { AttributeUserInfo } from '../../components/userInfo/userInfo';
import { dataUsers } from '../../data/dataUsers';
import '../../components/postPopUp/postPopUp';
import PostPopUp, { Attribute3 } from '../../components/postPopUp/postPopUp';
import '../../components/elements/clubInfo/clubInfo';
import '../../components/clubsCard/clubsCard';
import ClubsCard, { AttributeClubsCard } from '../../components/clubsCard/clubsCard';
import { dataClubs } from '../../data/dataClubs';
import '../../components/DiscoverLandingCards/DiscoverLandingCards';
import DiscoverLandingCards, { AttributeDiscoverLandingCards } from '../../components/DiscoverLandingCards/DiscoverLandingCards';
import { appState, addObserver, dispatch } from '../../store/index';
import { getDiscoverCardsAction } from '../../store/actions';
import '../../components/banner/banner';
import Banner, { AttributeBanner } from '../../components/banner/banner';

class DiscoverLanding extends HTMLElement {
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
        // Cargar las tarjetas de discover si no están cargadas
        if (appState.cards.length === 0) {
            const action = await getDiscoverCardsAction();
            if (action) {
                dispatch(action);
            }
        }
        this.render();
    }

    async renderDiscoverCards(container: HTMLElement) {
        const userId = appState.user;
        
        if (!appState.cards || !Array.isArray(appState.cards)) {
            console.log("No discover cards available");
            return;
        }
    
        container.innerHTML = '';

        const userClubs = appState.cards.filter((club: any) => 
            club.usersid && Array.isArray(club.usersid) && !club.usersid.includes(appState.user)
        );
    
        userClubs.forEach((card: any) => {
            const discoverCard = this.ownerDocument.createElement('discover-landing-card') as DiscoverLandingCards;
            
            if (card.id || card.uid) {
                discoverCard.setAttribute(AttributeDiscoverLandingCards.uid, String(card.id || card.uid));
            } else {
                console.error("Card has no uid or id:", card);
                return;
            }
            
            discoverCard.setAttribute(AttributeDiscoverLandingCards.image, card.image || '');
            discoverCard.setAttribute(AttributeDiscoverLandingCards.name, card.name || '');
            discoverCard.setAttribute(AttributeDiscoverLandingCards.members, card.members || '');
    
            // Check if the current user is already a member
       
            
            discoverCard.setAttribute(AttributeDiscoverLandingCards.button, 'Join' );
    
            container.appendChild(discoverCard);
        });
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

            const banner = this.ownerDocument.createElement('banner-component') as Banner;
            banner.setAttribute(AttributeBanner.utitle, 'New worlds are waiting for you!');
            banner.setAttribute(AttributeBanner.text, 'Join and discover stories with fantastic worlds, charismatic characters and, most importantly, interact with people who have the same tastes as you.');
            banner.setAttribute(AttributeBanner.image, 'https://github.com/ItsSilva/bookloop/blob/juanito/src/assets/bannerIMG/bookBanner.png?raw=true');
            banner.setAttribute('bg-color', '#b4b13d');
            postContainer.appendChild(banner);

            const discoverCardContainer = this.ownerDocument.createElement('div');
            discoverCardContainer.className = 'discover-card-container';
            postContainer.appendChild(discoverCardContainer);

            // Render discover cards
            this.renderDiscoverCards(discoverCardContainer);

            container.appendChild(postContainer);

            const clubsContainer = this.ownerDocument.createElement('section');
            clubsContainer.className = 'clubs-container';

            if (dataClubs && Array.isArray(dataClubs)) {
                const clubsCard1 = this.ownerDocument.createElement('clubs-card') as ClubsCard;
                clubsCard1.setAttribute('cardtitle', 'Clubs');
                clubsCard1.setAttribute('buttontext', 'Your Clubs');
                clubsCard1.setAttribute('cardcolor', '#6471C7');
                clubsCard1.setAttribute('buttoncolor', '#6471C7');
                clubsContainer.appendChild(clubsCard1);

                // const clubsCard2 = this.ownerDocument.createElement('clubs-card') as ClubsCard;
                // clubsCard2.setAttribute('cardtitle', 'Discover');
                // clubsCard2.setAttribute('buttontext', 'Discover now');
                // clubsCard2.setAttribute('cardcolor', '#C2BE4D');
                // clubsCard2.setAttribute('buttoncolor', '#C2BE4D');
                // clubsContainer.appendChild(clubsCard2);
            }

            container.appendChild(clubsContainer);

            this.shadowRoot.appendChild(navBar);
            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('app-discover-landing', DiscoverLanding);
export default DiscoverLanding;