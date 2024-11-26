import { dispatch } from '../store';
import { Actions, Screens } from '../types/store';
import { getDiscoverCards, getClubsCards, addClubsCards, getUserName, removeClubsCards, getPosts, addLikes, updateProfile } from '../utils/firebase';

export const navigate = (screen: Screens) => {
    return {
        action: Actions.NAVIGATE,
        payload: screen,
    };
};


export const setUserCredentials = (user: string) => {
    return {
        action: Actions.SETUSERCREDENTIALS,
        payload: user,
    };
};

export const setUserData = (user: any) => {
    return {
        action: Actions.SETUSERDATA,
        payload: user,
    };
};

export const getDiscoverCardsAction = async () => {
    const cards = await getDiscoverCards();
    return {
        action: Actions.GETDISCOVERCARDSACTION,
        payload: cards,
    };
};

export const getClubsAction = async () => {
    try {
        const clubs = await getClubsCards();
        console.log("Retrieved clubs:", clubs);
        return {
            action: Actions.GETCLUBSARDSACTION,
            payload: clubs,
        };
    } catch (error) {
        console.error("Error in getClubsAction:", error);
        return null;
    }
};

export const removeClubForUser = async (clubData: any) => {
    try {
        console.log("Removing user from club:", clubData);
        const success = await removeClubsCards(clubData);

        if (success) {
            // Get updated clubs after removing
            const updatedClubs = await getClubsCards();
            console.log("Updated clubs after removal:", updatedClubs);

            dispatch({
                action: Actions.GETCLUBSARDSACTION,
                payload: updatedClubs,
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in removeClubForUser:", error);
        return false;
    }
};

export const addClubForUser = async (clubData: any) => {
    try {
        console.log("Adding user to club:", clubData);
        const success = await addClubsCards(clubData);

        if (success) {
            // Get updated clubs after adding
            console.log("Updated clubs after adding:", success);

            dispatch({
                action: Actions.GETCLUBSARDSACTION,
                payload: success,
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in addClubForUser:", error);
        return false;
    }
};

export const getUserNameAction = async () => {
    const user = await getUserName();
    return {
        action: Actions.GETUSERNAME,
        payload: user,
    };
};

export const getPostsAction = async () => {
    const posts = await getPosts();
    console.log('trayendo post in action', posts);


    return {
        action: Actions.GETPOSTS,
        payload: posts,
    }
};

export const addLikesAction = async (uid: string, liked: boolean) => {
    try {
        console.log("Adding user to club:", uid, liked);
        const success = await addLikes(uid, liked);

        if (success) {
            // Get updated clubs after adding
            console.log("Updated clubs after adding:", success);

            dispatch({
                action: Actions.ADDLIKES,
                payload: success,
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in addClubForUser:", error);
        return false;
    }
};

export const addCommentAction = (postId: string, comment: string) => ({
    type: 'ADD_COMMENT',
    payload: { postId, comment }
});

export const updateProfileAction = async (user: any) => {
    await updateProfile(user);
    return {
        action: Actions.UPDATEPROFILE,
        payload: user,
    }
}