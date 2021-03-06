import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import ActorCard from './ActorCard';
import MovieCard from './MovieCard';
import FirstScreen from './FirstScreen';
import VoiceSearch from './VoiceSearch';

import {
	setSearchValue,
	resetSearchValue,
	setVoiceNav,
	setVoiceSearch,
} from './../actions/search';

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
		};

		this.timer = null;

		this.fetchResults = this.fetchResults.bind(this);
		this.inputText = this.inputText.bind(this);
	}

	componentDidMount() {
		this.fetchPopular();
	}

	componentWillReceiveProps(nexProps) {
		clearTimeout(this.timer);

		if (nexProps.searchValue) {
			this.timer = setTimeout(() => {
				this.fetchResults();
			}, 2000);
		}
	}

	fetchPopular(){
		fetch('https://api.themoviedb.org/3/movie/popular?api_key=629599926ec66fe2630d82d78db80df6&language=en-US')
			.then( response => response.json())
			.then( ({results: items}) => {
				return this.setState({items});
			})
	}

	renderItems() {
		const {items} = this.state;

		return (
			<ul className="movies">
				{items.map((item, index) => {
					if(item.media_type === 'person') {
						return <ActorCard key={index} number={index} item={item} />;
					}
					return <MovieCard key={index} number={index} item={item} />;
				})}
			</ul>
		);
	}

	fetchResults() {
		fetch('https://api.themoviedb.org/3/search/multi?api_key=629599926ec66fe2630d82d78db80df6&language=en-US&query=' + this.props.searchValue + '&page=1&include_adult=false')
			.then( response => response.json())
			.then( ({results: items}) => {
				return this.setState({items});
			})

		this.props.resetSearchValue();
		this.props.setVoiceNav(true);
		this.props.setVoiceSearch(false);
	}

	inputText(event) {
		this.props.setSearchValue(event.target.value);
	}

	render() {
		return (
			<div className="seach-section">
				<FirstScreen
					firstScreenTitle="Search for a movie"
					firstScreenSubtitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, placeat." />
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="searching-area">
								<VoiceSearch />
								<div className="search">
									<input
										ref={(ref) => {this.input = ref}}
										type="text"
										className="search__field"
										onChange={this.inputText}
										value={this.props.searchValue}
										placeholder="Enter movie title"/>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							{this.renderItems()}
						</div>
					</div>
				</div>
			</div>
		);
	}	
}

function mapStateToProps(state) {
	return {
		searchValue: state.search.searchValue,
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

export {Search};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Search);
