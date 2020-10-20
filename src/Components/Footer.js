import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer>
            <div class="footer 1-box is-center">
                <h2 variant="body2" color="textSecondary" align="center">
                    <span>Copyright <i class="fa fa-copyright"></i> ChatApp </span>
                    {/* {'ChatApp'} */}
                    {new Date().getFullYear()}
                    {'.'}
                </h2>
            </div>
        </footer>
    )
}
export default Footer;
// class Footer extends React.Component {
//     Copyright = () => {
//         return (

//             <h2 variant="body2" color="textSecondary" align="center">
//                 {'Copyright'}
//                 {'ChatApp'}
//                 {new Date().getFullYear()}
//                 {'.'}
//             </h2>
//         )
//     }
//     render() {
//         return (
//             <Footer>
//                 <div class="footer 1-box is-center">
//                     {this.Copyright()}
//                 </div>
//             </Footer>
//         )
//     }
// }
// export default Footer