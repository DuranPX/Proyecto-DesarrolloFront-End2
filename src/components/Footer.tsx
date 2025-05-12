import React from 'react';
import '../assets/styles/FooterCSS.css';
import Logo from "../assets/images/output-onlinepngtools.png";


const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section logo">
                    <img src={Logo} alt="Logo" />
                    <p>Tu comida favorita, directo a tu puerta.</p>
                </div>

                <div className="footer-section">
                    <h4>Explora</h4>
                    <ul>
                        <li>Restaurantes cercanos</li>
                        <li>Ofertas del día</li>
                        <li>Recomendaciones</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Ayuda</h4>
                    <ul>
                        <li>Centro de soporte</li>
                        <li>Preguntas frecuentes</li>
                        <li>Reportar un problema</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Conócenos</h4>
                    <ul>
                        <li>Sobre nosotros</li>
                        <li>Trabaja con nosotros</li>
                        <li>Blog</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li>Términos y condiciones</li>
                        <li>Política de privacidad</li>
                        <li>Política de cookies</li>
                    </ul>
                </div>
            </div>

            <hr className="footer-line" />

            <div className="footer-bottom">
                <div className="social-icons">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com/duran_jd7/"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-tiktok"></i></a>
                </div>
                <p>© 2025 Devlivery. Todos los derechos reservados.</p>
            </div>
        </footer>

    );
};

export default Footer;
