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
import BlogEditForm from "./pages/blogs/BlogEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import Category from "./pages/blogs/Category";
import Home from "./pages/home/HomePage";
import UpcomingBlogsCreateForm from "./pages/upcomingblogs/UpcomingBlogsCreateForm";
import UpcomingBlogs from "./pages/upcomingblogs/UpcomingBlogs";
import UpcomingBlogsEditForm from "./pages/upcomingblogs/UpcomingBlogsEditForm";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import ContactPage from "./pages/contact/ContactPage";
import ContactTicketEditPage from "./pages/contact/ContactTicketEditPage";


function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <Home /> } />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/blogs/create" render={() => <BlogCreateForm />} />
          <Route exact path="/upcoming-blogs/create" render={() => <UpcomingBlogsCreateForm />} />
          <Route exact path="/upcoming-blogs" render={() => <UpcomingBlogs /> } />
          <Route exact path="/upcoming-blogs/:id/edit" render={() => <UpcomingBlogsEditForm /> } />
          <Route exact path="/tickets" render={() => <ContactPage /> } />
          <Route exact path="/tickets/:id/edit" render={() => <ContactTicketEditPage /> } />
          <Route exact path="/blogs/:cat/:id/edit" render={() => <BlogEditForm />} />
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
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          <Route exact path="/blogs/" render={() => <Category />} />
          <Route render={() => <NotFoundPage />} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;