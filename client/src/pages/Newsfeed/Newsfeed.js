import React, { Component } from "react";
import Postfeed from "../../components/Postfeed/Postfeed";
import { Col, Row, Container } from "../../components/Grid";
import NewPost from "../../components/NewPost/NewPost";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import PostAPI from "../../utils/postAPI";
import "./Newsfeed.css";
import UserAPI from "../../utils/userAPI";

const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("2879ab41a44141b3a1c9a2fb6174199d");

class Newsfeed extends Component {
  state = {
    posts: [],
    loggedInUser: "",
    newsArticles: []
  };

  componentDidMount() {
    this.getUserData();
    this.loadPosts();
    this.fetchNews();
  }

  getUserData = () => {
    UserAPI.getUser()
      .then(data => {
        if (data.data.success === false) {
          return window.location.replace("/login");
        } else {
          this.setState({
            loggedInUser: data.data._id
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  loadPosts = () => {
    PostAPI.getPosts()

      .then(res =>
        this.setState({
          posts: res.data
        })
      )
      .catch(err => console.log(err));
  };

  fetchNews = () => {
    newsapi.v2
      .topHeadlines({
        category: "technology",
        language: "en",
        country: "us",
        apiKey: "2879ab41a44141b3a1c9a2fb6174199d"
      })
      .then(response => {
        // console.log(response.articles);
        this.setState({
          newsArticles: response.articles
        });
      });
  };

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Row>
            {/* <Col size="md-3"> */}
            {/* <Sidebar /> */}
            {/* </Col> */}
            <Col size="md-8">
              <NewPost />
              <Postfeed loggedInUser={this.state.loggedInUser} />
            </Col>
            <Col size="md-4">
              <div
                className="p-4"
                style={{
                  border: "1px solid rgba(0,0,0,.125)",
                  backgroundColor: "#fff"
                }}
              >
                <h4>Latest Tech News</h4>
                {this.state.newsArticles.map(newsArticle => {
                  return (
                    <Sidebar
                      key={newsArticle.title}
                      title={newsArticle.title}
                      author={newsArticle.author}
                      url={newsArticle.url}
                      source={newsArticle.source.name}
                      description={newsArticle.description}
                    />
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Newsfeed;
