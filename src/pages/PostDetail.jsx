import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PostDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
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
                const foundPost = data.find((item) => item.slug === slug);
                setPost(foundPost);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi khi tải chi tiết bài viết:", error);
                setLoading(false);
            });
    }, [slug]);

    // Trạng thái đang tải dữ liệu
    if (loading) {
        return (
            <h2 style={{ textAlign: "center", padding: "100px 20px" }}>
                Loading Bài Viết...
            </h2>
        );
    }

    // Xử lý trường hợp nhập sai slug hoặc không tìm thấy bài viết
    if (!post) {
        return (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
                <h2>Bài viết không tồn tại!</h2>
                <p>Vui lòng quay lại trang chủ.</p>
            </div>
        );
    }

    return (
        <main
            style={{
                maxWidth: "900px",
                margin: "50px auto",
                padding: "20px"
            }}
        >
            {/* Category */}
            <p
                style={{
                    color: "#ff4d4d",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    fontSize: "13px"
                }}
            >
                {post.category}
            </p>

            {/* Title */}
            <h1
                style={{
                    fontSize: "42px",
                    lineHeight: "1.3",
                    margin: "15px 0",
                    fontWeight: "700"
                }}
            >
                {post.title}
            </h1>

            {/* Author & Date */}
            <p
                style={{
                    color: "#888",
                    marginBottom: "35px"
                }}
            >
                {post.author} • {post.date}
            </p>

            {/* Cover Image */}
            <img
                src={post.coverImage}
                alt={post.title}
                style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "500px",
                    objectFit: "cover",
                    marginBottom: "30px",
                    borderRadius: "4px"
                }}
            />

            {/* Intro */}
            <p
                style={{
                    fontSize: "20px",
                    lineHeight: "1.9",
                    marginBottom: "40px",
                    color: "#333",
                    fontWeight: "500"
                }}
            >
                {post.intro}
            </p>

            {/* Body Image */}
            {post.bodyImage && (
                <img
                    src={post.bodyImage}
                    alt={post.title}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "450px",
                        objectFit: "cover",
                        marginBottom: "30px",
                        borderRadius: "4px"
                    }}
                />
            )}

            {/* Body */}
            <p
                style={{
                    fontSize: "18px",
                    lineHeight: "2",
                    marginBottom: "40px",
                    color: "#444"
                }}
            >
                {post.body}
            </p>

            {/* Ending Image */}
            {post.endingImage && (
                <img
                    src={post.endingImage}
                    alt={post.title}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "450px",
                        objectFit: "cover",
                        marginBottom: "30px",
                        borderRadius: "4px"
                    }}
                />
            )}

            {/* Conclusion */}
            <p
                style={{
                    fontSize: "18px",
                    lineHeight: "2",
                    color: "#444",
                    fontStyle: "italic",
                    borderLeft: "4px solid #ff4d4d",
                    paddingLeft: "15px"
                }}
            >
                {post.conclusion}
            </p>
        </main>
    );
}

export default PostDetail;