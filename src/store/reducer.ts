import { Post } from '../components';
import { Actions } from '../types/store';

export const reducer = (currentAction: any, currentState: any) => {
	const { action, payload } = currentAction;

	switch (action) {
		case Actions.NAVIGATE:
			return {
				...currentState,
				screen: payload,
			};
		case Actions.SETUSERCREDENTIALS:
			return {
				...currentState,
				user: payload,
			};
		case Actions.SETUSERDATA:
			return {
				...currentState,
				userData: payload,
			};
		case Actions.GETDISCOVERCARDSACTION:
			return {
				...currentState,
				cards: payload,
			};
		case Actions.GETCLUBSARDSACTION:
			return {
				...currentState,
				clubs: payload,
				isFetched: true,
			};
		case Actions.ADDLIKES:
			return {
				...currentState,
				posts: currentState.posts.map((post: any) =>
					post.uid === payload.postId // Ya estamos usando postId aquí
						? { ...post, likes: payload.likeCount, liked: payload.liked }
						: post
				),
			};
		case Actions.REMOVELIKES:
			return {
				...currentState,
				posts: currentState.posts.map((post: any) =>
					post.uid === payload.postId
						? { ...post, likes: payload.likeCount, liked: payload.liked }
						: post
				)
			};
		case Actions.GETUSERNAME:
			return {
				...currentState,
				user: payload,
			};
		case Actions.GETPOSTS:
			return {
				...currentState,
				posts: payload,
			};
		case Actions.UPDATEPROFILE:
			return {
				...currentState,
				userData: currentState.userData.uid === payload.uid ? payload : currentState.userData,
			};
		default:
			return currentState;


	}
};
