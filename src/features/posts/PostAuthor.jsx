import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { PropTypes } from "prop-types";

const PostAuthor = ({ userId }) => {
  const users = useSelector(selectAllUsers);
  const author = users.find((user) => user.id === userId);

  return <span>by {author ? author.name : "unknown author"}</span>;
};

PostAuthor.propTypes = {
  userId: PropTypes.number,
};

export default PostAuthor;
