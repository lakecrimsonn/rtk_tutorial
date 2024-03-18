import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";
import { PropTypes } from "prop-types";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "🤩",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();
  const reactionButtons = Object.entries(reactionEmoji).map(
    ([emojiName, emoji]) => {
      return (
        <button
          key={emojiName}
          type="button"
          className="reactionButton"
          onClick={() =>
            dispatch(reactionAdded({ postId: post.id, reaction: emojiName }))
          }
        >
          {emoji} {post.reactions[emojiName]}
        </button>
      );
    }
  );

  ReactionButtons.propTypes = {
    post: PropTypes.object,
  };

  return <div>{reactionButtons}</div>;
};
export default ReactionButtons;
