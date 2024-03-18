# redux toolkit tutorial

# lesson 1

## 참고자료

[React Redux Full Course for Beginners | Redux Toolkit Complete Tutorial](https://www.youtube.com/watch?v=NqzdVN2tyvQ&list=PL0Zuz27SZ-6M1J5I1w2-uZx36Qp6qhjKo&t=86)

https://github.com/gitdagray/react_redux_toolkit

## 설치

- npm install @reduxjs/toolkit react-redux
- redux dev tools 크롬 익스텐션 설치하기

## vite 사용할 때 jsx 의존성 문제

> [vite] Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.

- jsx 문법을 사용하고 있으면 반드시 파일의 확장자명을 `.jsx`로 지어주자. `.js` 에서 jsx문법을 사용할 수 없다.

# lesson 2

## rtk 구조 설계 및 디테일

### 구조

- posts 디렉토리
  - postsSlice.js는 posts디렉토리에서 사용하고 있는 스테이트를 관리한다.
  - initialState에 포스트 형태를 지정하고, 디폴트로 2개를 미리 생성한다.
  - 리듀서는 새로운 포스트를 만드는 경우와 이모지 클릭수 업데이트가 있다. 나머지 스테이트 각 컴포넌트에서만 사용한다.
  - 포스트와 관련된 기능들을 최대한 다 컴포넌트로 구분해서 구현한다.
    - 새로운 포스트를 추가하기
    - 모든 포스트를 리스트로 보여주기와 구성요소
      - 제목과 컨텐츠
      - 작성자
      - 이모지
      - 타임스탬프
- users 디렉토리
  - 이용자를 찾는 기능은 users 디렉토리를 따로 만들어서 관리한다. `selectAllusers` 로 모든 유저들을 찾아볼 수 있다.

### 디테일

- `postsSlice.actions`는 자동적으로 생성이 되기 때문에 상세한 코드를 파일안에서 찾아볼 수가 없다. export 하는 건 사실 action creater function를 익스포팅하고 이 함수가 actions를 생성한다.
- `selectAllPosts` 는 이 함수가 사용이 되는 곳에서 나중에 수정이 되면 여러 컴포넌트들을 수정해야 하니, 차라리 슬라이스에서 관리한다.
- 리액트는 스테이트를 직접 수정하면 안된다. 그래서 리액트 툴킷은 immer.js를 내부적으로 사용하고 있다. immer.js는 스테이트를 수정하는 것이 아니라 새로운 스테이트를 생성하고 그 값을 반환한다. 오직 `createSlice()` 함수 안의 `state.push()` 를 이용해서 스테이트의 값을 수정한 것처럼 보이게 할 수 있다. 이외에 다른 곳에서는 원래 하던 방식대로 `useState()`를 사용한다. https://immerjs.github.io/immer/
- `useState()` 를 사용하는 경우는 오직 하나의 컴포넌트안에서만 이용을 할 때이다. 글로벌 스테이트는 rtk로 관리를 하자.
- `nanoid` 는 uuid 대신에 rtk에서 제공하는 랜덤 아이디 생성 라이브러리.
- `onSavePostClicked` 에서 사용되는 로직을 애초에 postsSlice.js에서 정의해서 재활용하는 것이 좋다.
  전

  ```jsx
  import { useState } from "react";
  import { useDispatch } from "react-redux";
  import { nanoid } from "@reduxjs/toolkit";

  import { postAdded } from "./postsSlice";

  const AddPostForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onTitleChanged = (e) => setTitle(e.target.value);
    const onContentChanged = (e) => setContent(e.target.value);

    const onSavePostClicked = () => {
      if (title && content) {
        dispatch(
          postAdded({
            id: nanoid(),
            title,
            content,
          })
        );

        setTitle("");
        setContent("");
      }
    };

    return (
      <section>
        <h2>add a new post</h2>
        <form>
          <label htmlFor="postTitle">post title:</label>
          <input
            type="text"
            name="postTitle"
            id="postTitle"
            value={title}
            onChange={onTitleChanged}
          />
          <label htmlFor="postContent">content :</label>
          <textarea
            name="postConetent"
            id="postContent"
            onChange={onContentChanged}
            value={content}
          />
          <button type="button" onClick={onSavePostClicked}>
            save post
          </button>
        </form>
      </section>
    );
  };

  export default AddPostForm;
  ```

  후

  ```jsx
  import { useState } from "react";
  import { useDispatch } from "react-redux";
  import { postAdded } from "./postsSlice";

  const AddPostForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onTitleChanged = (e) => setTitle(e.target.value);
    const onContentChanged = (e) => setContent(e.target.value);

    const onSavePostClicked = () => {
      if (title && content) {
        dispatch(postAdded(title, content));

        setTitle("");
        setContent("");
      }
    };

    return (
      <section>
        <h2>add a new post</h2>
        <form>
          <label htmlFor="postTitle">post title:</label>
          <input
            type="text"
            name="postTitle"
            id="postTitle"
            value={title}
            onChange={onTitleChanged}
          />
          <label htmlFor="postContent">content :</label>
          <textarea
            name="postConetent"
            id="postContent"
            onChange={onContentChanged}
            value={content}
          />
          <button type="button" onClick={onSavePostClicked}>
            save post
          </button>
        </form>
      </section>
    );
  };

  export default AddPostForm;
  ```

  postsSlice.js

  ```jsx
  import { createSlice, nanoid } from "@reduxjs/toolkit";

  const initialState = [
    {
      id: "1",
      title: "learning redux toolkit",
      content: "i've heard good things.",
    },
    {
      id: "2",
      title: "slices...",
      content: "the more i say slice, the more i want pizza",
    },
  ];

  const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
      postAdded: {
        reducer(state, action) {
          state.push(action.payload);
        },
        prepare(title, content) {
          return {
            payload: {
              id: nanoid(),
              title,
              content,
            },
          };
        },
      },
    },
  });

  export const selectAllPosts = (state) => state.posts;

  export const { postAdded } = postsSlice.actions;

  export default postsSlice.reducer;
  ```

- date 쉽게 다루는 라이브러리 설치: `npm install date-fns`
  ```jsx
  date: sub(new Date(), { minutes: 10 }).toISOString(),
  ```
- 블로그 포스트를 최신 순서대로 정렬
  ```jsx
  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  ```
- 여러 글쓴이 리스트에서 특정한 글쓴이 찾기
  ```jsx
  const author = users.find((user) => user.id === userId);
  ```
- 딕셔너리에 맵 돌려서 사용해보기
  ```jsx
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
  ```
  - `Object.entries()` 는 오브젝트를 인자로 받아서 enumerable 어레이로 전환해준다. [key, value] 형태로 나오기 때문에 map 문법을 적용할 때는 인자의 형식을 `[emojiName, emoji]` 로 지정해주자.
