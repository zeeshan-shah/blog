import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import BlogCreateForm from "./pages/blogs/BlogCreateForm";
import BlogPage from "./pages/blogs/BlogPage";
import BlogsPage from "./pages/blogs/BlogsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <h1>Home page</h1>} />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/blogs/create" render={() => <BlogCreateForm />} />
          <Route exact path="/blogs/:category/:id" render={() => <BlogPage />} />
          <Route exact path="/blogs/:category/" render={() => (
              <BlogsPage message="No results found. Adjust the search keyword." />
            )}
          />
          <Route exact path="/bookmarked" render={() => (
              <BlogsPage 
              message="No results found. Adjust the search keyword or like a blog."
              filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            )}
          />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;