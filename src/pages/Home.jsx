import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL;
        const jsonPath = `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}data.json`;

        fetch(jsonPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <main className="home">
                <div className="loading">
                    Loading...
                </div>
            </main>
        );
    }
     
    console.log(posts.length);
    console.log(posts);
    return (
        <main className="home">

            <div className="posts-grid">

                {posts.map((post) => (

                    <Link
                        key={post.slug}
                        to={`/post/${post.slug}`}
                        className="post-link"
                    >

                        <article className="post-card">

                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="post-image"
                            />

                            <div className="post-content">

                                <p className="post-category">
                                    {post.category}
                                </p>

                                <h2 className="post-title">
                                    {post.title}
                                </h2>

                                <p className="post-summary">
                                    {post.summary}
                                </p>

                                <p className="post-meta">
                                    {post.author} • {post.date}
                                </p>
                                <p className="read-more">
                                    Read Story →
                                </p>

                            </div>

                        </article>

                    </Link>

                ))}

            </div>

        </main>
    );
}

export default Home;