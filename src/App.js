import React from 'react';
import $ from 'jquery';
import Messages from './message-list';
import Input from './input';
import _map from 'lodash/map';
import io from 'socket.io-client';

import './App.css';

export default class App extends React.Component {
   constructor(props) {
       super(props);
       //Khởi tạo state,
       this.state = {
           messages: [
            //    {id: 0, userId: "default", message: 'Hello',testId:""}
           ],
           user: null,
           name: ""
       }
       this.socket = null;
   }
   //Connetct với server nodejs, thông qua socket.io
   UNSAFE_componentWillMount() {
       this.socket = io('localhost:3001');
       this.socket.on('id', res =>this.setState({user: res})) // lắng nghe event có tên 'id'
       this.socket.on('name', res =>this.setState({name: res})) // lắng nghe event có tên 'name'
       this.socket.on('newMessage', (response) => {this.newMessage(response)}); //lắng nghe event 'newMessage' và gọi hàm newMessage khi có event
   }
   //Khi có tin nhắn mới, sẽ push tin nhắn vào state mesgages, và nó sẽ được render ra màn hình
   newMessage(m) {
       const messages = this.state.messages;
    //    let ids = _map(messages, 'id');
    //    let max = Math.max(...ids);
       messages.push({
           id: messages.length+1,
           userId: m.id,
           message: m.data,
           name:m.name
       });

       let objMessage = $('.messages');
       if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight ) {
           this.setState({messages});
           objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300); //tạo hiệu ứng cuộn khi có tin nhắn mới

       } else {
           this.setState({messages});
           if (m.id === this.state.user) {
               objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
           }
       }
   }
   //Gửi event socket newMessage với dữ liệu là nội dung tin nhắn
   sendnewMessage(m) {
       if (m.value) {
           this.socket.emit("newMessage", {message: m.value, id: this.state.user}); //gửi event về server
       }
   }

   render () {
       return (
          <div className="app__content">
             <h1>{this.state.name? `Welcome ${this.state.name}` : ""}</h1>
             <div className="chat_window">
                 <Messages user={this.state.user} messages={this.state.messages} typing={this.state.typing}/>
                 <Input sendMessage={this.sendnewMessage.bind(this)}/>
             </div>
           </div>
       )
   }
}

