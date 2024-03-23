## lesson5

### 성능 최적화하기

- 셀렉터 memoization 해보기. 동일한 계산을 수행한다면 이전의 계산한 값을 캐시해서 사용한다.
- Header 렌더링하면서 UserPage의 동일한 작업을 줄여보자.

### 성능 측정하기

- react dev tool 크롬 익스텐션 설치하기 → f12 → profiler로 성능 측정이 가능하다.

1. 왼쪽 상단에 리코딩 버튼(빨간 버튼)을 누른 후, 헤더의 숫자 카운터를 클릭해서 올린다.
2. 카운트가 증가하면서 페이지가 리랜더링된다.
3. 리코딩을 종료하면 무엇이 리랜더링 되었는지 확인이 할 수 있다.

- UserPage는 Header의 카운트와 관련이 없지만 헤더가 업데이트 될 때마다 이 페이지는 리랜더링이 된다.
- UserPage.jsx의 설계가 잘못되었다. postsForUser는 모든 포스트를 찾고, 이 중에서 유저 아이디를 대조한다. 대조한 아이디와 포스트의 유저아이디가 일치하는 포스트를 리턴한다.
  ```jsx
  const postsForUser = useSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post) => post.userId === Number(userId));
  });
  ```

### 성능 향상시키기

- `createSeletor` 가 해법이 될 수 있다. 이 함수는 셀렉터를 기억한다(memoized, memorized 아니다). posts나 userId의 스테이트가 변경될 때만 로직을 수행해서 자원을 아낀다. 스테이트가 변경되지 않으면 이전의 캐시해둔 값만 리턴한다. 아 함수는 reselect 라이브러리를 기반으로 이루어져 있다.
- 인풋셀렉터와 아웃풋셀렉터가 존재한다. 인풋셀렉터는 여러개가 들어가지만, 아웃풋은 하나다. 아웃풋이 갖는 파라미터의 스테이트가 변경되지 않으면, 아웃풋셀렉터는 아예 실행이 되지 않는다. 이전의 캐시한 값만 리턴한다.
- `[selectAllPosts, (state, userId) => userId],` 인풋셀렉터. 첫번째 인풋셀렉터인 selectAllPosts는 posts를 리턴한다. 두번째 셀렉터 익명함수는 userId를 리턴한다.
- `(posts, userId) => posts.filter((post) => post.userId === userId)` 아웃풋셀렉터. 두 인풋셀렉터가 리턴하는 값을 파라미터로 갖고, 포스트의 아이디가 유저의 아이디와 매칭이 되는 포스트를 리턴한다.
  ```jsx
  export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter((post) => post.userId === userId)
  );
  ```
  - 참고 다큐멘트
    https://redux.js.org/usage/deriving-data-selectors
    ```jsx
    const state = {
      a: {
        first: 5,
      },
      b: 10,
    };

    const selectA = (state) => state.a;
    const selectB = (state) => state.b;

    const selectA1 = createSelector([selectA], (a) => a.first);

    const selectResult = createSelector([selectA1, selectB], (a1, b) => {
      console.log("Output selector running");
      return a1 + b;
    });

    const result = selectResult(state);
    // Log: "Output selector running"
    console.log(result);
    // 15

    const secondResult = selectResult(state);
    // No log output
    console.log(secondResult);
    // 15
    ```
  - gpt 답변
    Certainly! The function you've shared is an example of a selector created using **`createSelector`** from the Redux Toolkit library or the reselect library, which is often used in the context of a Redux application for selecting a part of the state in a memoized way. This means that the selector will only re-compute the result if the input values (in this case, the state of all posts or the **`userId`**) have changed, improving performance by avoiding unnecessary calculations on every render.
    Let's break down this function step by step:
    ### **`createSelector`**
    - **`createSelector`** is a function that creates a memoized selector. Memoization is a performance optimization technique that caches the result of function calls and returns the cached result when the same inputs occur again.
    ### **Parameters to `createSelector`**
    - **`createSelector`** takes two types of arguments:
      1. **Input selectors**: One or more selectors that extract and return pieces of state. In your case, there are two input selectors:
         - **`selectAllPosts`**: This is likely a selector that returns all posts from the Redux state.
         - **`(state, userId) => userId`**: This is an inline input selector that simply returns the **`userId`** passed as an argument to the final selector.
      2. **Output selector**: A function that receives the outputs of the input selectors as its arguments and returns some derived data. This is where you implement how to combine or derive new data from the state selected by the input selectors.
    ### **The Output Selector Function**
    - **`(posts, userId) => posts.filter((post) => post.userId === userId)`**
      - This function is the output selector.
      - It receives the results of the input selectors as its parameters:
        - **`posts`**: The result of the **`selectAllPosts`** selector.
        - **`userId`**: The **`userId`** obtained from the second input selector.
      - It returns a filtered list of posts, where only the posts made by the specified **`userId`** are included. This is done using the **`filter`** method on the array of posts, checking each **`post`**'s **`userId`** against the supplied **`userId`**.
    ### **Usage**
    - You would use this selector in a component connected to the Redux store to efficiently select all posts made by a specific user. By passing the state and a **`userId`** to this selector, it will return the filtered list of posts for that user.
    - Thanks to memoization, if the function is called multiple times with the same state and **`userId`**, it will not re-run the filtering logic but return the cached result from the previous invocation.
    In summary, this selector function allows you to efficiently extract and derive data from the Redux state, specifically to get all posts by a specific user, optimizing performance by avoiding unnecessary recalculations.

