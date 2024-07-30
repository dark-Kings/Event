import React from 'react';
import gi from './giventures.png';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="border border-primary bg-dark  bottom-0 w-100">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top p-4">
                <p
                    className="col-md-4 mb-0 text-white"
                    onClick={scrollToTop}
                    style={{ cursor: 'pointer' }}
                >
                    © 2024 GI Corporation
                </p>

                <a
                    href="#"
                    onClick={scrollToTop}
                    className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
                >
                    <svg className="bi me-2" width="40" height="32"></svg>
                </a>

                <ul className="nav col-md-4 justify-content-end">
                    <img
                        src={gi}
                        height={40}
                        onClick={scrollToTop}
                        style={{ cursor: 'pointer' }}
                        alt="GI Ventures Logo"
                    />
                </ul>
            </footer>
        </div>
    );
};

export default Footer;