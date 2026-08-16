// components/Footer.tsx
"use client";
import React from "react";
import { Saira } from "next/font/google";

const saira = Saira({
    weight: ["700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
});

const Footer = () => {
    return (
        <footer style={{
            marginTop: "3rem",
            padding: "2rem 1rem",
            width: "100%",
            maxWidth: "600px",
            borderTop: "4px solid #ff00ff",
            background: "#000",
            borderRadius: "8px",
            textAlign: "center",
            maxHeight: "100px",

        }}>
            <p style={{
                color: "#fff",
                fontSize: "1rem",
                lineHeight: "0.8",
                fontFamily: saira.style.fontFamily,

            }}>
                Made with ❤️
                <br />
                All rights reserved 2026 ©
                <br />
                <a
                    href="https://imaketech.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#ff00ff",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontFamily: saira.style.fontFamily,
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ffaa00";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#ff00ff";
                    }}
                >
                    imaketech
                </a>
            </p>
        </footer>
    );
};

export default Footer;