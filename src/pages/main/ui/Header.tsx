import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store/store";
import { FC } from "react";
import { logout } from "../../../entities/user";
interface IHeaderProps {
  handleOpenModal: () => void;
}
const Header: FC<IHeaderProps> = ({ handleOpenModal }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <h1 className="py-5 flex  justify-around  text-center border border-gray-200 text-gray-50 items-center">
      <button
        id="profileBtn"
        className="
                        text-gray-50
                        flex
                        gap-3
                        items-center
                        ml-2
                        px-4
                        outline-none
                        rounded-sm
                        transition-all
                        focus:outline-gray-300
                        hover:outline-gray-50"
        onClick={handleOpenModal}
      >
        <CgProfile className="text-2xl" />
        My profile
      </button>
      <button
        className="
                  text-gray-50
                  flex
                  gap-3
                  items-center
                  ml-2
                  px-4
                  outline-none
                  rounded-sm
                  transition-all
                  focus:outline-gray-300
                  hover:outline-gray-50
                "
        onClick={() => logout(navigate, dispatch)}
      >
        <CiLogout className="text-2xl" />
        Logout
      </button>
    </h1>
  );
};

export default Header;
