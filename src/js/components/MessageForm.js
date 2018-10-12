import React from 'react';
import ReactDOM from 'react-dom';

export default class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', typing: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {

  	if (!!this.state.value) {
  		const time = new Date().toLocaleTimeString('ru-RU', 
  			{ 
  				hour: "numeric", 
          minute: "numeric"
        }
      );

  		const message = {
  			'nickname': this.props.nickname,
  			'avatar': this.props.avatar,
  			'message': this.state.value,
  			'time': time
  		};

	    this.props.socket.emit('chat message', message);
	    this.setState({value: ''});

  	}
    event.preventDefault();
  }

  handleTyping(){
      console.log('keypress');

      if (!this.state.typing) {
        this.props.socket.emit('typing', this.props.nickname);
      }

      let typingTimeout = setTimeout(() => {  
        console.log('cleared');
        this.setState({
          'typing': false
        });
        this.props.socket.emit('done typing', this.props.nickname);
      }, 3000);

      clearTimeout(this.state.typingClock);

      this.setState({
        typingClock: typingTimeout,
        'typing': true
      });
  }

  render() {
    return (
      <div>
  	    <form onSubmit={this.handleSubmit} className="chat__input-area">
  				<textarea className="textarea" value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleTyping} placeholder="Напишите сообщение..."></textarea>
  				<button type="submit" className="button">Отправить</button>
  			</form>	
  		</div>
    );
  }
}
