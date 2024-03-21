## lesson 4

### 멀티 페이지 블로그 만들기

- npm i react-router-dom

### router 구조

- main.jsx
  - Router
    - Routes
      - Route path =”/\*” element={<App/>} >
- App.jsx
  - Route path=”/” Layout
    - index <PostList />
    - Route path=”post”
      - index <AddPostForm />
        - Route path=”:postId” <SinglePostPage />
        - Route path=”edit/:postId” <EditPostForm />
  - index는 해당 도메인위치로 이동할 경우 첫 페이지를 의미함.
  - 예시로 도메인이 www.ex.ple이라면 첫 페이지는 <PostList/>
  - www.ex.ple/post의 첫 페이지는 <AddPostForm/>
  - www.ex.ple/post/{postid} → <SinglePostPage/>
  - www.ex.ple/post/edit/{postid} → <EditPostForm/>
- component/Layout.jsx
  - <Header />
  - <main><Outlet /></main>
  - Layout은 항상 어느 페이지로 이동하든 정적으로 계속 존재하는 요소들을 정할 수 있음. header, footer, outlet. Outlet에 이동하는 페이지가 보여질 예정. Route안에 Route가 nested되어 있기 때문에 그렇다.
- component/Header.jsx
  - Link는 client side routing을 가능하게 함. 일반적인 link를 사용하면 서버로 페이지 요청을 하지만, react router dom이 Link로 하여금 클라이언트 안에서 페이지 라우팅이 가능하게 한다.

### unwrap()

- 언랩은 api호출과 같은 비동기작업이 리턴하는 프로미스를 편하게 처리하는 함수다. dispatch 처리 다음에 발동하는 함수인데, action을 dispatch하고 난 뒤에 리턴되는 프로미스를 언랩한다. dispatch된 action이 fulfilled였으면 action의 payload을 담고 있는 새로운 프로미스를 리턴한다. rejected된다면 에러 오브젝트를 리턴한다.
- 프로미스가 성공적으로 해결되면 then() 으로 그 다음 작업을 처리할 수 있다. 만약에 reject된다면, catch()로 에러 스테이트나 메세지를 확인할 수 있다.
  - 예시
    ```jsx
    dispatch(
      updatePost({
        id: post.id,
        title,
        body: content,
        userId,
        reactions: post.reactions,
      })
    )
      .unwrap()
      .then((updatedPost) => {
        // Handle success
        console.log("Post updated successfully:", updatedPost);
        // You can perform more actions here, such as redirecting the user
        // or updating the state to indicate the successful update.
      })
      .catch((error) => {
        // Handle error
        console.error("Failed to update the post:", error);
        // Here, you could update your application's state to indicate the error,
        // show an error message to the user, or perform other error handling actions.
      });
    ```
- unwrap()만 쓰인 구조라면 에러 오브젝트를 받는 용도로 사용이 되었다는 말이다.
  - 예시
    ```jsx
    dispatch(
      updatePost({
        id: post.id,
        title,
        body: content,
        userId,
        reactions: post.reactions,
      })
    ).unwrap();
    ```
