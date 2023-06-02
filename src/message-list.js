import React from 'react';
import Message from './message-item';


export default class MessageItem extends React.Component {
    render () {
        return (
            <ul className="messages">
                {
                    this.props.messages.map((item,index) =>
                      <Message key={index} name={item.name}  user={item.userId === this.props.user? true: false} message={item.message}/>
                    
                )}
            </ul>
        )
    }
}