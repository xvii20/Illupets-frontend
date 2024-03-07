import { auth } from './firebase';

// gets the users user id
export const getCurrentUser = () => {
  const user = auth.currentUser;

  if (user) {
    // The user is signed in
    const uidId = user.uid; // This is the uid ID of the user
    // console.log(uidId);

    return uidId;
  } else {
    // No user is signed in
    return null;
  }
};
