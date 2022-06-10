import auth from "../../../auth.json";
import reddit from "snoowrap";
export default class RedditClient {
  public static r = new reddit(auth.reddit);

  //@ts-ignore
  public static async getRandomPost(subreddit: string, nsfw = false): Promise<reddit.Submission> {
    const s = this.r.getSubreddit(subreddit);
    const posts = await s.getTop({ count: 100 });
    const random = Math.floor(Math.random() * posts.length);
    const post = posts[random];

    if (post.selftext.length > 4096 || (post.over_18 != nsfw)) {
        //@ts-ignore
      return this.getRandomPost(subreddit);
    } else {
        //@ts-ignore
      return post;
    }
  }

  //@ts-ignore
  public static async getRandomPostBySearch(subreddit: string, search: string, nsfw = false): Promise<reddit.Submission> {
    const s = this.r.getSubreddit(subreddit);
    const posts = await s.search({ query: search, sort: "relevance" });
    const random = Math.floor(Math.random() * posts.length);
    const post = posts[random];

    if (post.selftext.length > 4096 || (post.over_18 != nsfw)) {
        //@ts-ignore
      return this.getRandomPost(subreddit);
    } else {
        //@ts-ignore
      return post;
    }
  }
}
