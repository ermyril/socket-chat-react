import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import faker from 'faker';

import MessageForm from './MessageForm.js';


const socket = io();

var snd = new Audio("/message.wav");

function recieveMessage(callback){
	socket.on('chat message', mes => callback(null, mes));
}

function welcomeUser(callback){
	socket.on('user joined', nickname => callback(null, nickname));
}

// function showTyping(callback){
// 	socket.on('user typing', nickname => callback(null, nickname));
// }

// function hideTyping(callback){
// 	socket.on('user done typing', nickname => callback(null, nickname));
// }


export default class Chat extends React.Component {
	constructor(props){
		super(props);

		const randomKitten = Math.floor(Math.random() * Math.floor(16));

		this.state = {
			socket: io(),
			nickname: faker.name.firstName() + ' ' + faker.name.lastName(),
			avatar: 'https://placekitten.com/100/100?image=' + randomKitten, 
			typists: [],
			messages: [
			// {nickname: "Adela Corwin", avatar: "https://placekitten.com/100/100?image=0", message: "Tkjak fdjkaf jsdk ", time: "4:00"},
			// {joined: "Micaela Rodriguez"},
			// {nickname: "Adela Corwin", avatar: "https://placekitten.com/100/100?image=0", message: "Tkjak fdjkaf jsdk ", time: "4:00"},
			// {joined: "Britney Kerluke"},
			// {nickname: "Adela Corwin", avatar: "https://placekitten.com/100/100?image=0", message: "sad fasd fasd fsadf sdaf", time: "4:01"}
			]
		}

		// this.state.socket.on('chat message', mes => callback(null, mes));
		this.state.socket.emit('add user', this.state.nickname);



		recieveMessage((err, message) => {
			let messages = this.state.messages;
			messages.push(message);

			if (this.state.nickname !== message.nickname) {
				snd.play();
			}

			this.setState({
				messages: messages
			})
		});


		welcomeUser((err, nickname) => {
			if (this.state.nickname !== nickname) {
				let messages = this.state.messages;
				messages.push({joined: nickname});

				this.setState({
					messages: messages
				})
			}
		});

		// showTyping((err, nickname) => {
		// 	if (this.state.nickname !== nickname) {
		// 		let typists = this.state.typists;

		// 		typists.append(nickname);

		// 		this.setState({
		// 			typists: typists 
		// 		})
		// 	}
		// });

		// hideTyping((err, nickname) => {
		// 	// if (this.state.nickname !== nickname) {
		// 		let typists = this.state.typists;

		// 		// typists.append(nickname);
		// 		delete typists.nickname;

		// 		this.setState({
		// 			typists: typists 
		// 		})
		// 	// }
		// });

	}

	renderMessages(messages){
		let renderedMessages = [];
		for (var i = 0; i < messages.length; i++) {
			if (!!messages[i].joined) {
				renderedMessages.push(
					<div key={i} className='chat__notifier'>
					<div className='chat__notifier-inner'>
					{ messages[i].joined } присоединился к беседе
					</div>
					</div>
					);
			}
			else{
				const autorFlag = messages[i].nickname === this.state.nickname ? 'chat__message--autor' : '';
				let signature = autorFlag ? 'Вы' : messages[i].nickname;
				signature = signature + ' в ' + messages[i].time;



				renderedMessages.push(
					// chat__message--autor
					<div key={i} className={ 'chat__message ' + autorFlag }>
					<div className="chat__avatar">
					<SvgCrop path={ messages[i].avatar } />
					</div>
					<div className="chat__baloon" data-info={ signature }>{ messages[i].message }</div>
					</div>
					);
			}
		}
		return renderedMessages;
	}

	scrollToBottom() {
		this.messagesEnd.scrollIntoView({ behavior: "smooth" });
	}

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	render() {
		const messages = this.renderMessages(this.state.messages);
		return (
			<div className="chat">
			<div className="chat__messages-area">
			{messages}
			<div style={{ float:"left", clear: "both" }}
			ref={(el) => { this.messagesEnd = el; }}>
			</div>
			</div>
			<MessageForm nickname={this.state.nickname} avatar={this.state.avatar} socket={this.state.socket}/>
			</div>
			);
	}
}

/**
 * Рендер svg-аватарки
 */
 function SvgCrop(props){
 	return (
 		<svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
 		<defs>
 		<clipPath id="shape">
 		<path d="M50,0 L100,40 L80,100 L20,100 L0,40z" />
 		</clipPath>
 		</defs>
 		<image clipPath="url(#shape)" xlinkHref={props.path} href={props.path} x="0" y="0" height="100px" width="100px" />
 		</svg>
 		);
 }