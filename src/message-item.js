import React from 'react';

export default class App extends React.Component {

    
    render () {
        return (
            <li className={this.props.user ? 'message right' : 'message left'}>
                {!this.props.user && <div className="avatar">
                   <span>{this.props.name}</span>
                    </div>
                }    
                <div className="text_wrapper">
                    <div className="box bg-light-info">{this.props.message}</div>
                </div>
                <div className="time">10:56 am</div>
            </li>
        )
    }
}

