import React, { Component } from 'react';
import { ViewPagerAndroid, View, Text, Image } from 'react-native';

import { Button } from 'react-native-elements';

class Slides extends Component {

	state = { currentSlide: 0, textButton: 'Skip', buttonColor: '#BDBDBD' };

	renderSlides() {


		return this.props.data.map((slide) =>
			this.renderSlide(slide)
		);
	}

	renderSlide(slide) {
		console.debug('slide', slide);
		const { slideStyle, slideTextStyle, slideTitleStyle } = styles;
		return (
			<View
				keyExtractor={(slide) => slide.pageId}
				style={slideStyle}
			>
				<Text style={slideTitleStyle}>{slide.title}</Text>
				<Text style={slideTextStyle}>{slide.text}</Text>
				<Image resizeMode='contain' style={{width: '50%', flex:2}} source={slide.imgFile} />
			</View>
		);
	}

	renderPagination() {
		const pages = [];
		const size = this.props.data.length;
		console.debug('renderpag');
		console.debug(size);

		for (let i = 0; i < size; i++) {
			if (i === this.state.currentSlide) {
				pages.push(<View style={{ backgroundColor: '#8BC34A', flex: 1, borderRadius: 25 }} />);
			} else {
				pages.push(<View style={{ backgroundColor: '#757575', flex: 1, borderRadius: 25 }} />);
			}
		}

		return (
			<View style={{ flexDirection: 'row', height: 50, padding: 20, marginBottom: 50 }}>
				{pages}
			</View>
		);
	}

	updatePagination(e) {
		console.debug(e.nativeEvent.position);
		console.debug(this.state.currentSlide);
		if (e.nativeEvent.position === (this.props.data.length - 1)) this.setState({ buttonColor: '#8BC34A', textButton: 'Finish', currentSlide: e.nativeEvent.position });
		else this.setState({ buttonColor: '#BDBDBD' , textButton: 'Skip', currentSlide: e.nativeEvent.position });
	}

	onButtonPress() {
    console.log('onButtonPress');
		this.props.navigation.navigate('mainflow');
  }

	render() {
		return (
			<View style={styles.SlidesContainer}>

				<ViewPagerAndroid
					initialPage={0}
					style={{ flex: 1 }}
					onPageSelected={this.updatePagination.bind(this)}
				>
					{this.renderSlides()}
				</ViewPagerAndroid>

				{this.renderPagination()}

				<Button
          raised
          containerViewStyle={styles.ContButtonStyle}
					backgroundColor={this.state.buttonColor}
          title={this.state.textButton}
          underlayColor='#c2c2c2'
          onPress={this.onButtonPress.bind(this)}
        />

			</View>
		);
	}
}

const styles = {
	SlidesContainer: {
		flex: 1,
		paddingBottom: 10,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#ffffff'
	},
	slideStyle: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 5
	},
	slideTitleStyle: {
		fontSize: 20,
		padding: 5,
		flex: 1
	},
	slideTextStyle: {
		fontSize: 15,
		paddingTop: 15,
		flex: 1,
		textAlign: 'justify',
		justifyContent: 'center',
	},
	buttonStyle: {
		justifyContent: 'center',
		alignItems: 'center'
	}
};


export default Slides;
