import { useSelector } from "react-redux";

const useAuthUser = () => {
  return useSelector((state) => state.auth.user);
};

export default useAuthUser;
