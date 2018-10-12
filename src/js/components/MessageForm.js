import React from 'react';
import ReactDOM from 'react-dom';

export default class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    return (
      <div>
  	    <form onSubmit={this.handleSubmit} className="chat__input-area">
  				<textarea className="textarea" value={this.state.value} onChange={this.handleChange} placeholder="Напишите сообщение..."></textarea>
  				<button type="submit" className="button">Отправить</button>
  			</form>	
  		</div>
    );
  }
}
