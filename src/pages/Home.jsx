import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

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

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);
     

    return (
        <main className="home">
            <div className="content">
                <div className="posts-grid">

                {currentPosts.map((post) => (

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

                <div className="pagination">

                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>

                </div>

            </div>

            

        </main>
    );
}

export default Home;