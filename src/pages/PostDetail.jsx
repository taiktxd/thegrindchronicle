import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./PostDetail.css";

function PostDetail() {
    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const baseUrl = import.meta.env.BASE_URL;

        const jsonPath =
            `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}data.json`;

        fetch(jsonPath)
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to load article.");
                }

                return response.json();

            })
            .then((data) => {

                const foundPost =
                    data.find((item) => item.slug === slug);

                setPost(foundPost);

                setLoading(false);

            })
            .catch((error) => {

                console.error(error);

                setLoading(false);

            });

    }, [slug]);

    if (loading) {

        return (
            <main className="article-page">

                <div className="loading">

                    Loading article...

                </div>

            </main>
        );

    }

    if (!post) {

        return (

            <main className="article-page">

                <div className="not-found">

                    <h2>Article Not Found</h2>

                    <p>The article you're looking for doesn't exist.</p>

                    <Link to="" className="back-link">

                        ← Back to Home

                    </Link>

                </div>

            </main>

        );

    }

    return (

        <main className="article-page">

            <article className="article">

                <p className="article-category">

                    {post.category}

                </p>

                <h1 className="article-title">

                    {post.title}

                </h1>

                <p className="article-summary">

                    {post.summary}

                </p>

                <p className="article-meta">

                    {post.author} • {post.date}

                </p>

                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="article-cover"
                />

                {post.sections?.map((section, index) => {

                    if (section.type === "text") {

                        return (
                            <div
                                key={index}
                                className="article-text"
                            >

                                {section.content
                                    .split("\n\n")
                                    .map((paragraph, pIndex) => (

                                        <p key={pIndex}>

                                            {paragraph}

                                        </p>

                                    ))}

                            </div>
                        );

                    }

                    if (section.type === "image") {

                        return (
                            <figure
                                key={index}
                                className="article-figure"
                            >

                                <img
                                    src={section.src}
                                    alt={section.caption || post.title}
                                    className="article-image"
                                />

                                {section.caption && (

                                    <figcaption className="article-caption">

                                        {section.caption}

                                    </figcaption>

                                )}

                            </figure>
                        );

                    }

                    return null;

                })}

                <Link
                    to="/"
                    className="back-link"
                >

                    ← Back to Stories

                </Link>

            </article>

        </main>

    );

}

export default PostDetail;
