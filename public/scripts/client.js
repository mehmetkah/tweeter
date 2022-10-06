$(document).ready(function () {
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

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
    const $tweet = $("<article>");
    const innerHTML = $(`<article class="tweet"><header>
  <img src= ${tweet.user.avatars}>
  <span>${tweet.user.name}</span>
  <span class="handle">${tweet.user.handle}</span>
</header>
<span>${escape(tweet.content.text)}</span>
<footer>
<span>${tweet.created_at_str}</span>
<span class="interactOptions">
<i class="fa-solid fa-flag"></i>
<i class="fa-solid fa-retweet"></i>
<i class="fa-solid fa-heart"></i>
</span>
</footer></article>`);
    $tweet.append(innerHTML);
    return $tweet;
  };

  $(".tweetForm").submit(function (event) {
    event.preventDefault();
    const $form = $(this);
    const value = $(this).serialize();
    const newTweetTextStr = $form.children("textarea").val();
    $(".new-tweet p").text("");
    if (!newTweetTextStr) {
      $(".new-tweet p").append(
        "<b>Error:</b> All tweets must contain at least one character. Your tweet currently does not."
      );
      $(".new-tweet p").addClass("errorSection");
      setTimeout(() => {
        $(".new-tweet p").slideDown();
      }, 600);
    } else if (newTweetTextStr.length > 140) {
      $(".new-tweet p").append(
        "<b>Error:</b> We do not accept tweets longer than 140 characters. Your tweet is currently too long."
      );
      $(".new-tweet p").addClass("errorSection");
      setTimeout(() => {
        $(".new-tweet p").slideDown();
      }, 600);
    } else {
      $(".new-tweet p").removeClass("errorSection");
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: $(this).serialize(),
        success: () => {
          $(".tweetForm").trigger("reset");
          loadtweets();
        },
        dataType: "text",
      });
    }
  });

  const loadtweets = function () {
    $.get("/tweets", function (data) {
      renderTweets(data);
    });
  };
  loadtweets();
});
