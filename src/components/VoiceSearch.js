import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import classNames from 'classnames';
import {
	setSearchValue,
	resetSearchValue,
	setVoiceNav,
	setVoiceSearch,
} from './../actions/search';
import SvgMic from './Svg/SvgMic';

class VoiceSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isRecognising: false,
			finalTranscript: '',
		};

		this.recognition = null;

		this.handleVoiceButton = this.handleVoiceButton.bind(this);
		this.recognitionFunc = this.recognitionFunc.bind(this);
		this.recognitionOnStart = this.recognitionOnStart.bind(this);
		this.recognitionOnStart = this.recognitionOnStart.bind(this);
		this.recognitionOnResult = this.recognitionOnResult.bind(this);
		this.recognitionOnEnd = this.recognitionOnEnd.bind(this);

		this.recognitionFunc();
	}

	componentWillReceiveProps(nexProps) {
		if (nexProps.isVoiceSearch && nexProps.isVoiceSearch !== this.props.isVoiceSearch) {
			this.recognition.start();
		} else {
			this.recognition.stop();
		}
	}

	recognitionFunc() {
		if ('webkitSpeechRecognition' in window) {
		  this.recognition = new window.webkitSpeechRecognition();
		  this.recognition.continuous = false; //set to false
		  this.recognition.interimResults = false; //set to false

		  this.recognition.onstart = this.recognitionOnStart;
			this.recognition.onend = this.recognitionOnEnd;
			this.recognition.onresult = this.recognitionOnResult;
		}
	}

	recognitionOnStart() {
		this.setState({
			isRecognising: true,
		});
	}

	recognitionOnResult() {
		let transcription = '';

		for (let i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				transcription += event.results[i][0].transcript;
			}
		}

		this.setState({
			finalTranscript: this.capitalize(transcription),
		});

		console.log("recognitionOnResult", this.state.finalTranscript)
		
		this.props.setSearchValue(this.state.finalTranscript);
		this.props.setVoiceNav(true);
		this.props.setVoiceSearch(false);
	}

	recognitionOnEnd() {
		this.setState({
			isRecognising: false,
		});

		this.props.setVoiceNav(true);
		this.props.setVoiceSearch(false);
	}

	capitalize(result) {
	  return result.charAt(0).toUpperCase() + result.slice(1);
	}

	handleVoiceButton() {
		this.props.setVoiceNav(false);

		if (this.state.isRecognising) {
			this.props.setVoiceSearch(false);
			this.props.setVoiceNav(true);
		} else {
			this.props.resetSearchValue();
			this.props.setVoiceSearch(true);
		}
	}

	render() {
		const buttonClasses = classNames('voice-search__btn g-before', {
			'state-recording': this.state.isRecognising && !this.props.searchValue,
		});

		return (
			<div className="voice-search">
				<div
					className={buttonClasses}
					onClick={this.handleVoiceButton}
				>
					<SvgMic />
				</div>
			</div>
		);
	}	
}

function mapStateToProps(state) {
	return {
		searchValue: state.search.searchValue,
		isVoiceSearch: state.search.isVoiceSearch,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setSearchValue: bindActionCreators(setSearchValue, dispatch),
		resetSearchValue: bindActionCreators(resetSearchValue, dispatch),
		setVoiceNav: bindActionCreators(setVoiceNav, dispatch),
		setVoiceSearch: bindActionCreators(setVoiceSearch, dispatch),
	}
}

export {VoiceSearch};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VoiceSearch);