### 성능 최적화하기2

- 포스트의 업 버튼 하나를 누르면 100개의 포스트를 리랜더링을 하기 때문에 문제가 된다. PostExcerpt가 작동한다.
- React.memo()는 불필요한 랜더링 과정을 줄이는 최적화 함수다. props가 이전의 랜더링한 컴포넌트와 같다면, 다음 랜더링을 스킵하고 변화가 있을 때만 랜더링한다.
- normalization state structure
  - no duplicated data and creates an ID lookup.
  - `createEntityAdapter`
  - https://ko.redux.js.org/usage/structuring-reducers/normalizing-state-shape/
- gpt 답변
  **`createEntityAdapter`** is a utility function provided by Redux Toolkit that simplifies managing normalized state for certain types of entities. When you're dealing with collections of data, especially when performing CRUD (Create, Read, Update, Delete) operations, managing the state can get complex. **`createEntityAdapter`** offers a standardized way to store your data in a slice of the Redux state in a normalized form, making it easier to update and retrieve.
  Normalization, in this context, means that you're transforming an array of entities into a more accessible object format, where each entity is stored as a property of an object, and its ID is used as the key. This structure simplifies the lookup, addition, and removal of entities.
  ### **Features of `createEntityAdapter`**
  - **Simplifies State Structure**: Automatically organizes the state in a **`{ ids: [], entities: {} }`** format, where **`ids`** is an array of all the entity ids, and **`entities`** is an object with entity ids as keys and the entity objects as values.
  - **CRUD Operations**: Provides generated reducer functions and selectors for common CRUD operations, reducing boilerplate code for managing entity state.
  - **Sorting and Filtering**: Allows specifying sorting and filtering logic for the selectors, making it easier to retrieve subsets of data based on certain criteria.
  - **Customization**: Supports customization of the ID generation strategy, enabling use with entities that don't have a simple **`id`** attribute or need more complex handling.
  ### **How to Use `createEntityAdapter`**
  Here's a basic example of how **`createEntityAdapter`** can be used:
  ```jsx
  javascriptCopy code
  import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

  // Define an adapter for a "users" state slice
  const usersAdapter = createEntityAdapter();

  // Initial state generated with getInitialState
  const initialState = usersAdapter.getInitialState();

  const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      // Assuming action.payload contains a user object
      userAdded: usersAdapter.addOne,
      // Assuming action.payload is the id of the user to remove
      userRemoved: usersAdapter.removeOne,
      // Assuming action.payload contains an array of users
      usersLoaded: usersAdapter.setAll,
      // And so on for other CRUD operations...
    },
  });

  // Export the customized selectors provided by createEntityAdapter
  export const {
    selectById: selectUserById,
    selectIds: selectUserIds,
    selectEntities: selectUserEntities,
    selectAll: selectAllUsers,
    selectTotal: selectTotalUsers,
  } = usersAdapter.getSelectors(state => state.users);

  export const { userAdded, userRemoved, usersLoaded } = usersSlice.actions;

  export default usersSlice.reducer;

  ```
  In this example, **`createEntityAdapter`** provides methods to easily add, remove, and manage users in a Redux store with minimal boilerplate. It helps manage state more efficiently and makes the Redux store easier to work with for entity-based collections.
