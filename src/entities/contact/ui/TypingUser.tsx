import { FaCircle } from "react-icons/fa6";
import { useAppSelector } from "../../../app/store/store";
import { selectUsersByIds } from "../model/contactSlice";
interface ITypingUser {
  groupTypingStatuses?: boolean;
  userTypingIds?: string[];
}
const TypingUser = ({ userTypingIds, groupTypingStatuses }: ITypingUser) => {
  const users = useAppSelector(selectUsersByIds(userTypingIds));
  if (groupTypingStatuses && userTypingIds && userTypingIds.length) {
    let userNames: string[] = [];
    users.forEach((user) => {
      userNames.push(user.name);
    });
    if (!userNames.length) return;
    return (
      <div className="text-gray-50 select-none  flex items-center  ">
        <span className="text-lg">
          {userNames.length > 1 ? userNames.join(", ") : userNames[0]}
          &nbsp;typing
        </span>
        <div className="flex gap-0.5  pt-4">
          <FaCircle className="h-1 w-1  [animation-delay:0s] animate-bounce" />
          <FaCircle className="h-1 w-1  [animation-delay:0.2s] animate-bounce" />
          <FaCircle className="h-1  w-1  [animation-delay:0.3s] animate-bounce" />
        </div>
      </div>
    );
  }
  if (!groupTypingStatuses) {
    return (
      <div className="text-gray-50 select-none  flex items-center  ">
        <span className="text-lg">typing</span>
        <div className="flex gap-0.5  pt-4">
          <FaCircle className="h-1 w-1 duration-100 animate-bounce" />
          <FaCircle className="h-1 w-1 duration-200 animate-bounce" />
          <FaCircle className="h-1  w-1 duration-300 animate-bounce" />
        </div>
      </div>
    );
  }
  if (
    (groupTypingStatuses && !userTypingIds) ||
    (groupTypingStatuses && !userTypingIds?.length)
  )
    return;
};

export default TypingUser;
