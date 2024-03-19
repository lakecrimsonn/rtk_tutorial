## lesson 3

### async redux - thunk

- 비동기와 관련된 모든 활동들은 store.js 밖에서 일어나야 한다. 그래서 비동기 작업은 미들웨어를 사용하는데, thunk라고 한다. 프로그래밍에서 thunk는 딜레이된 작업의 코드를 의미한다.
- `createAsyncThunk from ‘@reduxjs/toolkit’` , `axios from ‘axios`
- 가끔은 슬라이스 리듀서는 리듀서로 정의되지 않는 액션에 대해 반응을 해야한다. async thunk로 api를 받아오는 것과 같은 경우다. `extraReducers(builder)` 에서 builder는 추가적인 케이스를 정의해주는 오브젝트다.

### 개념 설명

- **dispatch**는 actions를 store에 등록된 reducer functions에게 전달한다. reducer functions의 action type에 따라 state의 로직과 값이 변경이 된다.
- **actions**는 state를 변경할 목적으로 설계된 자바스크립트 오브젝트다. actions는 type 속성이 반드시 존재하고, 어떤 작업을 수행하는지 유형을 나타낸다. payload 속성은 자료나 데이터를 담는다. **action creator**는 action 오브젝트를 생성하고 리턴하는 함수다.
- **store**는 리덕스 프로젝트에서 스테이트를 관리하는 중앙 레포지토리다. actions를 전송하거나, 현재 state값을 가져오거나, 변경사항을 구독한다.

### 구조설명

- 서버를 실행하면 제일 먼저 main.jsx에서 store.dispatch(fetchUsers());를 실행한다. 이 함수는 api서버에서 유저들의 정보를 가져온다. api호출은 비동기적으로 작동해야 한다. fetchUsers()는 asynchronous thunk action function이면서 action creator다. redux는 async actions를 지원하지 않는다. 그래서 미들웨어인 redux thunk를 사용한다. redux thunk는 action이 아닌 함수를 리턴하는 action creator를 사용할 수 있게 해준다. thunk는 action를 dispatch할 때 딜레이가 가능하고, 특정한 조건이 맞을 때만 dispatch를 한다.
- store.dispatch()와 useDispatch()는 같은 기능을 수행한다. action를 store에 전달하고, 이 action은 reducer functions에게 연달아 전달된다. 두 함수는 같은 기능을 수행하지만, 사용하는 위치에 따라 다르게 사용이 된다. 리액트 컴포넌트가 아닌 파일에서나 리액트 컴포넌트이지만 세팅과 관련된 기능은 store.dispatch()를 사용한다. 리액트는 useDispatch()를 이용하는 것을 권장한다. 이 함수는 리액트 컴포넌트에서만 사용이 가능하다.
- features/posts/postSlice.js는 글을 포스트하는 것과 관련된 기능들 중에 redux함수들을 관리하는 파일이다. 이 곳에서의 비동기 작업은 post api를 가져오는 것과 그 데이터로 글을 쓸 수 있도록 데이터 전처리 작업을 수행한다.
- 비동기 작업을 시행하는 함수는 이전과 다르게 reducers안에서 정의되지 않고 슬라이스(createSlice) 밖에서 정의가 되어야 한다. 그리고 extrareducers(builder) 속성을 이용해서 정의하기 때문에, reducers와 reducers 관련된 여러 함수들과 구분이 된다. 비동기 함수의 리듀서 작업은 addCase로 다뤄진다는 것을 기억하자.
  - 비동기 함수
    ```jsx
    export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
      const response = await axios.get(POSTS_URL);
      return response.data;
    });

    export const addNewPost = createAsyncThunk(
      "posts/addNewPost",
      async (initialPost) => {
        const response = await axios.post(POSTS_URL, initialPost);
        return response.data;
      }
    );
    ```
  - builder.addCase() 예시
    ```jsx
    extraReducers(builder) {
        builder
          .addCase(fetchPosts.pending, (state) => {
            state.status = "loading";
          })
          .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = "succeeded";
            let min = 1;
            const loadedPosts = action.payload.map((post) => {
              post.id = nanoid();
              post.date = sub(new Date(), { minutes: min++ }).toISOString();
              post.reactions = {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0,
              };
              return post;
            });
            state.posts = state.posts.concat(loadedPosts);
          })
    ```
- initialState에 posts배열과 status, error를 생성했다. 이 스테이트들은 나중에 호출해서 사용이 되거나 변경할 수 있도록 꼭 코드 하단에 export시켜야 한다.
  - state.posts.posts?
    - posts의 posts로 정의하는 이유는 store에 등록된 포스트 리듀서가 posts이기 때문이다.
    ```jsx
    export const selectAllPosts = (state) => state.posts.posts;
    export const getPostsStatus = (state) => state.posts.status;
    export const getPostsError = (state) => state.posts.error;
    ```
