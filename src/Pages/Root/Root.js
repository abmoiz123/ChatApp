import React, {Component} from 'react';
import Header from '../../Components/Header';
import Home from '../Home/Home';
import About from '../About/About';
import Contact from '../Contact/Contact';

class RootPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <Home/>
                <About/>
                <Contact/>
            </div>
        )
    }
}
export default RootPage