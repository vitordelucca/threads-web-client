// @see: https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848

import { selectAuthState, selectToken, selectUserId } from "@/store/authSlice";
import { useSelector } from "react-redux";

// Updates the height of a <textarea> when the value changes.
const useFetcher = () => {

  const isLoggedIn = useSelector(selectAuthState);
  const token = useSelector(selectToken);
  const my_user_id = useSelector(selectUserId);

  return async (endpoint: string, data: Object = {}) => {
    
    if (!isLoggedIn || !token || !my_user_id)  {
      return false;
    }
    let response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        token: token,
        my_user_id: my_user_id,
        ...data
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());

    if (response.message == 'login_required') {
      window.localStorage.clear();
      window.location.reload();
    }

    return response;
  }
};

export default useFetcher;
