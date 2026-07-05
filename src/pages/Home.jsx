import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("/data.json")
            .then((response) => response.json())
            .then((data) => setPosts(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <main
            style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            <h2
                style={{
                    marginBottom: "30px",
                    fontSize: "28px",
                    fontWeight: "700",
                }}
            >
                Latest Stories
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "30px",
                }}
            >{posts.map((post) => (
            <Link
                key={post.slug}
                to={`/post/${post.slug}`}
                style={{
                    textDecoration: "none",
                    color: "inherit"
                }}
            >
                <article
                    style={{
                        border: "1px solid #e5e5e5",
                        background: "#fff",
                        overflow: "hidden",
                        transition: "0.3s"
                    }}
                >
                    {/* Cover Image */}
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        style={{
                            width: "100%",
                            height: "230px",
                            objectFit: "cover"
                        }}
                    />

                    {/* Content */}
                    <div style={{ padding: "20px" }}>

                        <p
                            style={{
                                color: "#ff4d4d",
                                fontWeight: "700",
                                fontSize: "12px",
                                textTransform: "uppercase"
                            }}
                        >
                            {post.category}
                        </p>

                        <h2
                            style={{
                                fontSize: "24px",
                                lineHeight: "1.4",
                                margin: "10px 0"
                            }}
                        >
                            {post.title}
                        </h2>

                        <p
                            style={{
                                color: "#666",
                                lineHeight: "1.8"
                            }}
                        >
                            {post.summary}
                        </p>

                        <p
                            style={{
                                marginTop: "20px",
                                fontSize: "13px",
                                color: "#999"
                            }}
                        >
                            {post.author} • {post.date}
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