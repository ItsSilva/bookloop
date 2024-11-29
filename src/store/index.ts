import { reducer } from './reducer';
import Storage from '../utils/storage';
import { AppState, Observer, Screens } from '../types/store';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseInstance } from '../utils/firebase';
import { navigate, setUserCredentials } from './actions';

const onAuth = async () => {
	const { auth } = await getFirebaseInstance();
	onAuthStateChanged(auth, (user) => {
		if (user) {
			user.uid !== null ? dispatch(setUserCredentials(user.uid)) : '';
			dispatch(navigate(Screens.DASHBOARD));

		} else {
			dispatch(navigate(Screens.LOGIN));
		};
	});
};

onAuth();

const initialState: AppState = {
	screen: 'LOGIN',
	posts: [],
	userData: {
		username: '',
		uid: '',
		email: '',
		name: '',
		image: '',
		bannerimage: '',
	},
	user: {},
	cards: [],
	clubs: [],
	isFetched: false,
};

export let appState = initialState;

let observers: Observer[] = [];

export const dispatch = (action: any) => {
	const clone = JSON.parse(JSON.stringify(appState));
	const newState = reducer(action, clone);
	appState = newState;

	observers.forEach((o: any) => o.render());
};

export const addObserver = (ref: any) => {
	observers = [...observers, ref];
};