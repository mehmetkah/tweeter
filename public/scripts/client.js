$(document).ready(function () {
  const renderTweets = function (data) {
    for (let tweets of data) {
      const time = timeago.format(tweets.created_at, "en_US");
      tweets.created_at_str = time;

      const $tweets = createTweetElement(tweets);
      $(".all-tweets").prepend($tweets);
    }
  };
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container

  const createTweetElement = function (tweet) {
    const $tweet = $(`<article class="tweet"><header>
  <img src= ${tweet.user.avatars}>
  <span>${tweet.user.name}</span>
  <span class="handle">${tweet.user.handle}</span>
</header>
<span>${tweet.content.text}</span>
<footer>
<span>${tweet.created_at_str}</span>
<span class="interactOptions">
<i class="fa-solid fa-flag"></i>
<i class="fa-solid fa-retweet"></i>
<i class="fa-solid fa-heart"></i>
</span>
</footer></article>`);
    return $tweet;
  };

  $(".tweetForm").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "/tweets",
      data: $(this).serialize(),
      success: () => {
        loadtweets();
      },
      dataType: "text",
    });
  });

  const loadtweets = function () {
    $.get("/tweets", function (data) {
      renderTweets(data);
    });
  };
  loadtweets();
});
