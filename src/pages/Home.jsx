import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Tự động lấy tiền tố base path của Vite (ví dụ: /thegrindchronicle/)
        const baseUrl = import.meta.env.BASE_URL;
        const jsonPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data.json`;

        fetch(jsonPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Lỗi kết nối: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh sách bài viết:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px", fontSize: "20px", fontWeight: "600" }}>
                Loading...
            </div>
        );
    }

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
            >
                {posts.map((post) => (
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
                                transition: "0.3s",
                                borderRadius: "4px"
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
                                        textTransform: "uppercase",
                                        margin: "0 0 5px 0"
                                    }}
                                >
                                    {post.category}
                                </p>

                                <h2
                                    style={{
                                        fontSize: "20px",
                                        lineHeight: "1.4",
                                        margin: "10px 0",
                                        fontWeight: "700"
                                    }}
                                >
                                    {post.title}
                                </h2>

                                <p
                                    style={{
                                        color: "#666",
                                        lineHeight: "1.6",
                                        fontSize: "14px",
                                        margin: "10px 0"
                                    }}
                                >
                                    {post.summary}
                                </p>

                                <p
                                    style={{
                                        marginTop: "20px",
                                        fontSize: "13px",
                                        color: "#999",
                                        margin: "0"
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