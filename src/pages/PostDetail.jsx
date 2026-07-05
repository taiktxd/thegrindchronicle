import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PostDetail() {
    const { slug } = useParams();

    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch("/data.json")
            .then((response) => response.json())
            .then((data) => {
                const foundPost = data.find(
                    (item) => item.slug === slug
                );

                setPost(foundPost);
            });
    }, [slug]);

    if (!post) {
        return (
            <h2 style={{ textAlign: "center" }}>
                Loading...
            </h2>
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
                margin: "15px 0"
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
                marginBottom: "30px"
            }}
        />

        {/* Intro */}
        <p
            style={{
                fontSize: "20px",
                lineHeight: "1.9",
                marginBottom: "40px"
            }}
        >
            {post.intro}
        </p>

        {/* Body Image */}
        <img
            src={post.bodyImage}
            alt={post.title}
            style={{
                width: "100%",
                marginBottom: "30px"
            }}
        />

        {/* Body */}
        <p
            style={{
                fontSize: "18px",
                lineHeight: "2",
                marginBottom: "40px"
            }}
        >
            {post.body}
        </p>

        {/* Ending Image */}
        <img
            src={post.endingImage}
            alt={post.title}
            style={{
                width: "100%",
                marginBottom: "30px"
            }}
        />

        {/* Conclusion */}
        <p
            style={{
                fontSize: "18px",
                lineHeight: "2"
            }}
        >
            {post.conclusion}
        </p>
    </main>
);
}

export default PostDetail;